using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using AutoMapper;
using OnlineOrder.Mvc;
using OnlineOrder.Mvc.Grid;
using OnlineOrder.Mvc.Pagination;
using OnlineOrder.Website.Models;

namespace OnlineOrder.Website.Controllers
{
    /// <summary>
    /// 所有列表Controller的基类
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class BaseListController<T> : BaseController<T> where T : IEntity
    {
        #region 构造函数
        public BaseListController(IModel<T> model)
            : base(model)
        {            
        }
        #endregion
       

        #region 首次加载、列表操作、翻页、排序、刷新、搜索查询
        /// <summary>
        /// 首次加载、列表操作、翻页、排序、刷新、搜索查询
        /// </summary>
        /// <param name="pagingModel"></param>
        /// <returns></returns>
        public virtual ActionResult Index([ModelBinder(typeof(PagingModelBinder))]PagingModel pagingModel)
        {
            var expr = LambdaHelper.BuildQueryCondition<T>(pagingModel);
            IPagination<T> list = model.GetPagedList(pagingModel, expr);

            ViewBag.Sort = pagingModel.SortOptions;

            if (Request.IsAjaxRequest())
            {
                if (Request.HttpMethod == "GET")
                return PartialView("_Index", list);
                else
                    return Json(new SuccessActionResult("Ok", list));
            }

            return View("Index", list);
        }
        
        #endregion

        #region 列设置
        /// <summary>
        /// 列设置
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public virtual ActionResult Setting()
        {
            return PartialView();
        }
        #endregion

        #region 选择查询
        /// <summary>
        /// 选择查询
        /// </summary>
        /// <param name="pagingModel"></param>
        /// <returns></returns>        
        public virtual ActionResult Query([ModelBinder(typeof(PagingModelBinder))]PagingModel pagingModel)        
        {
            pagingModel.PageSize = 10;
            var expression = LambdaHelper.BuildQueryCondition<T>(pagingModel);
            object lstData;
            if (pagingModel.QueryFields == "Code,Name") //TODO:不同的查询列表不同字段列表
            {
                IEnumerable<T> list = model.GetList(expression);

                //TODO: 直接使用IPagination<T>无法转换 
                var data = Mapper.Map<IEnumerable<T>, IEnumerable<QueryViewModel>>(list)
                    .OrderBy(pagingModel.SortOptions.Column, pagingModel.SortOptions.Direction)
                    .AsPagination(pagingModel.PageIndex, pagingModel.PageSize, pagingModel.SortOptions);

                lstData = data;
            }
            else
            {
                IPagination<T> list = model.GetPagedList(pagingModel, expression);
                lstData = list;
            }

            ViewBag.Sort = pagingModel.SortOptions;
            ViewBag.Query = pagingModel.Query;

            if (Request.HttpMethod == "GET")
                return PartialView("_Query", lstData);

            //默认是PUT
            return PartialView("Query", lstData);
        }
        #endregion

        #region 输入模糊查询自动完成
        /// <summary>
        /// 输入模糊查询自动完成
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost]
        public virtual ActionResult Query(String query)
        {
            var expression = LambdaHelper.BuildLambdasOr<T>("Code,Name", QueryMethods.Contains, query);
            IEnumerable<T> list = model.GetList(expression);

            return Json(new SuccessActionResult("ok", list));
        }
        #endregion
    }
}
