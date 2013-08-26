using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace OnlineOrder.Mvc
{
    /// <summary>
    /// 下拉框控件，枚举值
    /// </summary>
    public sealed class ValuesAttribute : Attribute
    {
        public ValuesAttribute(string value)
        {
            this.Value = value;
        }

        public string Value { get; set; }
    }
}
