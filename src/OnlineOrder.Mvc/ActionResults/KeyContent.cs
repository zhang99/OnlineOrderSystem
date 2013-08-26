using System;
using System.ComponentModel;

namespace OnlineOrder.Mvc
{
	public class KeyContent
	{
		private bool encode = true;
		private string k;
		private string c;
		[EditorBrowsable(EditorBrowsableState.Never)]
		public string K
		{
			get
			{
				if (!this.encode)
				{
					return this.k;
				}
				
				return this.k.Encode();
			}
			set
			{
				this.k = value;
			}
		}
		[EditorBrowsable(EditorBrowsableState.Never)]
		public string C
		{
			get
			{
				if (!this.encode)
				{
					return this.c;
				}				
				return this.c.Encode();
			}
			set
			{
				this.c = value;
			}
		}
		public object Key
		{
			set
			{
				this.K = (value ?? "").ToString();
			}
		}
		public string Content
		{
			set
			{
				this.C = value;
			}
		}
		public bool Encode
		{
			set
			{
				this.encode = value;
			}
		}
		public KeyContent()
		{
		}
		public KeyContent(object key, string content, bool encode)
		{
			this.encode = encode;
			key = (key ?? "");
			this.Key = key.ToString();
			this.Content = content;
		}
		public KeyContent(object key, string content)
		{
			key = (key ?? "");
			this.Key = key.ToString();
			this.Content = content;
		}
	}
}
