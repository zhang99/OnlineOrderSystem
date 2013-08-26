﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;

namespace OnlineOrder.Mvc
{
    public static class JScripts
    {
        /// <summary>
        /// 引入脚本文件，若该文件不存在则不引入
        /// </summary>
        /// <param name="paths"></param>
        /// <returns></returns>
        public static IHtmlString Include(params string[] paths)
        {
            if (paths == null)
                return null;

            var files = new List<string>();
            for (int i = 0; i < paths.Length; i++)
            {
                string value = paths[i];
                if (!string.IsNullOrEmpty(value))
                {
                    string path = HttpContext.Current.Server.MapPath(value);
                    if (File.Exists(path))
                        files.Add(value);
                }
            }
            if (files.Count == 0)
                return null;

            return Scripts.Render(files.ToArray());
        }
    }
}

