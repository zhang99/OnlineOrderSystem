using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OnlineOrder.Mvc
{
    /// <summary>
    /// 宽度
    /// </summary>
    [AttributeUsage(AttributeTargets.Property,
     AllowMultiple = false, Inherited = false)]
    public class WidthAttribute : Attribute
    {
        public WidthAttribute(int width)
        {
            this.Width = width;
        }

        public int Width { get; set; }
    }
}
