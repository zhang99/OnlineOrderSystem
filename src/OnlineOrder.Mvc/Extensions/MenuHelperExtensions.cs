using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Newtonsoft.Json;

namespace OnlineOrder.Mvc
{   
    /// <summary>
    /// HtmlHelper扩展类 -- 菜单
    /// </summary>
    public static class MenuHelperExtensions
    {
        /// <summary>
        /// SissMainMenu主菜单辅助方法，检查是否当前菜单
        /// add by zhangh 2013/05/09
        /// </summary>
        /// <param name="menu"></param>
        /// <param name="controllerName"></param>
        /// <returns></returns>          
        private static bool IsCurrentController(Menu menu, string controllerName,ref bool flag)
        {
            if (menu.Controller == controllerName)
                return flag = true;

            if (menu.Menus != null)
            {
                foreach (var m in menu.Menus)
                    IsCurrentController(m, controllerName, ref flag);
            }

            return flag;
        }

        /// <summary>
        /// SissMainMenu主菜单  
        /// add by zhangh 2013/05/08
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="jsonMenus"></param>
        /// <param name="curCtlName"></param>
        /// <returns></returns>
        public static MvcHtmlString SiMainMenu(this HtmlHelper htmlHelper, string jsonMenus, string curCtlName)
        {
            bool flag;
            List<Menu> menus = JsonConvert.DeserializeObject<List<Menu>>(jsonMenus);            
            StringBuilder builder = new StringBuilder();
            
            builder.Append("<ul class=\"clearfix\">");            
            foreach (var item in menus)
            {
                flag = false;
                builder.AppendFormat("<li {0}><a href='/{1}/{2}'>{3}</a>", (IsCurrentController(item, curCtlName,ref flag) ? "class=current" : ""), item.Controller, item.Action, item.Text);               

                if (item.Menus != null)
                {
                    builder.Append("<dl>");
                    foreach (var x in item.Menus)
                    {
                        builder.AppendFormat("<dt class=\"first\"><strong>{0}</strong></dt>", x.Text);
                        builder.Append("<dd>");
                        foreach (var y in x.Menus)
                        {
                            if (y.Url != null)
                                builder.AppendFormat("<a href=\"{0}\" target=\"_blank\">{1}</a>", y.Url, y.Text);
                            else
                                builder.AppendFormat("<a href=\"/{0}/{1}\">{2}</a>", y.Controller, y.Action, y.Text);
                        }
                        builder.Append("</dd>");
                    }
                    builder.Append("</dl>");
                }
                builder.Append("</li>");                
            }
            builder.Append("</ul>");            

            return MvcHtmlString.Create(builder.ToString());
        }

        /// <summary>
        /// SissDropDownMenu下拉菜单
        /// add by zhangh 2013/05/09
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="jsonMenus"></param>
        /// <returns></returns>
        public static MvcHtmlString SiDropDownMenu(this HtmlHelper htmlHelper, string text, string jsonMenus, bool hasContainer=true)
        {
            List<Menu> menus = JsonConvert.DeserializeObject<List<Menu>>(jsonMenus);

            StringBuilder builder = new StringBuilder();
            if (hasContainer)
                builder.Append("<ul>");

            builder.Append("<li class=\"top\">");
            builder.AppendFormat("<a href=\"javascript:void(0);\">{0}<b></b></a>", text);
            builder.Append("<div>");
            foreach (var item in menus)
            {               
                if (item.Url != null)
                    builder.AppendFormat("<a href=\"{0}\" target=\"_blank\">{1}</a>", item.Url, item.Text);
                else
                    builder.AppendFormat("<a href=\"/{0}/{1}\">{2}</a>", item.Controller, item.Action, item.Text);
            }
            builder.Append("</div>");
            builder.Append("</li>");
            if (hasContainer)
                builder.Append("</ul>");

            return MvcHtmlString.Create(builder.ToString());
        }
        
        /// <summary>
        /// 菜单对象
        /// </summary>
        private class Menu
        {
            public string Text { get; set; }
            public string Url { get; set; }
            public string Action { get; set; }
            public string Controller { get; set; }           
            public List<Menu> Menus { get; set; }            
        }
    }
}
