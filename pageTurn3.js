(function ($) {
	$.fn.extendPagination = function (options, targetHerf) {
		var showPage = options.showPage;	//展示的页码数量
		var totalPage = options.totalPage;	//总共的页面数量
		var pageNumber = options.pageNumber;	//当前的页码

		var interval = showPage / 2;	//即展示的页码数量的一半
		var intervalBegin = Math.ceil(pageNumber - interval);	//当页面处于中间时，页码显示的第一个数字
		var intervalEnd = Math.ceil(pageNumber + interval - 1);	//当页面处于中间时，页码显示的最后一个数字

		var middleCursor = Math.ceil(interval);	//游标：页码中间是第几个，比如展示５个页码，则中间是第三个

		var tailMiddleNumber = Math.ceil(totalPage - interval);	//页面处于尾部时，中间的页码

		var previousNumber = pageNumber - 1;	//点击前一页时，所要到达的页面
		var nextNumber = pageNumber + 1;	//点击后一页时，所要到达的页面
		if (pageNumber == 1) {
			previousNumber = 1;	//当前是第一页时，其为１
		}
		if (pageNumber == totalPage) {
			nextNumber = totalPage;	//当前是最后一页时，其为最后一页
		}

		/*
		分页分两大种情况，一为总页面数量少于展示数量，二为总页面数量大于展示数量

		第二种情况又分为三种情况，
		一为当前页面小于展示页面数量的一半；
		二为当前页面大于“页面处于尾部时，中间的页码”；
		三为当前页面处于中间，即非上述两种情况时。
		*/
		if (totalPage <= showPage) {
			addPagination(this, 1, totalPage);
		} else {
			if (pageNumber <= middleCursor) {
				addPagination(this, 1, showPage);
				$(this).find('ul.pagination li.next').next().removeClass('hidden');
				$(this).find('ul.pagination li.next').prev().removeClass('hidden');	//当目前的页码小于尾部中间页码时，后面的省略号可视
			}else if (pageNumber >= tailMiddleNumber) {
				addPagination(this, totalPage - showPage + 1, totalPage);
				$(this).find('ul.pagination li.previous').prev().removeClass('hidden');
				$(this).find('ul.pagination li.previous').next().removeClass('hidden');	//当目前的页码大于展示页面数量的一半时，前面的省略号可视
			} else {
				addPagination(this, intervalBegin, intervalEnd);
				$(this).find('ul.pagination li.previous').prev().removeClass('hidden');
				$(this).find('ul.pagination li.previous').next().removeClass('hidden');	//当目前的页码大于展示页面数量的一半时，前面的省略号可视
				$(this).find('ul.pagination li.next').next().removeClass('hidden');
				$(this).find('ul.pagination li.next').prev().removeClass('hidden');	//当目前的页码小于尾部中间页码时，后面的省略号可视
			}
		}
		//跳转到指定页面
		var appointObj = $(this).find('#appoint');
		var appointInput = $(this).find('input');
		appointObj.click(function () {
			var appointNumber = appointInput.val();
			if (appointNumber <= totalPage && appointNumber > 0 && appointNumber != pageNumber) {
				window.location.href = targetHerf + appointNumber;
			} else {
				return false;
			}
		});
		//增加跳页功能
		function addPagination(targetObj, beginNumber,endNumber) {
			var html = [];	//要添加的html
			html.push('<ul class="pagination form-inline">');	//这里看bootstrap的分页，不解释
			html.push('<li class="hidden"><a href="' + targetHerf + 1 + '">First</a></li>');
			html.push('<li class="previous"><a href="' + targetHerf + previousNumber + '">&laquo;</a></li>');	//链接到上一页
			html.push('<li class="disabled hidden"><a href="#">...</a></li>');	//说明前面有页面
			for (var i = beginNumber; i <= endNumber; i++) {
				if (i == pageNumber) {
					html.push('<li class="active"><a href="' + targetHerf + i+'">' + i +'</a></li>');	//要是页码对应目前页面时，添加active样式
				} else {
					html.push(' <li><a href="' + targetHerf + i +'">' + i + '</a></li>');	//链接到对应的页面
				}
			}
			html.push('<li class="disabled hidden"><a href="#">...</a></li>');	//说明后面有页面
			html.push('<li class="next"><a href="' + targetHerf + nextNumber +'">&raquo;</a></li>');	//链接到下一页
			html.push('<li class="hidden"><a href="' + targetHerf + totalPage + '">Last</a></li>');
			html.push('<input type="text" class="form-control" style="display:inline-block;padding:5px;height:34px;width:40px;margin-left:10px;">');
			html.push('<a class="btn btn-default" id="appoint" style="height:34px;width:40px;padding:6px;" href="#">GO</a>');
			html.push('<span style="color:grey;margin-left:5px;">' + pageNumber + '/' + totalPage + '<span>');
			html.push('</ul>');
			$(targetObj).html(html.join(''));	//把html添加到页面中
		}
	};

})(jQuery);