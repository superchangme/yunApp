
jQuery(function($){
        var app=g={
                changeHash:false,
                currentPage:null,
                current:1,
                saveUrl:"http://localhost/temp/yunApp/index.php/index/upload",
                shareUrl:"http://localhost/temp/yunApp/index.php/index/shareCounting"
            },hashMap={"#page_1":".page_1","#page_2":".page_2","#page_3":"page_3","#page_4":".page_4","#page_5":".page_5"},
            $pages=$(".main .page"),
            isAnimate=false,
            $current=$pages.filter(".current"),
            effect="cubic-bezier(0.42,0,0.58,1)",waitLoad=$("#waitLoad"),
            sharePhoto=$(".photo-box img"),
            canvasContainer=$("#canvasContainer"),
            canvasCtx=$("#canvasContainer")[0].getContext("2d"),
            deviceRatio= 2,
            $stepsBox=$(".photo-step[data-step]"),
            errorLogs=[],
            $shareMask=$("#shareMask"),
            $shareClose=$shareMask.find(".close"),
            myVow=$("#myVow"),
            $moreTip=waitLoad.find(".more"),
            $inputLabel=$("#inputLabel"),
            IS_SAVE=false,
            PHOTO_PATH,
    saveAndShare=$("#saveAndShare"),
            LOCK_PHOTO=false,
            FROM_ID,
            SHARE_COUNT,
            SHARE_ID;

        var posX=0, posY=0,
            lastPosX=0, lastPosY=0,
            bufferX=0, bufferY=0,
            scale=1, last_scale=1 ,rotation= 1, last_rotation, dragReady=0;

        var hammertime = Hammer(canvasContainer[0], {
            transform_always_block: true,
            transform_min_scale: 1,
            drag_block_horizontal: true,
            drag_block_vertical: true,
            drag_min_distance: 0
        });
//test
    if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
        Hammer.plugins.showTouches();
    }

    if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
        Hammer.plugins.fakeMultitouch();
    }
        hammertime.on('touch drag dragend transform', function(ev) {
            if(!LOCK_PHOTO){
                manageMultitouch(ev);
            }
        });

        function manageMultitouch(ev){
            console.log(ev.type)
            switch(ev.type) {
                case 'touch':
                    last_scale = scale;
                    last_rotation = rotation;
                    break;

                case 'drag':
                    posX = ev.gesture.deltaX + lastPosX;
                    posY = ev.gesture.deltaY + lastPosY;
                   canvasContainer
                        .animateLayer('photo', {
                            x: posX, y: posY
                        }, 0);
                    break;

                case 'transform':
/*
                    rotation = last_rotation + ev.gesture.rotation;
*/
                    scale = Math.max(0, Math.min(last_scale * ev.gesture.scale, 10));
                    canvasContainer
                        .animateLayer('photo', {
/*
                            rotate: rotation,
*/
                            scale:scale
                        }, 0);
                    break;

                case 'dragend':
                    lastPosX = posX;
                    lastPosY = posY;
                    break;
            }
        }

        function recordState(hash,flag){
            var pageSelector=hashMap[window.location.hash];
            g.changeHash=true;
            g.current=pageSelector&&pageSelector.slice(-1)||1;
            setTimeout(function(){
                g.changeHash = false;
            },100);
            window.location.href=window.location.href.split("#")[0]+"#"+hash;
            return true;
        };

        window.addEventListener("popstate",function(e){
            loadPage();
        });
        function loadPage(){
            var pageSelector=hashMap[window.location.hash];
            if( g.changeHash==false&&pageSelector  ){
                var pageEl=$(pageSelector+".page"),page=parseInt(pageSelector.slice(-1)),clas;
                if(pageEl.length){
                    if(page> g.current){
                        clas="up";
                    }else{
                        clas="down";
                    }
                    pageAnimate(pageEl,clas);
                }
            }else if(!(g.current==1&&(!pageSelector||pageSelector==".page_1"))){
                pageAnimate($pages.eq(0),"down");
            }
        }
        loadPage();
        document.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false);
        Zepto(document).swipeUp(function(){
                pageAnimate($current.next(".page"),"up");
            });
        Zepto(document).swipeDown(function(){
                pageAnimate($current.prev(".page"),"down");
            });
        function pageAnimate(next,clas){
            if(isAnimate){
                return;
            }
            next.length&&(isAnimate=true)&&recordState(next.data("hash"))&&Zepto(next).addClass("active "+clas).animate({translate3d:"0,0,0"},618,effect,function(){
                $current.removeClass("current");
                $current=$(this).addClass("current").removeClass("active "+clas).attr("style","");
                isAnimate=false;
            })
        }

//            $('.page_2').addClass("current");
        //声音播放
        $("#musicBtn").on("switch",function(){
            if($(this).hasClass("volumeOff"))
            {
                document.getElementById("bgAudio").pause();
                $(this).removeClass("volumeOff").addClass("volumeOn");

            }else
            {
                document.getElementById("bgAudio").play();
                $(this).removeClass("volumeOn").addClass("volumeOff");
            }
        }).on("click",function(){
            $(this).trigger("switch")
        })
        window.onload=function(){
            $('.page_loading').animate({opacity:0},600,"linear",function(){
                $('.page_loading').remove();
            });
        };
        //相册搞起
        var myWidth=285;
        var myHeight=320;

        $(document).ready(function(){
            canvasContainer.attr({width:myWidth,height:myHeight});
            canvasContainer.detectPixelRatio(function(ratio){
                deviceRatio=ratio>2?ratio:2;
            });
        });
        //加载照片
        function init(src)
        {
            canvasContainer.removeLayers();
            var targetWidth=285;
            var img=new Image;
            img.src=src;
            img.onload=function(){
                var iWidth=this.width;
                var iHeight=this.height;
                if(targetWidth<=0)
                    targetWidth=iWidth;
                scale=last_scale=(targetWidth/iWidth);
                // Counting 0 point
                lastPosX=posX=(iWidth*scale/2);
                lastPosY=posY=(iHeight*scale/2);
                canvasContainer.drawImage({
                    layer: true,
                    name:"photo",
                    source:src,
                    x: posX, y: posY,
                    fromCenter:true,
                    //width:iWidth*last_scale,height:iHeight*last_scale
                    scale:last_scale
                });
            }
        }
    //载入文字png
    function initTextPng(){
        if(canvasContainer.getLayerGroup('myBoxes')!=null){
            return;
        }
        var x1=Math.ceil(-(178-178*1/2)/2+20);
        canvasContainer.drawImage({
            layer:true,
            groups:["textGroup"],
            name:"text-can",
            source: 'img/can.png',
            x: x1, y: 270,
            scale:1/2,
            fromCenter: false
        });
        canvasContainer.drawImage({
            layer:true,
            groups:["textGroup"],
            name:"text-2015",
            source: 'img/2015.png',
            x: x1, y: 208,
            scale:1/2,
            fromCenter: false
        });
    }
    //画文字
    function drawVow(val){
        initTextPng();
        if($.trim(val)==""){return;}
        var layer=canvasContainer.getLayer("text-vow");
        if(layer){
            canvasContainer.setLayer("text-vow",{text:val},0).drawLayer();
        }else{
            canvasContainer.drawText({
                layer:true,
                groups:["textGroup"],
                name:"text-vow",
                fillStyle: 'white',
                x: 19, y: 258,
                fontFamily:"sans-serif",
                fontSize: 18,
                text: val,
                fromCenter: false
                /*fontSize: parseInt(18*deviceRatio),

                text: val*/
            });
        }
    }
    $("#takePhoto").bind("change",function(e){
       var file=this.files[0];
        if(file){
            var work=WorkMan(2);
            var reader=new FileReader;
            reader.readAsDataURL(file);
            reader.onload=function(){
                work.resolve(reader.result,1);
            }
            reader.onerror=function(err){
                work.reject(err);
            }
        }
    });
    //上传分步骤
    /***
     *
     * @param step
     * step1 拍立得
     * step2 拖拖看
     * step3 随便写
     * step4 快来吧
     * @param data
     */
        function goToStep(step,data){
            if(step=="share"){
                $shareMask.addClass("open");
                return;
            }
            var $stepBox=$stepsBox.filter("[data-step='"+step+"']"),len;
            if(step!=1){
                sharePhoto.hide();
                canvasContainer.show();
                if(step==2){
                    LOCK_PHOTO=false;
                }else{
                    LOCK_PHOTO=true;
                }
            }else{
                canvasContainer.hide();
                sharePhoto.show();
            }
           switch (step){
               case 1:
                   break;
               case 2:
                   data&&init(data);
                   break;
               case 3:
                   IS_SAVE=false;
                   PHOTO_PATH=null;
                   break;
               case 4:
                   if(!(len=GetLength($.trim(myVow.val())))){
                       alert("先输入个人宣言啦！");
                       myVow.focus();
                       return;
                   }else if(len>20){
                       alert("超过十个字了哦，精简一下吧！");
                       myVow.focus();
                       return;
                   }
                   $inputLabel.text(myVow.val());
                   break;
           }
         $stepBox.siblings().hide().end().show();
    }


    //步骤清理工作
    function clearStep(step){
        switch(step){
            case 1:break;
            case 2:break;
        }
    }
    //一个够听话的工作哥
    function WorkMan(next){
       var work= $.Deferred();
        waitLoad.addClass("open");
        if(next=="share"){
            $moreTip.html("正在上传图片...<br/>");
        }else{
            $moreTip.html("");
        }
        work.done(function(data){
            goToStep(next,data);
            waitLoad.removeClass("open");
        });
        work .fail(function(err){ alert("出错啦！");errorLogs.push(err);waitLoad.removeClass("open"); });
        return work;
    }
        Zepto(document).delegate(".s-back","click",function(){
            var step=parseInt($(this).parent(".photo-step").data("step")),prev=step-1;
            goToStep(prev);
        });
    Zepto(document).delegate(".s-next,.s-ok","click",function(){
        var step=parseInt($(this).parent(".photo-step").data("step")),prev=step+1;
        goToStep(prev);
    });
    //输入控制
    myVow.bind("change",function(){
        drawVow(this.value);
    });
    //保存分享
    saveAndShare.bind("click",function(){
            var data=canvasContainer[0].toDataURL("image/jpeg",0.5);
        var img=new Image;
        img.src=data;
        $(".photo-box").append(img);
             var work=WorkMan("share");
        //上传图片给vion
        if(IS_SAVE){
            work.resolve();
        }else{
            //删除字符串前的提示信息 "data:image/png;base64,"
            var b64 = data.substring( 22 );
            $.post(app.saveUrl,{image:{imgData:data}},function(result){
                if(result&&result.mess=="上传成功"){
                    PHOTO_PATH=result.filePath;
                    IS_SAVE=true;
                    var script=loadShare("在云端","2015\n"+myVow.val()+"\nI CAN!","http",PHOTO_PATH);
                    script.onload=function(){
                        work.resolve();
                    }
                };
            }).error(function(err) {  work.reject(err);})
        }
    });
    $shareClose.bind("click",function(){
        $shareMask.removeClass("open");
    });
    myVow.on("keypress",function(e){
        if(e.keyCode==13){
            $(".s-ok").click();
        }
     //   if(e.code==)
    });
    //拿图片链接
    $.getJSON("shareCounting","id=",function(data){
         if(typeof data===Object){
             if(data.path){
                 sharePhoto.attr("src",data.path);
             }
             if(data.shared){
                SHARE_COUNT=parseInt(data.shared)+1;
             }
             if(data.id){
                 FROM_ID=datg.id;
             }
         }else{
            //wrong
         }
    }).error(function(err) {errorLogs.push(err); });
    });
