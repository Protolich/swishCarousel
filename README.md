# swishCarousel

_Take heed!_

Although the basic animations work correctly ( _most_ of the time ) alot of the functionality within this plugin is still in development and so things may not work as expected.

One of these days I'll have a proper versioning system and stable releases and everything. Until then good luck if you need a hand get me on Twitter @protolich.

Happy hacking or like whatever.

## Creating a carousel

A carousel can be created using any element which has child elements.

	<ul class="carousel-list">
		<li>Item 1</li>
		<li>Item 2</li>
		<li>Item 3</li>
	</ul>
	
and
	
	<div class="carousel-panel">
		<div>Item 1</div>
		<div>Item 2</div>
		<div>Item 3</div>
	</div>
	
Are both equally suitable for using in a carousel

Call the carousel as you would any other jQuery plugin

	$('.carousel-list').swishCarousel();

## Exposing the carousel

You can expose an object for direct access to some of a carousels functions.
Obviously you can only expose a carousel that has already been created.

	var carousel = $('.carousel-list').swishCarousel('expose');
	
### Exposed functions

* goTo( _index_ ) - move the carousel where _index_ is 'first', 'last', 'next', 'previous' or an integer index.
* pause - pause the carousel, maintaining current timer position.
* play - resumes the carousel from either a paused or stopped state.
* stop - stop the carousel, clears the timer.
* destroy - restore the carousel to a pre-initialised state.

### Examples

	carousel.goTo('next'); // Go to the next item
	
	carousel.goTo(2); // Go to the second item
	
	carousel.pause(); // Pause the carousel
