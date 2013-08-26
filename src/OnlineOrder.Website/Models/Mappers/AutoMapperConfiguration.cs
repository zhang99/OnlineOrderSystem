using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AutoMapper;

namespace OnlineOrder.Website.Models
{
    public class AutoMapperConfiguration
    {
        public static void Configure()
        {
            Mapper.Initialize(x =>
            {
                x.AddProfile<DomainToViewModelMapping>();
                x.AddProfile<ViewModelToDomainMapping>();
            });
        }
    }
}
