//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace OnlineOrder.Website.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.Collections.Generic;
    using Newtonsoft.Json;

    public partial class Brand : ModelBase<Brand>, IModel<Brand>
    {    
        // Primitive properties    
        [Display(Name = "����")]
        [Required(AllowEmptyStrings = false)]
        public string Code { get; set; }
        [Display(Name = "����")]
        [Required(AllowEmptyStrings = false)]
        public string Name { get; set; }
    
        // Navigation properties
        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }
    
    }
}