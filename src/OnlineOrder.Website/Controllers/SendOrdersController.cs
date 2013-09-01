using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OnlineOrder.Website.Models;
using OnlineOrder.Mvc;

namespace OnlineOrder.Website.Controllers
{
    [Title("发货单")]
    public class SendOrdersController : BaseSheetController<SendOrder>
    {
        public SendOrdersController(SendOrder model)
            : base(model)          
        {            
        }     
    }
}