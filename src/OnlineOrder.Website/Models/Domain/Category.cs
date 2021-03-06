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
    public partial class Category : ModelBase<Category>, IModel<Category>
    {
        public Category()
        {
            this.Children = new HashSet<Category>();
            this.Products = new HashSet<Product>();
        }   
        [Display(Name="编码")]
        public string Code { get; set; }
        [Display(Name = "名称")]
        public string Name { get; set; }
        public Nullable<int> ParentId { get; set; }

        public virtual ICollection<Category> Children{ get; set; }
        public virtual Category Parent { get; set; }
        public virtual ICollection<Product> Products { get; set; }

        /// <summary>
        /// 有无孩子节点
        /// </summary>
        public bool hasChild
        {
            get
            {
                return this.Children != null && this.Children.Count > 0;
            }
        }
    }
    
}
