//////  myGrid (jqGrid)  //////  
(function ($, undefined) {
  $.fn.extend({
    myGrid: function (options, args) {
      // each instance of the component requires a unique instance of options
      var opts = $.extend({}, $.myGrid.defaults);
      if (options && typeof (options) == "object") {
        $.extend(opts, options);
      }

      return this.each(function () {
        var $this   = $(this),                      // this: element with data-role=grid
            jqGrid  = $this.data("jqGrid");         // object of type $.myGrid

        // init grid: options = custom properties for grid, args = undefined
        if (!jqGrid) {
          // init grid object
          jqGrid = new $.myGrid(this, opts);
          
          // store grid object in element
          $this.data("jqGrid", jqGrid);
        }

        // call public method of grid: options = method name, args = 1 param or 1 array of params
        if (typeof options == "string") {
          var method = jqGrid[options];
          if ($.isFunction(method)) {
            method.call(jqGrid, args);
          } 
          else {
            console.log("cannot find method \"" + options + "\" of myGrid");
          }
        }
      });
    }    
  });

  $.myGrid = function (elem, opts) {
    // 
    // Local variables
    //
    var $elem = $(elem),
        scope = $elem.closest("[data-view]");
    
    // 
    // Fields
    //
  	var alwaysCount = opts.alwaysCount == undefined ? false : opts.alwaysCount,
        controller = $elem.getController(),
        entityName = $elem.data("entity-name"),      // use for i18n
        lastsel,
        model = $elem.createModel(),
        needRowCount = false,
        rowCount = -1,
        tableId = $elem.attr("id"),
        url = $elem.data("url"),
        gridId;

    // Identify grid id according to the position in HTML
  	var positionIds = [];
  	$elem.parents("[id]").each(function () { positionIds.push($(this).attr("id")) });
  	gridId = positionIds.join(".").hashCode();


    var jqGridOptions = {
      datatype: "local", // disable auto-load 1st time
      colNames: [],
      colModel: [],
      multiselect: false,
      recordpos: "left",
      rowNum: 10,
      rowList: [40, 60, 80],
      url: url,
      height: '100%',
      viewrecords: true,
      footerrow: false,

      // Events
      gridComplete: function () {
        debugger;
        console.log($(this).prop('id') + 'Grid.gridComplete');
      	// enable auto-reload
				if(url == undefined)	{
					//	$elem.jqGrid('setGridParam', { datatype: opts.datatype });
	      }
	      else {
      		$elem.jqGrid("setGridParam", { datatype: "json" });
	      }

	      // check rowCount
        rowCount = $elem.jqGrid("getGridParam", "records");;        
        var $pagerLeft = $("#" + tableId + "-grid-pager_left", scope);
        // var $pager = $pagerLeft.closest("[data-role=pager]");
        var $jqgridView = $(".ui-jqgrid-view", scope);

        if (rowCount === 0) {
          // if empty data, change pager text color to red.
          $pagerLeft.addClass("pager-grid-empty");

          // set minHeight cua grid khi khong co' du lieu la 150px ~ 5row * 30px
          $jqgridView.css({ "margin-bottom": "150px" });
        }
        else {

          // rowCount > 0          
          $pagerLeft.removeClass("pager-grid-empty");

          if (rowCount <= 5) {
            // Tinh toan de giu minheight cua gird ~ 5row * 30px
            $jqgridView.css({ "margin-bottom": ((5 - rowCount) * 30) + "px" });
          }
          else {
            $jqgridView.css({ "margin-bottom": "0" });
          }
        }

        // invoke grid-complete function of controller if defined
        var fn = controller[$elem.data("grid-complete")];
        if ($.isFunction(fn)) {
          fn.apply(controller, arguments);
        }
        
        // set width cua jqGrid
        // TODO: hard code cho project BanHang
        //$elem.myGrid('setGridWidth', $(".search-content").width());

        // reset last selected row
        lastsel = null;
      },      

      onPaging: function () { // first,prev,next,last,records
        // do not count rows
        needRowCount = false;

        // luu rowNum vao cookie
        var rowNum = $elem.closest(".ui-jqgrid").find("select.ui-pg-selbox").val();
        $.cookie(gridId, rowNum);

        // invoke paging function of controller if defined
        var fn = controller[$elem.data("paging")];
        if ($.isFunction(fn)) {
          fn.apply(controller, arguments);
        }
      },

      onSelectRow: function (id) {
        if (id && id !== lastsel) {
          // goi ham restoreRow
          $elem.jqGrid("restoreRow", lastsel);
          if (lastsel) {
            var fn = controller[$elem.data("restorerow")];
            if ($.isFunction(fn)) {
              fn.call(controller, lastsel);
            }
          }

          $elem.jqGrid("editRow", id, {
            keys: true,
            oneditfunc: function () {
              var fn = controller[$elem.data("oneditfunc")];
              if ($.isFunction(fn)) {
                fn.apply(controller, arguments);
              }
            },
            successfunc: function (response) {
              var data = response.responseJSON;
              if (!data.status) {
                si.msgbox.showError(data.error);
              }
              lastsel = 0;

              // goi ham sau khi edit cell
              var fn = controller[$elem.data("successfunc")];
              if ($.isFunction(fn)) {
                fn.apply(controller, arguments);
              }

              return data.status;
            },
            aftersavefunc: function () {
              var fn = controller[$elem.data("aftersavefunc")];
              if ($.isFunction(fn)) {
                fn.apply(controller, arguments);
              }
            },
            afterrestorefunc: function () {
              var fn = controller[$elem.data("restorerow")];
              if ($.isFunction(fn)) {
                fn.apply(controller, arguments);
              }
              // reset last selected row
              lastsel = 0;
            },
            errorfunc: function () {
              debugger;
            },
            restoreAfterError: function () {
              debugger;
            },
          });
          //    $elem.jqGrid('editRow', id, true);
          lastsel = id;
        }
      },

      onSortCol: function (index, columnIndex, sortname) {
        // do not count rows
        needRowCount = false;
        
        // invoke sort function of controller if defined
        var fn = controller[$elem.data("sort")];
        if ($.isFunction(fn)) {
          fn.apply(controller, arguments);
        }
      } ,

      serializeGridData: function (data) {
         return data;
      }
    };
    $.extend(jqGridOptions, opts);


    //
    // Constructor
    //

    //
    // Public methods
    // Note: all these methods (except getGridContext) must be used with getGridContext 
    //
    this.action = function(args) {
      $elem.jqGrid(args);
    };

    this.addPostData = function(args) {
      var postData = $elem.jqGrid("getGridParam", "postData");
      var data = args;
      for (var p in data) {
        postData[p] = encodeURIComponent(data[p]);
      }
    };    

    this.clearGridData = function(args) {
      $elem.jqGrid("clearGridData", true).trigger("reloadGrid");
    };

    this.delRowData = function (rowId) {
      $elem.jqGrid("delRowData", rowId);
    };

    this.getGridContext = function (fn) {
      if ($.isFunction(fn)) {
        fn(this);
      } 
      else {
        console.log(fn + " is not of type function for myGrid getGridContext method ");
      }
    };

    this.getGridParam = function (name) {
      var param = $elem.jqGrid("getGridParam", name);

      return param;
    };

    this.setRowData = function(data) {
      $elem.jqGrid("setRowData", data.id, data);
    };

    this.getObjectData = function(values) { // map column name with value
      var object = {};
      $.each(jqGridOptions.colModel, function(index, value) {
        var name = value.name;
        object[name] = values[index];
      });

      return object;
    };

    this.getRowData = function (id) {
      var rowData;
      if (id != undefined) {
        rowData = $elem.jqGrid("getRowData", id);
      } 
      else {
        rowData = $elem.jqGrid("getRowData");
      }

      return rowData;           
    };

    this.getRandomId = function() {
      return $.jgrid.randId();
    };
    
    this.getSelectedRowIds = function() {
      var rowIds = $elem.jqGrid("getGridParam", "selarrrow");
            
      return rowIds;
    };

    this.reloadGrid = function(args) {
      if (alwaysCount == true) {
        var postData = $elem.jqGrid("getGridParam", "postData");
        postData.rowCount = -1;
      }

      args == undefined ? $elem.trigger("reloadGrid") : $elem.trigger("reloadGrid", args);
    };

    this.setGridParam = function(args) {
      $elem.jqGrid("setGridParam", args);
    };

    this.setSearchCriteria = function (criteria) {
      var postData = $elem.jqGrid("getGridParam", "postData");

      // check if need row count
      needRowCount = false;
      if (!criteria.equals(model)) {
        needRowCount = true;
        model = $.extend(model, criteria);
      }

      // update postData
      for (var p in model) {
        var value = model[p];
        if ($.isFunction(value)) {
          continue;
        }
        postData[p] = encodeURIComponent(value);
      }
      postData.rowCount = needRowCount ? -1 : rowCount;
    };

    this.setGridWidth = function(width) {
      $elem.jqGrid("setGridWidth", width);
    };

    this.setGridHeight = function(height) {
      $elem.jqGrid("setGridHeight", height);
    };

    this.addRowData = function (data) {
      $elem.jqGrid("addRowData", data.rowid, data.rdata, data.pos, data.src);
    };

    //
    // Initialization
    //

    // init column model for jqGrid
    var sorted = false,                 // jqGrid only supports sort on a single column
        unSortableColumns = [];         // store unsortable columns
    $elem.find("thead td").each(function (index) {
      var $col = $(this), 
          col = {
            align     : "left", 
            editable  : false, 
            formatter : "null_formatter", 
            hidden    : false, 
            sortable  : true,
            width     : 100            
          };

      // override default settings from data-attributes
      for (var prop in col) {
        if ($col.data(prop) != undefined) {
          col[prop] = $col.data(prop);
        }

        if ($col.attr("name") != undefined) {
          col.name = $col.attr("name");
        }

        if ($col.data("index") != undefined) {
          col.index = $col.data("index");
        } 
        else {
          col.index = col.name;
        }

        if (!sorted && $col.data("sort") != undefined) {
          sorted = true;
          var sortOrder = $col.data("sort") || "";
          jqGridOptions.sortname = col.name;
          jqGridOptions.sortorder = $.trim(sortOrder).length == 0 ? "asc" : sortOrder;
        }
      }

      if (col.editable) {
        if ($col.data("editrules") != undefined) {
          col.editrules = $col.data("editrules");
        }
      }

      if (col["sortable"] == false) {
        unSortableColumns.push(col.name);
      }

      // look up a cell formatter if exists
      if (typeof col.formatter == "string" && $.isFunction(window[col.formatter])) {
        //      col.formatter = formatters[col.formatter];
        col.formatter = window[col.formatter];
      }

      if (i18n[entityName][col.name.toLowerCase()] != undefined) {
        jqGridOptions.colNames.push(i18n[entityName][col.name.toLowerCase()]);
      } 
      else {
        jqGridOptions.colNames.push("?" + col.name + "?");
      }

      jqGridOptions.colModel.push(col);
    });

    if ($elem.data("multiselect") != undefined) {
    	jqGridOptions.multiselect = $elem.data("multiselect");
    }

    // init pager
    var pager = $elem.parent().find("[data-role=pager]").attr("id");
    if (pager != undefined) {
      jqGridOptions.pager = pager;      
    } 
    else {
      console.log("Pager not defined.");
    }

    // // set rowNum tu cookie (neu khong ton tai dung rowNum default)
    var rowNum = $.cookie("" + gridId);  // convert gridId to string de doc gia tri tu cookie
    jqGridOptions.rowNum = rowNum ? +rowNum : jqGridOptions.rowList[0];

    // init edit url
    var editUrl = $elem.data("editurl");
    if (editUrl != undefined) {
      jqGridOptions.editurl = editUrl;
    }

    // init jqGrid
    $elem.jqGrid(jqGridOptions);

    // style navigation buttons
    $(".ui-icon-seek-next", scope).append("<i class=\"ace-icon fa fa-angle-right bigger-140\"></i>");
    $(".ui-icon-seek-end", scope).append("<i class=\"ace-icon fa fa-angle-double-right bigger-140\"></i>");
    $(".ui-icon-seek-prev", scope).append("<i class='ace-icon fa fa-angle-left bigger-140'></i>");
    $(".ui-icon-seek-first", scope).append("<i class=\"ace-icon fa fa-angle-double-left bigger-140\"></i>");

    // hide sort indicator of unsortable Columns.
    var gridView = $("#gview_" + tableId, scope);
    $.each(unSortableColumns, function (index, value) {
      var colName = "#" + tableId + "_" + value,
      $header = gridView.find("thead > tr > th[role=columnheader]" + colName);
      $header.find(".ui-jqgrid-sortable").removeClass("ui-jqgrid-sortable").find(".s-ico").remove();
    });
  };

  $.myGrid.defaults = {};

})(jQuery);


//////  mySelect (select2)   //////
(function ($, undefined) {
  $.fn.extend({
    mySelect: function (options, args) {
      return this.each(function () {
        var $this = $(this),
            data = $this.data('mySelect');
        if (!data) {
          // each instance of the component requires an unique instance of options
          var opts = $.extend({}, $.mySelect.defaults);
          if (options && typeof (options) == 'object') {
            $.extend(opts, options);
          }
          $this.data('mySelect', (data = new $.mySelect(this, opts)));
        }

        if (typeof options == 'string') {
          var method = data[options];
          if ($.isFunction(method)) {
            method.call(data, args);
          }
          else {
            console.log('cannot find method "' + options + '" of myGrid');
          }
        }
      });
    }
  });

  $.mySelect = function (elem, opts) {
    var $this = $(elem),
        entityName = $this.data('entity-name'), isMultiSelect = $this.data('ismultiselect');
    var select2Options = {};
    if ($this.data('url') != undefined) {
      select2Options = {
        multiple: isMultiSelect,

        query: function (query) {
          var data = { results: [] };
          var param = { keyWord: query.term }
          var options = {
            url: $this.data('url'),
            data: param,
            showWait: false,
            callback: function (returnValue) {
              if (returnValue) {
                data.results = returnValue;
                query.callback(data);
                $this.select2('open');
              }
            }
          }
          if (query.term.length != 0)
            requestManager.doAjaxRequest(options);
        }
      };
    } else {
      select2Options = {
        escapeMarkup: function (m) { return m; },
        data: []
      };
    }

    if ($this.data('formatwithcombinegroup') == true) {
      select2Options.formatSelection = formatWithCombineGroup;
    }

    if ($this.data('setifnotexists') == true) {
      select2Options.createSearchChoice = function (term, data) {
        if ($(data).filter(function () {
          return this.text.localeCompare(term) === 0;
        }).length === 0) {
          return { id: term, text: term };
        }
      };
    }
    $.extend(select2Options, opts);


    //
    // Public Methods
    //

    this.getMySelectContext = function (fn) {
      if ($.isFunction(fn)) {
        fn(this);
      }
      else {
        console.log(fn + ' is not of type function for MySelect getMySelectContext method ');
      }
    }

    this.getValue = function () {
      return $this.select2("val");
    }

    this.setValue = function (val, addifNotExits) {
      if (addifNotExits) {
        var item = $.grep(select2Options.data, function (ele) {
          return ele.id == val;
        });

        if (item.length == 0) {
          select2Options.data.push({ id: val, text: val });
          $this.select2(select2Options);
        }
      }

      $this.select2('val', val);
    }

    this.setIsReadOnly = function (val) {
      $this.select2("readonly", val);
    }

    this.addItem = function (item) {
      temp = $this.select2('data');
      if (temp == undefined) {
        temp = [];
      }
      temp.push(item);
      $this.select2('data', temp);
    }

    this.setData = function (dataSource) {
      //    $this.select2({ data: dataSource });
      $this.select2('data', dataSource == undefined ? null : dataSource);
    }
    this.setDataSource = function (dataSource) {
      select2Options.data = dataSource;
      $this.select2(select2Options);
    }
    function formatWithCombineGroup(item) {
      var data = select2Options.data;
      var groupText = "";
      $.each(data, function (index, parrent) {
        $.each(parrent.children, function (childIndex, child) {
          if (child.id == item.id) {
            groupText = parrent.text;
          }
        });
      });
      return groupText + '-' + item.text;
    }
    $this.select2(select2Options);
  };

  $.mySelect.defaults = {};

})(jQuery);


