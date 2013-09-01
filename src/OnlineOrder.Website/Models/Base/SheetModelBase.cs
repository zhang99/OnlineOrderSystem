using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using OnlineOrder.Mvc;

namespace OnlineOrder.Website.Models
{
    /// <summary>
    /// 单据Model基类
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class SheetModelBase<T> : ModelBase<T> where T : class
    {
        #region 属性
        [Display(Name = "单号")]
        [Width(120)]
        public string Code { get; set; }
        [Display(Name = "交易编码")]
        public string TransNo { get; set; }
        [Display(Name = "审核标识")]
        public string ApproveFlag { get; set; }
        [Display(Name = "审核人ID")]
        public Nullable<int> ApproverId { get; set; }
        [Editable(false)]
        [Display(Name = "审核人员")]
        [JsonIgnore]
        public virtual User Approver { get; set; }
        [Display(Name = "审核日期")]
        public Nullable<DateTime> ApproveDate { get; set; }
        [Display(Name = "制单人ID")]
        public Nullable<int> OperId { get; set; }
        [Editable(false)]
        [Display(Name = "制单人员")]
        [JsonIgnore]
        public virtual User Oper { get; set; }
        [Display(Name = "制单日期")]
        public Nullable<DateTime> OperDate { get; set; }        
        #endregion
        
        /// <summary>
        /// 产生单据编号
        /// </summary>
        /// <param name="transNo"></param>
        /// <returns></returns>
        public virtual string GenerateSheetNo(string transNo)
        {
            //TODO: 根据实际业务需求产生单号
            return string.Format("{0}{1}",transNo,System.DateTime.Now.ToString("yyyyMMddhhssmm"));
        }

        /// <summary>
        /// 单据审核前逻辑处理
        /// </summary>
        /// <param name="entity"></param>
        public virtual void BeforeApprove(T entity)
        {            
        }

        /// <summary>
        /// 单据审核
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userId"></param>
        public T Approve(int id, int userId)
        {
            T entity = this.GetById(id);
            this.BeforeApprove(entity);

            Type type = entity.GetType();
            type.GetProperty("ApproveFlag").SetValue(entity, "1", null);
            type.GetProperty("ApproverId").SetValue(entity, userId, null);
            type.GetProperty("ApproveDate").SetValue(entity, System.DateTime.Now, null);

            return this.Update(entity);
        }
    }
}