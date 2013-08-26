using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using OnlineOrder.Mvc.Pagination;
using OnlineOrder.Mvc;
using System.Collections;
using OnlineOrder.Mvc.Grid;
using OnlineOrder.Website.Models;


namespace OnlineOrder.Website.Controllers
{
    /// <summary>
    /// Æ·ÅÆController
    /// </summary>
    [Title("Æ·ÅÆ")]
    public class BrandsController : BaseDataController<Brand>
    {
        public BrandsController(Brand model)
            : base(model)        
        {           
        }
    }
}
