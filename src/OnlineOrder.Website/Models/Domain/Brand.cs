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
    public partial class Brand : ModelBase<Brand>, IModel<Brand>
    {
        public Brand()
        {
            this.Products = new HashSet<Product>();
        }        
        [Display(Name="����")]
        public string Code { get; set; }
        [Display(Name = "����")]
        public string Name { get; set; }
    
        public virtual ICollection<Product> Products { get; set; }
    }
    
}
