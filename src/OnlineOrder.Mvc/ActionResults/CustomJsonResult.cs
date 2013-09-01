using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace OnlineOrder.Mvc
{
    /// <summary>
    /// CustomJsonResult自定义JsonResult类
    /// add by zhangh 2013/5/30
    /// </summary>
    public class CustomJsonResult : JsonResult
    {
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            HttpResponseBase response = context.HttpContext.Response;

            if (!String.IsNullOrEmpty(ContentType))
                response.ContentType = ContentType;
            else
                response.ContentType = "application/json; charset=UTF-8";

            if (ContentEncoding != null)
                response.ContentEncoding = ContentEncoding;

            if (Data != null)
            {
                response.Write(JsonConvert.SerializeObject(
                    Data,
                    Formatting.None,
                    new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore })
                    );
            }
        }
    }


    /// <summary>
    /// Status枚举类
    /// </summary>
    public enum Status
    {
        error = 0,
        success = 1,
    }

    /// <summary>
    /// MsgType枚举类
    /// </summary>
    public enum MsgType
    {
        normal = 0,
        info = 1,
        error = 2,
        confirm = 3,
        succeed = 4,
        warning = 5,
    }

    /// <summary>
    /// Message消息
    /// </summary>
    public class Message
    {
        public string msg { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public MsgType type { get; set; }
    }

    /// <summary>
    /// CustomActionResult自定义ActionResult类    
    /// </summary>
    public class CustomActionResult
    {
        /// <summary>
        /// 状态
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public Status status { get; set; }
        /// <summary>
        /// 消息内容
        /// </summary>
        public Message message { get; set; }
        /// <summary>
        /// 数据
        /// </summary>
        public object data { get; set; }
    }


    /// <summary>
    /// ErrorActionResult自定义ActionResult类     
    /// </summary>
    public class ErrorActionResult : CustomActionResult
    {
        public ErrorActionResult(String message)
        {
            this.status = Status.error;
            this.message = new Message { msg = message, type = MsgType.error };
        }
        public ErrorActionResult(Exception ex)
            : this(ex.Message)
        {                                         ;
        }
    }

    /// <summary>
    /// SuccessActionResult自定义ActionResult类     
    /// </summary>
    public class SuccessActionResult : CustomActionResult
    {
        public SuccessActionResult(String message, object data)
        {
            this.status = Status.success;
            this.message = new Message { msg = message, type = MsgType.normal };
            this.data = data;
        }
        public SuccessActionResult(String message)
            : this(message, null)
        {
        }
    }

}
