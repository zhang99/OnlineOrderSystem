using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Web.Mvc;
using System.Web.Mvc.Properties;
using System.Web.Mvc.Html;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters;
using AutoMapper;
using Newtonsoft.Json;
using System.Web.Routing;

namespace OnlineOrder.Mvc
{
    public enum SiFieldType
    {
        /// <summary>
        /// 文本框
        /// </summary>
        TextBox,
        /// <summary>
        /// 文本域
        /// </summary>
        TextArea,
        /// <summary>
        /// 带选择、模糊查询、自动完成功能的用户控件
        /// </summary>
        UControl
    }

    /// <summary>
    /// SiTabNavItem
    /// </summary>
    public class SiTabNavItem
    {
        /// <summary>
        /// 名称
        /// </summary>
        public string Text { get; set; }
        /// <summary>
        /// 在指定的Action才显示
        /// </summary>
        public string ShowAct { get; set; }
    }

    /// <summary>
    /// HtmlHelperExtensions -- zhangh 2013/07/05
    /// </summary>
    public static class HtmlHelperExtensions
    {
        static IDictionary<string, object> dict = new Dictionary<string, object>(){
            {"confirm","确定"},
            {"cancel","取消"},
            {"create","新增"},
            {"delete","删除"},
            {"refresh","刷新"},
            {"setting","设置"},
            {"print","打印"} //TODO: 其他待加
        };

        /// <summary>
        /// ControllerName
        /// </summary>
        /// <param name="helper"></param>
        /// <returns></returns>
        public static string ControllerName(this HtmlHelper helper)
        {
            return helper.ViewContext.RouteData.Values["controller"].ToString();
        }

        /// <summary>
        /// ActionName
        /// </summary>
        /// <param name="helper"></param>
        /// <returns></returns>
        public static string ActionName(this HtmlHelper helper)
        {
            return helper.ViewContext.RouteData.Values["action"].ToString();
        }

        #region SiForm
        /// <summary>
        /// SiForm
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <returns></returns>
        public static MvcForm SiForm(this HtmlHelper htmlHelper)
        {
            return SiForm(htmlHelper, htmlHelper.ControllerName(), htmlHelper.ActionName(), FormMethod.Post, null);
        }

        /// <summary>
        /// SiForm
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        public static MvcForm SiForm(this HtmlHelper htmlHelper, object htmlAttributes)
        {
            return SiForm(htmlHelper, htmlHelper.ControllerName(), htmlHelper.ActionName(), FormMethod.Post, htmlAttributes);
        }

        /// <summary>
        /// SiForm -- zhangh 2013/06/13
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="controllerName"></param>
        /// <param name="actionName"></param>
        /// <param name="method"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        public static MvcForm SiForm(this HtmlHelper htmlHelper, string controllerName, string actionName, FormMethod method, object htmlAttributes)
        {
            TagBuilder tagBuilder = new TagBuilder("form");
            if (htmlAttributes != null)
                tagBuilder.MergeAttributes(new RouteValueDictionary(htmlAttributes));
            tagBuilder.AddCssClass("si-form");

            tagBuilder.MergeAttribute("controller", controllerName);
            tagBuilder.MergeAttribute("action", actionName);

            tagBuilder.MergeAttribute("method", HtmlHelper.GetFormMethodString(method), true);

            bool traditionalJavascriptEnabled = htmlHelper.ViewContext.ClientValidationEnabled
                                            && !htmlHelper.ViewContext.UnobtrusiveJavaScriptEnabled;


            htmlHelper.ViewContext.Writer.Write(tagBuilder.ToString(TagRenderMode.StartTag));
            MvcForm theForm = new MvcForm(htmlHelper.ViewContext);

            if (traditionalJavascriptEnabled)
            {
                htmlHelper.ViewContext.FormContext.FormId = tagBuilder.Attributes["id"];
            }

            return theForm;
        }
        #endregion

        /// <summary>
        /// SiSheet
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <returns></returns>
        public static MvcHtmlString SiSheetBegin(this HtmlHelper htmlHelper)
        {
            StringBuilder builder = new StringBuilder();
            builder.AppendFormat("<div class='container'><form action='{0}' method='{1}' controller='{2}' class='{3}'>", 
                htmlHelper.ActionName(), 
                "POST", 
                htmlHelper.ControllerName(), 
                "si-form si-sheet");

            return MvcHtmlString.Create(builder.ToString());
        }

        /// <summary>
        /// SiSheetEnd
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <returns></returns>
        public static MvcHtmlString SiSheetEnd(this HtmlHelper htmlHelper)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("</form></div>");

            return MvcHtmlString.Create(builder.ToString());
        }

        #region SiAdvancedQuery
        /// <summary>
        /// SiAdvancedQuery
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="arrMvcHtmlString"></param>
        /// <returns></returns>
        public static MvcHtmlString SiAdvancedQuery(this HtmlHelper htmlHelper, params object[] arrMvcHtmlString)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("<form class='si-form'><div class='general-box'>");
            foreach (MvcHtmlString item in arrMvcHtmlString)
            {
                builder.Append(item.ToHtmlString());
            }
            builder.Append("</div></form>");

            return MvcHtmlString.Create(builder.ToString());
        }
        #endregion

        #region SiSheetMaster
        /// <summary>
        /// SiSheetMaster
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="arrMvcHtmlString"></param>
        /// <returns></returns>
        public static MvcHtmlString SiSheetMaster(this HtmlHelper htmlHelper, params object[] arrMvcHtmlString)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("<div class='general-box'>");
            foreach (MvcHtmlString item in arrMvcHtmlString)
            {
                builder.Append(item.ToHtmlString());
            }
            builder.Append("</div>");
            return MvcHtmlString.Create(builder.ToString());
        }
        #endregion

        #region SiSheetDetail
        /// <summary>
        /// SiSheetDetailBegin
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <returns></returns>
        public static MvcHtmlString SiSheetDetailBegin(this HtmlHelper htmlHelper)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(string.Format(@"<ul class='si-sidebar'>
                                <li><a title='新增行' class='add' ></a></li>
                                <li><a title='删除行' class='delete'></a></li>
                            </ul>
                            <div field='{0}Details' class='si-edit-grid' controller='{0}Details'>", htmlHelper.ControllerName().TrimEnd(new char[] { 's' })));

            return MvcHtmlString.Create(builder.ToString());
        }

        /// <summary>
        /// SiSheetDetailEnd
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <returns></returns>
        public static MvcHtmlString SiSheetDetailEnd(this HtmlHelper htmlHelper)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("</div>");

            return MvcHtmlString.Create(builder.ToString());
        }
        #endregion

        #region SiTabNav
        /// <summary>
        /// SiTabNav
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTabNav(this HtmlHelper htmlHelper, List<SiTabNavItem> items)
        {
            if (items.Count() == 0)
            {
                return MvcHtmlString.Empty;
            }

            StringBuilder builder = new StringBuilder();
            builder.Append(@"<div class=""form-tab-nav"">");
            builder.Append("<ul>");
            foreach (var i in items)
            {
                builder.AppendFormat("<li{1}><span>{0}</span></li>", i.Text, string.IsNullOrWhiteSpace(i.ShowAct) ? string.Empty : string.Format(" showAct=\"{0}\"", i.ShowAct));
            }           
            builder.Append("</ul>");            
            builder.Append("</div>");
            
            return MvcHtmlString.Create(builder.ToString());
        }
        #endregion

        #region SiDateboxArea
        /// <summary>
        /// SiDateboxArea
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public static MvcHtmlString SiDateboxArea(this HtmlHelper htmlHelper, string fieldName)
        {
            return SiDateboxArea(htmlHelper, fieldName, null);
        }

        /// <summary>
        /// SiDateboxArea
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="fieldName"></param>
        /// <param name="operators"></param>
        /// <returns></returns>
        public static MvcHtmlString SiDateboxArea(this HtmlHelper htmlHelper, string fieldName, object htmlAttributes)
        {
            StringBuilder innerBuilder = new StringBuilder();
            innerBuilder.AppendFormat(@"            
             <label>日期</label>
                <div class='field-inner'>{1}</div>
               <span>--</span><div class='field-inner'>{2}</div>
               <input type='radio' class='today' name='{0}' value=''  id='today' /><label for='today'>今天</label>
               <input type='radio' class='yesterday'  name='{0}' value='' id='yesterday' /><label for='yesterday'>昨天</label>
               <input type='radio' class='thisweek' name='{0}' value='' id='thisweek' /><label for='thisweek'>本周</label>
               <input type='radio' class='lastweek'  name='{0}' value=''  id='lastweek' /><label for='lastweek'>上周</label>
               <input type='radio' class='thismonth'  name='{0}' value='' id='thismonth' /><label for='thismonth'>本月</label>
               <input type='radio' class='lastmonth'  name='{0}' value='' id='lastmonth' /><label for='lastmonth'>上月</label>
               <input type='radio' class='thisseason'  name='{0}' value='' id='thisseason' /><label for='thisseason'>本季</label>
               <input type='radio' class='lastseason'  name='{0}' value='' id='lastseason' /><label for='lastseason'>上季</label>
               <input type='radio' class='thisyear'  name='{0}' value='' id='thisyear' /><label for='thisyear'>今年</label>
              ", fieldName,
              htmlHelper.TextBox(string.Format("{0}Begin", fieldName)),
              htmlHelper.TextBox(string.Format("{0}End", fieldName))
              );

            TagBuilder container = new TagBuilder("div");
            if (htmlAttributes != null)
                container.MergeAttributes(new RouteValueDictionary(htmlAttributes));

            container.AddCssClass("field datebox-area datebox");
            container.InnerHtml = innerBuilder.ToString();

            return container.ToMvcHtmlString(TagRenderMode.Normal);
        }
        #endregion

        #region SiLink
        /// <summary>
        ///SiLink
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        public static MvcHtmlString SiLink(this HtmlHelper htmlHelper, string text, string link, IDictionary<string, object> htmlAttributes)
        {
            TagBuilder tag = new TagBuilder("a");
            tag.MergeAttributes(htmlAttributes);
            tag.SetInnerText(text);

            if (!string.IsNullOrWhiteSpace(link))
                tag.Attributes.Add("href", link);

            return tag.ToMvcHtmlString(TagRenderMode.Normal);
        }
        #endregion

        #region SiUpload
        /// <summary>
        /// SiUpload
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static MvcHtmlString SiUpload(this HtmlHelper htmlHelper, string name)
        {
            if(string.IsNullOrWhiteSpace(name))
                return MvcHtmlString.Empty;

            string picFileName = htmlHelper.ViewContext.ViewData.Eval(name) == null
                ? "/Images/form/no_image.jpg"
                : string.Format("/Uploads/{0}", htmlHelper.ViewContext.ViewData.Eval(name).ToString());

            string temp = string.Format(@"
                <div class=""upload-box"">
                    <div class=""upload-img"">
                        <img src=""{1}"" onerror=""javascript:this.src='/Images/form/no_image.jpg' ""/>
                    </div>
                    <div class=""field upload"">
                        <label for=""{0}"">图片</label>
                        <div class=""field-inner"">
                            <input type=""file"" name=""{0}"" id=""{0}""> 
                            <input type=""text"" name=""{0}"" class=""upload-text"" >
                            <a class=""si-btn search""></a>                                                                                 
                        </div>
                    </div>
                </div>", name, picFileName);

            return MvcHtmlString.Create(temp);
        }
        #endregion

        #region SiHiddenFor
        /// <summary>
        /// SiHiddenFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <returns></returns>
        public static MvcHtmlString SiHiddenFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression)
        {
            #region
            //ModelState modelState;
            //string fullName = "Id";
            //htmlHelper.ViewData.ModelState.TryGetValue(fullName, out modelState);
            #endregion

            return htmlHelper.HiddenFor(expression);
        }
        #endregion

        #region SiTextBox
        /// <summary>
        /// SiTextBox
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="fieldName"></param>
        /// <param name="labelText"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTextBox(this HtmlHelper htmlHelper, string fieldName, string labelText)
        {
            return SiTextBox(htmlHelper, fieldName, labelText, null);
        }

        /// <summary>
        /// SiTextBox
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="fieldName"></param>
        /// <param name="labelText"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTextBox(this HtmlHelper htmlHelper, string fieldName, string labelText, object htmlAttributes)
        {
            return BuildHtmlField(fieldName, labelText, new List<MvcHtmlString> { htmlHelper.TextBox(fieldName) }, htmlAttributes);
        }
        #endregion

        #region SiTextBoxRange
        /// <summary>
        /// SiTextBoxRange
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="fieldName"></param>
        /// <param name="labelText"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTextBoxRange(this HtmlHelper htmlHelper, string fieldName, string labelText)
        {
            return SiTextBoxRange(htmlHelper, fieldName, labelText, null);
        }

        /// <summary>
        /// SiTextBoxRange
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="fieldName"></param>
        /// <param name="labelText"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTextBoxRange(this HtmlHelper htmlHelper, string fieldName, string labelText, object htmlAttributes)
        {
            string innerHtml = string.Format(@"
                <label for='Amt'>{0}</label>
                <div class='field-inner'>{1}
                </div>
                <span>--</span>
                <div class='field-inner'>{2}
                </div>
                ", labelText, htmlHelper.TextBox(string.Format("{0}Begin", fieldName)), htmlHelper.TextBox(string.Format("{0}End", fieldName)));

            TagBuilder container = new TagBuilder("div");
            if (htmlAttributes != null)
                container.MergeAttributes(new RouteValueDictionary(htmlAttributes));
            container.AddCssClass("field defined-area");
            container.InnerHtml = innerHtml;

            return container.ToMvcHtmlString(TagRenderMode.Normal);
        }
        #endregion

        #region SiButton
        /// <summary>
        /// SiButton
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="buttons"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        public static MvcHtmlString SiButton(this HtmlHelper htmlHelper, string buttons, object htmlAttributes)
        {
            if (string.IsNullOrEmpty(buttons))
                throw new ArgumentNullException("buttons不能为空!");

            string[] str = buttons.Split(new char[] { ',' });
            StringBuilder sb = new StringBuilder();
            foreach (var item in str)
            {
                sb.AppendFormat("<button type='button' class='si-btn {0}'>{1}</button>", item, dict[item]);
            }

            string innerhtml = string.Format(@"<label>&nbsp;</label>
                                            <div>
                                               {0}
                                            </div>", sb.ToString());

            TagBuilder container = new TagBuilder("div");
            if (htmlAttributes != null)
                container.MergeAttributes(new RouteValueDictionary(htmlAttributes));

            container.AddCssClass("field");
            container.InnerHtml = innerhtml;

            return container.ToMvcHtmlString(TagRenderMode.Normal);
        }
        #endregion

        #region SiRadioButton
        /// <summary>
        /// SiRadioButton
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="fieldName"></param>
        /// <param name="labelText"></param>
        /// <param name="list"></param>
        /// <returns></returns>
        public static MvcHtmlString SiRadioButton(this HtmlHelper htmlHelper, string fieldName, string labelText, IDictionary<string, object> values)
        {
            return SiRadioButton(htmlHelper, fieldName, labelText, values, null);
        }

        /// <summary>
        /// SiRadioButton
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="fieldName"></param>
        /// <param name="labelText"></param>
        /// <param name="values"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        public static MvcHtmlString SiRadioButton(this HtmlHelper htmlHelper, string fieldName, string labelText, IDictionary<string, object> values, object htmlAttributes)
        {
            StringBuilder inner = new StringBuilder();
            for (int i = 0; i < values.Count; i++)
            {
                inner.AppendFormat("<input type='radio' name='{0}' value='{1}' id='{2}' /><label for='{2}'>{3}</label>",
                    fieldName,
                    values.ElementAt(i).Value,
                    string.Format("{0}{1}", fieldName, i),
                    values.ElementAt(i).Key
                    );
            }


            

            StringBuilder innerBuilder = new StringBuilder();
            innerBuilder.AppendFormat(@"<label>{0}</label>
                                        <div class = 'field-inner'>
                                            {1}
                                        </div>
                                        ", labelText, inner.ToString());


            TagBuilder container = new TagBuilder("div");
            if (htmlAttributes != null)
                container.MergeAttributes(new RouteValueDictionary(htmlAttributes));

            container.AddCssClass("field radio-button");
            container.InnerHtml = innerBuilder.ToString();

            return container.ToMvcHtmlString(TagRenderMode.Normal);

        }
        #endregion

        #region SiTextBoxFor
        /// <summary>
        /// SiTextBoxFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTextBoxFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression)
        {
            return SiTextBoxFor(htmlHelper, expression, null);
        }

        /// <summary>
        /// SiTextBoxFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTextBoxFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string name)
        {
            return SiTextBoxFor(htmlHelper, expression, name, htmlAttributes: null);
        }

        /// <summary>
        /// SiTextBoxFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTextBoxFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, object htmlAttributes)
        {
            return SiField(htmlHelper, expression, null, new List<MvcHtmlString>() { htmlHelper.TextBoxFor(expression, htmlAttributes) });
        }

        /// <summary>
        /// SiTextBoxFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <param name="textboxHtmlAttributes"></param>
        /// <param name="outerHtmlAttributes"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTextBoxFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, object textboxHtmlAttributes, object outerHtmlAttributes)
        {
            return SiField(htmlHelper, expression, null, new List<MvcHtmlString>() { htmlHelper.TextBoxFor(expression, textboxHtmlAttributes) }, outerHtmlAttributes);
        }

        /// <summary>
        /// SiTextBoxFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTextBoxFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string name, object htmlAttributes)
        {
            return SiField(htmlHelper, expression, name, new List<MvcHtmlString>() { htmlHelper.TextBoxFor(expression, htmlAttributes) });
        }
        #endregion

        #region SiIdNameTextBoxFor
        /// <summary>
        /// SiIdNameTextBoxFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <returns></returns>
        public static MvcHtmlString SiIdNameTextBoxFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression)
        {
            return SiIdNameTextBoxFor(htmlHelper, expression, htmlAttributes: null);
        }
        #endregion

        #region SiIdNameTextBoxFor
        /// <summary>
        /// SiIdNameTextBoxFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        public static MvcHtmlString SiIdNameTextBoxFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, object htmlAttributes)
        {
            ModelMetadata metadata = ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData);
            string inferredName = ExpressionHelper.GetExpressionText(expression);
            var idExpr = LambdaHelper.BuildPropertySpecifier<TModel, Nullable<int>>(string.Format("{0}Id", inferredName));
            var nameExpr = LambdaHelper.BuildPropertySpecifier<TModel, string>(string.Format("{0}.Name", inferredName));
            //string resolvedLabelText = metadata.DisplayName ?? metadata.PropertyName ?? inferredName;

            return SiField(htmlHelper, expression, null, new List<MvcHtmlString>() { htmlHelper.HiddenFor(idExpr), htmlHelper.TextBoxFor(nameExpr, htmlAttributes) });
        }
        #endregion

        #region SiTextAreaFor
        /// <summary>
        /// SiTextAreaFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <returns></returns>
        public static MvcHtmlString SiTextAreaFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression)
        {
            return SiField(htmlHelper, expression, null, new List<MvcHtmlString>() { htmlHelper.TextAreaFor(expression) }, new { @class = "merged" });
        }
        #endregion

        #region SiDropDownListFor
        /// <summary>
        /// SiDropDownListFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <returns></returns>
        public static MvcHtmlString SiDropDownListFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression)
        {
            Type type = typeof(TModel);
            string inferredName = ExpressionHelper.GetExpressionText(expression);
            PropertyInfo pi = type.GetProperty(inferredName);

            IEnumerable<SelectListItem> selectList = new List<SelectListItem>();
            object v = null;
            
            if (typeof(TProperty).GetProperty("Id") != null)
            {
                IEnumerable<TProperty> list = new List<TProperty>();
                if (pi.IsDefined(typeof(RelationAttribute), false))
                {
                    Attribute attr = Attribute.GetCustomAttribute(pi, typeof(RelationAttribute), false);
                    if (attr != null)
                    {
                        string condition = ((RelationAttribute)attr).Condition;
                        string[] c = condition.Split(new char[] { '=' });
                        var expr = LambdaHelper.BuildLambda<TProperty, bool>(c[0], QueryMethods.Equals, c[1]);

                        object o = Activator.CreateInstance(typeof(TProperty));
                        MethodInfo methodInfo = typeof(TProperty).GetMethod("GetList", new Type[] { typeof(Expression<Func<TProperty, bool>>) });
                        list = methodInfo.Invoke(o, new object[] { expr }) as IEnumerable<TProperty>;
                    }
                }
                v = htmlHelper.ViewContext.ViewData.Eval(string.Format("{0}Id", inferredName)) ?? "";

                var code = LambdaHelper.BuildPropertySpecifier<TProperty, int>(string.Format("{0}.Id", inferredName));
                var name = LambdaHelper.BuildPropertySpecifier<TProperty, string>(string.Format("{0}.Name", inferredName));

                Mapper.CreateMap<TProperty, SelectListItem>()
                    .ForMember(dest => dest.Text, opt => opt.MapFrom(name))
                    .ForMember(dest => dest.Value, opt => opt.MapFrom(code));

                selectList = Mapper.Map<IEnumerable<TProperty>, IEnumerable<SelectListItem>>(list);
            }
            else
            {
                v = htmlHelper.ViewContext.ViewData.Eval(inferredName) ?? "";
                if (pi.IsDefined(typeof(ValuesAttribute), false))
                {
                    Attribute attr = Attribute.GetCustomAttribute(pi, typeof(ValuesAttribute), false);
                    if (attr != null)
                    {
                        string value = ((ValuesAttribute)attr).Value;
                        selectList = JsonConvert.DeserializeObject<IEnumerable<SelectListItem>>(value);
                    }
                }
            }
            var selected = selectList.Where(p => p.Value == v.ToString()).SingleOrDefault();
            if (selected != null)
                selected.Selected = true;

            return SiDropDownListFor(htmlHelper, expression, selectList);

        }

        /// <summary>
        /// SiDropDownListFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <param name="list"></param>
        /// <returns></returns>
        public static MvcHtmlString SiDropDownListFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, IEnumerable<TProperty> list)
        {
            string inferredName = ExpressionHelper.GetExpressionText(expression);
            var code = LambdaHelper.BuildPropertySpecifier<TProperty, int>(string.Format("{0}.Id", inferredName));
            var name = LambdaHelper.BuildPropertySpecifier<TProperty, string>(string.Format("{0}.Name", inferredName));

            var v = UtilHelper.GetFieldValue(htmlHelper.ViewData.Model, string.Format("{0}Id", inferredName));

            Mapper.CreateMap<TProperty, SelectListItem>()
                .ForMember(dest => dest.Text, opt => opt.MapFrom(name))
                .ForMember(dest => dest.Value, opt => opt.MapFrom(code));

            var selectList = Mapper.Map<IEnumerable<TProperty>, IEnumerable<SelectListItem>>(list);
            var selected = selectList.Where(p => p.Value == v.ToString()).SingleOrDefault();
            if (selected != null)
                selected.Selected = true;

            return SiDropDownListFor(htmlHelper, expression, selectList);
        }

        /// <summary>
        /// SiDropDownListFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <param name="list"></param>
        /// <returns></returns>
        public static MvcHtmlString SiDropDownListFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression,IEnumerable<SelectListItem> list)
        {
            ModelMetadata metadata = ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData);
            string inferredName = ExpressionHelper.GetExpressionText(expression);
            string resolvedLabelText = metadata.DisplayName ?? metadata.PropertyName ?? inferredName;

            StringBuilder sb = new StringBuilder();
            SelectListItem selectedItem = new SelectListItem();
            foreach (var item in list)
            {
                if (item.Selected)
                    selectedItem = item;

                sb.AppendFormat(@"<div class=""combobox-item"" value=""{0}"">{1}</div>",item.Value,item.Text);
            }

            if (typeof(TProperty).GetProperty("Id") != null)
                inferredName = string.Format("{0}Id", inferredName);

            string comboStr = string.Format(@"
            <div class=""field combobox"">
	            <label for=""{0}"">{1}</label>
	            <div class=""field-inner"">
		            <input type=""text"" class=""combo-text"" value=""{2}"" />
		            <span class=""combo-arrow""></span>
		            <input type=""hidden"" class=""combo-value"" id=""{0}"" name=""{0}"" value=""{3}""/>
		            <div class=""panel"">
			            <div class=""combo-panel panel-body"">
				            {4}
			            </div>
		            </div> 
	            </div>
            </div>", inferredName, resolvedLabelText, selectedItem.Text, selectedItem.Value, sb.ToString());

            return MvcHtmlString.Create(comboStr);
        }
        #endregion

        #region SiUControl
        /// <summary>
        /// SiUControl
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="fieldName"></param>
        /// <param name="labelText"></param>
        /// <param name="idField"></param>
        /// <param name="nameField"></param>
        /// <param name="controllerName"></param>
        /// <returns></returns>
        public static MvcHtmlString SiUControl(this HtmlHelper htmlHelper, string fieldName, string labelText)
        {
            return SiUControl(htmlHelper, fieldName, labelText, new { @operator="Contains"});
        }

        /// <summary>
        /// SiUControl
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="fieldName"></param>
        /// <param name="labelText"></param>
        /// <param name="controllerName"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        public static MvcHtmlString SiUControl(this HtmlHelper htmlHelper, string fieldName, string labelText, object htmlAttributes)
        {
            return BuildHtmlField(fieldName, labelText, new List<MvcHtmlString> {
                            htmlHelper.Hidden(string.Format("{0}Id",fieldName)),                           
                            htmlHelper.TextBox(string.Format("{0}.Name",fieldName),"",new Dictionary<string,object>(){{"class","search-text"}}),                            
                            htmlHelper.SiLink("","", new Dictionary<string,object>(){{"class","si-btn search"}})},
                            htmlAttributes);
        }
        #endregion

        #region SiUControlFor
        /// <summary>
        /// SiUControlFor
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <returns></returns>
        public static MvcHtmlString SiUControlFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression)
        {
            string inferredName = ExpressionHelper.GetExpressionText(expression);
            var idExpr = LambdaHelper.BuildPropertySpecifier<TModel, Nullable<int>>(string.Format("{0}Id", inferredName));
            var nameExpr = LambdaHelper.BuildPropertySpecifier<TModel, string>(string.Format("{0}.Name", inferredName));

            string controllerName = inferredName.EndsWith("y")
                ? string.Format("{0}ies", inferredName.Substring(0, inferredName.Length - 1))
                : string.Format("{0}s", inferredName);

            return SiField(htmlHelper, expression, null, new List<MvcHtmlString> {
                            htmlHelper.HiddenFor(idExpr),                           
                            htmlHelper.TextBoxFor(nameExpr,new Dictionary<string,object>(){{"class","search-text"}}) ,                            
                            htmlHelper.SiLink("","", new Dictionary<string,object>(){{"class","si-btn search"}})},
                            new { controller = controllerName }
                    );
        }
        #endregion

        #region SiFieldFor
        /// <summary>
        /// SiField -- zhangh 2013/06/13
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <param name="labelText"></param>
        /// <param name="arrHtmlString"></param>
        /// <returns></returns>
        private static MvcHtmlString SiField<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string name, List<MvcHtmlString> arrHtmlString)
        {
            return SiField(htmlHelper, expression, name, arrHtmlString, null);
        }

        /// <summary>
        /// SiField -- zhangh 2013/06/13
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <param name="labelText"></param>
        /// <param name="arrHtmlString"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        private static MvcHtmlString SiField<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string name, IEnumerable<MvcHtmlString> arrHtmlString, object htmlAttributes)
        {
            ModelMetadata metadata = ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData);
            string inferredName = ExpressionHelper.GetExpressionText(expression);
            string resolvedLabelText = name ?? metadata.DisplayName ?? metadata.PropertyName ?? inferredName;

            return BuildHtmlField(inferredName, resolvedLabelText, arrHtmlString, htmlAttributes);
        }

        /// <summary>
        /// BuildHtmlField -- zhangh 2013/06/14
        /// </summary>
        /// <param name="fieldName"></param>
        /// <param name="labelText"></param>
        /// <param name="arrHtmlString"></param>
        /// <param name="htmlAttributes"></param>
        /// <returns></returns>
        private static MvcHtmlString BuildHtmlField(string fieldName, string labelText, IEnumerable<MvcHtmlString> arrHtmlString, object htmlAttributes)
        {
            TagBuilder label = new TagBuilder("label");
            label.Attributes.Add("for", TagBuilder.CreateSanitizedId(fieldName));
            label.InnerHtml = labelText;

            TagBuilder inner = new TagBuilder("div");
            inner.AddCssClass("field-inner");
            StringBuilder innerBuilder = new StringBuilder();
            if (arrHtmlString != null)
                foreach (var item in arrHtmlString)
                    innerBuilder.Append(item.ToHtmlString());

            inner.InnerHtml = innerBuilder.ToString();

            TagBuilder container = new TagBuilder("div");
            if (htmlAttributes != null)
            {
                container.MergeAttributes(new RouteValueDictionary(htmlAttributes));
            }

            container.AddCssClass("field");
            container.InnerHtml = string.Format("{0}{1}", label.ToString(), inner.ToString());

            return container.ToMvcHtmlString(TagRenderMode.Normal);
        }
        #endregion

        #region ToMvcHtmlString
        /// <summary>
        /// ToMvcHtmlString
        /// </summary>
        /// <param name="tagBuilder"></param>
        /// <param name="renderMode"></param>
        /// <returns></returns>
        internal static MvcHtmlString ToMvcHtmlString(this TagBuilder tagBuilder, TagRenderMode renderMode)
        {
            return new MvcHtmlString(tagBuilder.ToString(renderMode));
        }
        #endregion
    }
}
