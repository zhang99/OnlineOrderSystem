using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OnlineOrder.Website.Models;
using OnlineOrder.Mvc;

namespace OnlineOrder.Website.Controllers
{
    [Title("经销商")]
    public class CustomersController : BaseDataController<Customer>
    {
        public CustomersController(Customer model)
            : base(model)        
        {           
        }
    }
}
