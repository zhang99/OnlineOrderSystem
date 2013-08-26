using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Website.Models
{
    /// <summary>
    /// 类别管理ViewModel
    /// </summary>
    public class CategoriesViewModel
    {
        /// <summary>
        /// 类别分页数据
        /// </summary>
        public IPagination<Category> CategoriesList { get; set; }

        /// <summary>
        /// 类别树
        /// </summary>
        public IEnumerable<Category> CategoriesTree { get; set; }
    }
 
}