using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;

namespace OnlineOrder.Website.Models
{
    public class ViewModelToDomainMapping : Profile
    {
        public override string ProfileName
        {
            get { return "ViewModelToDomainMapping"; }
        }

        protected override void Configure()
        {

        }
    }
}