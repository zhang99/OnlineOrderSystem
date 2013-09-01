//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OnlineOrder.Website.Models
{
    public partial class SendOrderDetail : ModelBase<SendOrderDetail>, IModel<SendOrderDetail>
    {     
        public Nullable<int> ParentId { get; set; }
        public Nullable<int> ProductId { get; set; }
        [Display(Name = "数量")]
        public Nullable<decimal> Qty { get; set; }
        [Display(Name = "价格")]
        public Nullable<decimal> Price { get; set; }
        [Display(Name = "金额")]
        public Nullable<decimal> Amount { get; set; }
        [Display(Name = "折扣")]
        public Nullable<decimal> Discount { get; set; }
    
        public virtual Product Product { get; set; }
        public virtual SendOrder SendOrder { get; set; }
    }
    
}
