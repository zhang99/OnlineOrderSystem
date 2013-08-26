using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using OnlineOrder.Mvc.Grid.Syntax;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Mvc.Grid
{
	/// <summary>
	/// Defines a grid to be rendered.
	/// </summary>
	/// <typeparam name="T">Type of datasource for the grid</typeparam>
	public class Grid<T> : IGrid<T> where T : class
	{
		private readonly ViewContext _context;
		private IGridModel<T> _gridModel = new GridModel<T>();

		/// <summary>
		/// The GridModel that holds the internal representation of this grid.
		/// </summary>
		public IGridModel<T> Model
		{
			get { return _gridModel; }
		}

		/// <summary>
		/// Creates a new instance of the Grid class.
		/// </summary>
		/// <param name="dataSource">The datasource for the grid</param>
		/// <param name="context"></param>
        public Grid(IPagination<T> dataSource, ViewContext context)
		{
			this._context = context;
			DataSource = dataSource;
		}

        public Grid(IPagination<dynamic> dataSource, ViewContext context)
        {
            this._context = context;
            DataSourceDynamic = dataSource;
        }

		/// <summary>
		/// The datasource for the grid.
		/// </summary>
        public IPagination<T> DataSource { get; private set; }

        public IPagination<dynamic> DataSourceDynamic { get; private set; }

		public IGridWithOptions<T> RenderUsing(IGridRenderer<T> renderer)
		{
			_gridModel.Renderer = renderer;
			return this;
		}

		public IGridWithOptions<T> Columns(Action<ColumnBuilder<T>> columnBuilder)
		{
			var builder = new ColumnBuilder<T>();
			columnBuilder(builder);

			foreach (var column in builder)
			{
				if (column.Position == null) 
				{
					_gridModel.Columns.Add(column);
				} 
				else
				{
					_gridModel.Columns.Insert(column.Position.Value, column);	
				}

                if (DataSource != null && column.IsSum)
                {
                    if( DataSource.DicSum == null)
                        DataSource.DicSum = new Dictionary<string, decimal>();

                    DataSource.DicSum.Add(new KeyValuePair<string, decimal>(column.FieldName, 0M));
                }
            }

			return this;
		}

        public IGridWithOptions<T> AddEmptyRows(int rows)
        {
            _gridModel.EmptyRows = rows;
            return this;
        }

        public IGridWithOptions<T> ShowFooter(bool isShowFooter)
        {
            _gridModel.ShowFooter = isShowFooter;
            return this;
        }

        public IGridWithOptions<T> AutoScroll(bool isAutoScroll)
        {
            _gridModel.AutoScroll = isAutoScroll;
            return this;
        }

		public IGridWithOptions<T> Empty(string emptyText)
		{
			_gridModel.EmptyText = emptyText;
			return this;
		}

		public IGridWithOptions<T> Attributes(IDictionary<string, object> attributes)
		{
			_gridModel.Attributes = attributes;
			return this;
		}

		public IGrid<T> WithModel(IGridModel<T> model)
		{
			_gridModel = model;
			return this;
		}

		public IGridWithOptions<T> Sort(GridSortOptions sortOptions)
		{
			_gridModel.SortOptions = sortOptions;
			return this;
		}

		public IGridWithOptions<T> Sort(GridSortOptions sortOptions, string prefix)
		{
			_gridModel.SortOptions = sortOptions;
			_gridModel.SortPrefix = prefix;
			return this;
		}

		public override string ToString()
		{
			return ToHtmlString();
		}

		public string ToHtmlString()
		{
			var writer = new StringWriter();
			_gridModel.Renderer.Render(_gridModel, DataSource, writer, _context);
			return writer.ToString();
		}

		public IGridWithOptions<T> HeaderRowAttributes(IDictionary<string, object> attributes)
		{
			_gridModel.Sections.HeaderRowAttributes(attributes);
			return this;
		}

		[Obsolete("The Render method is deprecated. From within a Razor view, use @Html.Grid() without a call to Render.")]
		public void Render()
		{
			_gridModel.Renderer.Render(_gridModel, DataSource, _context.Writer, _context);
		}

		public IGridWithOptions<T> RowAttributes(Func<GridRowViewData<T>, IDictionary<string, object>> attributes)
		{
			_gridModel.Sections.RowAttributes(attributes);
			return this;
		}
	}
}