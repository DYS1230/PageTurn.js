(function ($) {
	$.fn.extendPagination = function (options, obj, targetHerf) {　//obj为所要替换的对象
		var defaults = {
			totalPage: 100,	//总共的页面数量
			showPage: 7,	//展示的页码数量
			pageNumber: 1,	//当前的页码
		//	callback: function () {
		//		return false;
		//	}
		};
		$.extend(defaults, options || {});	//倘若没有options，则采用默认，否则options覆盖defaults
		var targetId = '#' + $(obj).attr('id');	//采用load所需要得到的内容的id

		var showPage = defaults.showPage;
		var totalPage = defaults.totalPage;
		var pageNumber = options.pageNumber;

		var html = [];
		html.push('<ul class="pagination form-inline">');
		html.push('<li class="hidden first"><a href="">First</a></li>');
		html.push('<li class="previous"><a href="">&laquo;</a></li>');
		html.push('<li class="disabled hidden"><a href="">...</a></li>');

		//分两种情况，当总页面小于显示页面时，和当总页面大于显示页面时，具体区别在所要显示的页码i和j
		if (totalPage <= showPage) {
			for (var i = 1; i <= totalPage; i++) {
				html.push('<li class="pageNum"><a href="">' + i + '</a></li>');
			}
		} else {
			for (var j = 1; j <= showPage; j++) {
				html.push('<li class="pageNum"><a href="">' + j + '</a></li>');
			}
		}
		html.push('<li class="disabled hidden"><a href="">...</a></li>');
		html.push('<li class="next"><a href="">&raquo;</a></li>');
		html.push('<li class="hidden last"><a href="">Last</a></li>');
		html.push('<input type="text" class="form-control" style="display:inline-block;padding:5px;height:34px;width:40px;margin-left:10px;">');
		html.push('<a class="btn btn-default" id="appoint" style="height:34px;width:40px;padding:6px;" href="">GO</a>');
		html.push('<span style="color:grey;margin-left:5px;">' + pageNumber + '/' + totalPage + '<span>');
		html.push('</ul>');
		$(this).html(html.join(''));

		var pageObj = $(this).find('.pagination');	//找到页码的ul
		var preObj = pageObj.find('.previous');	//找到代表前一页的li
		var currentObj = pageObj.find('.pageNum');	//找到目前显示的页码对象
	//	var aCurrentObj = Array.from(currentObj);	//把currentObj转化成数组
		var nextObj = pageObj.find('.next');	//找到代表后一页的li

		var firstObj = pageObj.find('.first');
		var lastObj = pageObj.find('.last');

		var appointObj = pageObj.find('#appoint');
		var appointInput = pageObj.find('input');
		var paginationObj = pageObj.find('span');

		var headMiddleNumber = Math.ceil(showPage / 2);
		var tailMiddleNumber = Math.ceil(totalPage - showPage / 2);

		changePageElement();	//改变class与页码

		appointObj.click(function () {
			event.preventDefault();
			var appointNumber = appointInput.val();
			if (appointNumber > totalPage || appointNumber < 0 || appointNumber == pageNumber) return false;
			pageNumber = appointNumber;
			changePageElement();
			changeUrl();
		});

		currentObj.click(function (event) {
			event.preventDefault();
			var currentNumber = Number($(this).find('a').html());	//找到所点击的页码
			if (currentNumber == pageNumber) return false;	//若点击的和目前的相同，无效果
			pageNumber = currentNumber;
			changePageElement();
			changeUrl();
		});

		preObj.click(function (event) {
			event.preventDefault();
			var currentNumber = pageNumber - 1;
			if (currentNumber < 1) return false;
			pageNumber = currentNumber;
			changePageElement();
			changeUrl();
		});

		nextObj.click(function (event) {
			event.preventDefault();
			var currentNumber = pageNumber + 1;
			if (currentNumber > totalPage) return false;
			pageNumber = currentNumber;
			changePageElement();
			changeUrl();
		});

		firstObj.click(function (event) {
			event.preventDefault();
			pageNumber = 1;
			changePageElement();
			changeUrl();
		});

		lastObj.click(function (event) {
			event.preventDefault();
			pageNumber = totalPage;
			changePageElement();
			changeUrl();
		});

		/*
			分页分两大种情况，一为总页面数量少于展示数量，二为总页面数量大于展示数量
			第二种情况又分为三种情况，
			一为当前页面小于展示页面数量的一半；
			二为当前页面大于“页面处于尾部时，中间的页码”；
			三为当前页面处于中间，即非上述两种情况时。
		*/
		function changePageElement() {
			appointInput.val('');	//清除输入值
			paginationObj.html(pageNumber + '/' + totalPage); //页码改变
			var start;
			if (totalPage <= showPage) {
				start = 1;
			} else {
				if (pageNumber <= headMiddleNumber) {
					start = 1;
					preObj.prev().addClass('hidden');
					preObj.next().addClass('hidden');
					nextObj.next().removeClass('hidden');
					nextObj.prev().removeClass('hidden');
				}else if (pageNumber >= tailMiddleNumber) {
					start = totalPage - showPage + 1;
					preObj.prev().removeClass('hidden');
					preObj.next().removeClass('hidden');
					nextObj.next().addClass('hidden');
					nextObj.prev().addClass('hidden');
				} else {
					start = Math.ceil(pageNumber - showPage / 2);
					preObj.prev().removeClass('hidden');
					preObj.next().removeClass('hidden');
					nextObj.next().removeClass('hidden');
					nextObj.prev().removeClass('hidden');
				}
			}
			currentObj.each(function (index, item) {	//改变active和页码
				var targetObj = $(item);
				$(item).children().eq(0).html(start);
				targetObj.removeClass('active');
				if (start == pageNumber) {
					targetObj.addClass('active');
				}
				start += 1;
			});
		}

		function changeUrl() {
			$(obj).load(targetHerf + pageNumber + ' ' + targetId);	//加载所要取得的东西
			var x = location.pathname.lastIndexOf('/') + 1;
			var href = location.pathname.slice(0, x);
			history.pushState({number: pageNumber}, '', href + pageNumber);	//改变地址栏
		}

		//浏览器点击后退前进时触发
		$(window).on("popstate", function(event) {
			pageNumber = location.pathname.split('/').pop();
			$(obj).load(targetHerf + pageNumber + ' ' + targetId);
			changePageElement();
		});
	};
})(jQuery);