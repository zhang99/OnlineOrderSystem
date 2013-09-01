using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OnlineOrder.Website.Models;
using OnlineOrder.Mvc;
using OnlineOrder.Mvc.Grid;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Website.Controllers
{
    /// <summary>
    /// 订单Controller
    /// </summary>
    [Title("订单")]
    public class OrdersController : BaseSheetController<Order>
    {
        public OrdersController(Order model)
            : base(model)          
        {            
        }     
    }
}
