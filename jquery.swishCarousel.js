/*||                                ||*/
/*|| Swish Carousel					||*/
/*||                                ||*/

/*
  <(^,^)>
*/

/*|| Author: Thomas Stradling       ||*/

/*	
	Dependent on Modernizr
*/

(function ($) {

	var methods = {
		init: function (options) {
			var opts = $.extend({}, $.fn.swishCarousel.defaults, options);

			return this.each(function () {
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
					base.data.lastItem = base.data.options.startPosition - 1;

					// Setup button objects
					function setupButton(btn) {
						var _btn;
						if (typeof (btn) === "function")
							_btn = btn(base);
						else if (btn !== -1)
							_btn = $(btn);
						else
							_btn = $(null); // Force function to return an empty jq object if unused.
						return _btn;
					}

					base.data.$buttonNext = setupButton(base.data.options.buttonNext);
					base.data.$buttonPrev = setupButton(base.data.options.buttonPrev);
					base.data.$buttonFirst = setupButton(base.data.options.buttonFirst);
					base.data.$buttonLast = setupButton(base.data.options.buttonLast);
					base.data.$buttonPlay = setupButton(base.data.options.buttonPlay);
					base.data.$buttonPause = setupButton(base.data.options.buttonPause);
					base.data.$buttonStop = setupButton(base.data.options.buttonStop);


					//
					base.data.pause = false;
					//
					base.$el.data('swishCarousel', base.data);
				}


				// Setup animations
				switch (base.data.options.animation) {
					case 'slide':
						base.$el.width(base.data.length * base.data.items.outerWidth(true));
						base.$el.css({ left: -((base.data.options.startPosition - 1) * base.data.items.outerWidth(true)) });
						break;
					case 'fade':
						base.data.items.css({ opacity: 0, position: 'absolute', top: 0, left: 0, zIndex: 1 }).eq(base.data.currentItem).css({ opacity: 1, zIndex: 2 });
						base.$el.height(base.data.items.height());
						break;
					case 'loop':
						
						// Add data-swish-index to allow tracking cloned items with the original
						base.data.items.each(function (i, e) {
							var _e = $(e);
							_e.attr('data-swish-index', i);
						});

						// Test how many items are in view.
						base.data.loopInView = Math.round(base.data.parent.width() / base.data.items.outerWidth(true));
						// console.log("Items in view: " + base.data.loopInView);

						// Clone the default in view items.
						var i = 0;
						for (i = 0; i < base.data.loopInView; i++) {
							base.$el.append(base.data.items.eq(i).clone());
						}

						base.data.items = base.$el.children();
						base.data.length = base.data.items.length;

						base.$el.width(base.data.length * base.data.items.outerWidth(true));
						base.$el.css({ left: -((base.data.options.startPosition - 1) * base.data.items.outerWidth(true)) });
						break;
					case 'sequence':
						// This is for just adding / removing classes
						// Mainly for use with CSS based transitions
						base.data.items.children().addClass('animate-out');
						base.data.items.eq(base.data.options.startPosition - 1).children().addClass('animate-in').removeClass('animate-out');
					break;
				}
				base.$el.addClass('swishCarousel');

				if (Modernizr.csstransitions) {
					var t = "all " + (base.data.options.animSpeed / 1000) + "s " + base.data.options.css3easing,
					transitionsCss = {
						'-webkit-transition': t,
						'-moz-transition': t,
						'-o-transition': t,
						'transition': t
					}
					switch (base.data.options.animation) {
						case 'slide':
							base.$el.css(transitionsCss);
							break;
						case 'fade':
							base.data.items.css(transitionsCss);
							break;
					}
				}

				// Setup the pager
				if (base.data.options.pager) {
					if (typeof (base.data.options.pagerElement) === "function") base.data.$pager = base.data.options.pagerElement(base);
					else if (base.data.options.pagerElement !== -1) base.data.$pager = $(base.data.options.pagerElement);

					// Create a pager if required
					if (base.data.options.pagerAuto) {
						// If the pager element is not a list container create a list container
						var tag;
						base.data.$pager.each(function () {
							tag = this.tagName;
						});
						if (tag !== "UL" && tag !== "OL") {
							base.data.$pager.append('<ol></ol>');
							base.data.$pager = $('ol', base.data.$pager);
						}
						// Create a pager item for each carousel item
						base.data.items.each(function (i, e) { base.data.$pager.append('<li>' + (i + 1) + '</li>') });
					}
					base.data.$pagerItems = $("li", base.data.$pager);
					base.data.$pagerItems.each(function (i, e) { $(e).data("pagerIndex", i) }).on('click.swishCarousel', function () {
						base.$el.swishCarousel("goTo", $(this).data("pagerIndex")).swishCarousel(base.data.options.onAction);
					});
					$('a', base.data.$pager).on('click.swishCarousel', function (e) {
						e.preventDefault() 
					});

					// Create an update pager function?
					base.data.$pagerItems.eq(base.data.options.startPosition - 1).addClass('pagerActive').siblings().removeClass('active');
				}
				// Setup the progress bar
				if (base.data.options.timer) {
					base.data.$timer = $('<div class="timer"><div class="inner"></div></div>');
					base.$el.after(base.data.$timer);
				}

				// If set to autostart begin the interval
				if (base.data.options.autoStart) {
					if (base.data.options.timer)
						$('.inner', base.data.$timer).stop().css({ width: 'auto' }).animate({ width: 0 }, base.data.options.delay, 'linear');

					base.data.carouselTimer = setInterval(function () {
						base.$el.swishCarousel("goTo", "next");
						
						if (base.data.options.timer)
							$('.inner', base.data.$timer).stop().css({ width: 'auto' }).animate({ width: 0 }, base.data.options.delay, 'linear');
					
					}, base.data.options.delay);
				}

				base.data.$buttonPause.on("click.swishCarousel", function (e) {
					e.preventDefault();
					base.$el.swishCarousel("pause");
				});
				
				base.data.$buttonPlay.on("click.swishCarousel", function (e) {
					e.preventDefault();
					base.$el.swishCarousel("play"); 
				});
				
				base.data.$buttonStop.on("click.swishCarousel", function (e) { 
					e.preventDefault();
					base.$el.swishCarousel("stop"); 
				});
				
				base.data.$buttonFirst.on("click.swishCarousel", function (e) {
					e.preventDefault();
					base.$el.swishCarousel("goTo", "first").swishCarousel(base.data.options.onAction);
				});
				
				base.data.$buttonPrev.on("click.swishCarousel", function (e) {
					e.preventDefault();
					base.$el.swishCarousel("goTo", "previous").swishCarousel(base.data.options.onAction);
				});
				
				base.data.$buttonNext.on("click.swishCarousel", function (e) {
					e.preventDefault();
					base.$el.swishCarousel("goTo", "next").swishCarousel(base.data.options.onAction);
				});

				base.data.$buttonLast.on("click.swishCarousel", function (e) {
					e.preventDefault();
					base.$el.swishCarousel("goTo", "last").swishCarousel(base.data.options.onAction);
				});



				if (base.data.length < base.data.options.startPosition) {
					base.data.$buttonNext.remove();
					base.data.$buttonPrev.remove();
				}



				// Check at defined intervals if carousel state has changed.
				if (base.data.options.poll) {
					base.data.poll = setInterval(function () {
						base.data.length = base.$el.children().length;
					}, base.data.options.pollTimer);
				}

				if (base.data.options.responsive) {
					// Auto set width / height / whatev
					base.data.items.width(Math.floor(base.data.parent.width() * (base.data.options.responsiveWidth / 100)));

					base.data.responsiveFunction = function () { }

					switch (base.data.options.animation) {
						case 'slide':
							base.data.responsiveFunction = function () {
								base.data.items.width(Math.floor(base.data.parent.width() * (base.data.options.responsiveWidth / 100)));
								base.$el.width(base.data.items.length * base.data.items.width());

								// Update positioning
								base.$el.css({ left: -(base.data.currentItem * base.data.items.width()) });
							}
							break;
						case 'fade':
							base.data.responsiveFunction = function () {
								base.$el.height(base.data.items.height());
							}
							break;
						case 'loop':
							base.data.responsiveFunction = function () {
								base.data.items.width(Math.floor(base.data.parent.width() * (base.data.options.responsiveWidth / 100)));
								base.$el.width(base.data.items.length * base.data.items.width());

								// Update positioning
								base.$el.css({ left: -(base.data.currentItem * base.data.items.width()) });
							}
							break;
					}

					// base.data.responsiveInterval = setInterval(base.data.responsiveFunction, 1);
					base.data.responsiveFunction();
					$(window).resize(base.data.responsiveFunction);
				}

				if (base.data.options.useTouch) {
					var touchStart = {};
					var touchCurrent = {};
					var touchElStart;

					base.el.addEventListener('touchstart', function(ev){
						base.$el.swishCarousel("stop"); // Prevent carousel from moving

						touchStart = ev.changedTouches[0];

						touchElStart = base.el.style.left;
					}, false);

					base.el.addEventListener('touchmove', function(ev){
						var touchNew = ev.changedTouches[0];
					}, false);

					base.el.addEventListener('touchend', function(ev){
						if (ev.changedTouches[0].clientX - touchStart.clientX < 0)
							base.$el.swishCarousel("goTo", "next").swishCarousel(base.data.options.onAction);
					
						else
							base.$el.swishCarousel("goTo", "previous").swishCarousel(base.data.options.onAction);
						
							
					}, false);

				}

				base.$el.data('swishCarousel', base.data);
			});


			// End of INIT function //
		},
		goTo: function (index) {
			return this.each(function () {
				var base = $.fn.swishCarousel.setupData(this);
				var keyword = null;
				var _currentItem;	// Helper item for holding the current item
				var _lastItem;		// Helper item for holding the last item

				if (typeof(index) === "string") {
					keyword = index;
					// Go to keyword (first/last/prev/next)
					// Store which button was clicked
					var btnClicked = "none";

					switch (index) {
						case "first":
							index = base.data.options.startPosition - 1;
							break;
						case "last":
							index = base.data.length - base.data.options.step;
							break;
						case "next":
							base.data.currentItem = base.data.currentItem + base.data.options.step;
							if (base.data.currentItem === base.data.items.length || base.data.currentItem > base.data.items.length) base.data.currentItem = base.data.options.startPosition - 1;
							if ((base.data.items.length - base.data.currentItem) < base.data.options.step) base.data.currentItem = base.data.currentItem - (base.data.options.step - (base.data.items.length - base.data.currentItem));
							index = base.data.currentItem;
							btnClicked = "next";
							break;
						case "previous":
							base.data.currentItem = base.data.currentItem - base.data.options.step;
							if (base.data.currentItem < base.data.options.startPosition - 1) base.data.currentItem = base.data.length - 1;
							index = base.data.currentItem;
							btnClicked = "previous";
							break;
						default:
							$.error("Invalid argument passed to swishCarousel('goTo')");
					}
				}

				if (!isNaN(index)) {
					_currentItem = base.data.items.eq(index); // Set the current helper object
					_lastItem = base.data.items.eq(base.data.lastItem) // Set the last helper object

					switch (base.data.options.animation) {
						case 'slide':
							if (Modernizr.csstransitions)
								base.$el.css({ left: -(index * base.data.items.outerWidth(true)) });
							else 
								base.$el.stop().animate({ left: -(index * base.data.items.outerWidth(true)) }, base.data.options.animSpeed);
							
							break;
						case 'fade':
							if (Modernizr.csstransitions)
								_currentItem.css({ opacity: 1, zIndex: 2 }).siblings().css({ opacity: 0, zIndex: 1 });
							else
								_currentItem.animate({ opacity: 1, zIndex: 2 }, base.data.options.animSpeed).siblings().animate({ opacity: 0, zIndex: 1 }, base.data.options.animSpeed);

							break;
						case 'loop':
							if (btnClicked === 'next' || (index > base.data.lastItem && base.data.lastItem !== base.data.options.startPosition - 1)) {
								// Click forwards to first item
								if (index === base.data.options.startPosition - 1) { // (base.data.items.length - base.data.loopInView) + 1
									index = base.data.options.startPosition - 1;
									base.$el.stop().css({ left: -(index * base.data.items.outerWidth(true)) });
									index = index + base.data.options.step;
								}
							}
							else if (btnClicked === 'previous' || index < base.data.lastItem) {
								// Click backwards to previous item
								if ((index + 1) === base.data.items.length) {
									index = (index - base.data.loopInView) + 1;
									base.$el.stop().css({ left: -(index * base.data.items.outerWidth(true)) });
									index = index - base.data.options.startPosition;
								}
							}

							base.$el.stop().animate({ left: -(index * base.data.items.outerWidth(true)) }, base.data.options.animSpeed);

							break;
						case 'sequence':
							_lastItem.children().addClass('animate-out').removeClass('animate-in');
							_currentItem.addClass('next-item').children().addClass('animate-in').removeClass('animate-out');

							
							setTimeout(function(){
								_currentItem.removeClass('next-item');	
							}, base.data.options.sequenceDelay);
						break;
					}
					
					_currentItem.addClass('active').siblings().removeClass('active');

					if (base.data.options.pager)
						base.data.$pagerItems.eq(index).addClass('pagerActive').siblings().removeClass('pagerActive');

					base.data.lastItem = base.data.currentItem;
				} else {
					$.error('swishCarousel | Trying to move to a non integer index.');
				}

				// Update data object //
				base.data.currentItem = index;
				base.$el.data('swishCarousel', base.data);
			});
		},
		pause: function () {
			return this.each(function () {
				var base = $.fn.swishCarousel.setupData(this);
				clearInterval(base.data.carouselTimer);
				if (base.data.options.timer) $('.inner', base.data.$timer).stop();
				// Calculate remaining time and store
				// base.data.pauseTime = ($('.inner', base.data.$timer).width() / base.data.$timer.width()) * base.data.options.delay;
				base.data.pause = true;
			});
		},
		play: function () {
			return this.each(function () {
				var base = $.fn.swishCarousel.setupData(this);
				if (base.data.pause) {
					base.data.carouselTimer = setTimeout(function () {
						if (base.data.options.timer) $('.inner', base.data.$timer).stop().css({ width: 'auto' }).animate({ width: 0 }, base.data.options.delay, 'linear');
						// Make sure data is up to date //
						base.$el.data('swishCarousel', base.data);
						base.$el.swishCarousel("goTo", "next");
						base.data = base.$el.data('swishCarousel');
						// Pull in any updated data //
						base.data.carouselTimer = setInterval(function () {
							if (base.data.options.timer) $('.inner', base.data.$timer).stop().css({ width: 'auto' }).animate({ width: 0 }, base.data.options.delay, 'linear');
							base.$el.swishCarousel("goTo", "next");
						}, base.data.options.delay);
					}, base.data.pauseTime);
					if (base.data.options.timer) $('.inner', base.data.$timer).animate({ width: 0 }, base.data.pauseTime, 'linear');
					base.data.pause = false;
				}
			});
		},
		stop: function () {
			return this.each(function () {
				var base = $.fn.swishCarousel.setupData(this);
				clearInterval(base.data.carouselTimer);
				if (base.data.options.timer) $('.inner', base.data.$timer).stop().css({ width: 'auto' });
				base.data.pauseTime = base.data.options.delay;
				base.data.pause = true;
			});
		},
		destroy: function () {
			return this.each(function () {
				var base = $.fn.swishCarousel.setupData(this);
				base.$el.swishCarousel("stop");
				// Unbind all events //
			});
		}
	};

	$.fn.swishCarousel = function (method) {

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
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
		focusFix: true,
		interrupt: true,
		onAction: "stop",
		pager: false,
		pagerAuto: false,
		pagerElement: '.pager',
		poll: false,
		pollTimer: 500,
		responsive: true,
		responsiveWidth: 100,
		sequenceDelay: 500,
		startPosition: 1,
		step: 1,
		timer: false,
		useTouch: true
	};

	// public functions definition

	$.fn.swishCarousel.setupData = function (el) {
		var base = { el: el, $el: $(el) };
		base.data = base.$el.data('swishCarousel');
		if (!base.data) $.error('swishCarousel | Calling a none initialiser method on an object without an initialised plugin.');
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