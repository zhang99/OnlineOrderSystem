using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Mvc.Grid
{
	/// <summary>
	/// Base class for Grid Renderers. 
	/// </summary>
	public abstract class GridRenderer<T> : IGridRenderer<T> where T : class 
	{
		protected IGridModel<T> GridModel { get; private set; }
        protected IPagination<T> DataSource { get; private set; }
		protected ViewContext Context { get; private set; }
		private TextWriter _writer;
		private readonly ViewEngineCollection _engines;
        protected int _rowNum = 0;

		protected  TextWriter Writer
		{
			get { return _writer; }
		}

		protected GridRenderer() : this(ViewEngines.Engines) {}

		protected GridRenderer(ViewEngineCollection engines)
		{
			_engines = engines;
		}

        public void Render(IGridModel<T> gridModel, IPagination<T> dataSource, TextWriter output, ViewContext context)
		{
			_writer = output;
			GridModel = gridModel;
			DataSource = dataSource;
			Context = context;

			RenderGridStart();
			bool hasItems = RenderHeader();

			if(hasItems)
			{
				RenderItems();
			}
			else
			{
				RenderEmpty();
			}

            if (GridModel.ShowFooter && !IsDataSourceEmpty())
                RenderFooter();


			RenderGridEnd(!hasItems);
		}

		protected void RenderText(string text)
		{
			Writer.Write(text);
		}

        protected virtual void RenderItems()
        {
            if (IsDataSourceEmpty())
            {
                RenderEmpty();
                return;
            }

            RenderBodyStart();

            bool isAlternate = false;
            _rowNum = 0;
            foreach (var item in DataSource)
            {
                _rowNum++;
                RenderItem(new GridRowViewData<T>(item, isAlternate));
                isAlternate = !isAlternate;
            }

            RenderAdditionalEmptyRows();

            RenderBodyEnd();
        }

		protected virtual void RenderItem(GridRowViewData<T> rowData)
		{
			BaseRenderRowStart(rowData);
           
            int i = 0;
			foreach(var column in VisibleColumns())
			{                
				//A custom item section has been specified - render it and continue to the next iteration.
#pragma warning disable 612,618
				// TODO: CustomItemRenderer is obsolete in favour of custom columns. Remove this after next release.
				if (column.CustomItemRenderer != null)
				{
					column.CustomItemRenderer(new RenderingContext(Writer, Context, _engines), rowData.Item);
					continue;
				}
#pragma warning restore 612,618

				RenderStartCell(column, rowData);
                if (this.GridModel.ShowCheckBox && i == 0)
                {
                    RenderCheckBox(column, rowData.Item);
                }
                else
                {
                    RenderCellValue(column, rowData);
                }
                i++;

                if (i == VisibleColumns().Count())
                    i = 0;

				RenderEndCell();
			}

			BaseRenderRowEnd(rowData);
		}

		protected virtual void RenderCellValue(GridColumn<T> column, GridRowViewData<T> rowData)
		{
            if (!string.IsNullOrEmpty(column.Name) && (column.Name == "rowNum" || column.Name == "LineNum"))
            {
                RenderText(RenderRowNum());
            }
            else
            {
                var cellValue = column.GetValue(rowData.Item);

                if (column.IsEditable && column.Selectable)
                    cellValue = string.Format("<input type=\"text\" value=\"{0}\" class=\"search-text\"><a class=\"si-btn search\"></a>", cellValue);
                else if (column.Selectable)
                    cellValue = string.Format("<input type=\"text\" value=\"{0}\" class=\"search-text\" disabled=\"disabled\"><a class=\"si-btn search\"></a>", cellValue);
                else if (column.IsEditable)
                    cellValue = string.Format("<input type=\"text\" value=\"{0}\" class=\"focus\">", cellValue);

                if (cellValue != null)
                {
                    RenderText(cellValue.ToString());
                }
            }
		}

        private void RenderCheckBox(GridColumn<T> column, T instance)
        {
            if (column == null || string.IsNullOrWhiteSpace(column.FieldName))
                throw new Exception("FieldName����Ϊ��.");

            Type type = instance.GetType();
            var cellValue = type.GetProperty(column.FieldName).GetValue(instance, null);
            string cellHtml = string.Format("<input type=\"checkbox\" value=\"{0}\">", cellValue);

            RenderText(cellHtml);
        }

        private string RenderRowNum()
        {
            if (DataSource == null)
                return _rowNum.ToString();

            return (_rowNum + (DataSource.PageNumber - 1) * DataSource.PageSize).ToString();
        }

		protected virtual bool RenderHeader()
		{
			//No items - do not render a header.
			//if(! ShouldRenderHeader()) return false;

			RenderHeadStart();

			foreach(var column in VisibleColumns())
			{

				//Allow for custom header overrides.
#pragma warning disable 612,618
				if(column.CustomHeaderRenderer != null)
				{
					column.CustomHeaderRenderer(new RenderingContext(Writer, Context, _engines));
				}
#pragma warning restore 612,618
				else
				{
					RenderHeaderCellStart(column);
                    RenderHeaderText(column);
					RenderHeaderCellEnd();
				}
			}

			RenderHeadEnd();

			return true;
		}

        protected virtual bool RenderFooter()
        {
            //No items - do not render a header.
            //if(! ShouldRenderHeader()) return false;

            RenderFootStart();

            foreach (var column in VisibleColumns())
            {
                RenderFooterCellStart(column);
                RenderFooterText(column);
                RenderFooterCellEnd();
            }

            RenderFootEnd();

            return true;
        }

        protected virtual void RenderHeaderText(GridColumn<T> column)
        {
			var customHeader = column.GetHeader();

			if (customHeader != null) 
			{
				RenderText(customHeader);
			}
			else 
			{

				RenderText(column.DisplayName);
			}
        }

        protected virtual void RenderFooterText(GridColumn<T> column)
        {
            var customFooter = column.GetFooter();

            if (customFooter != null)
            {
                RenderText(customFooter);
            }
            else
            {
                string value = string.Empty;
                if (!string.IsNullOrEmpty(column.Name) && (column.Name == "rowNum" || column.Name == "LineNum"))
                {
                    value = "�ϼ�";
                }
                else
                {
                    if (column.FieldName != null && DataSource != null && DataSource.DicSum != null & DataSource.DicSum.ContainsKey(column.FieldName))
                        value = DataSource.DicSum[column.FieldName].ToString();
                }                

                RenderText(value);
            }
        }

		protected virtual bool ShouldRenderHeader()
		{
			return !IsDataSourceEmpty();
		}

		protected bool IsDataSourceEmpty()
		{
			return DataSource == null || !DataSource.Any();
		}

		protected IEnumerable<GridColumn<T>> VisibleColumns()
		{
			return GridModel.Columns.Where(x => x.IsVisible);
		}

        protected int TotalWidth
        {
            get
            {
                return VisibleColumns().Where(c => c.IsHide != true).Sum(c => c.ColWidth) + VisibleColumns().Where(c => c.IsHide != true).Count() + 1;
            }
        }

		protected void BaseRenderRowStart(GridRowViewData<T> rowData)
		{
			bool rendered = GridModel.Sections.Row.StartSectionRenderer(rowData, new RenderingContext(Writer, Context, _engines));

			if(! rendered)
			{
				RenderRowStart(rowData);
			}
		}

		protected void BaseRenderRowEnd(GridRowViewData<T> rowData)
		{
			bool rendered = GridModel.Sections.Row.EndSectionRenderer(rowData, new RenderingContext(Writer, Context, _engines));

			if(! rendered)
			{
				RenderRowEnd();
			}
		}

		protected bool IsSortingEnabled
		{
			get { return GridModel.SortOptions != null; }
		}

		protected abstract void RenderHeaderCellEnd();
		protected abstract void RenderHeaderCellStart(GridColumn<T> column);
		protected abstract void RenderRowStart(GridRowViewData<T> rowData);
		protected abstract void RenderRowEnd();
		protected abstract void RenderEndCell();
		protected abstract void RenderStartCell(GridColumn<T> column, GridRowViewData<T> rowViewData);
		protected abstract void RenderHeadStart();
		protected abstract void RenderHeadEnd();
		protected abstract void RenderGridStart();
		protected abstract void RenderGridEnd(bool isEmpty);
		protected abstract void RenderEmpty();
        protected abstract void RenderAdditionalEmptyRows();
		protected abstract void RenderBodyStart();
		protected abstract void RenderBodyEnd();
        protected abstract void RenderFooterCellStart(GridColumn<T> column);
        protected abstract void RenderFooterCellEnd();
        protected abstract void RenderFootStart();
        protected abstract void RenderFootEnd();
	}
}
