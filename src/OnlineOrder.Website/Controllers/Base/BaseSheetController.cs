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
        private readonly Hashtable HASHTABLE_SHEET_TYPES = new Hashtable(){
                {"采购订单","PO"},
                {"采购收货","PI"}, //TODO: 其他待加
            };

        public BaseSheetController(ISheetModel<T> model)
            : base(model)          
        {
            string title = GetCustomAttribute(this.GetType(), typeof(TitleAttribute), "Title");
            if (HASHTABLE_SHEET_TYPES.ContainsKey(title)) 
                TransNo = HASHTABLE_SHEET_TYPES[title].ToString();

            if (string.IsNullOrWhiteSpace(TransNo))
                throw new ArgumentNullException("TransNo不能为空.");
        }
       
        /// <summary>
        /// 单据类型TransNo
        /// </summary>
        protected string TransNo
        {
            get;
            set;
        }

        /// <summary>
        /// 单据审核
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public virtual ActionResult Approve(int Id)
        {
            var mod = model as ISheetModel<T>;

            T entity = mod.GetById(Id);
            Type type = entity.GetType();
            type.GetProperty("ApproveFlag").SetValue(entity, "1", null);
            type.GetProperty("ApproverId").SetValue(entity, CurrUserInfo.Id, null);
            type.GetProperty("ApproveDate").SetValue(entity, System.DateTime.Now, null);

            mod.Approve(entity);
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
            Type type = entity.GetType();
            PropertyInfo[] properties = type.GetProperties();
            for (int j = 0; j < properties.Length; j++)
            {
                PropertyInfo propertyInfo = properties[j];
                if (propertyInfo.Name.Equals("TransNo") && "Create".Equals(ViewBag.ActionName))
                    propertyInfo.SetValue(entity, TransNo, null);

                if (propertyInfo.Name.Equals("Code") && "Create".Equals(ViewBag.ActionName))
                    propertyInfo.SetValue(entity, (model as ISheetModel<T>).GenerateSheetNo(TransNo), null);
            }

            base.UpdateEntity(entity);
        }
    }
}
