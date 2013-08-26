using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineOrder.Website.Models
{
    /// <summary>
    /// 单据接口
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface ISheetModel<T> : IModel<T> where T : IEntity
    {
        /// <summary>
        /// 产生单号
        /// </summary>
        /// <param name="transNo"></param>
        /// <returns></returns>
        string GenerateSheetNo(string transNo);

        /// <summary>
        /// 审核单据
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        void Approve(T entity);
    }
}