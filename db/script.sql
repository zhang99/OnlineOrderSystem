USE [master]
GO
/****** Object:  Database [OnlineOrder]    Script Date: 09/02/2013 00:21:01 ******/
CREATE DATABASE [OnlineOrder] ON  PRIMARY 
( NAME = N'OnlineOrder', FILENAME = N'D:\My Notes\我的毕业设计(论文)\张华 - 本科毕业设计（论文）\在线订单系统\db\OnlineOrder.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'OnlineOrder_log', FILENAME = N'D:\My Notes\我的毕业设计(论文)\张华 - 本科毕业设计（论文）\在线订单系统\db\OnlineOrder_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [OnlineOrder] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [OnlineOrder].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [OnlineOrder] SET ANSI_NULL_DEFAULT OFF
GO
ALTER DATABASE [OnlineOrder] SET ANSI_NULLS OFF
GO
ALTER DATABASE [OnlineOrder] SET ANSI_PADDING OFF
GO
ALTER DATABASE [OnlineOrder] SET ANSI_WARNINGS OFF
GO
ALTER DATABASE [OnlineOrder] SET ARITHABORT OFF
GO
ALTER DATABASE [OnlineOrder] SET AUTO_CLOSE OFF
GO
ALTER DATABASE [OnlineOrder] SET AUTO_CREATE_STATISTICS ON
GO
ALTER DATABASE [OnlineOrder] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [OnlineOrder] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [OnlineOrder] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [OnlineOrder] SET CURSOR_DEFAULT  GLOBAL
GO
ALTER DATABASE [OnlineOrder] SET CONCAT_NULL_YIELDS_NULL OFF
GO
ALTER DATABASE [OnlineOrder] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [OnlineOrder] SET QUOTED_IDENTIFIER OFF
GO
ALTER DATABASE [OnlineOrder] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [OnlineOrder] SET  DISABLE_BROKER
GO
ALTER DATABASE [OnlineOrder] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [OnlineOrder] SET DATE_CORRELATION_OPTIMIZATION OFF
GO
ALTER DATABASE [OnlineOrder] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [OnlineOrder] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [OnlineOrder] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [OnlineOrder] SET READ_COMMITTED_SNAPSHOT OFF
GO
ALTER DATABASE [OnlineOrder] SET HONOR_BROKER_PRIORITY OFF
GO
ALTER DATABASE [OnlineOrder] SET  READ_WRITE
GO
ALTER DATABASE [OnlineOrder] SET RECOVERY SIMPLE
GO
ALTER DATABASE [OnlineOrder] SET  MULTI_USER
GO
ALTER DATABASE [OnlineOrder] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [OnlineOrder] SET DB_CHAINING OFF
GO
USE [OnlineOrder]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [varchar](20) NULL,
	[Name] [varchar](50) NULL,
	[Password] [varchar](50) NULL,
	[Email] [varchar](50) NULL,
	[CustomerId] [int] NULL,
 CONSTRAINT [PK_USERS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Logistics]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Logistics](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NULL,
	[Linkman] [varchar](50) NULL,
	[Tel] [varchar](50) NULL,
	[WebSite] [varchar](50) NULL,
	[Fee] [decimal](16, 4) NULL,
	[Memo] [varchar](100) NULL,
 CONSTRAINT [PK_LOGISTICS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Customers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [varchar](20) NULL,
	[Name] [varchar](50) NULL,
	[Discount] [decimal](6, 2) NULL,
	[Memo] [varchar](100) NULL,
 CONSTRAINT [PK_CUSTOMERS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Categories](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [varchar](20) NULL,
	[Name] [varchar](50) NULL,
	[ParentId] [int] NULL,
 CONSTRAINT [PK_CATEGORIES] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Brands]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Brands](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [varchar](20) NULL,
	[Name] [varchar](50) NULL,
 CONSTRAINT [PK_BRANDS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[BaseCodes]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[BaseCodes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [varchar](20) NULL,
	[Name] [varchar](50) NULL,
	[CodeType] [char](2) NULL,
	[Memo] [varchar](255) NULL,
 CONSTRAINT [PK_BASECODES] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Receipts]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Receipts](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CustomerId] [int] NULL,
	[Linkman] [varchar](50) NULL,
	[Tel] [varchar](50) NULL,
	[Address] [varchar](100) NULL,
	[Memo] [varchar](100) NULL,
 CONSTRAINT [PK_RECEIPTS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Products]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Products](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [varchar](20) NULL,
	[Name] [varchar](50) NULL,
	[UnitId] [int] NULL,
	[CategoryId] [int] NULL,
	[BrandId] [int] NULL,
	[CostPrice] [decimal](16, 4) NULL,
	[SalePrice] [decimal](16, 4) NULL,
	[StockQty] [decimal](16, 4) NULL,
	[Description] [varchar](200) NULL,
	[PicFileName] [varchar](50) NULL,
	[Status] [char](1) NULL,
	[Memo] [varchar](100) NULL,
	[OperId] [int] NULL,
	[OperDate] [datetime] NULL,
	[ModifyId] [int] NULL,
	[ModifyDate] [datetime] NULL,
 CONSTRAINT [PK_PRODUCTS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'0正常1停购2汰淘' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'Status'
GO
/****** Object:  Table [dbo].[ShoppingCart]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ShoppingCart](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [int] NULL,
	[Qty] [decimal](16, 4) NULL,
	[Price] [decimal](16, 4) NULL,
	[Amount] [decimal](16, 4) NULL,
	[Discount] [decimal](6, 2) NULL,
 CONSTRAINT [PK_SHOPPINGCART] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Orders](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [varchar](20) NULL,
	[CustomerId] [int] NULL,
	[DeliveryId] [int] NULL,
	[PaymentId] [int] NULL,
	[ReceiptId] [int] NULL,
	[PayDate] [datetime] NULL,
	[Amount] [decimal](16, 4) NULL,
	[ApproveFlag] [char](1) NULL,
	[Status] [char](1) NULL,
	[ApproveDate] [datetime] NULL,
	[ApproverId] [int] NULL,
	[OperId] [int] NULL,
	[OperDate] [datetime] NULL,
 CONSTRAINT [PK_ORDERS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
 CONSTRAINT [AK_KEY_2_ORDERS] UNIQUE NONCLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[OrderDetails]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[LineNum] [int] NULL,
	[ParentId] [int] NULL,
	[ProductId] [int] NULL,
	[Qty] [decimal](16, 4) NULL,
	[SalePrice] [decimal](16, 4) NULL,
	[Amount] [decimal](16, 4) NULL,
	[Discount] [decimal](6, 2) NULL,
 CONSTRAINT [PK_ORDERDETAILS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SendOrders]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[SendOrders](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [varchar](20) NULL,
	[OrderId] [int] NULL,
	[LogisticId] [int] NULL,
	[ShippingFee] [decimal](16, 4) NULL,
	[Amount] [decimal](16, 4) NULL,
	[ApproveFlag] [char](1) NULL,
	[Status] [char](1) NULL,
	[ApproveDate] [datetime] NULL,
	[ApproverId] [int] NULL,
	[OperId] [int] NULL,
	[OperDate] [datetime] NULL,
 CONSTRAINT [PK_SENDORDERS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
 CONSTRAINT [AK_KEY_2_SENDORDE] UNIQUE NONCLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[SendOrderDetails]    Script Date: 09/02/2013 00:21:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SendOrderDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[LineNum] [int] NULL,
	[ParentId] [int] NULL,
	[ProductId] [int] NULL,
	[Qty] [decimal](16, 4) NULL,
	[Price] [decimal](16, 4) NULL,
	[Amount] [decimal](16, 4) NULL,
	[Discount] [decimal](6, 2) NULL,
 CONSTRAINT [PK_SENDORDERDETAILS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  ForeignKey [FK_CATEGORI_CATEGORY__CATEGORI]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[Categories]  WITH CHECK ADD  CONSTRAINT [FK_CATEGORI_CATEGORY__CATEGORI] FOREIGN KEY([ParentId])
REFERENCES [dbo].[Categories] ([Id])
GO
ALTER TABLE [dbo].[Categories] CHECK CONSTRAINT [FK_CATEGORI_CATEGORY__CATEGORI]
GO
/****** Object:  ForeignKey [FK_RECEIPTS_REFERENCE_CUSTOMER]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[Receipts]  WITH CHECK ADD  CONSTRAINT [FK_RECEIPTS_REFERENCE_CUSTOMER] FOREIGN KEY([CustomerId])
REFERENCES [dbo].[Customers] ([Id])
GO
ALTER TABLE [dbo].[Receipts] CHECK CONSTRAINT [FK_RECEIPTS_REFERENCE_CUSTOMER]
GO
/****** Object:  ForeignKey [FK_PRODUCTS_PRODUCT_R_BRANDS]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_PRODUCTS_PRODUCT_R_BRANDS] FOREIGN KEY([BrandId])
REFERENCES [dbo].[Brands] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_PRODUCTS_PRODUCT_R_BRANDS]
GO
/****** Object:  ForeignKey [FK_PRODUCTS_PRODUCT_R_CATEGORI]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_PRODUCTS_PRODUCT_R_CATEGORI] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Categories] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_PRODUCTS_PRODUCT_R_CATEGORI]
GO
/****** Object:  ForeignKey [FK_PRODUCTS_REFERENCE_BASECODE]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_PRODUCTS_REFERENCE_BASECODE] FOREIGN KEY([UnitId])
REFERENCES [dbo].[BaseCodes] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_PRODUCTS_REFERENCE_BASECODE]
GO
/****** Object:  ForeignKey [FK_PRODUCTS_REFERENCE_MODIFY]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_PRODUCTS_REFERENCE_MODIFY] FOREIGN KEY([ModifyId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_PRODUCTS_REFERENCE_MODIFY]
GO
/****** Object:  ForeignKey [FK_PRODUCTS_REFERENCE_OPER]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_PRODUCTS_REFERENCE_OPER] FOREIGN KEY([OperId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_PRODUCTS_REFERENCE_OPER]
GO
/****** Object:  ForeignKey [FK_SHOPPING_REFERENCE_PRODUCTS]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[ShoppingCart]  WITH CHECK ADD  CONSTRAINT [FK_SHOPPING_REFERENCE_PRODUCTS] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[ShoppingCart] CHECK CONSTRAINT [FK_SHOPPING_REFERENCE_PRODUCTS]
GO
/****** Object:  ForeignKey [FK_ORDERS_PURCHASEO_CUSTOMER]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD  CONSTRAINT [FK_ORDERS_PURCHASEO_CUSTOMER] FOREIGN KEY([CustomerId])
REFERENCES [dbo].[Customers] ([Id])
GO
ALTER TABLE [dbo].[Orders] CHECK CONSTRAINT [FK_ORDERS_PURCHASEO_CUSTOMER]
GO
/****** Object:  ForeignKey [FK_ORDERS_REFERENCE_RECEIPTS]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD  CONSTRAINT [FK_ORDERS_REFERENCE_RECEIPTS] FOREIGN KEY([ReceiptId])
REFERENCES [dbo].[Receipts] ([Id])
GO
ALTER TABLE [dbo].[Orders] CHECK CONSTRAINT [FK_ORDERS_REFERENCE_RECEIPTS]
GO
/****** Object:  ForeignKey [FK_ORDERS_REFERENCE_USERS]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD  CONSTRAINT [FK_ORDERS_REFERENCE_USERS] FOREIGN KEY([OperId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Orders] CHECK CONSTRAINT [FK_ORDERS_REFERENCE_USERS]
GO
/****** Object:  ForeignKey [FK_ORDERDET_PURCHASEO_ORDERS]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD  CONSTRAINT [FK_ORDERDET_PURCHASEO_ORDERS] FOREIGN KEY([ParentId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[OrderDetails] CHECK CONSTRAINT [FK_ORDERDET_PURCHASEO_ORDERS]
GO
/****** Object:  ForeignKey [FK_ORDERDET_PURCHASEO_PRODUCTS]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD  CONSTRAINT [FK_ORDERDET_PURCHASEO_PRODUCTS] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[OrderDetails] CHECK CONSTRAINT [FK_ORDERDET_PURCHASEO_PRODUCTS]
GO
/****** Object:  ForeignKey [FK_SENDORDE_REFERENCE_LOGISTIC]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[SendOrders]  WITH CHECK ADD  CONSTRAINT [FK_SENDORDE_REFERENCE_LOGISTIC] FOREIGN KEY([LogisticId])
REFERENCES [dbo].[Logistics] ([Id])
GO
ALTER TABLE [dbo].[SendOrders] CHECK CONSTRAINT [FK_SENDORDE_REFERENCE_LOGISTIC]
GO
/****** Object:  ForeignKey [FK_SendOrders_Orders]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[SendOrders]  WITH CHECK ADD  CONSTRAINT [FK_SendOrders_Orders] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[SendOrders] CHECK CONSTRAINT [FK_SendOrders_Orders]
GO
/****** Object:  ForeignKey [FK_SENDORDE_REFERENCE_PRODUCTS]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[SendOrderDetails]  WITH CHECK ADD  CONSTRAINT [FK_SENDORDE_REFERENCE_PRODUCTS] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[SendOrderDetails] CHECK CONSTRAINT [FK_SENDORDE_REFERENCE_PRODUCTS]
GO
/****** Object:  ForeignKey [FK_SENDORDE_REFERENCE_SENDORDE]    Script Date: 09/02/2013 00:21:04 ******/
ALTER TABLE [dbo].[SendOrderDetails]  WITH CHECK ADD  CONSTRAINT [FK_SENDORDE_REFERENCE_SENDORDE] FOREIGN KEY([ParentId])
REFERENCES [dbo].[SendOrders] ([Id])
GO
ALTER TABLE [dbo].[SendOrderDetails] CHECK CONSTRAINT [FK_SENDORDE_REFERENCE_SENDORDE]
GO
