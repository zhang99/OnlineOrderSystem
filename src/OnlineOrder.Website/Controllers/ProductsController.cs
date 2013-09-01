using System;
using System.IO;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http.ModelBinding.Binders;
using System.Web.Mvc;
using OnlineOrder.Mvc;
using OnlineOrder.Mvc.Grid;
using OnlineOrder.Mvc.Pagination;
using System.Data.Entity.Validation;
using OnlineOrder.Website.Models;
using System.Linq.Expressions;
using Newtonsoft.Json;
using System.Data.Entity;
using System.Reflection;

namespace OnlineOrder.Website.Controllers
{
    /// <summary>
    /// 商品档案Controller
    /// </summary>
    [Title("商品档案")]
    public class ProductsController : BaseDataController<Product>
    {
        public ProductsController(Product model)
            : base(model)
        {
        }

        #region 商品选择
        /// <summary>
        /// 商品选择
        /// </summary>
        /// <param name="pagingModel"></param>
        /// <returns></returns>
        [OutputCache(Duration = 120)]
        public override ActionResult Query([ModelBinder(typeof(PagingModelBinder))]PagingModel pagingModel)
        {
            Response.Cache.SetOmitVaryStar(true);
            SelectProductsViewModel pvm = new SelectProductsViewModel();
            Category categoryModel = new Category();
            ViewBag.Sort = pagingModel.SortOptions;
            ViewBag.Query = pagingModel.Query;
            pagingModel.PageSize = 10;

            var parentId = Request.Params["parentId"];
            var parentCode = Request.Params["parentCode"];

            if (String.IsNullOrWhiteSpace(parentId))
            {
                pvm.CategoriesTree = categoryModel.GetList(p => p.ParentId == null);
            }
            else
            {
                Int32 pId = Int32.Parse(parentId);
                pvm.CategoriesTree = categoryModel.GetList(p => p.ParentId == pId);
            }

            var expr = LambdaHelper.BuildLambdasOr<Product>(pagingModel.QueryFields, QueryMethods.Contains, pagingModel.Query);
            if (String.IsNullOrWhiteSpace(parentCode))
            {
                pvm.ProductsList = model.GetPagedList(pagingModel, expr);
            }
            else
            {
                var predicate = PredicateBuilder.True<Product>();
                predicate = predicate.And(f => f.Category.Code.StartsWith(parentCode)).And(expr);
                pvm.ProductsList = model.GetPagedList(pagingModel, predicate);
            }

            if (Request.HttpMethod == "GET")
                return PartialView("_Query", pvm);

            //默认是PUT
            return PartialView("Query", pvm);
        }
        #endregion

        #region TODO
        /// <summary>
        /// ajax 服务端校验 TODO:Ajax服务端校验功能还需重新设计
        /// </summary>
        /// <param name="id"></param>
        /// <param name="validate"></param>
        /// <returns></returns>
        //public ActionResult Validate(int id, Dictionary<string, string> validate)
        //{
        //    //TODO:Ajax服务端校验功能还需重新设计
        //    string key = validate.First().Key;
        //    string value = validate.First().Value;

        //    IEnumerable<Product> products = model.Context.Products.SqlQuery(string.Format("select * from Products where {0}='{1}' and Id!={2}", key, value, id));

        //    if (products.Count() > 0)
        //    {
        //        return Json(new ErrorActionResult(value + " 已存在，请重新输入"));
        //    }
        //    return Json(new SuccessActionResult("ok"));
        //}     
        #endregion
    }
}
