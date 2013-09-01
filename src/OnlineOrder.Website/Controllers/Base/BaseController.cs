using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using OnlineOrder.Mvc;
using OnlineOrder.Mvc.Grid;
using OnlineOrder.Mvc.Pagination;
using System.IO;
using System.Collections;
using OnlineOrder.Website.Models;

namespace OnlineOrder.Website.Controllers
{
    /// <summary>
    /// Controller顶级抽象基类
    /// </summary>
    public abstract class BaseController<T> : Controller where T : IEntity
    {
        #region 成员变量
        protected IModel<T> model;           
        #region HASHTABLE_ACTION_PAIRS
        //TODO:Action中英文对照表，暂时放置这里,具体放哪里后面讨论考虑
        private readonly Hashtable HASHTABLE_ACTION_PAIRS = new Hashtable(){
                {"Index","列表"},
                {"Create","新增"},
                {"Edit","编辑"},
                {"Query","查询"}
            };
        #endregion
        #endregion

        #region 构造函数
        public BaseController(IModel<T> model)
        {
            this.model = model;
        }
        #endregion

        #region 当前用户
        /// <summary>
        /// 当前用户
        /// </summary>
        private User _currUser;
        public User CurrUserInfo
        {
            get {
                _currUser = new User { Id = 1, Code = "2755", Name = "张华", Password = "ND46R2V8" };
                return _currUser;
            }
            set {
                _currUser = value;             
            }
        }
        #endregion

        #region 操作ModelState
        /// <summary>
        /// AddModelState
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        protected void AddModelState(string key, object value)
        {
            ModelState.Add(new KeyValuePair<string, ModelState>(key, new ModelState() { Value = new ValueProviderResult(value, "", null) }));
        }
        #endregion

        #region 重写覆盖Json
        /// <summary>
        /// 重写覆盖Json
        /// </summary>
        /// <param name="data"></param>
        /// <param name="contentType"></param>
        /// <param name="contentEncoding"></param>
        /// <returns></returns>
        protected new JsonResult Json(object data)
        {
            if (Request.Files.Count > 0)
                return Json(data, "text/html", Encoding.UTF8);
            else
                return new CustomJsonResult { Data = data };
        }

        /// <summary>
        /// 重写覆盖Json
        /// </summary>
        /// <param name="data"></param>
        /// <param name="behavior"></param>
        /// <returns></returns>
        protected new JsonResult Json(object data, JsonRequestBehavior behavior)
        {
            return new CustomJsonResult
            {
                Data = data,
                JsonRequestBehavior = behavior
            };
        }

        /// <summary>
        /// 重写Json
        /// </summary>
        /// <param name="data"></param>
        /// <param name="contentType"></param>
        /// <param name="contentEncoding"></param>
        /// <returns></returns>
        protected override JsonResult Json(object data, string contentType, Encoding contentEncoding)
        {
            return new CustomJsonResult
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding
            };
        }
        #endregion

        #region GetCustomAttribute
        /// <summary>
        /// GetCustomAttribute
        /// </summary>
        /// <param name="type"></param>
        /// <param name="attrType"></param>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        protected string GetCustomAttribute(Type type, Type attrType, string fieldName)
        {
            if (type.IsDefined(attrType, false))
            {
                Attribute attr = Attribute.GetCustomAttribute(type, attrType, false);
                if (attr != null)
                    return attr.GetType().GetProperty(fieldName).GetValue(attr, null).ToString();
            }
            return string.Empty;
        }
        #endregion

        #region 重写OnActionExecuting
        /// <summary>
        /// OnActionExecuting重写
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!Request.IsAuthenticated)
            {
                filterContext.Result = RedirectToAction("Index","Home");
            }
            else
            {
                ViewBag.ControllerName = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
                ViewBag.ActionName = filterContext.ActionDescriptor.ActionName;

                var attrs = filterContext.ActionDescriptor
                    .ControllerDescriptor
                    .GetCustomAttributes(typeof(TitleAttribute), false);

                if (attrs.Length > 0)
                {
                    ViewBag.ModelName = ((TitleAttribute)attrs[0]).Title;
                    ViewBag.Title = string.Format("{0} -- {1}", ((TitleAttribute)attrs[0]).Title,
                        HASHTABLE_ACTION_PAIRS.ContainsKey(ViewBag.ActionName) ?
                        HASHTABLE_ACTION_PAIRS[ViewBag.ActionName] : "");
                }
            }

        }
        #endregion

        #region 异常处理
        /// <summary>
        /// OnException重写异常处理
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnException(ExceptionContext filterContext)
        {
            filterContext.ExceptionHandled = true;
            filterContext.Result = Json(new ErrorActionResult(filterContext.Exception.InnerException ?? filterContext.Exception));
        }
        #endregion

    }
}
