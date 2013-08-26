using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using OnlineOrder.Mvc;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Website.Models
{
    public interface IModel<T> : IUnitOfWork where T : IEntity
    {      
        T Add(T entity);
        T Update(T entity);        
        void Delete(int id);
        void Delete(int[] ids);        
        T GetById(object Id);
        T GetById(long Id);
        T Get(Expression<Func<T, bool>> where);
        IEnumerable<T> GetList();
        IEnumerable<T> GetList(Expression<Func<T, bool>> where);
        IPagination<T> GetPagedList(PagingModel pagingModel,Expression<Func<T, bool>> where);
    }
}
