using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OnlineOrder.Mvc;

namespace OnlineOrder.Website.Models
{
    /// <summary>
    /// DatabaseFactory -- zhangh 2013/06/20
    /// </summary>
	public class DatabaseFactory : Disposable, IDatabaseFactory {

        public OnlineOrderDb GetDb()
        {
            var requestStore = HttpRequestSingleton<OnlineOrderDb>.Instance;

            if (!requestStore.IsSet)
            {
                requestStore.Value = new OnlineOrderDb();
            }
            return requestStore.Value;
        }

        protected override void DisposeCore()
        {           
            if (GetDb() != null)
            {
                GetDb().Dispose();
            }
        }
	}
}
