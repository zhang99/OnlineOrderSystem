using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace OnlineOrder.Website.Models
{
    public class LoginViewModel
    {
        [Required]
        [Display(Name = "用户")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "密码")]
        public string Password { get; set; }

        [Display(Name = "记住?")]
        public bool RememberMe { get; set; }
    }
}