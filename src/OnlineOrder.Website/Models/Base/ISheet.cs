using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineOrder.Website.Models
{
    public interface ISheet : IUnitOfWork, IEntity
    {
        void Approve(int userId);
    }
}