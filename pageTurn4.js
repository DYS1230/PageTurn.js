(function ($) {
    $.fn.extendPagination = function (options,targetHerf) {

        var showPage = options.showPage; 
        var totalPage = options.totalPage;
        var pageNumber = options.pageNumber;

        var interval = showPage/2; 
        var intervalBegin = Math.ceil(pageNumber - interval);
        var intervalEnd = Math.ceil(pageNumber + interval - 1);

        var middleCursor = Math.floor(interval + 1);

        var  tailMiddleNumber = Math.ceil(totalPage - interval );

        var previousNumber = pageNumber -1 ;
        var nextNumber = pageNumber + 1;
        if(pageNumber == 1){
            previousNumber = 1;
        }
        if(pageNumber == totalPage){
            nextNumber = totalPage;
        }
        function pushPagination(targetObj,beginNumber,endNumber){
            var html = [];
            html.push(' <ul class="pagination">');
            html.push(' <li class="previous"><a href="' + targetHerf + previousNumber +'">&laquo;</a></li>');
            html.push('<li class="disabled hidden"><a href="#">...</a></li>');
            for (var i = beginNumber; i <= endNumber; i++) {
                if( i== pageNumber){
                    html.push(' <li class="active"><a href="' + targetHerf + i+'">' + i +'</a></li>');              
                }else{
                    html.push(' <li><a href="' + targetHerf + i +'">' + i + '</a></li>');
                }
            }
            html.push('<li class="disabled hidden"><a href="#">...</a></li>');
            html.push(' <li class="next"><a href="' + targetHerf + nextNumber +'">&raquo;</a></li>');
            $(targetObj).html(html.join(''));
        }

        if(totalPage <= showPage){

            pushPagination(this,1,totalPage);
        
        }else{

            if (pageNumber <= middleCursor) {

                pushPagination(this,1,showPage);

            }else if (pageNumber >= tailMiddleNumber){

                pushPagination(this,totalPage-showPage+1,totalPage)

            } else {

                pushPagination(this,intervalBegin,intervalEnd);

            }


            if(pageNumber>middleCursor){
                $(this).find('ul.pagination li.previous').next().removeClass('hidden');
            }
            if(pageNumber<tailMiddleNumber){
                $(this).find('ul.pagination li.next').prev().removeClass('hidden');
            }
        }
    };
})(jQuery);