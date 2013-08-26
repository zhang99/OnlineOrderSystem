using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace OnlineOrder.Mvc
{
    public class UtilHelper
    {
        #region 实体属性
        /// <summary>
        /// 获取实体属性
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static object GetFieldValue(object entity, string fieldName)
        {
            object sheetNo = string.Empty;
            Type type = entity.GetType();
            PropertyInfo[] properties = type.GetProperties();
            for (int j = 0; j < properties.Length; j++)
            {
                PropertyInfo propertyInfo = properties[j];
                if (propertyInfo.Name == fieldName)
                {
                    sheetNo = type.GetProperty(propertyInfo.Name).GetValue(entity, null);
                    break;
                }
            }
            return sheetNo;
        }

        /// <summary>
        /// 给实体字段赋值
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static object SetFieldValue(object entity, string fieldName, object fieldValue)
        {
            string sheetNo = string.Empty;
            Type type = entity.GetType();
            PropertyInfo[] properties = type.GetProperties();
            for (int j = 0; j < properties.Length; j++)
            {
                PropertyInfo propertyInfo = properties[j];
                if (propertyInfo.Name == fieldName)
                {
                    propertyInfo.SetValue(entity, fieldValue, null);
                    break;
                }
            }
            return entity;
        }
        #endregion
    }
}
