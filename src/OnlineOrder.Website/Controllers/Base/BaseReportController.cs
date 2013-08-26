using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using OnlineOrder.Website.Models;

namespace OnlineOrder.Website.Controllers
{
    /// <summary>
    /// 所有报表的抽象基类
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class BaseReportController<T> : BaseListController<T> where T : IEntity
    {
        public BaseReportController(IModel<T> model)
            : base(model)          
        {           
        }
    }
}
