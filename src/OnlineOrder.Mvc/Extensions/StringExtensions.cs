using System;
using System.Web;

namespace OnlineOrder.Mvc
{
	internal static class StringExtensions
	{
		public static string Encode(this string s)
		{
			if (s == null)
			{
				return null;
			}
			return HttpUtility.HtmlEncode(s).Replace("'", "&apos;");
		}
	}
}
