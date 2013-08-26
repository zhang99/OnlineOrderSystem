using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using OnlineOrder.Mvc.Grid;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Mvc
{
    /// <summary>
    /// 分页辅助类
    /// </summary>
    public class PagingModel
    {
        /// <summary>
        /// 当前页
        /// </summary>
        private int _pageIndex = 1;
        public int PageIndex {
            get
            {
                return _pageIndex;
            }
            set
            {
                _pageIndex = value;
            }
        }

        /// <summary>
        /// 每页记录显示条数
        /// </summary>
        private int _pageSize = 15;
        public int PageSize
        {
            get
            {
                return _pageSize;
            }
            set
            {
                _pageSize = value;
            }
        }

        /// <summary>
        /// 排序信息
        /// </summary>
        private GridSortOptions _sortOptions = new GridSortOptions { Column = "Id", Direction = SortDirection.Descending };
        public GridSortOptions SortOptions {
            get
            {
                return _sortOptions;
            }
            set
            {
                _sortOptions = value;
            }
        }

        /// <summary>
        /// 简单模糊查询字段逗号隔开
        /// </summary>
        private string _queryFields = string.Empty;
        public string QueryFields
        {
            get
            {
                return _queryFields;
            }
            set
            {
                _queryFields = value;
            }
        }

        /// <summary>
        /// 简单模糊查询字串
        /// </summary>
        private string _query = string.Empty;
        public string Query {
            get
            {
                return _query;
            }
            set
            {
                _query = value;
            }
        }

        /// <summary>
        /// 高级查询
        /// </summary>
        IEnumerable<AdvancedQueryItem> _AdvancedQuery = new HashSet<AdvancedQueryItem>();
        public IEnumerable<AdvancedQueryItem> AdvancedQuery
        {
            get
            {
                return _AdvancedQuery;
            }
            set
            {
                _AdvancedQuery = value;
            }
        }
    }

    /// <summary>
    /// 高级查询项
    /// </summary>
    public class AdvancedQueryItem
    {
        /// <summary>
        /// 字段
        /// </summary>
        public string Field { get; set; }
        /// <summary>
        /// 操作符
        /// </summary>
        public QueryMethods Operator { get; set; }
        /// <summary>
        /// 值(多个逗号隔开)
        /// </summary>
        public string Value { get; set; }
    }    
}
