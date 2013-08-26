using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OnlineOrder.Website.Models
{
	public interface IUnitOfWork {
        void Commit();
	}
}
