using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Mvc
{
    /// <summary>
    /// 查询方式
    /// </summary>
    public enum QueryMethods
    {
        Contains = 0,
        StartsWith = 1,
        EndsWith = 2,
        Equals = 3,
        Between = 4,
    }

    /// <summary>
    /// LambdaHelper -- zhangh 2013/06/28
    /// </summary>
    public class LambdaHelper
    {
        /// <summary>
        /// BuildQueryCondition
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TValue"></typeparam>
        /// <param name="pagingModel"></param>
        /// <returns></returns>
        public static Expression<Func<T, bool>> BuildQueryCondition<T>(PagingModel pagingModel)
        {
            var expression = PredicateBuilder.True<T>();
            if (!string.IsNullOrWhiteSpace(pagingModel.Query) && !string.IsNullOrWhiteSpace(pagingModel.QueryFields))
                expression = LambdaHelper.BuildLambdasOr<T>(pagingModel.QueryFields, QueryMethods.Contains, pagingModel.Query);

            if (pagingModel.AdvancedQuery != null && pagingModel.AdvancedQuery.Count() > 0)
            {
                Expression<Func<T, bool>> tmpExpr = null;
                var expr = PredicateBuilder.True<T>();
                foreach (var item in pagingModel.AdvancedQuery)
                {
                    tmpExpr = LambdaHelper.BuildLambda<T, bool>(item.Field, item.Operator, item.Value);
                    if (tmpExpr != null)
                        expr = expr.And(tmpExpr);
                }
                expression = expression.And(expr);
            }
            return expression;
        }

        /// <summary>
        /// BuildLambdas
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TValue"></typeparam>
        /// <param name="property"></param>
        /// <param name="method"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public static Expression<Func<T, bool>> BuildLambdasOr<T>(string property, QueryMethods method, string content)
        {
            if (string.IsNullOrWhiteSpace(property))
                return null;

            string[] props = property.Split(',');
            var predicate = PredicateBuilder.False<T>();
            Expression<Func<T, bool>> expr = null;
            foreach (string prop in props)
            {
                expr = BuildLambda<T, bool>(prop, method, content);
                if (expr != null)
                    predicate = predicate.Or(expr);
            }

            return predicate;
        }

        /// <summary>
        /// BuildLambda
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TValue"></typeparam>
        /// <param name="property"></param>
        /// <param name="method"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public static Expression<Func<T, TValue>> BuildLambda<T, TValue>(string property, QueryMethods method, object content)
        {
            if (string.IsNullOrWhiteSpace(property))
                return null;

            string[] props = property.Split('.');
            Type type = typeof(T);
            ParameterExpression arg = Expression.Parameter(type, "f");
            Expression expr = arg;
            foreach (string prop in props)
            {
                PropertyInfo pi = type.GetProperty(prop);
                if (pi == null)
                    continue;
                expr = Expression.Property(expr, pi);
                type = pi.PropertyType;
            }

            bool nullFlag = false;
            QueryDataProcessing(type, ref method, ref content, ref nullFlag);
            if (nullFlag)
                return null;

            Expression searchExpr = null;
            MethodInfo callMethod = null;
            Expression expression = null;
            switch (method)
            {
                case QueryMethods.Equals:
                    searchExpr = Expression.Constant(content, type);
                    expression = Expression.Equal(expr, searchExpr);
                    break;
                case QueryMethods.StartsWith:
                case QueryMethods.EndsWith:
                case QueryMethods.Contains:
                    searchExpr = Expression.Constant(content, type);
                    callMethod = type.GetMethod(method.ToString(), new[] { type });                    
                    expression = Expression.Call(expr, callMethod, new[] { searchExpr });
                    break;
                case QueryMethods.Between:
                    var values = content as HashSet<object>;
                    var minExpr = Expression.Constant(values.First(), type);
                    var maxExpr = Expression.Constant(values.Last(), type);
                    var leftExpr = Expression.GreaterThanOrEqual(expr, minExpr);
                    var rightExpr = Expression.LessThanOrEqual(expr, maxExpr);
                    expression = Expression.And(leftExpr, rightExpr);
                    break;
                default:
                    callMethod = type.GetMethod(method.ToString(), new[] { type });
                    expression = Expression.Call(expr, callMethod, new[] { searchExpr });
                    break;
            }

            return Expression.Lambda<Func<T, TValue>>(expression, arg);
        }

        /// <summary>
        /// QueryDataProcessing
        /// </summary>
        /// <param name="method"></param>
        /// <param name="content"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private static bool QueryDataProcessing(Type type, ref QueryMethods method, ref object content, ref bool nullFlag)
        {
            HashSet<object> hs = new HashSet<object>();         
            switch (type.Name)
            {
                case "String":
                    break;
                case "Int32":
                case "Int64":
                case "Decimal":
                case "Single":
                case "Double":
                    if (method == QueryMethods.Contains || method == QueryMethods.StartsWith || method == QueryMethods.EndsWith)
                        nullFlag = true;
                    else if (content != null && content.ToString().Trim() != "")
                    {
                        if (method == QueryMethods.Between)
                        {
                            CustomRangeQueryProcessing(type, content, ref hs);
                            content = hs;
                        }
                        else
                        {
                            content = Convert.ChangeType(content, type);
                        }
                    }
                    break;
                case "DateTime":
                    if (method == QueryMethods.Contains || method == QueryMethods.StartsWith || method == QueryMethods.EndsWith)
                    {
                        nullFlag = true;
                        break;
                    }
                    method = QueryMethods.Between;
                    DateTime today;
                    DateTime start;
                    switch (content.ToString())
                    {
                        case "today":
                            hs.Add(System.DateTime.Today);
                            hs.Add(System.DateTime.Today.AddDays(1).AddMilliseconds(-1));
                            break;
                        case "yesterday":
                            hs.Add(System.DateTime.Today.AddDays(-1));
                            hs.Add(System.DateTime.Today.AddMilliseconds(-1));
                            break;
                        case "thisweek":
                            today = System.DateTime.Today;
                            start = today.AddDays(1 - Convert.ToInt32(today.DayOfWeek.ToString("d")));
                            hs.Add(start);
                            hs.Add(start.AddDays(7).AddMilliseconds(-1));
                            break;
                        case "lastweek":
                            today = System.DateTime.Today;
                            start = today.AddDays(Convert.ToInt32(1 - Convert.ToInt32(DateTime.Now.DayOfWeek)) - 7);
                            hs.Add(start);
                            hs.Add(start.AddDays(7).AddMilliseconds(-1));
                            break;
                        case "thismonth":
                            start = DateTime.Parse(DateTime.Today.ToString("yyyy-MM-01"));
                            hs.Add(start);
                            hs.Add(start.AddMonths(1).AddMilliseconds(-1));
                            break;
                        case "lastmonth":
                            start = DateTime.Parse(DateTime.Today.ToString("yyyy-MM-01")).AddMonths(-1);
                            hs.Add(start);
                            hs.Add(start.AddMonths(1).AddMilliseconds(-1));
                            break;
                        case "thisseason":
                            start = DateTime.Today.AddMonths(0 - ((DateTime.Today.Month - 1) % 3)).AddDays(1 - DateTime.Today.Day);
                            hs.Add(start);
                            hs.Add(DateTime.Parse(DateTime.Today.AddMonths(3 - ((DateTime.Today.Month - 1) % 3)).ToString("yyyy-MM-01")).AddMilliseconds(-1));
                            break;
                        case "lastseason":
                            start = DateTime.Today.AddMonths(-3 - ((DateTime.Today.Month - 1) % 3)).AddDays(1 - DateTime.Today.Day);
                            hs.Add(start);
                            hs.Add(DateTime.Today.AddMonths(0 - ((DateTime.Today.Month - 1) % 3)).AddDays(1 - DateTime.Today.Day).AddMilliseconds(-1));
                            break;
                        case "thisyear":
                            start = DateTime.Parse(DateTime.Now.ToString("yyyy-01-01"));
                            hs.Add(start);
                            hs.Add(start.AddYears(1).AddMilliseconds(-1));
                            break;
                        case "lastyear":
                            start = DateTime.Parse(DateTime.Now.ToString("yyyy-01-01"));
                            hs.Add(start.AddYears(-1));
                            hs.Add(start.AddMilliseconds(-1));
                            break;
                        default:
                            CustomRangeQueryProcessing(type, content, ref hs);
                            break;
                    }
                    content = hs;
                    break;
                case "Nullable`1":
                    QueryDataProcessing(type.GetGenericArguments()[0], ref method, ref content, ref nullFlag);
                    break;
                default:
                    nullFlag = true;
                    break;
            }
            return nullFlag;
        }

        /// <summary>
        /// CustomRangeQueryProcessing
        /// </summary>
        /// <param name="type"></param>
        /// <param name="content"></param>
        /// <param name="hs"></param>
        private static void CustomRangeQueryProcessing(Type type, object content, ref HashSet<object> hs)
        {
            var arr = content.ToString().Split(new char[] { ',' });
            if (arr.Length == 2)
            {
                hs.Add(Convert.ChangeType(arr[0], type));
                hs.Add(Convert.ChangeType(arr[1], type));
            }
        }

        /// <summary>
        /// BuildPropertySpecifier
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="?"></typeparam>
        /// <param name="property"></param>
        /// <returns></returns>
        public static Expression<Func<T, TValue>> BuildPropertySpecifier<T, TValue>(string property)
        {
            if (string.IsNullOrWhiteSpace(property))
                return null;

            string[] props = property.Split('.');
            Type type = typeof(T);
            ParameterExpression arg = Expression.Parameter(type, "f");
            Expression expr = arg;
            foreach (string prop in props)
            {
                PropertyInfo pi = type.GetProperty(prop);
                if (pi == null)
                    continue;
                expr = Expression.Property(expr, pi);
                type = pi.PropertyType;
            }

            var expression = Expression.Lambda(
                typeof(Func<T, TValue>),
                expr,
                arg
                );

            return (Expression<Func<T, TValue>>)expression;
        }

        /// <summary>
        /// GetMemberExpression
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        public static MemberExpression GetMemberExpression(LambdaExpression expression)
        {
            return RemoveUnary(expression.Body) as MemberExpression;
        }

        /// <summary>
        /// GetTypeFromMemberExpression
        /// </summary>
        /// <param name="memberExpression"></param>
        /// <returns></returns>
        public static Type GetTypeFromMemberExpression(MemberExpression memberExpression)
        {
            if (memberExpression == null) return null;

            var dataType = GetTypeFromMemberInfo(memberExpression.Member, (PropertyInfo p) => p.PropertyType);
            if (dataType == null) dataType = GetTypeFromMemberInfo(memberExpression.Member, (MethodInfo m) => m.ReturnType);
            if (dataType == null) dataType = GetTypeFromMemberInfo(memberExpression.Member, (FieldInfo f) => f.FieldType);

            return dataType;
        }

        /// <summary>
        /// GetTypeFromMemberInfo
        /// </summary>
        /// <typeparam name="TMember"></typeparam>
        /// <param name="member"></param>
        /// <param name="func"></param>
        /// <returns></returns>
        private static Type GetTypeFromMemberInfo<TMember>(MemberInfo member, Func<TMember, Type> func) where TMember : MemberInfo
        {
            if (member is TMember)
            {
                return func((TMember)member);
            }
            return null;
        }

        /// <summary>
        /// RemoveUnary
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        private static Expression RemoveUnary(Expression body)
        {
            var unary = body as UnaryExpression;
            if (unary != null)
            {
                return unary.Operand;
            }
            return body;
        }
    }

    /// <summary>
    /// PredicateBuilder
    /// </summary>
    public static class PredicateBuilder
    {
        public static Expression<Func<T, bool>> True<T>() { return f => true; }
        public static Expression<Func<T, bool>> False<T>() { return f => false; }

        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
        {
            return first.Compose(second, Expression.Or);
        }

        public static Expression<T> Compose<T>(this Expression<T> first, Expression<T> second, Func<Expression, Expression, Expression> merge)
        {
            if (second == null) return first;

            var map = first.Parameters.Select((f, i) => new { f, s = second.Parameters[i] }).ToDictionary(p => p.s, p => p.f);

            var secondBody = ParameterRebinder.ReplaceParameters(map, second.Body);

            return Expression.Lambda<T>(merge(first.Body, secondBody), first.Parameters);
        }

        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
        {
            return first.Compose(second, Expression.And);
        }

        public static Expression<Func<T, bool>> Not<T>(this Expression<Func<T, bool>> expr)
        {
            var not = Expression.Not(expr.Body);
            return Expression.Lambda<Func<T, bool>>(not, expr.Parameters);
        }
    }

    /// <summary>
    /// ParameterRebinder
    /// </summary>
    public class ParameterRebinder : ExpressionVisitor
    {
        private readonly Dictionary<ParameterExpression, ParameterExpression> map;

        public ParameterRebinder(Dictionary<ParameterExpression, ParameterExpression> map)
        {
            this.map = map ?? new Dictionary<ParameterExpression, ParameterExpression>();
        }

        public static Expression ReplaceParameters(Dictionary<ParameterExpression, ParameterExpression> map, Expression exp)
        {
            return new ParameterRebinder(map).Visit(exp);
        }

        protected override Expression VisitParameter(ParameterExpression p)
        {
            ParameterExpression replacement;
            if (map.TryGetValue(p, out replacement))
            {
                p = replacement;
            }
            return base.VisitParameter(p);
        }
    }   
}
