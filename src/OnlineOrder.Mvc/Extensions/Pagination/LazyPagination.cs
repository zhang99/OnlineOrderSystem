using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
//using System.Linq.Dynamic;
using OnlineOrder.Extensions;
using System.Linq.Expressions;
using System.Text;
using System.Reflection;

namespace OnlineOrder.Mvc.Pagination
{
	/// <summary>
	/// Executes an IQueryable in order to created a paged set of objects.
	/// The query is not executed until the LazyPagination is enumerated or one of its properties is invoked.
	/// The results of the query are cached.
	/// </summary>
	/// <typeparam name="T">Type of objects in the collection.</typeparam>
	public class LazyPagination<T> : IPagination<T>
	{
		/// <summary>
		/// Default page size.
		/// </summary>
		public const int DefaultPageSize = 20;
		private IList<T> results;
        private IDictionary<string, decimal> dicSum;
		private int totalItems;
		public int PageSize { get; private set; }
		/// <summary>
		/// The query to execute.
		/// </summary>
		public IQueryable<T> Query { get; protected set; }
		public int PageNumber { get; private set; }


		/// <summary>
		/// Creates a new instance of the <see cref="LazyPagination{T}"/> class.
		/// </summary>
		/// <param name="query">The query to page.</param>
		/// <param name="pageNumber">The current page number.</param>
		/// <param name="pageSize">Number of items per page.</param>
        public LazyPagination(IQueryable<T> query, int pageNumber, int pageSize, IDictionary<string, decimal> dicSum)
		{
			PageNumber = pageNumber;
			PageSize = pageSize;
			Query = query;
            DicSum = dicSum;

            //add by zhangh 2013/5/31 页码为-1时，返回最大页码
            if (PageNumber == -1)
                PageNumber =TotalPages;

		}

		IEnumerator<T> IEnumerable<T>.GetEnumerator()
		{
			TryExecuteQuery();

			foreach (var item in results)
			{
				yield return item;
			}
		}

		/// <summary>
		/// Executes the query if it has not already been executed.
		/// </summary>
        protected void TryExecuteQuery()
        {
            if (dicSum == null)
                dicSum = AggregationCount();

            //Results is not null, means query has already been executed.
            if (results != null)
                return;

            totalItems = Query.Count();

            //add by zhangh 2013/5/30 页码为-1时，返回最大页码.及其他控制
            int totalPage = (int)Math.Ceiling(((double)totalItems) / PageSize);
            if (PageNumber > totalPage)
                PageNumber = totalPage;
            if (PageNumber == -1)
                PageNumber = totalPage;
            else if (PageNumber < -1 || PageNumber == 0)
                PageNumber = 1;
            //end add

            results = ExecuteQuery();

            if (dicSum == null)
                dicSum = AggregationCount();
        }

		/// <summary>
		/// Calls Queryable.Skip/Take to perform the pagination.
		/// </summary>
		/// <returns>The paged set of results.</returns>
		protected virtual IList<T> ExecuteQuery()
		{
			int numberToSkip = (PageNumber - 1) * PageSize;
			return Query.Skip(numberToSkip).Take(PageSize).ToList();
		}

        /// <summary>
        /// 合计计算  TODO: Dynamic Linq实际没生成预期SQL，计算方式有待优化
        /// </summary>
        protected virtual IDictionary<string, decimal> AggregationCount()
        {
            if (DicSum == null || DicSum.Count() == 0)
                return null;

            StringBuilder sb = new StringBuilder();
            sb.Append("new (");
            foreach (string key in DicSum.Keys)
            {
                sb.AppendFormat("Sum({0}) as {0}", key);
                if (key != DicSum.Keys.Last())
                    sb.Append(",");
            }
            sb.Append(")");

            var groupBy = string.Format("new ({0})", String.Join(",", DicSum.Keys));
            var AggregatedData = Query.GroupBy(groupBy, "it").Select(sb.ToString());

            Type type;
            object value;
            PropertyInfo pi;
            foreach (var item in AggregatedData)
            {
                type = item.GetType();
                for (int i = 0; i < DicSum.Keys.Count; i++)
                {
                    pi = type.GetProperty(DicSum.Keys.ElementAt(i));
                    if(pi == null) continue;

                    value = pi.GetValue(item, null);
                    if (value != null)
                        DicSum[DicSum.Keys.ElementAt(i)] += Convert.ToDecimal(value);
                }
            }

            return DicSum;
        }

		public IEnumerator GetEnumerator()
		{
			return ((IEnumerable<T>)this).GetEnumerator();
		}

		public int TotalItems
		{
			get
			{
				TryExecuteQuery();
				return totalItems;
			}
		}

		public int TotalPages
		{
			get { return (int)Math.Ceiling(((double)TotalItems) / PageSize); }
		}

		public int FirstItem
		{
			get
			{
				TryExecuteQuery();
				return ((PageNumber - 1) * PageSize) + 1;
			}
		}

		public int LastItem
		{
			get
			{
				return FirstItem + results.Count - 1;
			}
		}

		public bool HasPreviousPage
		{
			get { return PageNumber > 1; }
		}

		public bool HasNextPage
		{
			get { return PageNumber < TotalPages; }
		}

        public IDictionary<string, decimal> DicSum
        {
            get;
            set;
        }
	}
}
