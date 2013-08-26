using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using OnlineOrder.Mvc.Pagination;

namespace OnlineOrder.Mvc.Grid
{
	/// <summary>
	/// Column for the grid
	/// </summary>
	public class GridColumn<T> : IGridColumn<T> where T : class
	{
		private string _name;
        private string _fieldName = string.Empty;
        private int _width = 100;      
		private string _displayName;
        private Alignment _align = Alignment.Left;
		private bool _doNotSplit;
        private readonly Func<T, object> _columnValueFunc;
		private readonly Type _dataType;
		private Func<T, bool> _cellCondition = x => true;
		private string _format;
		private bool _visible = true;
		private bool _htmlEncode = true;
		private readonly IDictionary<string, object> _headerAttributes = new Dictionary<string, object>();
        private readonly IDictionary<string, object> _footerAttributes = new Dictionary<string, object>();        
		private List<Func<GridRowViewData<T>, IDictionary<string, object>>> _attributes = new List<Func<GridRowViewData<T>, IDictionary<string, object>>>();
        private bool _sortable = true;
        private bool _queryable = true;
        private bool _editable = false;
        private bool _reliable = false;
        private bool _selectable = false;
        private bool _isSum = false;
        private bool _isHide = false;
        private string _equalTo = string.Empty;
		private string _sortColumnName = null;
		private SortDirection? _initialDirection; 
		private int? _position;
		private Func<object, object> _headerRenderer = x => null;
        private Func<object, object> _footerRenderer = x => null;

		/// <summary>
		/// Creates a new instance of the GridColumn class
		/// </summary>
		public GridColumn(Func<T, object> columnValueFunc, string name, Type type)
		{
			_name = name;
			_displayName = name;
			_dataType = type;
			_columnValueFunc = columnValueFunc;
		}

        /// <summary>
        /// Sortable
        /// </summary>
		public bool Sortable
		{
			get { return _sortable; }
		}

        /// <summary>
        /// Reliable
        /// </summary>
        public bool Reliable
        {
            get { return _reliable; }
        }

        /// <summary>
        /// IsHide
        /// </summary>
        public bool IsHide
        {
            get { return _isHide; }
        }

        /// <summary>
        /// IsSum
        /// </summary>
        public bool IsSum
        {
            get { return _isSum; }
        }

        /// <summary>
        /// Queryable
        /// </summary>
        public bool Queryable
        {
            get { return _queryable; }
        }

        /// <summary>
        /// Selectable
        /// </summary>
        public bool Selectable
        {
            get { return _selectable; }
        }

        /// <summary>
        /// Editable
        /// </summary>
        public bool Editable
        {
            get { return _editable; }
        }

        /// <summary>
        /// Visible
        /// </summary>
		public bool Visible
		{
			get { return _visible; }
		}

        /// <summary>
        /// EqualTo
        /// </summary>
        public string EqualTo
        {
            get { return _equalTo; }
        }

        /// <summary>
        /// SortColumnName
        /// </summary>
		public string SortColumnName
		{
			get { return _sortColumnName; }
		}

		public SortDirection? InitialDirection
		{
			get { return _initialDirection; }
		}

		/// <summary>
		/// Name of the column
		/// </summary>
		public string Name
		{
			get { return _name; }
		}

        /// <summary>
        /// FieldName
        /// </summary>
        public string FieldName
        {
            get {

                return string.IsNullOrEmpty(_fieldName) ? Name : _fieldName; 
            }
            set { 
                _fieldName = value; 
            }
        }

        /// <summary>
        /// width of the column
        /// </summary>
        public int ColWidth
        {
            get { return _width; }
        }


        /// <summary>
        /// Alignment of the column
        /// </summary>
        public Alignment Alignment
        {
            get { return _align; }
        }
       

		/// <summary>
		/// Display name for the column
		/// </summary>
		public string DisplayName
		{
			get
			{
				if(_doNotSplit)
				{
					return _displayName;
				}
				return SplitPascalCase(_displayName);
			}
		}

		/// <summary>
		/// The type of the object being rendered for thsi column. 
		/// Note: this will return null if the type cannot be inferred.
		/// </summary>
        public Type ColumnType
        {
            get { return _dataType; }
        }

		public int? Position
		{
			get { return _position; }
		}

        IGridColumn<T> IGridColumn<T>.Attributes(Func<GridRowViewData<T>, IDictionary<string, object>> attributes)
		{
			_attributes.Add(attributes);
			return this;
		}

		IGridColumn<T> IGridColumn<T>.Sortable(bool isColumnSortable)
		{
			_sortable = isColumnSortable;
			return this;
		}

        /// <summary>
        /// Queryable
        /// </summary>
        /// <param name="isColumnQueryable"></param>
        /// <returns></returns>
        IGridColumn<T> IGridColumn<T>.Queryable(bool isColumnQueryable)
        {
            _queryable = isColumnQueryable;
            return this;
        }

        /// <summary>
        /// Selectable
        /// </summary>
        /// <param name="isSelectable"></param>
        /// <returns></returns>
        IGridColumn<T> IGridColumn<T>.Selectable(bool isSelectable)
        {
            _selectable = isSelectable;
            return this;
        }

        /// <summary>
        /// EqualTo
        /// </summary>
        /// <param name="equalTo"></param>
        /// <returns></returns>
        IGridColumn<T> IGridColumn<T>.EqualTo(string equalTo)
        {
            _equalTo = equalTo;
            return this;
        }

        /// <summary>
        /// Editable
        /// </summary>
        /// <param name="isEditable"></param>
        /// <returns></returns>
        IGridColumn<T> IGridColumn<T>.Editable(bool isEditable)
        {
            _editable = isEditable;
            return this;
        }
       
        IGridColumn<T> IGridColumn<T>.Reliable(bool isReliable)
        {
            _reliable = isReliable;
            return this;
        }

        IGridColumn<T> IGridColumn<T>.IsSum(bool isSum)
        {
            _isSum = isSum;
            return this;
        }

		IGridColumn<T> IGridColumn<T>.SortColumnName(string name)
		{
			_sortColumnName = name;
			return this;
		}

		IGridColumn<T> IGridColumn<T>.SortInitialDirection(SortDirection initialDirection)
		{
			_initialDirection = initialDirection;
			return this;
		}

		/// <summary>
		/// Custom header renderer
		/// </summary>
		[Obsolete("CustomHeaderRenderer has been deprecated. Please use Header instead.")]
		public Action<RenderingContext> CustomHeaderRenderer { get; set; }

		/// <summary>
		/// Custom item renderer
		/// </summary>
		[Obsolete("CustomItemRenderer has been deprecated. Please use a custom column instead.")]
		public Action<RenderingContext, T> CustomItemRenderer { get; set; }

		IGridColumn<T> IGridColumn<T>.InsertAt(int index)
		{
			_position = index;
			return this;
		}

		/// <summary>
		/// Additional attributes for the column header
		/// </summary>
		public IDictionary<string, object> HeaderAttributes
		{
			get { return _headerAttributes; }
		}

        /// <summary>
        /// Additional attributes for the column Footer
        /// </summary>
        public IDictionary<string, object> FooterAttributes
        {
            get { return _footerAttributes; }
        }

		/// <summary>
		/// Additional attributes for the cell
		/// </summary>
		public Func<GridRowViewData<T>, IDictionary<string, object>> Attributes
		{
			get { return GetAttributesFromRow; }
		}

		private IDictionary<string, object> GetAttributesFromRow(GridRowViewData<T> row)
		{
			var dictionary = new Dictionary<string, object>();
			var pairs = _attributes.SelectMany(attributeFunc => attributeFunc(row));

			foreach(var pair in pairs)
			{
				dictionary[pair.Key] = pair.Value;
			}

			return dictionary;
		}

		public IGridColumn<T> Named(string name)
		{
			_displayName = name;
			_doNotSplit = true;
			return this;
		}

        public IGridColumn<T> Width(int w)
        {
            _width = w;
            //this.HeaderAttributes<T>(width => w);
            //this.Attributes<T>(width => w);
            return this;
        }

        /// <summary>
        /// Alignment -- add by zhangh 2013/06/17
        /// </summary>
        /// <param name="alignment"></param>
        /// <returns></returns>
        public IGridColumn<T> Align(Alignment alignment)
        {
            _align = alignment;
            return this;
        }

		public IGridColumn<T> DoNotSplit()
		{
			_doNotSplit = true;
			return this;
		}

        public IGridColumn<T> Hide(bool isHide)
        {
            _isHide = isHide;
            if (isHide)
            {
                this.HeaderAttributes<T>(style => "display:none");
                this.Attributes<T>(style => "display:none");
                this.FooterAttributes<T>(style => "display:none");
                this._sortable = false;
            }
            return this;
        }

        public IGridColumn<T> IsRowNumberColumn(bool isRowNumCol)
        {
            if (isRowNumCol)
            {
                this._name = "rowNum";
                this._displayName = "ÐÐºÅ";
                this._sortable = false;
            }
            return this;
        }

		public IGridColumn<T> Format(string format)
		{
			_format = format;
			return this;
		}

		public IGridColumn<T> CellCondition(Func<T, bool> func)
		{
			_cellCondition = func;
			return this;
		}

		IGridColumn<T> IGridColumn<T>.Visible(bool isVisible)
		{
			_visible = isVisible;
			return this;
		}

		public IGridColumn<T> Header(Func<object, object> headerRenderer)
		{
			_headerRenderer = headerRenderer;
			return this;
		}

		public IGridColumn<T> Encode(bool shouldEncode)
		{
			_htmlEncode = shouldEncode;
			return this;
		}

		//TODO: Jeremy to remove after next release
		[Obsolete("Use Encode(false) instead.")] 
		public IGridColumn<T> DoNotEncode()
		{
			return Encode(false);
		}

		IGridColumn<T> IGridColumn<T>.HeaderAttributes(IDictionary<string, object> attributes)
		{
			foreach(var attribute in attributes)
			{
				_headerAttributes.Add(attribute);
			}

			return this;
		}

        IGridColumn<T> IGridColumn<T>.FooterAttributes(IDictionary<string, object> attributes)
        {
            foreach (var attribute in attributes)
            {
                _footerAttributes.Add(attribute);
            }

            return this;
        }

		private string SplitPascalCase(string input)
		{
			if(string.IsNullOrEmpty(input))
			{
				return input;
			}
			return Regex.Replace(input, "([A-Z])", " $1", RegexOptions.Compiled).Trim();
		}

		/// <summary>
		/// Gets the value for a particular cell in this column
		/// </summary>
		/// <param name="instance">Instance from which the value should be obtained</param>
		/// <returns>Item to be rendered</returns>
		public object GetValue(T instance)
		{
            try
            {
                if (!_cellCondition(instance))
                {
                    return null;
                }

                var value = _columnValueFunc(instance);

                if (!string.IsNullOrEmpty(_format))
                {
                    value = string.Format(_format, value);
                }

                if (_htmlEncode && value != null && !(value is IHtmlString))
                {
                    value = HttpUtility.HtmlEncode(value.ToString());
                }

                return value;
            }
            catch { //add by zhangh 2013/06/18 
                return string.Empty;
            }
		}

		public string GetHeader()
		{
			var header = _headerRenderer(null);
			return header == null ? null : header.ToString();
		}

        public string GetFooter()
        {
            var footer = _footerRenderer(null);
            return footer == null ? null : footer.ToString();
        }
	}
}