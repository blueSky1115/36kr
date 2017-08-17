
$(document).on('touchmove',function(ev){
    ev.preventDefault();
});
/*获取页面的高度宽度适配------------------------------------------------------------------------------------------*/
$(function(){
    var $main = $('#main');
    var $list = $('#list');
    var $li = $list.find('>li');
    var $music = $('#music');       /*音乐获取*/
    var desW = 640;
    var desH = 1008;
    var viewHeight = $(window).height();
    $main.css('height',viewHeight);

    //slideCanvas();
        slideList();  /*页面滑动----------*/



    function nowWidth(){
        var w = desW/desH * viewHeight;     /*----最终显示设备宽度-----------------------------------------------*/
        return w;                          /*返回w值*/
    }

    function slideCanvas(){
//		var oC = $('#c1').get(0);
//		var oGC = oC.getContext('2d');
//		var bBtn = true;
//		oC.height = viewHeight;

//        var objImg = new Image();

        objImg.onload = function(){
//			oGC.drawImage(objImg,(desW - nowWidth())/2 ,0,nowWidth(),viewHeight);
//			oGC.fillStyle = 'red';
//			oGC.globalCompositeOperation = 'destination-out';
//			oGC.lineWidth = 60;
//			oGC.lineCap = 'round';
//
            $(oC).on('touchstart',function(ev){
                var touch = ev.originalEvent.changedTouches[0];
                var x = touch.pageX - $(this).offset().left;
                var y = touch.pageY - $(this).offset().top;

                /*oGC.beginPath();
                 oGC.arc(x,y,100,0,360*Math.PI/180);
                 oGC.closePath();
                 oGC.fill();*/
                if(bBtn){
                    bBtn = false;
                    oGC.moveTo(x,y);
                    oGC.lineTo(x+1,y+1);
                }
                else{
                    oGC.lineTo(x,y);
                }

                oGC.stroke();

                $(oC).on('touchmove.move',function(ev){
                    var touch = ev.originalEvent.changedTouches[0];
                    var x = touch.pageX - $(this).offset().left;
                    var y = touch.pageY - $(this).offset().top;
                    oGC.lineTo(x,y);
                    oGC.stroke();
                });
                $(oC).on('touchend.move',function(){

                    var dataImg = oGC.getImageData(0,0,oC.width,oC.height);

                    var allPx = dataImg.width * dataImg.height;
                    var iNum = 0;

                    for(var i=0;i<allPx;i++){
                        if(dataImg.data[i*4+3] == 0){
                            iNum++;
                        }
                    }

                    if( iNum > allPx/2 ){
                        $(oC).animate({opacity:0},1000,function(){
                            $(this).remove();
//                            cjAnimate[0].inAn();            /*暂时不要*/
//                            showMusic();                    /*暂时不要*/
                        });
                    }
                    $(oC).off('.move');
                });
            });
        };
    }

    function slideList(){
        var downY = 0;
        var step = 1/4;

        var nowIndex = 0;
        var nextorprevIndex = 0;
        var bBtn = true;

        $li.css('backgroundPosition',( (desW - nowWidth())/96 )+'px 0');   /*背景定位修改*/
        $li.css('background-size','100% 100%');                           /*背景固定值*/
        $li.on('touchstart',function(ev){
            if(!bBtn){return;}
            bBtn = false;
            var touch = ev.originalEvent.changedTouches[0];
            downY = touch.pageY;
            nowIndex = $(this).index();

            $li.on('touchmove',function(ev){
                var touch = ev.originalEvent.changedTouches[0];

                $(this).siblings().hide();

                if( touch.pageY < downY ){  //↑
                    nextorprevIndex = nowIndex == $li.length-1 ? 0 : nowIndex + 1;
                    $li.eq(nextorprevIndex).css('transform','translate(0,'+(viewHeight + touch.pageY - downY)+'px)');
                } else if( touch.pageY > downY ){  //↓
                    nextorprevIndex = nowIndex == 0 ? $li.length-1 : nowIndex - 1;
                    $li.eq(nextorprevIndex).css('transform','translate(0,'+(-viewHeight + touch.pageY - downY)+'px)');
                } else{
                    bBtn = true;
                }

                $li.eq(nextorprevIndex).show().addClass('zIndex');
                $(this).css('transform','translate(0,'+(touch.pageY - downY)*step+'px) none ('+(1-Math.abs(touch.pageY - downY)/viewHeight*step)+')');
                /*scale改成none 不执行2D翻页效果*/
            });

            $li.on('touchend',function(ev){
                var touch = ev.originalEvent.changedTouches[0];
                if( touch.pageY < downY ){  //↑
                    $(this).css('transform','translate(0,'+(-viewHeight * step)+'px) none('+(1-step)+')');
                } else if( touch.pageY > downY ){  //↓
                    $(this).css('transform','translate(0,'+(viewHeight * step)+'px) none('+(1-step)+')');
                }
                                                                                      /*scale改成none 不执行2D翻页效果*/
                 /*------增加--暂时不要*/
                //$(".J_animate").addClass("hide");
                //$($($li).get(nextorprevIndex)).find(".J_animate").removeClass("hide");
                /*------增加---暂时不要*/


                $(this).css('transition','.3s');
                $li.eq(nextorprevIndex).css('transform','translate(0,0)');
                $li.eq(nextorprevIndex).css('transition','.3s');

            });

        });

        $li.on('transitionEnd webkitTransitionEnd',function(ev){
            resetFn();
        });

        function resetFn(){
            $li.css('transition','');
            $li.eq(nextorprevIndex).removeClass('zIndex').siblings().hide();
            bBtn = true;
        }

    }

/*music---------------------------------------------------------------------------------------------------------------*/
    function showMusic(){/*音乐点击/暂定/开始*/
        var $music = $('#music');/*获取音乐图片的div*/
        var $audio1 = $('#audio1');/*获取音乐文件的div*/
        var onoff = true;
        $music.on('touchstart',function(){
            if(onoff){
                $(this).attr('class','active');
                $audio1.get(0).play();/*调用原生的方法要加一个get/开始*/
            } else{
                $(this).attr('class','');
                $audio1.get(0).pause();/*调用原生的方法要加一个get/暂停*/
            }
            onoff = !onoff;
        });
        $music.trigger('touchstart');/*自动刷新触发*/
    }
  showMusic();/*最后调用这个音乐*/
});
/*music---------------------------------------------------------------------------------------------------------------*/
