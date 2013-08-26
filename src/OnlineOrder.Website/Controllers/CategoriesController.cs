using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using AutoMapper;
using OnlineOrder.Mvc;
using OnlineOrder.Mvc.Grid;
using OnlineOrder.Mvc.Pagination;
using System.IO;
using OnlineOrder.Website.Models;
using System.Linq.Expressions;


namespace OnlineOrder.Website.Controllers
{
    [Title("类别管理")]
    public class CategoriesController : BaseDataController<Category>
    {
        public CategoriesController(Category model)
            : base(model)          
        {           
        }

        /// <summary>
        /// 首次加载、列表操作、翻页、排序、刷新、搜索查询、Ajax请求树
        /// </summary>
        /// <param name="pagingModel"></param>
        /// <returns></returns>
        public override ActionResult Index([ModelBinder(typeof(PagingModelBinder))]PagingModel pagingModel)
        {
            CategoriesViewModel cvm = new CategoriesViewModel();
            ViewBag.Sort = pagingModel.SortOptions;
            var parentId = Request.Params["parentId"];
            var parentCode = Request.Params["parentCode"];

            if (String.IsNullOrWhiteSpace(parentId))
            {
                cvm.CategoriesTree = model.GetList(p => p.ParentId == null);
            }
            else
            {
                Int32 pId = Int32.Parse(parentId);
                cvm.CategoriesTree = model.GetList(p => p.ParentId == pId);
            }

            var expr = LambdaHelper.BuildLambdasOr<Category>(pagingModel.QueryFields, QueryMethods.Contains, pagingModel.Query);
            if (String.IsNullOrWhiteSpace(parentCode))
            {                
                cvm.CategoriesList = model.GetPagedList(pagingModel, expr);
            }
            else
            {
                var predicate = PredicateBuilder.True<Category>();
                predicate = predicate.And(f => f.Code.StartsWith(parentCode)).And(expr);               
                cvm.CategoriesList = model.GetPagedList(pagingModel, predicate);
            }

            if (Request.IsAjaxRequest())
            {
                if (Request.HttpMethod == "GET")
                    return PartialView("_Index", cvm);
                else
                    return Json(new SuccessActionResult("Ok", cvm.CategoriesTree));
            }

            return View("Index", cvm);
        }

    }
}
