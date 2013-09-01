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
using Newtonsoft.Json;

namespace OnlineOrder.Website.Models
{
    public partial class OrderDetail : ModelBase<OrderDetail>, IModel<OrderDetail>
    {
        [Display(Name = "行号")]
        public int LineNum { get; set; }
        public Nullable<int> ParentId { get; set; }
        public Nullable<int> ProductId { get; set; }
        [Display(Name = "数量")]
        public Nullable<decimal> Qty { get; set; }
        [Display(Name = "价格")]
        public Nullable<decimal> SalePrice { get; set; }
        [Display(Name = "金额")]
        public Nullable<decimal> Amount { get; set; }
        [Display(Name = "折扣")]
        public Nullable<decimal> Discount { get; set; }
        [JsonIgnore]
        public virtual Order Order { get; set; }
        [JsonIgnore]
        public virtual Product Product { get; set; }
       
    }
    
}
