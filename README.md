# swishCarousel

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