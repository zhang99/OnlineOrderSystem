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
        string Code { get; set; }
        string TransNo { get; set; }
        string ApproveFlag { get; set; }
        Nullable<DateTime> ApproveDate { get; set; }
        Nullable<int> ApproverId { get; set; }
        User Approver { get; set; }
        Nullable<int> OperId { get; set; }
        User Oper { get; set; }
        Nullable<DateTime> OperDate { get; set; }

        string GenerateSheetNo(string transNo);
        T Approve(int id, int userId);
    }
}