using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;

namespace OnlineOrder.Website.Models
{
    public class DomainToViewModelMapping : Profile
    {
        public override string ProfileName
        {
            get { return "DomainToViewModelMappings"; }
        }

        protected override void Configure()
        {
            Mapper.CreateMap<Brand, QueryViewModel>();       
            Mapper.CreateMap<Category, QueryViewModel>();        
            Mapper.CreateMap<User, QueryViewModel>();

        }
    }
}