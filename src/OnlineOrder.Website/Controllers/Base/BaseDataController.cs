using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OnlineOrder.Website.Models;
using OnlineOrder.Mvc;
using System.IO;
using System.Reflection;
using Newtonsoft.Json;
using System.Collections;

namespace OnlineOrder.Website.Controllers
{
    /// <summary>
    /// 涉及业务操作的抽象基类
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class BaseDataController<T> : BaseListController<T> where T : IEntity
    {
        #region 构造函数
        public BaseDataController(IModel<T> model)
            : base(model)
        {
        }
        #endregion

        #region 新增
        /// <summary>
        /// 新增
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public virtual ActionResult Create()
        {
            if (Request.IsAjaxRequest())
                return PartialView("Create");
            return View();
        }
        #endregion

        #region 新增保存
        /// <summary>
        /// 新增保存
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateModel]
        public virtual ActionResult Create([Bind(Exclude = "Id,Parent")]T entity)
        {
            UpdateEntity(entity);
            entity = model.Add(entity);
            model.Commit();

            #region TODO: ModelState需手动更新?
            //ViewBag.ActionName = "Edit";
            //if (Request.IsAjaxRequest())
            //    PartialView("Create", entity);
            //return Json(new SuccessActionResult("保存成功.", entity));

            //Type type = entity.GetType();
            //PropertyInfo[] properties = type.GetProperties();
            //KeyValuePair<string, ModelState> kv;
            //ValueProviderResult vps;
            //ModelState ms;
            //for (int j = 0; j < properties.Length; j++)
            //{
            //    PropertyInfo propertyInfo = properties[j];
            //    object o = propertyInfo.GetValue(entity, null);

            //    vps = new ValueProviderResult(o, "", null);
            //    ms = new System.Web.Mvc.ModelState();
            //    ms.Value = vps;
            //    kv = new KeyValuePair<string, ModelState>(propertyInfo.Name, ms);

            //    ModelState.Add(kv);
            //}

            //return Redirect(string.Format("Edit/{0}",entity.Id));
            //return ResultView("_Create", entity);
            #endregion

            return Json(new SuccessActionResult("保存成功", entity));
        }
        #endregion

        #region 编辑
        /// <summary>
        /// 编辑
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public virtual ActionResult Edit(int id)
        {
            var entity = model.GetById(id);
            if (Request.IsAjaxRequest())                    // james
                return PartialView("Create", entity);       //弹出对话框式的编辑界面，如brand编辑
            return View("Create", entity);                  //跳转式的编辑界面，如product编辑
        }
        #endregion

        #region 编辑保存
        /// <summary>
        /// 编辑保存
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateModel]
        public virtual ActionResult Edit([Bind(Exclude = "Parent")]T entity)
        {
            T modelData = model.GetById(entity.Id);
            UpdateModel(modelData);
            modelData = model.Update(modelData);
            model.Commit();

            return Json(new SuccessActionResult("保存成功.", modelData));
        }
        #endregion

        #region 删除操作
        /// <summary>
        /// 删除操作
        /// </summary>
        /// <param name="Ids"></param>
        /// <returns></returns>
        [HttpPost]
        public virtual JsonResult Delete([ModelBinder(typeof(SissArrayModelBinder<int>))]int[] Ids)
        {
            if (Ids.Count() == 0)
                throw new Exception("没有选择任何记录!");

            model.Delete(Ids);
            model.Commit();

            return Json(new SuccessActionResult(String.Format("成功删除{0}条数据.", Ids.Count())));
        }
        #endregion

        #region 更新实体对象
        /// <summary>
        /// 更新实体对象
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        protected new void UpdateModel<TModel>(TModel entity) where TModel : IEntity
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            if (ValueProvider == null)
                throw new ArgumentNullException("ValueProvider");

            Type type = typeof(T);

            IModelBinder binder = Binders.GetBinder(type);

            ModelBindingContext bindingContext = new ModelBindingContext()
            {
                ModelMetadata = ModelMetadataProviders.Current.GetMetadataForType(() => entity, type),
                ModelName = null,
                ModelState = ModelState,
                PropertyFilter = null,
                ValueProvider = ValueProvider
            };

            binder.BindModel(ControllerContext, bindingContext);

            UpdateEntity(entity);            
        }

        /// <summary>
        /// 更新实体对象
        /// </summary>
        /// <param name="entity"></param>
        protected virtual void UpdateEntity<TModel>(TModel entity) where TModel : IEntity
        {
            string fileName = Upload();

            Type type = entity.GetType();
            PropertyInfo[] properties = type.GetProperties();
            for (int j = 0; j < properties.Length; j++)
            {
                PropertyInfo propertyInfo = properties[j];

                if (propertyInfo.Name.Equals("OperId") && "Create".Equals(ViewBag.ActionName))
                    propertyInfo.SetValue(entity, CurrUserInfo.Id, null);

                if (propertyInfo.Name.Equals("OperDate") && "Create".Equals(ViewBag.ActionName))
                    propertyInfo.SetValue(entity, System.DateTime.Now, null);

                if (propertyInfo.Name.Equals("ModifyId")) //TODO:外键关联更新
                    propertyInfo.SetValue(entity, CurrUserInfo.Id, null);

                if (propertyInfo.Name.Equals("ModifyDate"))
                    propertyInfo.SetValue(entity, System.DateTime.Now, null);

                if (propertyInfo.Name.Equals("PicFileName") && !string.IsNullOrWhiteSpace(fileName))
                    propertyInfo.SetValue(entity, fileName, null);

                if (propertyInfo.PropertyType.GetProperty("Id") != null)
                    propertyInfo.SetValue(entity, null, null);

                if (propertyInfo.PropertyType.Name.Equals("ICollection`1"))
                {
                    IEnumerable tempList = null;
                    //有文件上传，实体中只有ICollection对象数据格式为Json字串，这里单独处理
                    if (!string.IsNullOrEmpty(fileName))
                    {
                        if (Request.Form[propertyInfo.Name] != null)
                        {
                            tempList = JsonConvert.DeserializeObject(Request.Form[propertyInfo.Name], propertyInfo.PropertyType) as IEnumerable;
                        }
                    }
                    else
                    {
                        tempList = propertyInfo.GetValue(entity, null) as IEnumerable;
                    }

                    if (tempList != null && tempList.GetEnumerator().MoveNext())
                    {
                        Type childType;
                        MethodInfo methodInfo;
                        foreach (var item in tempList)
                        {
                            if (item == null) continue;

                            childType = item.GetType();
                            int id = (int)childType.GetProperty("Id").GetValue(item, null);
                            if (id == 0)
                            {
                                methodInfo = childType.GetMethod("Add", new Type[] { childType });
                                methodInfo.Invoke(item, new object[] { item });
                            }
                            else if ((bool)childType.GetMethod("IsNullObject").Invoke(item, null))
                            {
                                methodInfo = childType.GetMethod("Delete", new Type[] { typeof(int) });
                                methodInfo.Invoke(item, new object[] { id });
                            }
                            else
                            {
                                methodInfo = childType.GetMethod("Update", new Type[] { childType });
                                methodInfo.Invoke(item, new object[] { item });
                            }
                        }
                    }
                }
            }
        }
        #endregion

        #region 文件上传
        /// <summary>
        /// 文件上传
        /// </summary>
        /// <returns></returns>       
        protected string Upload()
        {
            if (Request.Files.Count == 0)
                return string.Empty;

            //文件上传后的保存路径
            string filePath = Server.MapPath("~/Uploads/");
            if (!Directory.Exists(filePath))
                Directory.CreateDirectory(filePath);

            string fileName = Path.GetFileName(Request.Files[0].FileName);// 原始文件名称
            string fileExtension = Path.GetExtension(fileName); // 文件扩展名
            string saveName = Guid.NewGuid().ToString() + fileExtension; // 保存文件名称

            Request.Files[0].SaveAs(filePath + saveName);

            return saveName;
        }
        #endregion

        #region 重写OnActionExecuting
        /// <summary>
        /// OnActionExecuting重写
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            var attrs = filterContext.ActionDescriptor
                                     .GetCustomAttributes(typeof(ValidateModelAttribute), false);
            if (attrs.Length > 0)
            {
                if (!ModelState.IsValid)
                {
                    string errorMsg = string.Join(Environment.NewLine, ModelState.Values
                                            .SelectMany(x => x.Errors)
                                            .Select(x => x.ErrorMessage));

                    if (!string.IsNullOrEmpty(errorMsg))
                        filterContext.Result = Json(new ErrorActionResult(errorMsg));
                }
            }

            if (ViewBag.ActionName == "Create" && filterContext.HttpContext.Request.HttpMethod == "GET")
            {
                AddModelState("OperId", CurrUserInfo.Id);
                AddModelState("Oper.Name", CurrUserInfo.Name);
                AddModelState("OperDate", System.DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss"));
                AddModelState("ModifyId", CurrUserInfo.Id);
                AddModelState("Modify.Name", CurrUserInfo.Name);
                AddModelState("ModifyDate", System.DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss"));
            }
        }
        #endregion
    }
}
