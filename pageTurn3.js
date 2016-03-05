(function ($) {
    $.fn.extendPagination = function (options,targetHerf) {

        var showPage = options.showPage; 　//展示的页码数量
        var totalPage = options.totalPage;	   //总共的页面数量
        var pageNumber = options.pageNumber; 	//当前的页码

        var interval = showPage/2;   //即展示的页码数量的一半
        var intervalBegin = Math.ceil(pageNumber - interval);		//当页面处于中间时，页码显示的第一个数字
        var intervalEnd = Math.ceil(pageNumber + interval - 1);	//当页面处于中间时，页码显示的最后一个数字

        var middleCursor = Math.floor(interval + 1);	//游标：页码中间是第几个，比如展示５个页码，只则中间是第三个

        var  tailMiddleNumber = Math.ceil(totalPage - interval );	//页面处于尾部时，中间的页码

        var previousNumber = pageNumber -1 ;	//点击前一页时，所要到达的页面
        var nextNumber = pageNumber + 1;		//点击后一页时，所要到达的页面
        if(pageNumber == 1){	
            previousNumber = 1;	//当前是第一页时，其为１
        }
        if(pageNumber == totalPage){
            nextNumber = totalPage;	//当前是最后一页时，其为最后一页
        }

        /*
	分页分两大种情况，一为总页面数量少于展示数量，二为总页面数量大于展示数量

	第二种情况又分为三种情况，
		一为当前页面小于展示页面数量的一半；
		二为当前页面大于“页面处于尾部时，中间的页码”；
		三为当前页面处于中间，即非上述两种情况时。
        */
        if(totalPage <= showPage){
            addPagination(1,showPage);	
        }else{
            if (pageNumber <= middleCursor) {
                addPagination(1,showPage);
            }else if (pageNumber >= tailMiddleNumber){
                addPagination(totalPage-showPage+1,totalPage);
            } else {
                addPagination(intervalBegin,intervalEnd)
            }
            if(pageNumber>middleCursor){
                $(this).find('ul.pagination li.previous').next().removeClass('hidden');	//当目前的页码大于展示页面数量的一半时，前面的省略号可视
            }
            if(pageNumber<tailMiddleNumber){
                $(this).find('ul.pagination li.next').prev().removeClass('hidden');		//当目前的页码小于尾部中间页码时，后面的省略号可视
            }
        }
        //　增加　跳页功能
        function addPagination(beginNumber,endNumber){
            var html = [];	//要添加的html
            html.push(' <ul class="pagination">');	//　这里看bootstrap的分页，不解释
            html.push(' <li class="previous"><a href="' + targetHerf + previousNumber +'">&laquo;</a></li>'); //链接到上一页
            html.push('<li class="disabled hidden"><a href="#">...</a></li>');　//　说明前面有页面
            for (var i = beginNumber; i <= endNumber; i++) {
                if( i== pageNumber){
                    html.push(' <li class="active"><a href="' + targetHerf + i+'">' + i +'</a></li>');              //要是页码对应目前页面时，添加active样式
                }else{
                    html.push(' <li><a href="' + targetHerf + i +'">' + i + '</a></li>'); //链接到对应的页面
                }
            }
            html.push('<li class="disabled hidden"><a href="#">...</a></li>');  //　说明后面有页面
            html.push(' <li class="next"><a href="' + targetHerf + nextNumber +'">&raquo;</a></li>'); //链接到下一页

            $(this).html(html.join(''));            //把html添加到页面中
        }
    };

})(jQuery);