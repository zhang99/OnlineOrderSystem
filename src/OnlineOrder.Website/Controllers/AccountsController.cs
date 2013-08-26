using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OnlineOrder.Website.Models;

namespace OnlineOrder.Website.Controllers
{
    public class UsersController : BaseDataController<User>
    {
        public UsersController(User model)
            : base(model)          
        {           
        }

    }
}
