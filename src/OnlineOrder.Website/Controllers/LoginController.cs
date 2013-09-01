using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OnlineOrder.Website.Models;
using System.Web.Security;

namespace OnlineOrder.Website.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            FormsAuthentication.SignOut();
            return View();
        }

        public ActionResult Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (Request.HttpMethod == "POST")
                {                 
                    FormsAuthentication.SetAuthCookie(model.UserName, false);
                    return RedirectToAction("Index", "Home");
                }
            }
            ModelState.AddModelError("error","请输入正确的用户或密码!");

            return View("Index");
        }
    }
}
