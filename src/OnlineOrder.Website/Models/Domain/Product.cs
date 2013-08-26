
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

    //TODO: �ӿڿ���ȥ��
    #region �ӿ� 
    public interface IProductModel : IModel<Product>
    {
    }
    #endregion

    #region ʵ��
    public partial class Product : ModelBase<Product>, IProductModel
    {
        #region ����
        [Display(Name = "����")]
        [StringLength(20, MinimumLength = 4)]
        [Required(AllowEmptyStrings = false)]
        public string Code { get; set; }
        [Display(Name = "�Ա���")]
        public string SubNo { get; set; }
        [Required(AllowEmptyStrings = false)]
        [Display(Name = "Ʒ��")]
        public string Name { get; set; }
        public Nullable<int> UnitId { get; set; }
        [Display(Name = "��λ")]
        [Relation("CodeType=01")]
        [JsonIgnore]
        public virtual BaseCode Unit { get; set; }
        public Nullable<int> CategoryId { get; set; }
        [Display(Name = "���")]
        [JsonIgnore]
        public virtual Category Category { get; set; }
        public Nullable<int> BrandId { get; set; }
        [Display(Name = "Ʒ��")]
        [JsonIgnore]
        public virtual Brand Brand { get; set; }      
    
        [Display(Name = "������")]        
        [Range(0, 999999)]
        public Nullable<decimal> InPrice { get; set; }
        [Range(0, 999999)]
        [Display(Name = "���ۼ�")]
        public Nullable<decimal> SalePrice { get; set; }
        [Range(0, 999999)]
        [Display(Name = "������")]
        public Nullable<decimal> BasePrice { get; set; }
        [Range(0, 999999)]
        [Display(Name = "�������")]        
        public Nullable<decimal> PurchaseSpec { get; set; }
        [Display(Name = "ͼƬ�ϴ�")]   
        public string PicFileName { get; set; }
        [Display(Name = "״̬")]
        [Values("[{Text:'����', Value:'0'},{Text:'ͣ��', Value:'1'},{Text:'��̭', Value:'2'}]")]
        public string  Status { get; set; }
        [Display(Name = "��ע")]
        public string Memo { get; set; }
        [Editable(false)]
        public Nullable<int> OperId { get; set; }
        [Editable(false)]
        [Display(Name = "������")]
        [JsonIgnore]
        public virtual User Oper { get; set; }
        [Display(Name = "��������")]
        public Nullable<System.DateTime> OperDate { get; set; }
        public Nullable<int> ModifyId { get; set; }
        [Display(Name = "�޸���")]
        [JsonIgnore]
        public virtual User Modify { get; set; }
        [Display(Name = "�޸�ʱ��")]
        public Nullable<System.DateTime> ModifyDate { get; set; }

        public virtual BaseCode BaseCode { get; set; }
   
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
        public virtual User User { get; set; }
        public virtual User User1 { get; set; }
        public virtual ICollection<SendOrderDetail> SendOrderDetails { get; set; }
        public virtual ICollection<ShoppingCart> ShoppingCarts { get; set; }
        #endregion

        #region ����
        /// <summary>
        /// ��ӡ��޸�ǰҵ����
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
                throw new Exception(string.Format("����Ʒ����[{0}]�ѱ�ռ��!", entity.Code));
        }

        /// <summary>
        /// ɾ��ǰ�߼�����
        /// </summary>
        /// <param name="entity"></param>
        public override void BeforeDelete(Product entity)
        {
            //����Ƿ����ҵ��.TODO:ʵ��Ӧ�ü����ˮ������ֻ���ɹ��ջ���
            //PurchaseOrderDetail pod = new PurchaseOrderDetail();
            //IEnumerable<PurchaseOrderDetail> lstItem = pod.GetList(p => p.ProductId == entity.Id);
            //if (lstItem != null && lstItem.Count() > 0)
            //    throw new Exception("����Ʒ�Ѿ�����ҵ�񣬲�����ɾ��!");

            ////ɾ������������
            //var ids = entity.ProductBarcodes.Select(p => p.Id).ToArray();
            //ProductBarcode pb = new ProductBarcode();
            //pb.Delete(ids);          
        }
        #endregion

    }   
    #endregion
}
