using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineOrder.Website.Models
{
    /// <summary>
    /// 通用选择，自动完成功能
    /// </summary>
    public class QueryViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
    }
}