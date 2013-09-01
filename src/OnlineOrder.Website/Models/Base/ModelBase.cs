using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Data.Entity;
using OnlineOrder.Mvc.Pagination;
using OnlineOrder.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using System.Data.Entity.Infrastructure;
using System.Data;

namespace OnlineOrder.Website.Models
{
    /// <summary>
    /// Model抽象基类 -- zhangh 2013/06/26 
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class ModelBase<T> : IEntity where T : class
    {
        #region 成员变量
        private OnlineOrderDb db;
        private readonly IDbSet<T> dbset;
        #endregion

        #region 构造函数
        public ModelBase() : this(new DatabaseFactory()) { }

        public ModelBase(IDatabaseFactory databaseFactory)
        {
            DatabaseFactory = databaseFactory;
            dbset = DB.Set<T>();
        }
        #endregion

        #region 属性
        /// <summary>
        /// Id唯一标识
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Sortable(false), Align(Alignment.Center), Width(30), Queryable(false)]
        public virtual int Id { get; set; }
        
        /// <summary>
        /// DatabaseFactory
        /// </summary>
        protected IDatabaseFactory DatabaseFactory
        {
            get;
            private set;
        }
       
        /// <summary>
        /// DB
        /// </summary>
        protected OnlineOrderDb DB
        {
            get { return db ?? (db = DatabaseFactory.GetDb()); }
        }
        #endregion

        #region 添加
        /// <summary>
        /// 添加、修改前业务处理
        /// </summary>
        /// <param name="entity"></param>
        public virtual void BeforeAddOrUpdate(T entity)
        {
        }

        /// <summary>
        /// 添加
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual T Add(T entity)
        {
            if (entity == null)
                throw new ArgumentException("entity不能为空!");

            BeforeAddOrUpdate(entity);
            entity = dbset.Add(entity);            
            return entity;
        }
        #endregion

        #region 修改
        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual T Update(T entity)
        {
            if (entity == null)
                throw new ArgumentException("entity不能为空!");

            BeforeAddOrUpdate(entity);

            var entry = db.Entry<T>(entity);            
            if (entry.State == EntityState.Detached)
            {
                var set = db.Set<T>();
                T attachedEntity = set.Find(entity.GetType().GetProperty("Id").GetValue(entity, null));
                if (attachedEntity != null)
                {
                    var attachedEntry = db.Entry(attachedEntity);
                    attachedEntry.CurrentValues.SetValues(entity);
                }
                else
                {
                    entry.State = EntityState.Modified;
                }
            }
            else
            {
                dbset.Attach(entity);
                db.Entry(entity).State = EntityState.Modified;                
            }

            return entity;
        }
        #endregion

        #region 删除
        /// <summary>
        /// 删除前业务处理  TODO:抽象方法？后面考虑
        /// </summary>
        /// <param name="entity"></param>
        public virtual void BeforeDelete(T entity) {  }
        
        /// <summary>
        /// AfterDelete
        /// </summary>
        /// <param name="entity"></param>
        public virtual void AfterDelete(T entity) {  }     

        /// <summary>
        /// 删除 TODO:级联删除
        /// </summary>
        /// <param name="entity"></param>
        private void Delete(T entity)
        {
            if (entity == null)
                throw new ArgumentException("entity不能为空!");

            BeforeDelete(entity);
            dbset.Remove(entity);
            AfterDelete(entity);
        }        

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="where"></param>
        protected virtual void Delete(Expression<Func<T, bool>> where)
        {
            IEnumerable<T> objects = dbset.Where<T>(where).AsEnumerable();
            foreach (T obj in objects)
                Delete(obj);
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void Delete(int id)
        {
            T entity = GetById(id);
            Delete(entity);
        }

        /// <summary>
        /// 删除多条
        /// </summary>
        /// <param name="ids"></param>
        public void Delete(int[] ids)
        {
            var predicate = PredicateBuilder.False<T>();
            Expression<Func<T, bool>> expr = null;
            foreach (int id in ids)
            {
                expr =  LambdaHelper.BuildLambda<T, bool>("Id", QueryMethods.Equals, id);
                if (expr != null)
                    predicate = predicate.Or(expr);
                else
                    throw new Exception(string.Format("构造Delete表达式出错:id={0}", id));
            }

            Delete(predicate);
        }
        #endregion

        #region 获取实体
        /// <summary>
        /// 根据Id获取实体
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public virtual T GetById(object Id)
        {
            if (Id == null) return null;

            int t;
            int id = int.TryParse(Id.ToString(), out t) ? t : -1;
            if (id == -1) return null;

            return GetById(id);
        }

        /// <summary>
        /// 根据Id获取实体
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public virtual T GetById(long Id)
        {
            return dbset.Find(Id);
        }       
        
        /// <summary>
        /// 根据条件获取实体
        /// </summary>
        /// <param name="where"></param>
        /// <returns></returns>
        public virtual T Get(Expression<Func<T, bool>> where)
        {
            var query = dbset.Where<T>(where);
            if (query.Count() > 0)
                return query.First();
            return null;
        }
        #endregion

        #region 获取数据列表
        /// <summary>
        /// 获取全部数据列表
        /// </summary>
        /// <returns></returns>
        public virtual IEnumerable<T> GetList()
        {
            return dbset.ToList();
        }

        /// <summary>
        /// 根据条件获取数据列表
        /// </summary>
        /// <param name="where"></param>
        /// <returns></returns>
        public virtual IEnumerable<T> GetList(Expression<Func<T, bool>> where)
        {
            if (where == null)
                return GetList();

            return dbset.Where(where).ToList();
        }

        /// <summary>
        /// 根据条件获取分页数据列表 
        /// </summary>
        /// <param name="pagingModel"></param>
        /// <param name="where"></param>
        /// <returns></returns>
        public virtual IPagination<T> GetPagedList(PagingModel pagingModel, Expression<Func<T, bool>> where)
        {
            if (where != null)
                return dbset.Where(where).OrderBy(pagingModel.SortOptions.Column, pagingModel.SortOptions.Direction)
                    .AsPagination<T>(pagingModel.PageIndex, pagingModel.PageSize, pagingModel.SortOptions);
            else
                return dbset.OrderBy(pagingModel.SortOptions.Column, pagingModel.SortOptions.Direction)
                        .AsPagination<T>(pagingModel.PageIndex, pagingModel.PageSize, pagingModel.SortOptions);
        }

        /// <summary>
        /// SQL查询
        /// </summary>
        /// <param name="elementType"></param>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        //public DbRawSqlQuery SqlQuery(Type elementType, string sql, params object[] parameters)
        //{
        //    return db.Database.SqlQuery(elementType, sql, parameters);
        //}
        #endregion

        #region 提交
        /// <summary>
        /// 提交
        /// </summary>
        public void Commit()
        {
            DB.Commit();
        }
        #endregion      

        #region 判断是否空对象（除Id外）
        /// <summary>
        /// IsNullObject TODO:考虑更好的实现方式
        /// </summary>
        /// <returns></returns>
        public bool IsNullObject()
        {
            Type type = this.GetType();
            PropertyInfo[] properties = type.GetProperties();
            bool flag = true;
            for (int j = 0; j < properties.Length; j++)
            {
                if (properties[j].Name == "Id") continue;
                if (properties[j].GetValue(this, null) != null)
                {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
        #endregion
    }
}
