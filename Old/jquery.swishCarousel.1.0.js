

/*||                                ||*/
/*|| Swish Carousel					||*/
/*|| Version: 1.0                   ||*/
/*||                                ||*/

/*
  <(^,^)>
*/

/*|| Author: Thomas Stradling       ||*/

/*
	
	Notes here...
	
*/

// if(!Window.Modernizr) var Modernizr = {}; Modernizr.csstransitions = false;
// if(Modernizr) var Modernizr = {}; Modernizr.csstransitions = false;

(function($) {
    
	var methods = {
		init: function(options){
			var opts = $.extend({}, $.fn.swishCarousel.defaults, options);

			return this.each(function() {
				// Object for holding functions/data centrally
				var base = {};
				// Avoid scope issues & provide two versions (jQuery & DOM)
				base.el = this;
				base.$el = $(this);
				
				base.data = base.$el.data('swishCarousel');
				
				if (!base.data) {
					base.data = {};
					
					// Populate the base data object
					// Make options available through the base object
					base.data.options = opts;
					// Select immediate parent. Typically the mask.
					base.data.parent = base.$el.parent();
					// Select the carousel items
					base.data.items = base.$el.children();
					// Initially set variables
					base.data.length = base.data.items.length;
					base.data.currentItem = base.data.options.startPosition - 1;
					
					// Setup button objects
					
					base.data.buttons = [];
					if (typeof(base.data.options.buttonNext) === "function") base.data.$buttonNext = base.data.options.buttonNext(base);
					else if ( base.data.options.buttonNext !== -1 ) base.data.$buttonNext = $(base.data.options.buttonNext);
					
					if (typeof(base.data.options.buttonPrev) === "function") base.data.$buttonPrev = base.data.options.buttonPrev(base);
					else if ( base.data.options.buttonPrev !== -1 ) base.data.$buttonPrev = $(base.data.options.buttonPrev);
					
					if (typeof(base.data.options.buttonFirst) === "function") base.data.$buttonFirst = base.data.options.buttonFirst(base);
					else if ( base.data.options.buttonFirst !== -1 ) base.data.$buttonFirst = $(base.data.options.buttonFirst);
					
					if (typeof(base.data.options.buttonLast) === "function") base.data.$buttonLast = base.data.options.buttonLast(base);
					else if ( base.data.options.buttonLast !== -1 ) base.data.$buttonLast = $(base.data.options.buttonLast);
					
					if (typeof(base.data.options.buttonPlay) === "function") base.data.$buttonPlay = base.data.options.buttonPlay(base);
					else if ( base.data.options.buttonPlay !== -1 ) base.data.$buttonPlay = $(base.data.options.buttonPlay);
					
					if (typeof(base.data.options.buttonPause) === "function") base.data.$buttonPause = base.data.options.buttonPause(base);
					else if ( base.data.options.buttonPause !== -1 ) base.data.$buttonPause = $(base.data.options.buttonPause);
					
					if (typeof(base.data.options.buttonStop) === "function") base.data.$buttonStop = base.data.options.buttonStop(base);
					else if ( base.data.options.buttonStop !== -1 ) base.data.$buttonStop = $(base.data.options.buttonStop);
					
					/*base.data.buttons.push(base.data.$buttonNext);
					base.data.buttons.push(base.data.$buttonPrev);
					base.data.buttons.push(base.data.$buttonFirst);
					base.data.buttons.push(base.data.$buttonLast);
					base.data.buttons.push(base.data.$buttonPlay);
					base.data.buttons.push(base.data.$buttonPause);
					base.data.buttons.push(base.data.$buttonStop);*/
					
					//
					base.data.pause = false;
					//
					base.$el.data('swishCarousel', base.data);
				}
				
				
				// Setup animations
				switch(base.data.options.animation){
					case 'slide':
						base.$el.width(base.data.length * base.data.items.width());
						break;
					case 'fade':
						base.data.items.css({ opacity: 0, position: 'absolute', top: 0, left: 0, zIndex: 1 }).eq(base.data.currentItem).css({ opacity: 1, zIndex: 2 });
						break;
				}
				
				if (Modernizr.csstransitions) { 
					var t = "all " + (base.data.options.animSpeed/1000) + "s " + base.data.options.css3easing,
					transitionsCss = {
						'-webkit-transition': t,
						'-moz-transition'	: t,
						'-o-transition'		: t,
						'transition'		: t
					}
					switch(base.data.options.animation){
						case 'slide':
							base.$el.css(transitionsCss);
							break;
						case 'fade':
							base.data.items.css(transitionsCss);
							break;
					}
				}
				
				// Setup the pager
				if ( base.data.options.pager) {
					if(typeof(base.data.options.pagerElement) === "function") base.data.$pager = base.data.options.pagerElement(base);
					else if ( base.data.options.pagerElement !== -1 ) base.data.$pager = $(base.data.options.pagerElement);
					
					// Create a pager if required
					if ( base.data.options.pagerAuto ) {
						// If the pager element is not a list container create a list container
						var tag;
						base.data.$pager.each(function(){ tag = this.tagName; });
						if(tag !== "UL" && tag !== "OL") {
							base.data.$pager.append('<ol></ol>');
							base.data.$pager = $('ol', base.data.$pager);
						}
						// Create a pager item for each carousel item
						base.data.items.each(function(i, e) { base.data.$pager.append('<li>' + (i + 1) + '</li>') });
					}
					base.data.$pagerItems = $("li", base.data.$pager);
					base.data.$pagerItems.each(function(i,e){ $(e).data("pagerIndex", i) }).click(function(){
						base.$el.swishCarousel("goTo", $(this).data("pagerIndex")).swishCarousel(base.data.options.onAction);
					});
					$('a', base.data.$pager).click(function(e){ e.preventDefault() });
				}
				// Setup the progress bar
				if (base.data.options.timer) {
					base.data.$timer = $('<div class="timer"><div class="inner"></div></div>');
					base.$el.after(base.data.$timer);
				}
				
				base.$el.css({ left: 0 });
				
				// If set to autostart begin the interval
				if (base.data.options.autoStart) {
					if (base.data.options.timer) $('.inner', base.data.$timer).stop().css({ width: 'auto' }).animate({ width: 0 }, base.data.options.delay, 'linear');
					
					base.data.carouselTimer = setInterval(function(){
						base.$el.swishCarousel("goTo", "next");
						if (base.data.options.timer) $('.inner', base.data.$timer).stop().css({ width: 'auto' }).animate({ width: 0 }, base.data.options.delay, 'linear');
					}, base.data.options.delay);
				}
				
				$(base.data.options.buttonPause).bind("click.swishCarousel", function(e){ e.preventDefault(); base.$el.swishCarousel("pause"); });
				$(base.data.options.buttonPlay).bind("click.swishCarousel", function(e){ e.preventDefault(); base.$el.swishCarousel("play"); });
				
				$(base.data.options.buttonStop).bind("click.swishCarousel", function(e){ e.preventDefault(); base.$el.swishCarousel("stop"); });
				$(base.data.options.buttonFirst).bind("click.swishCarousel", function(e){ e.preventDefault();
					base.$el.swishCarousel("goTo", "first").swishCarousel(base.data.options.onAction);
				});
				$(base.data.options.buttonPrev).bind("click.swishCarousel", function(e){ e.preventDefault();
					base.$el.swishCarousel("goTo", "previous").swishCarousel(base.data.options.onAction);
				});
				$(base.data.options.buttonNext).bind("click.swishCarousel", function(e){ e.preventDefault();
					base.$el.swishCarousel("goTo", "next").swishCarousel(base.data.options.onAction);
				});
				$(base.data.options.buttonLast).bind("click.swishCarousel", function(e){ e.preventDefault();
					base.$el.swishCarousel("goTo", "last").swishCarousel(base.data.options.onAction);
				});
				
				
				
				// Check at defined intervals if carousel state has changed.
				if (base.data.options.poll) {
					base.data.poll = setInterval(function(){
						base.data.length = base.$el.children().length;
					}, base.data.options.pollTimer);
				}
				
				if (base.data.options.responsive){
					base.data.responsiveFunction = function(){}
					
					switch ( base.data.options.animation ) {
						case 'slide':
							base.data.responsiveFunction = function(){
								base.data.items.width(base.data.parent.width());
								base.$el.width(base.data.length * base.data.items.width());
								
								// Update positioning
								base.$el.css({ left: -(base.data.currentItem * base.data.items.width()) });
							}
						break;
						case 'fade':
							base.data.responsiveFunction = function(){
								base.$el.height(base.data.items.height());
							}
						break;
					}
					
					// base.data.responsiveInterval = setInterval(base.data.responsiveFunction, 1);
					$(window).resize(base.data.responsiveFunction);
				}
				
				// Deal with the Firefox tab focus bug
				$(window).blur(function(){ base.$el.swishCarousel("pause") }).focus(function(){ base.$el.swishCarousel("play") });
				
				
				base.$el.data('swishCarousel', base.data);
			});
		},
		goTo: function(index){
			return this.each(function(){
				var base = $.fn.swishCarousel.setupData(this);
				if ( _.isString(index) ) {
					// Go to keyword (first/last/prev/next)
					switch (index){
						case "first":
							index = base.data.options.startPosition - 1;
						break;
						case "last":
							index = base.data.length - base.data.options.step;
						break;
						case "next":
							base.data.currentItem = base.data.currentItem + base.data.options.step;
							if ( base.data.currentItem === base.data.items.length || base.data.currentItem > base.data.items.length ) base.data.currentItem = base.data.options.startPosition - 1;
							if ( (base.data.items.length - base.data.currentItem) < base.data.options.step ) base.data.currentItem = base.data.currentItem - (base.data.options.step - (base.data.items.length - base.data.currentItem));
							index = base.data.currentItem;
						break;
						case "previous":
							base.data.currentItem = base.data.currentItem - base.data.options.step;
							if (base.data.currentItem < base.data.options.startPosition - 1) base.data.currentItem = base.data.length - 1;
							index = base.data.currentItem;
						break;
						default:
							$.error("Invalid argument passed to swishCarousel('goTo')");
					}
				}
				
				if ( _.isNumber(index) ){
					switch(base.data.options.animation){
						case 'slide':
							if (Modernizr.csstransitions) base.$el.css({ left: -(index * base.data.items.width()) });
							else base.$el.stop().animate({ left: -(index * base.data.items.width()) }, base.data.options.animSpeed);
							break;
						case 'fade':
							if (Modernizr.csstransitions) base.data.items.filter(':eq(' + index + ')').css({ opacity: 1 }).siblings().css({ opacity: 0 });
							else base.data.items.filter(':eq(' + index + ')').animate({ opacity: 1 }, base.data.options.animSpeed).siblings().animate({ opacity: 0 }, base.data.options.animSpeed);
							break;
					}
					base.data.items.eq(index).addClass('active').siblings().removeClass('active');
				}
				
				// Update data object //
				base.data.currentItem = index;
				base.$el.data('swishCarousel', base.data);
			});
		},
		pause: function() {
			return this.each(function(){
				var base = $.fn.swishCarousel.setupData(this);
				clearInterval(base.data.carouselTimer);
				if (base.data.options.timer) $('.inner', base.data.$timer).stop();
				// Calculate remaining time and store
				base.data.pauseTime = ($('.inner', base.data.$timer).width() / base.data.$timer.width()) * base.data.options.delay;
				base.data.pause = true;
			});
		},
		play: function() {
			return this.each(function(){
				var base = $.fn.swishCarousel.setupData(this);
				if (base.data.pause) {
					base.data.carouselTimer = setTimeout(function(){
						if (base.data.options.timer) $('.inner', base.data.$timer).stop().css({ width: 'auto' }).animate({ width: 0 }, base.data.options.delay, 'linear');
						// Make sure data is up to date //
						base.$el.data('swishCarousel', base.data);
						base.$el.swishCarousel("goTo", "next");
						base.data = base.$el.data('swishCarousel');
						// Pull in any updated data //
						base.data.carouselTimer = setInterval(function(){
							if (base.data.options.timer) $('.inner', base.data.$timer).stop().css({ width: 'auto' }).animate({ width: 0 }, base.data.options.delay, 'linear');
							base.$el.swishCarousel("goTo", "next");
						}, base.data.options.delay);
					}, base.data.pauseTime);
					if (base.data.options.timer) $('.inner', base.data.$timer).animate({ width: 0 }, base.data.pauseTime, 'linear');
					base.data.pause = false;
				}
			});
		},
		stop: function() {
			return this.each(function(){
				var base = $.fn.swishCarousel.setupData(this);
				clearInterval(base.data.carouselTimer);
				if (base.data.options.timer) $('.inner', base.data.$timer).stop().css({ width: 'auto' });
				base.data.pauseTime = base.data.options.delay;
				base.data.pause = true;
			});
		},
		destroy: function() {
			return this.each(function(){
				var base = $.fn.swishCarousel.setupData(this);
				base.$el.swishCarousel("stop");
				// Unbind all events //
			});
		},
		test: function(){
			return this.each(function(){
				var base = $.fn.swishCarousel.setupData(this);
			});
		}
	};
	
	$.fn.swishCarousel = function(method) {
		
		if ( methods[method] ) {
		  return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}

    };
	
	// Public defaults allow global override.
	$.fn.swishCarousel.defaults = {
		animation: "slide",
		animSpeed: 300,
		autoSetup: false,
		autoStart: true,
		buttons: true,
		buttonNext: -1,
		buttonPrev: -1,
		buttonFirst: -1,
		buttonLast: -1,
		buttonPlay: -1,
		buttonPause: -1,
		buttonStop: -1,
		delay: 5000,
		easing: "linear",
		css3easing: "linear",
		interrupt: true,
		onAction: "play",
		pager: false,
		pagerAuto: false,
		pagerElement: '.pager',
		poll: false,
		pollTimer: 500,
		responsive: true,
		startPosition: 1,
		step: 1,
		timer: false
	};
	
	// public functions definition
	$.fn.swishCarousel.test = function(foo) {
		return this;
		console.log("!");
	};
	
	$.fn.swishCarousel.setupData = function(el) {
		var base = { el: el, $el: $(el) };
		base.data = base.$el.data('swishCarousel');
		if ( ! base.data ) $.error('swishCarousel | Calling a none initialiser method on an object without an initialised plugin.');
		return base;
	};

	// private functions definition
	function goTo(base, index) {
		// Make sure data is up to date //
		base.$el.data('swishCarousel', base.data);
		base.$el.swishCarousel("goTo", index);
		base.data = base.$el.data('swishCarousel');
		// Pull in any updated data //
		return base.data;
	}
	
	

})(jQuery);