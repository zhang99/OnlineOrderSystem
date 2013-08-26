/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2008                    */
/* Created on:     2013/8/16 15:41:08                           */
/*==============================================================*/


if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Categories') and o.name = 'FK_CATEGORI_CATEGORY__CATEGORI')
alter table Categories
   drop constraint FK_CATEGORI_CATEGORY__CATEGORI
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('OrderDetails') and o.name = 'FK_PURCHASE_PURCHASEDETAIL1_USER')
alter table OrderDetails
   drop constraint FK_PURCHASE_PURCHASEDETAIL1_USER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('OrderDetails') and o.name = 'FK_ORDERDET_PURCHASEO_PRODUCTS')
alter table OrderDetails
   drop constraint FK_ORDERDET_PURCHASEO_PRODUCTS
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('OrderDetails') and o.name = 'FK_ORDERDET_PURCHASEO_ORDERS')
alter table OrderDetails
   drop constraint FK_ORDERDET_PURCHASEO_ORDERS
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Orders') and o.name = 'FK_ORDERS_PURCHASEO_CUSTOMER')
alter table Orders
   drop constraint FK_ORDERS_PURCHASEO_CUSTOMER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Orders') and o.name = 'FK_ORDERS_REFERENCE_USERS')
alter table Orders
   drop constraint FK_ORDERS_REFERENCE_USERS
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Orders') and o.name = 'FK_ORDERS_REFERENCE_RECEIPTS')
alter table Orders
   drop constraint FK_ORDERS_REFERENCE_RECEIPTS
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Products') and o.name = 'FK_PRODUCTS_PRODUCT_R_BRANDS')
alter table Products
   drop constraint FK_PRODUCTS_PRODUCT_R_BRANDS
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Products') and o.name = 'FK_PRODUCTS_PRODUCT_R_CATEGORI')
alter table Products
   drop constraint FK_PRODUCTS_PRODUCT_R_CATEGORI
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Products') and o.name = 'FK_PRODUCTS_REFERENCE_BASECODE')
alter table Products
   drop constraint FK_PRODUCTS_REFERENCE_BASECODE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Products') and o.name = 'FK_PRODUCTS_REFERENCE_USERS')
alter table Products
   drop constraint FK_PRODUCTS_REFERENCE_USERS
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Products') and o.name = 'FK_PRODUCTS_REFERENCE_USERS')
alter table Products
   drop constraint FK_PRODUCTS_REFERENCE_USERS
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Receipts') and o.name = 'FK_RECEIPTS_REFERENCE_CUSTOMER')
alter table Receipts
   drop constraint FK_RECEIPTS_REFERENCE_CUSTOMER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('SendOrderDetails') and o.name = 'FK_SENDORDE_REFERENCE_SENDORDE')
alter table SendOrderDetails
   drop constraint FK_SENDORDE_REFERENCE_SENDORDE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('SendOrderDetails') and o.name = 'FK_SENDORDE_REFERENCE_PRODUCTS')
alter table SendOrderDetails
   drop constraint FK_SENDORDE_REFERENCE_PRODUCTS
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('SendOrders') and o.name = 'FK_SENDORDE_REFERENCE_LOGISTIC')
alter table SendOrders
   drop constraint FK_SENDORDE_REFERENCE_LOGISTIC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('ShoppingCart') and o.name = 'FK_SHOPPING_REFERENCE_PRODUCTS')
alter table ShoppingCart
   drop constraint FK_SHOPPING_REFERENCE_PRODUCTS
go

if exists (select 1
            from  sysobjects
           where  id = object_id('BaseCodes')
            and   type = 'U')
   drop table BaseCodes
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Brands')
            and   type = 'U')
   drop table Brands
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Categories')
            and   type = 'U')
   drop table Categories
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Customers')
            and   type = 'U')
   drop table Customers
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Logistics')
            and   type = 'U')
   drop table Logistics
go

if exists (select 1
            from  sysobjects
           where  id = object_id('OrderDetails')
            and   type = 'U')
   drop table OrderDetails
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Orders')
            and   type = 'U')
   drop table Orders
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Products')
            and   type = 'U')
   drop table Products
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Receipts')
            and   type = 'U')
   drop table Receipts
go

if exists (select 1
            from  sysobjects
           where  id = object_id('SendOrderDetails')
            and   type = 'U')
   drop table SendOrderDetails
go

if exists (select 1
            from  sysobjects
           where  id = object_id('SendOrders')
            and   type = 'U')
   drop table SendOrders
go

if exists (select 1
            from  sysobjects
           where  id = object_id('ShoppingCart')
            and   type = 'U')
   drop table ShoppingCart
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Users')
            and   type = 'U')
   drop table Users
go

/*==============================================================*/
/* Table: BaseCodes                                             */
/*==============================================================*/
create table BaseCodes (
   Id                   int                  not null,
   Code                 varchar(20)          null,
   Name                 varchar(50)          null,
   CodeType             char(2)              null,
   Memo                 varchar(255)         null,
   constraint PK_BASECODES primary key (Id)
)
go

/*==============================================================*/
/* Table: Brands                                                */
/*==============================================================*/
create table Brands (
   Id                   int                  not null,
   Code                 varchar(20)          null,
   Name                 varchar(50)          null,
   constraint PK_BRANDS primary key (Id)
)
go

/*==============================================================*/
/* Table: Categories                                            */
/*==============================================================*/
create table Categories (
   Id                   int                  not null,
   Code                 varchar(20)          null,
   Name                 varchar(50)          null,
   ParentId             int                  null,
   constraint PK_CATEGORIES primary key (Id)
)
go

/*==============================================================*/
/* Table: Customers                                             */
/*==============================================================*/
create table Customers (
   Id                   int                  not null,
   Code                 varchar(20)          null,
   Name                 varchar(50)          null,
   Discount             decimal(6,2)         null,
   Memo                 varchar(100)         null,
   constraint PK_CUSTOMERS primary key (Id)
)
go

/*==============================================================*/
/* Table: Logistics                                             */
/*==============================================================*/
create table Logistics (
   Id                   int                  not null,
   Name                 varchar(50)          null,
   Linkman              varchar(50)          null,
   Tel                  varchar(50)          null,
   WebSite              varchar(50)          null,
   Fee                  decimal(16,4)        null,
   Memo                 varchar(100)         null,
   constraint PK_LOGISTICS primary key (Id)
)
go

/*==============================================================*/
/* Table: OrderDetails                                          */
/*==============================================================*/
create table OrderDetails (
   Id                   int                  not null,
   ParentId             int                  null,
   ProductId            int                  null,
   Qty                  decimal(16,4)        null,
   Price                decimal(16,4)        null,
   Amount               decimal(16,4)        null,
   Discount             decimal(6,2)         null,
   constraint PK_ORDERDETAILS primary key (Id)
)
go

/*==============================================================*/
/* Table: Orders                                                */
/*==============================================================*/
create table Orders (
   Id                   int                  not null,
   Code                 varchar(20)          null,
   CustomerId           int                  null,
   DeliveryId           int                  null,
   PaymentId            int                  null,
   ReceiptId            int                  null,
   PayDate              datetime             null,
   Amount               decimal(16,4)        null,
   ApproveFlag          char(1)              null,
   Status               char(1)              null,
   ApproveDate          datetime             null,
   ApproverId           int                  null,
   OperId               int                  null,
   OperDate             datetime             null,
   constraint PK_ORDERS primary key (Id),
   constraint AK_KEY_2_ORDERS unique (Id)
)
go

/*==============================================================*/
/* Table: Products                                              */
/*==============================================================*/
create table Products (
   Id                   int                  not null,
   Code                 varchar(20)          null,
   Name                 varchar(50)          null,
   UnitId               int                  null,
   CategoryId           int                  null,
   BrandId              int                  null,
   InPrice              decimal(16,4)        null,
   SalePrice            decimal(16,4)        null,
   BasePrice            decimal(16,4)        null,
   StockQty             decimal(16,4)        null,
   Description          varchar(200)         null,
   Status               char(1)              null,
   Memo                 varchar(100)         null,
   OperId               int                  null,
   OperDate             datetime             null,
   ModifyId             int                  null,
   ModifyDate           datetime             null,
   constraint PK_PRODUCTS primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '0Õý³£1Í£¹º2Ì­ÌÔ',
   'user', @CurrentUser, 'table', 'Products', 'column', 'Status'
go

/*==============================================================*/
/* Table: Receipts                                              */
/*==============================================================*/
create table Receipts (
   Id                   int                  not null,
   CustomerId           int                  null,
   Linkman              varchar(50)          null,
   Tel                  varchar(50)          null,
   Address              varchar(100)         null,
   Memo                 varchar(100)         null,
   constraint PK_RECEIPTS primary key (Id)
)
go

/*==============================================================*/
/* Table: SendOrderDetails                                      */
/*==============================================================*/
create table SendOrderDetails (
   Id                   int                  not null,
   ParentId             int                  null,
   ProductId            int                  null,
   Qty                  decimal(16,4)        null,
   Price                decimal(16,4)        null,
   Amount               decimal(16,4)        null,
   Discount             decimal(6,2)         null,
   constraint PK_SENDORDERDETAILS primary key (Id)
)
go

/*==============================================================*/
/* Table: SendOrders                                            */
/*==============================================================*/
create table SendOrders (
   Id                   int                  not null,
   Code                 varchar(20)          null,
   OrderId              int                  null,
   LogisticId           int                  null,
   ShippingFee          decimal(16,4)        null,
   Amount               decimal(16,4)        null,
   ApproveFlag          char(1)              null,
   Status               char(1)              null,
   ApproveDate          datetime             null,
   ApproverId           int                  null,
   OperId               int                  null,
   OperDate             datetime             null,
   constraint PK_SENDORDERS primary key (Id),
   constraint AK_KEY_2_SENDORDE unique (Id)
)
go

/*==============================================================*/
/* Table: ShoppingCart                                          */
/*==============================================================*/
create table ShoppingCart (
   Id                   int                  not null,
   ProductId            int                  null,
   Qty                  decimal(16,4)        null,
   Price                decimal(16,4)        null,
   Amount               decimal(16,4)        null,
   Discount             decimal(6,2)         null,
   constraint PK_SHOPPINGCART primary key (Id)
)
go

/*==============================================================*/
/* Table: Users                                                 */
/*==============================================================*/
create table Users (
   Id                   int                  not null,
   Code                 varchar(20)          null,
   Name                 varchar(50)          null,
   Password             varchar(50)          null,
   Email                varchar(50)          null,
   CustomerId           int                  null,
   constraint PK_USERS primary key (Id)
)
go

alter table Categories
   add constraint FK_CATEGORI_CATEGORY__CATEGORI foreign key (ParentId)
      references Categories (Id)
go

alter table OrderDetails
   add constraint FK_PURCHASE_PURCHASEDETAIL1_USER foreign key (Id)
      references Users (Id)
go

alter table OrderDetails
   add constraint FK_ORDERDET_PURCHASEO_PRODUCTS foreign key (ProductId)
      references Products (Id)
go

alter table OrderDetails
   add constraint FK_ORDERDET_PURCHASEO_ORDERS foreign key (ParentId)
      references Orders (Id)
go

alter table Orders
   add constraint FK_ORDERS_PURCHASEO_CUSTOMER foreign key (CustomerId)
      references Customers (Id)
go

alter table Orders
   add constraint FK_ORDERS_REFERENCE_USERS foreign key (Id)
      references Users (Id)
go

alter table Orders
   add constraint FK_ORDERS_REFERENCE_RECEIPTS foreign key (ReceiptId)
      references Receipts (Id)
go

alter table Products
   add constraint FK_PRODUCTS_PRODUCT_R_BRANDS foreign key (BrandId)
      references Brands (Id)
go

alter table Products
   add constraint FK_PRODUCTS_PRODUCT_R_CATEGORI foreign key (CategoryId)
      references Categories (Id)
go

alter table Products
   add constraint FK_PRODUCTS_REFERENCE_BASECODE foreign key (UnitId)
      references BaseCodes (Id)
go

alter table Products
   add constraint FK_PRODUCTS_REFERENCE_USERS foreign key (OperId)
      references Users (Id)
go

alter table Products
   add constraint FK_PRODUCTS_REFERENCE_USERS1 foreign key (ModifyId)
      references Users (Id)
go

alter table Receipts
   add constraint FK_RECEIPTS_REFERENCE_CUSTOMER foreign key (CustomerId)
      references Customers (Id)
go

alter table SendOrderDetails
   add constraint FK_SENDORDE_REFERENCE_SENDORDE foreign key (ParentId)
      references SendOrders (Id)
go

alter table SendOrderDetails
   add constraint FK_SENDORDE_REFERENCE_PRODUCTS foreign key (ProductId)
      references Products (Id)
go

alter table SendOrders
   add constraint FK_SENDORDE_REFERENCE_LOGISTIC foreign key (LogisticId)
      references Logistics (Id)
go

alter table ShoppingCart
   add constraint FK_SHOPPING_REFERENCE_PRODUCTS foreign key (ProductId)
      references Products (Id)
go
