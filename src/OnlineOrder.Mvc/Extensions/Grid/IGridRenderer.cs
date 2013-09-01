using System.Collections.Generic;
using System.IO;
using System.Web.Mvc;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Mvc.Grid
{
    /// <summary>
    /// A renderer responsible for rendering a grid.
    /// </summary>
	public interface IGridRenderer<T> where T:class 
	{
		/// <summary>
		/// Renders a grid
		/// </summary>
		/// <param name="gridModel">The grid model to render</param>
		/// <param name="dataSource">Data source for the grid</param>
		/// <param name="output">The TextWriter to which the grid should be rendered/</param>
		/// <param name="viewContext">View context</param>
        void Render(IGridModel<T> gridModel, IPagination<T> dataSource, TextWriter output, ViewContext viewContext);
	}
}