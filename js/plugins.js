// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
function changeShareUrl(shareUrl) {
    WeixinApi.ready(function (api) {
        var info = new WeixinShareInfo();
        info.title = "情有独“John”";
        info.desc = "他怀揣着梦想与热情，他憧憬着希望和未来，他是John！欢迎大家来到我的主页。";
        info.link = shareUrl; // info.imgUrl = "一张24*24图片";
        info.imgUrl = _web_site+"/img/wechat_icon.jpg";
        api.shareToFriend(info);
        api.shareToTimeline(info); } );
}
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

function GetLength(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};
//baidu share
//share
function loadShare(text,desc,url,bdPic){
    var shareJs=document.getElementById("bShareJs"),script;
    shareJs&&shareJs.parentNode.removeChild(shareJs);
    window._bd_share_main=undefined;
    window._bd_share_is_recently_loaded=false;
    window._bd_share_config = {
        common : {
            bdText : text,
            bdDesc : desc,
            bdUrl : url,
            bdPic : bdPic
        },
        share : [{
            "bdSize" : 32
        }]
    };
        script = (document.getElementsByTagName('head')[0] || document.body).appendChild(document.createElement('script'));
        script.id = "bShareJs";
        script.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)
    return script
}

// Place any jQuery/helper plugins in here.
