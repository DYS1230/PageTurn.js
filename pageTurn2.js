(function ($) {
    $.fn.extendPagination = function (options,obj,targetHerf) {　//obj为所要替换的对象
        //　默认　总数量　展示页面　每个页面展示的数量 　返回的函数
        var defaults = {
            totalCount: 100,
            showPage: 7,
            limit: 5,
            callback: function () {
                return false;
            }
        };
        $.extend(defaults, options || {}); //倘若没有options，则采用默认，否则options覆盖defaults
        var targetId="#"+$(obj).attr("id");　//　采用load所需要得到的内容的id
        var totalCount = defaults.totalCount; 
        var showPage = defaults.showPage;
        var limit = defaults.limit; 
        var totalPage = Math.ceil(totalCount / limit); //页面总量
        if (totalPage > 0) {
            var html = [];  //要添加的html
            html.push(' <ul class="pagination">');  //　这里看bootstrap的分页，不解释
            html.push(' <li class="previous"><a href="#">&laquo;</a></li>');    //链接到上一页
            html.push('<li class="disabled hidden"><a href="#">...</a></li>');  //说明前面有页面

            //分两种情况，当总页面小于显示页面时，和当总页面大于显示页面时，具体区别在所要显示的页码i和j
            if (totalPage <= showPage) {
                for (var i = 1; i <= totalPage; i++) {
                    if (i == 1) html.push(' <li class="active"><a href="#">' + i + '</a></li>');    //第一个页码样式为active
                    else html.push(' <li><a href="#">' + i + '</a></li>');
                }
            } else {
                for (var j = 1; j <= showPage; j++) {
                    if (j == 1) html.push(' <li class="active"><a href="#">' + j + '</a></li>');
                    else html.push(' <li><a href="#">' + j + '</a></li>');
                }
            }
            html.push('<li class="disabled hidden"><a href="#">...</a></li>');  //说明后面有页面
            html.push('<li class="next"><a href="#">&raquo;</a></li></ul>');    //链接到下一页
            $(this).html(html.join(''));
            if (totalPage > showPage) $(this).find('ul.pagination li.next').prev().removeClass('hidden');　//当总页面数量大于显示页面数量时，后面的省略号可见

            var pageObj = $(this).find('ul.pagination');    //找到页码的ul
            var preObj = pageObj.find('li.previous');   //找到代表前一页的li
            var currentObj = pageObj.find('li').not('.previous,.disabled,.next'); //找到目前显示的页码对象
            var nextObj = pageObj.find('li.next');   //找到代表后一页的li

            function loopPageElement(minPage, maxPage) {
                var tempObj = preObj.next();
                for (var i = minPage; i <= maxPage; i++) {
                    if (minPage == 1 && (preObj.next().attr('class').indexOf('hidden')) < 0)
                        preObj.next().addClass('hidden');
                    else if (minPage > 1 && (preObj.next().attr('class').indexOf('hidden')) > 0)
                        preObj.next().removeClass('hidden');
                    if (maxPage == totalPage && (nextObj.prev().attr('class').indexOf('hidden')) < 0)
                        nextObj.prev().addClass('hidden');
                    else if (maxPage < totalPage && (nextObj.prev().attr('class').indexOf('hidden')) > 0)
                        nextObj.prev().removeClass('hidden');
                    var obj = tempObj.next().find('a');
                    if ( !isNaN(obj.html()) )
                        obj.html(i);
                    tempObj = tempObj.next();
                }
            }
            //回调函数
            function callBack(curr) {
                defaults.callback(curr, defaults.limit, totalCount);
            }
            //目前页码点击后的函数
            currentObj.click(function (event) {
                event.preventDefault();
                var currPage = Number($(this).find('a').html()); //找到所点击的页码
                var activeObj = pageObj.find('li[class="active"]');//目前的页码对象
                var activePage = Number(activeObj.find('a').html());//目前的页码

                if (currPage == activePage) return false;   //若点击的和目前的相同，无效果
                if (totalPage > showPage && currPage > 1) {
                    var maxPage = currPage; 
                    var minPage = 1;
                    if ( ($(this).prev().attr('class')) && ($(this).prev().attr('class').indexOf('disabled')) >= 0) {
                        minPage = currPage - 1;
                        maxPage = minPage + showPage - 1;
                        loopPageElement(minPage, maxPage);
                    } else if ( ($(this).next().attr('class')) && ($(this).next().attr('class').indexOf('disabled')) >= 0) {
                        if (totalPage - currPage >= 1) 
                            maxPage = currPage + 1;
                        else  
                            maxPage = totalPage;
                        if (maxPage - showPage > 0) minPage = (maxPage - showPage) + 1;
                        loopPageElement(minPage, maxPage)
                    }                  
                }
                activeObj.removeClass('active');    //替换active所在的位置
                $.each(currentObj, function (index, thiz) {
                    if ($(thiz).find('a').html() == currPage) {
                        $(thiz).addClass('active');
                        callBack(currPage);
                    }
                });

                $(obj).load(targetHerf + currPage + ' ' + targetId); //加载所要取得的东西

            });
            //和前边类似
            preObj.click(function (event) {
                event.preventDefault();
                var activeObj = pageObj.find('li[class="active"]');
                var activePage = Number(activeObj.find('a').html());
                if (activePage <= 1) return false;
                if (totalPage > showPage && currPage > 1) {
                    var maxPage = activePage; 
                    var minPage = 1;                  
                    if ((activeObj.prev().prev().attr('class')) && (activeObj.prev().prev().attr('class').indexOf('disabled')) >= 0) {
                        minPage = activePage - 1;
                        if (minPage > 1) minPage = minPage - 1;
                        maxPage = minPage + showPage - 1;
                        loopPageElement(minPage, maxPage);
                    }
                }
                $.each(currentObj, function (index, thiz) {
                    if ($(thiz).find('a').html() == (activePage - 1)) {
                        activeObj.removeClass('active');
                        $(thiz).addClass('active');
                        callBack(activePage - 1);
                    }
                });

                var targetPage = activePage-1;
                $(obj).load(targetHerf + targetPage + ' ' + targetId);

            });
            nextObj.click(function (event) {
                event.preventDefault();
                var activeObj = pageObj.find('li[class="active"]'), activePage = Number(activeObj.find('a').html());
                if (activePage >= totalPage) return false;
                if (totalPage > showPage) {
                    var maxPage = activePage, minPage = 1;                  
                    if ((activeObj.next().next().attr('class'))
                        && (activeObj.next().next().attr('class').indexOf('disabled')) >= 0) {
                        maxPage = activePage + 2;
                        if (maxPage > totalPage) maxPage = totalPage;
                        minPage = maxPage - showPage + 1;
                        loopPageElement(minPage, maxPage);
                    }
                }
                $.each(currentObj, function (index, thiz) {
                    if ($(thiz).find('a').html() == (activePage + 1)) {
                        activeObj.removeClass('active');
                        $(thiz).addClass('active');
                        callBack(activePage + 1);
                    }
                });

                var targetPage = activePage+1;
                $(obj).load(targetHerf + targetPage + ' ' + targetId);

            });
        }
    };
})(jQuery);