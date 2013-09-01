using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace OnlineOrder.Mvc
{
    /// <summary>
    /// HtmlHelper扩展类 -- 工具栏
    /// </summary>
    public static class ToolbarHelperExtensions
    {
        public static Toolbar Toolbar(this HtmlHelper helper, IEnumerable<ToolbarItem> items)
        {
            return new Toolbar(helper, items, true, "");
        }

        public static Toolbar Toolbar(this HtmlHelper helper, IEnumerable<ToolbarItem> items, bool isQuery = true)
        {
            return new Toolbar(helper, items, isQuery, "");
        }

        public static Toolbar Toolbar(this HtmlHelper helper, IEnumerable<ToolbarItem> items, bool isQuery = true, IHtmlString advBlock = null)
        {
            return new Toolbar(helper, items, isQuery, advBlock.ToHtmlString());
        }

        public static Toolbar Toolbar(this HtmlHelper helper, IEnumerable<ToolbarItem> items, bool isQuery = true, string advBlock = "")
        {
            return new Toolbar(helper, items, isQuery, advBlock);
        }       
    }   
}
