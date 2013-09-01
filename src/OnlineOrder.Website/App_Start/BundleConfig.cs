using System.Web;
using System.Web.Optimization;

namespace OnlineOrder.Website
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/xrd/jquery-{version}.js"));

            // TODO: delete if no need
            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/xrd/jquery-ui-{version}.js"));

            // TODO: delete if no need
            bundles.Add(new ScriptBundle("~/bundles/jqueryeasyui").Include(
                        "~/Scripts/xrd/jquery.easyui.js"));

            // TODO: delete if no need
            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/xrd/jquery.unobtrusive*",
                        "~/Scripts/xrd/jquery.validate*"));

            // TODO: delete if no need
            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/xrd/modernizr-*"));
            
            // ---------------------------------------
            // js for siss  james
            bundles.Add(new ScriptBundle("~/bundles/layout").Include(
                        "~/Scripts/core.js",
                        "~/Scripts/application.js",
                        "~/Scripts/ui/grid.js",                    
                        "~/Scripts/ui/waitting.js",
                        "~/Scripts/ui/message.js",
                        "~/Scripts/ui/window.js",
                        "~/Scripts/ui/form/form.js",
                        "~/Scripts/ui/form/sheetForm.js",
                        "~/Scripts/ui/form/datebox.js",
                        "~/Scripts/ui/form/autocomplete.js",
                        "~/Scripts/ui/form/easydrag.js",
                        "~/Scripts/ui/form/ajaxValidate.js",
                        "~/Scripts/ui/form/validate.js",
                        "~/Scripts/ui/form/ajaxFileUpload.js",
                        "~/Scripts/ui/tree.js",
                        "~/Scripts/ui/editGrid.js",
                        "~/Scripts/ui/filters.js"
                        ));
            // js for xrd 第三方控件
            bundles.Add(new ScriptBundle("~/bundles/xrd").Include(
                        "~/Scripts/xrd/jquery.uploadify.js"
                        ));

            // 框架css james
            bundles.Add(new StyleBundle("~/Content/layout").Include(
                "~/Content/reset.css",
                "~/Content/common.css",
                "~/Content/layout.css"
                ));
            // 自有控件css
            bundles.Add(new StyleBundle("~/Content/ui").Include(
                "~/Content/ui/toolbar.css",
                "~/Content/ui/page.css",
                "~/Content/ui/grid.css",
                "~/Content/ui/form.css",
                "~/Content/ui/message.css",
                "~/Content/ui/waitting.css",
                "~/Content/ui/window.css",
                "~/Content/ui/tree.css",
                "~/Content/ui/calendar.css"
                ));
            // css for xrd 第三方控件
            bundles.Add(new StyleBundle("~/Content/xrd").Include(
                        "~/Content/xrd/uploadify.css"
                        ));

            // ---------------------------------------

            // TODO: delete if no need
            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));

        }
    }
}