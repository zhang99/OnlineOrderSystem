using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Newtonsoft.Json;
using OnlineOrder.Mvc.Grid;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Mvc
{
    /// <summary>
    /// PagingModelBinder
    /// </summary>
    public class PagingModelBinder : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            PagingModel pagingModel = new PagingModel();
            var pageIndex = controllerContext.HttpContext.Request.Params["pageIndex"] == null 
                ? pagingModel.PageIndex.ToString() 
                : controllerContext.HttpContext.Request.Params["pageIndex"].ToString();
            var pageSize = controllerContext.Controller.ViewBag.PageSize == null
                ? pagingModel.PageSize.ToString()
                : controllerContext.Controller.ViewBag.PageSize.ToString();
            //var sortBy = controllerContext.HttpContext.Request.Params["sortBy"];
            //var sortDir = controllerContext.HttpContext.Request.Params["sortDir"];
            var query = controllerContext.HttpContext.Request.Params["query"];
            var queryFields = controllerContext.HttpContext.Request.Params["queryFields"];
            var sortOptions = controllerContext.HttpContext.Request.Params["SortOptions"];
            var advancedQuery = controllerContext.HttpContext.Request.Params["advancedQuery"];

            //GridSortOptions sortOption = new GridSortOptions
            //{
            //    Column = string.IsNullOrEmpty(sortBy) ? pagingModel.SortOptions.Column : sortBy.ToString(),
            //    Direction = string.IsNullOrEmpty(sortDir)
            //                ? pagingModel.SortOptions.Direction : sortDir == "asc"
            //                ? SortDirection.Ascending : sortDir == "desc"
            //                ? SortDirection.Descending : pagingModel.SortOptions.Direction
            //};

            int temp;
            pagingModel.PageIndex = int.TryParse(pageIndex, out temp) ? temp : pagingModel.PageIndex;
            pagingModel.PageSize = int.TryParse(pageSize, out temp) ? temp : pagingModel.PageSize;
            pagingModel.SortOptions = string.IsNullOrEmpty(sortOptions) ? pagingModel.SortOptions : JsonConvert.DeserializeObject<GridSortOptions>(sortOptions.ToString());
            pagingModel.Query = string.IsNullOrEmpty(query) ? pagingModel.Query : query.ToString();
            pagingModel.QueryFields = string.IsNullOrEmpty(queryFields) ? pagingModel.QueryFields : queryFields.ToString();
            pagingModel.AdvancedQuery = string.IsNullOrEmpty(advancedQuery)
                ? pagingModel.AdvancedQuery
                : JsonConvert.DeserializeObject<IEnumerable<AdvancedQueryItem>>(advancedQuery.ToString());

            return pagingModel;

        }       
    }
}
