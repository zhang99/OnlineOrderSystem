using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using OnlineOrder.Mvc.Grid;

namespace OnlineOrder.Mvc.Pagination
{
	/// <summary>
	/// Extension methods for creating paged lists.
	/// </summary>
	public static class PaginationHelper
	{
		/// <summary>
		/// Converts the specified IEnumerable into an IPagination using the default page size and returns the specified page number.
		/// </summary>
		/// <typeparam name="T">Type of object in the collection</typeparam>
		/// <param name="source">Source enumerable to convert to the paged list.</param>
		/// <param name="pageNumber">The page number to return.</param>
		/// <returns>An IPagination of T</returns>
        public static IPagination<T> AsPagination<T>(this IEnumerable<T> source, int pageNumber, GridSortOptions sortOptions)
		{
            return source.AsPagination(pageNumber, LazyPagination<T>.DefaultPageSize, sortOptions);
		}

		/// <summary>
		/// Converts the speciied IEnumerable into an IPagination using the specified page size and returns the specified page. 
		/// </summary>
		/// <typeparam name="T">Type of object in the collection</typeparam>
		/// <param name="source">Source enumerable to convert to the paged list.</param>
		/// <param name="pageNumber">The page number to return.</param>
		/// <param name="pageSize">Number of objects per page.</param>
		/// <returns>An IPagination of T</returns>
        public static IPagination<T> AsPagination<T>(this IEnumerable<T> source, int pageNumber, int pageSize, GridSortOptions sortOptions)
        {
            if (pageNumber < -1)
            {
                //throw new ArgumentOutOfRangeException("pageNumber", "The page number should be greater than or equal to 1.");
                pageNumber = 1;
            }

            return new LazyPagination<T>(source.AsQueryable(), pageNumber, pageSize, sortOptions, new Dictionary<string, decimal>());
        }
	}
}
