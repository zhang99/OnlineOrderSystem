using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Reflection;
using System.Web.Routing;
using System.Collections;

namespace OnlineOrder.Mvc
{
    /// <summary>
    /// ToolbarItem
    /// </summary>
    public class ToolbarItem    
    {
        public ToolbarItem(string text):this(text,null)
        {
            this.Text = text;
        }

        public ToolbarItem(string text, Hashtable attibutes)
        {
            this.Text = text;
            this.Attibutes = attibutes;
        }

        public string Text {get;set; }

        public Hashtable Attibutes { get; set; }

    }

    /// <summary>
    /// Toolbar
    /// </summary>
    public class Toolbar :IHtmlString, IDisposable 
    {       
        private HtmlHelper _helper;        
        private IEnumerable<ToolbarItem> _toolbarItems;
        private string _block;
        private StringBuilder _builder = new StringBuilder();
        private bool _isQuery = true;      
 
        /// <summary>
        /// Toolbar
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="items"></param>
        /// <param name="isQuery"></param>
        /// <param name="block"></param>
        public Toolbar(HtmlHelper helper, IEnumerable<ToolbarItem> items, bool isQuery = true, string block = null)
        {
            _helper = helper;                    
            _toolbarItems = items;
            _block = block;
            _isQuery = isQuery;

            WriteStartTag();
            WriteToolBarItems();
            WriteEndTag();
        }

        /// <summary>
        /// WriteStartTag
        /// </summary>
        private void WriteStartTag()
        {
            _builder.Append(BuildStartTag());            
        }

        /// <summary>
        /// BuildStartTag
        /// </summary>
        /// <returns></returns>
        private string BuildStartTag()
        {
            StringBuilder builder = new StringBuilder();
            builder.AppendFormat(@"<div class=""si-tbar"">{0}", Environment.NewLine);
            return builder.ToString();
        }

        /// <summary>
        /// WriteToolBarItems
        /// </summary>
        private void WriteToolBarItems()
        {          
            StringBuilder sb = new StringBuilder();
            if (this._toolbarItems.Count() > 0)
            {
                sb.AppendFormat(@"<ul>{0}", Environment.NewLine);
                foreach (ToolbarItem item in this._toolbarItems)
                {
                    sb.AppendFormat(@"<li><a ", Environment.NewLine, item.Text);
                    if (item.Attibutes != null)
                    {
                        foreach (var i in item.Attibutes.Keys)
                        {
                            if (i.ToString().ToLower().Equals("class"))
                                sb.AppendFormat(@" {0}=""si-btn {1}"" ", i, item.Attibutes[i]);
                            else
                                sb.AppendFormat(@" {0}=""{1}"" ", i, item.Attibutes[i]);
                        }
                    }

                    sb.AppendFormat(@"><b></b>{1}</a></li>{0}", Environment.NewLine, item.Text);
                }
                if (this._isQuery)
                    sb.Append(@"<li class=""search""><input type=""text"" class=""search-text""  autofocus/><button class=""si-btn query"">查询</button></li>");

                if (!String.IsNullOrEmpty(this._block))
                    sb.Append(@"<li><a class=""adv adved"" id=""adv-search"">高级查询<i></i><b></b></a></li>");               
               
                sb.AppendFormat(@"</ul>{0}", Environment.NewLine);
                 if (!String.IsNullOrEmpty(this._block))
                     sb.AppendFormat(@"<div class=""adv-search"" id=""adv-search-panel"">{0}</div>", this._block);     

                _builder.Append(sb.ToString());                           
            }                                           
        }        

        /// <summary>
        /// WriteEndTag
        /// </summary>
        private void WriteEndTag()
        {
            _builder.Append("</div>");
        }

        /// <summary>
        /// Add items
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public Toolbar Add(ToolbarItem item)
        {
            return this;
        }


        #region IDisposable Members
        /// <summary>
        /// Dispose
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Dispose
        /// </summary>
        /// <param name="dispose"></param>
        public void Dispose(bool dispose)
        {
            if (dispose)
                WriteEndTag();
        }

        #endregion

        #region IHtmlString 成员
        /// <summary>
        /// ToHtmlString
        /// </summary>
        /// <returns></returns>
        public string ToHtmlString()
        {
            return _builder.ToString();
        }

        #endregion
    }
}
