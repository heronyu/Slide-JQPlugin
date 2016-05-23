;(function ($) {

	//编写一个jQuery插件开始于给jQuery.fn加入​​新的功能属性，此处添加的对象属性的名称就是你插件的名称：
	//为了避免和其他JavaScript库冲突，我们最好将jQuery传递给一个自我执行的封闭程序，jQuery在此程序中映射为$符号，这样可以避免$号被其他库覆写。
	//object instance
	$.fn.sliderFlash=function(options){
		var defults={
			directionNav: true,//true为显示左右箭头，false为隐藏
			effect:"slide",//fade为渐入渐出效果，slide为滑动效果
			speed:"fast"//三种预定速度之一的字符串("slow","normal", or "fast")或表示动画时长的毫秒数值(如：1000)

		}

		//声明显示元素宽度
		var visWidth;

		//在插件的范围里， this关键字代表了这个插件将要执行的jQuery对象， 这里容易产生一个普遍的误区，因为在其他包含callback的jQuery函数中，this关键字代表了原生的DOM元素。这常常会导致开发者误将this关键字无谓的包在jQuery中
		//百度了解jQuery对象和普通DOM对象的区别

		//此处没有必要将this包在$号中如$(this)，因为this已经是一个jQuery对象。
        //$(this)等同于 $($('#element'));
		var slider=this;


		//console.log(options)
		// making variables public

		/*对于比较复杂的和提供了许多选项可定制的的插件，
		最好有一个当插件被调用的时候可以被拓展的默认设置(通过使用$.extend)。 
		因此，相对于调用一个有大量参数的插件，你可以调用一个对象参数，
		包含你了你想覆写的设置。*/

		slider.vars=$.extend({},defults, options);
		//console.log(slider.vars)

		return this.each(function() {
			var elLeg=elementLeg(),
				visWidth=$(window).width();

			//获取窗口宽度，设置元素
			slider.elWidth=function(){
				restSlider();
				slider.find('ul.slider> li').css('width',visWidth);
				slider.find('ul.slider').css('width',elLeg*visWidth);
			}
			slider.elWidth();

			//获取滚动元素的数量
			function elementLeg(){
				return slider.find('ul li').length;
			}

			//slide效果时，给ul.slide添加过渡动画style code
			function setSlideSpeed(transitionDuration){
				transitionDuration=transitionDuration+"ms"
				slider.find('ul.slider').css({"transition": "all"+" "+ transitionDuration+" "+ "ease","-webkit-transition": "all"+" "+transitionDuration+" "+"ease","-moz-transition": "all"+transitionDuration+ " "+"ease"})
			};

			//方向-左，点击时调用方法
			slider.navLeft=function(){
				    sliderInd=slider.find('ul li.active').index();
					if(sliderInd<elLeg&&sliderInd>0){
						sliderInd--;
						//根据显示效果调用对应方法
						if(slider.vars.effect=="slide"){
							navSlideControl();
						}else if(slider.vars.effect=="fade"){
							navFadeControl();
						}

					}
			}
			//方向-右，点击时调用方法
			slider.navRight=function(){
				    sliderInd=slider.find('ul li.active').index(),
				    sliderInd++;
					if(sliderInd<elLeg){
						//根据显示效果调用对应方法
						if(slider.vars.effect=="slide"){
							navSlideControl();
						}else if(slider.vars.effect=="fade"){
							navFadeControl(speedSet());
						}
					}
			}


			//不同显示效果-左右箭头不同方法对DOM进行显示位置的变化
			//slide effect control
			function navSlideControl(){
						slider.find('ul').css({"transform":"translateX("+"-"+visWidth*sliderInd+"px"+")","-webkit-transform":"translateX("+"-"+visWidth*sliderInd+"px"+")","-moz-transform":"translateX("+"-"+visWidth+"px"+")"});
						slider.find('ul li').removeClass('active');
						slider.find('ul li').eq(sliderInd).addClass('active');
			};
			//fade effect control
			function navFadeControl(transitionDuration){
						slider.find('ul li').eq(sliderInd).animate({opacity:'1'},transitionDuration).addClass('active');
						slider.find('ul li').eq(sliderInd).siblings('li').animate({opacity:'0'},transitionDuration).removeClass('active');
			}



			//设置  是/否  显示左右切换按钮
			function displayNavBtn(){
				if(slider.vars.directionNav){
					slider.append('<ol class="directionNav"><li class="left"></li><li class="right"></li></ol>');
 					slider.find('ol li.left').bind('click',function(){setSlideSpeed(speedSet());slider.navLeft();});
					slider.find('ol li.right').bind('click',function(){setSlideSpeed(speedSet());slider.navRight();});
				}
			}

			/*显示效果设置
			  目前可设置slide/fade效果
			*/
			if(slider.vars.effect=="slide"){
				setSlideSpeed(speedSet());
 				displayNavBtn(slider.vars.effect);
			}else if(slider.vars.effect=="fade"){
				slider.find('ul li').css({position:'relative','margin-right':'-100%',opacity:'0'});
				slider.find('ul li.active').css({opacity:'1'});
				displayNavBtn(slider.vars.effect);
			}


			//屏幕大小发生变化时调整显示位置
			function restSlider(){
				var sliderInd=slider.find('ul li.active').index();
					slider.find('ul').css({"transform":"translateX("+"-"+visWidth*sliderInd+"px"+")","-webkit-transform":"translateX("+"-"+visWidth*sliderInd+"px"+")","-moz-transform":"translateX("+"-"+visWidth+"px"+")"});


			}


			//设置动画过渡速度参数
			function speedSet(){
				if(slider.vars.speed=="fast"){
					return 200;
				}else if(slider.vars.speed=="normal"){
					return 500;
				}else if(slider.vars.speed=="slow"){
					return 1000;
				}else{
					return slider.vars.speed;
				}
			}



			//屏幕大小发生变化时重新计算图片大小，调整显示大小
			$(window).resize(function(event) {
				visWidth=$(window).width();
				slider.find('ul.slider').css({"transition": "all 0s ease","-webkit-transition": "all 0s ease","-moz-transition": "all 0s ease"})
				if(slider.vars.effect=="slide"){
					slider.elWidth();
				}else if(slider.vars.effect=="fade"){
					slider.find('ul.slider> li').css('width',visWidth);
				}
			});


		});
		
		
	}

})(jQuery);