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
    public partial class Logistic : ModelBase<Logistic>, IModel<Logistic>
    {
        public Logistic()
        {
            this.SendOrders = new HashSet<SendOrder>();
        }
        [Display(Name = "名称")]
        public string Name { get; set; }
        [Display(Name = "联系人")]
        public string Linkman { get; set; }
        [Display(Name = "电话")]
        public string Tel { get; set; }
        [Display(Name = "网站")]
        public string WebSite { get; set; }
        [Display(Name = "费用")]
        public Nullable<decimal> Fee { get; set; }
         [Display(Name = "备注")]
        public string Memo { get; set; }
    
        public virtual ICollection<SendOrder> SendOrders { get; set; }
    }
    
}
