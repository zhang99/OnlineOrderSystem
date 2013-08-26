
namespace OnlineOrder.Website.Models
{
    using System;
    using System.Linq;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Newtonsoft.Json;
    using OnlineOrder.Mvc;
    using OnlineOrder.Mvc.Pagination;
    using System.Linq.Expressions;
    using System.Collections;

    //TODO: 接口考虑去掉
    #region 接口 
    public interface IProductModel : IModel<Product>
    {
    }
    #endregion

    #region 实现
    public partial class Product : ModelBase<Product>, IProductModel
    {
        #region 属性
        [Display(Name = "货号")]
        [StringLength(20, MinimumLength = 4)]
        [Required(AllowEmptyStrings = false)]
        public string Code { get; set; }
        [Display(Name = "自编码")]
        public string SubNo { get; set; }
        [Required(AllowEmptyStrings = false)]
        [Display(Name = "品名")]
        public string Name { get; set; }
        public Nullable<int> UnitId { get; set; }
        [Display(Name = "单位")]
        [Relation("CodeType=01")]
        [JsonIgnore]
        public virtual BaseCode Unit { get; set; }
        public Nullable<int> CategoryId { get; set; }
        [Display(Name = "类别")]
        [JsonIgnore]
        public virtual Category Category { get; set; }
        public Nullable<int> BrandId { get; set; }
        [Display(Name = "品牌")]
        [JsonIgnore]
        public virtual Brand Brand { get; set; }      
    
        [Display(Name = "进货价")]        
        [Range(0, 999999)]
        public Nullable<decimal> InPrice { get; set; }
        [Range(0, 999999)]
        [Display(Name = "零售价")]
        public Nullable<decimal> SalePrice { get; set; }
        [Range(0, 999999)]
        [Display(Name = "批发价")]
        public Nullable<decimal> BasePrice { get; set; }
        [Range(0, 999999)]
        [Display(Name = "进货规格")]        
        public Nullable<decimal> PurchaseSpec { get; set; }
        [Display(Name = "图片上传")]   
        public string PicFileName { get; set; }
        [Display(Name = "状态")]
        [Values("[{Text:'正常', Value:'0'},{Text:'停售', Value:'1'},{Text:'淘汰', Value:'2'}]")]
        public string  Status { get; set; }
        [Display(Name = "备注")]
        public string Memo { get; set; }
        [Editable(false)]
        public Nullable<int> OperId { get; set; }
        [Editable(false)]
        [Display(Name = "创建者")]
        [JsonIgnore]
        public virtual User Oper { get; set; }
        [Display(Name = "创建日期")]
        public Nullable<System.DateTime> OperDate { get; set; }
        public Nullable<int> ModifyId { get; set; }
        [Display(Name = "修改人")]
        [JsonIgnore]
        public virtual User Modify { get; set; }
        [Display(Name = "修改时间")]
        public Nullable<System.DateTime> ModifyDate { get; set; }

        public virtual BaseCode BaseCode { get; set; }
   
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
        public virtual User User { get; set; }
        public virtual User User1 { get; set; }
        public virtual ICollection<SendOrderDetail> SendOrderDetails { get; set; }
        public virtual ICollection<ShoppingCart> ShoppingCarts { get; set; }
        #endregion

        #region 方法
        /// <summary>
        /// 添加、修改前业务处理
        /// </summary>
        /// <param name="entity"></param>
        public override void BeforeAddOrUpdate(Product entity)
        {
            IEnumerable<Product> lstItem;
            if (entity.Id == 0)
                lstItem = GetList(p => p.Code == entity.Code);
            else
                lstItem = GetList(p => p.Code == entity.Code && p.Id != entity.Id);

            if (lstItem != null && lstItem.Count()>0)
                throw new Exception(string.Format("该商品编码[{0}]已被占用!", entity.Code));
        }

        /// <summary>
        /// 删除前逻辑处理
        /// </summary>
        /// <param name="entity"></param>
        public override void BeforeDelete(Product entity)
        {
            //检查是否存在业务.TODO:实际应该检查流水表，这里只检查采购收货表
            //PurchaseOrderDetail pod = new PurchaseOrderDetail();
            //IEnumerable<PurchaseOrderDetail> lstItem = pod.GetList(p => p.ProductId == entity.Id);
            //if (lstItem != null && lstItem.Count() > 0)
            //    throw new Exception("该商品已经发生业务，不允许删除!");

            ////删除关联表数据
            //var ids = entity.ProductBarcodes.Select(p => p.Id).ToArray();
            //ProductBarcode pb = new ProductBarcode();
            //pb.Delete(ids);          
        }
        #endregion

    }   
    #endregion
}
