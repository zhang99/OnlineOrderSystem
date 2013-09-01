using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OnlineOrder.Mvc
{
    /// <summary>
    /// 是否合计列
    /// </summary>
    [AttributeUsage(AttributeTargets.Property,
     AllowMultiple = false, Inherited = false)]
    public class IsSumAttribute : Attribute
    {
        public IsSumAttribute(bool isSum)
        {
            this.IsSum = isSum;
        }

        public bool IsSum { get; set; }
    }
}
