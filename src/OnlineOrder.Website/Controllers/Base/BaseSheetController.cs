using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using OnlineOrder.Mvc;
using OnlineOrder.Website.Models;

namespace OnlineOrder.Website.Controllers
{
    /// <summary>
    /// 所有单据的抽象基类
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class BaseSheetController<T> : BaseDataController<T> where T : IEntity
    {
        public BaseSheetController(ISheetModel<T> model)
            : base(model)          
        {
        }

        /// <summary>
        /// 单据审核
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public virtual ActionResult Approve(int Id)
        {
            var mod = model as ISheetModel<T>;
            T entity = mod.Approve(Id, CurrUserInfo.Id);
            mod.Commit();

            return Json(new SuccessActionResult("审核成功.", entity));
        }

        /// <summary>
        /// 终止订单
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public virtual ActionResult Stop(int Id)
        {
            return new EmptyResult();
        }

        /// <summary>
        /// 导出
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public virtual ActionResult Export(int Id)
        {
            return new EmptyResult();
        }

         /// <summary>
        /// 更新实体对象
        /// </summary>
        /// <param name="entity"></param>
        protected override void UpdateEntity<TModel>(TModel entity)
        {
            #region Obsolete
            //Type type = entity.GetType();
            //PropertyInfo[] properties = type.GetProperties();
            //for (int j = 0; j < properties.Length; j++)
            //{
            //    PropertyInfo propertyInfo = properties[j];
            //    if (propertyInfo.Name.Equals("TransNo") && "Create".Equals(ViewBag.ActionName))
            //        propertyInfo.SetValue(entity, TransNo, null);

            //    if (propertyInfo.Name.Equals("Code") && "Create".Equals(ViewBag.ActionName))
            //        propertyInfo.SetValue(entity, (model as ISheetModel<T>).GenerateSheetNo(TransNo), null);
            //}
            #endregion

            base.UpdateEntity(entity);
        }
    }
}
