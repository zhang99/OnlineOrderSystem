using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OnlineOrder.Mvc
{
    /// <summary>
    /// 是否隐藏
    /// </summary>
    [AttributeUsage(AttributeTargets.Property,
     AllowMultiple = false, Inherited = false)]
    public class HideAttribute : Attribute
    {
        public HideAttribute(bool isHidden)
        {
            this.IsHidden = isHidden;
        }

        public bool IsHidden { get; set; }
    }
}
