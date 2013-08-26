using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Website.Models
{
    /// <summary>
    /// 选择商品ViewModel
    /// </summary>
    public class SelectProductsViewModel
    {     
        /// <summary>
        /// 类别树
        /// </summary>
        public IEnumerable<Category> CategoriesTree { get; set; }

        /// <summary>
        /// 商品分页数据
        /// </summary>
        public IPagination<Product> ProductsList { get; set; }
    }
}