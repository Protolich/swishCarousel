# swishCarousel

_Take heed!_

Although the basic animations work correctly ( _most_ of the time ) alot of the functionality within this plugin is still in development and so things may not work as expected.

One of these days I'll have a proper versioning system and stable releases and everything. Until then good luck if you need a hand get me on Twitter @protolich.

Happy hacking or like whatever.

## Requirements

jQuery - The newer the better. Cannot guarantee backward compatability. 1.9 seems stable enough.

Modernizr - The newer the better. Developed with 2.6.2.

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

## Options

<table>
	<thead>
		<th>Name</th>
		<th>Type</th>
		<th>Options</th>
		<th>Description</th>
		<th>Default Value</th>
	</thead>
	<tr>
		<td>animation</td>
		<td>string</td>
		<td>slide, fade</td>
		<td></td>
		<td>slide</td>
	</tr>
	<tr>
		<td>animSpeed</td>
		<td>int</td>
		<td>(milliseconds)</td>
		<td></td>
		<td>300</td>
	</tr>
	<tr>
		<td>autoSetup</td>
		<td>boolean</td>
		<td>ture, false</td>
		<td></td>
		<td>false</td>
	</tr>
	<tr>
		<td>autoStart</td>
		<td>boolean</td>
		<td>true, false</td>
		<td></td>
		<td>true</td>
	</tr>
	<tr>
		<td>buttons</td>
		<td>boolean</td>
		<td>true, false</td>
		<td></td>
		<td>true</td>
	</tr>
	<tr>
		<td>buttonNext</td>
		<td>string</td>
		<td>"a.next"</td>
		<td></td>
		<td>null</td>
	</tr>
	<tr>
		<td>buttonPrev</td>
		<td>string</td>
		<td>"a.prev"</td>
		<td></td>
		<td>null</td>
	</tr>
	<tr>
		<td>buttonFirst</td>
		<td>string</td>
		<td>"a.first"</td>
		<td></td>
		<td>null</td>
	</tr>
	<tr>
		<td>buttonLast</td>
		<td>string</td>
		<td>"a.last"</td>
		<td></td>
		<td>null</td>
	</tr>
	<tr>
		<td>buttonPlay</td>
		<td></td>
		<td></td>
		<td></td>
		<td>null</td>
	</tr>
	<tr>
		<td>buttonPause</td>
		<td>string</td>
		<td>"a.pause"</td>
		<td></td>
		<td>null</td>
	</tr>
	<tr>
		<td>buttonStop</td>
		<td>string</td>
		<td>"a.stop"</td>
		<td></td>
		<td>null</td>
	</tr>
	<tr>
		<td>delay</td>
		<td>int</td>
		<td>(milliseconds)</td>
		<td></td>
		<td>5000</td>
	</tr>
	<tr>
		<td>easing</td>
		<td>string</td>
		<td>"linear"</td>
		<td></td>
		<td>"linear"</td>
	</tr>
	<tr>
		<td>css3easing</td>
		<td>string</td>
		<td>"ease"</td>
		<td></td>
		<td>"ease"</td>
	</tr>
	<tr>
		<td>focusFix</td>
		<td>boolean</td>
		<td>true, false</td>
		<td></td>
		<td>true</td>
	</tr>
	<tr>
		<td>interrupt</td>
		<td>boolean</td>
		<td>true, false</td>
		<td></td>
		<td>true</td>
	</tr>
	<tr>
		<td>onAction</td>
		<td>string</td>
		<td>"stop"</td>
		<td></td>
		<td>"stop"</td>
	</tr>
	<tr>
		<td>pager</td>
		<td>boolean</td>
		<td>true, false</td>
		<td></td>
		<td>false</td>
	</tr>
	<tr>
		<td>pagerAuto</td>
		<td>boolean</td>
		<td>true, false</td>
		<td></td>
		<td>false</td>
	</tr>
	<tr>
		<td>pagerElement</td>
		<td>string</td>
		<td>".pager"</td>
		<td></td>
		<td>".pager"</td>
	</tr>
	<tr>
		<td>poll</td>
		<td>boolean</td>
		<td>true, false</td>
		<td></td>
		<td>false</td>
	</tr>
	<tr>
		<td>pollTimer</td>
		<td>int</td>
		<td>(milliseconds)</td>
		<td></td>
		<td>500</td>
	</tr>
	<tr>
		<td>responsive</td>
		<td>boolean</td>
		<td>true, false</td>
		<td></td>
		<td>true</td>
	</tr>
	<tr>
		<td>responsiveWidth</td>
		<td>int</td>
		<td></td>
		<td>How many items to show at once</td>
		<td>1</td>
	</tr>
	<tr>
		<td>sequenceDelay</td>
		<td>int</td>
		<td>(milliseconds)</td>
		<td></td>
		<td>500</td>
	</tr>
	<tr>
		<td>startPosition</td>
		<td>int</td>
		<td>1</td>
		<td></td>
		<td>1</td>
	</tr>
	<tr>
		<td>step</td>
		<td>int</td>
		<td>1</td>
		<td>How many items to go through with next / prev function.</td>
		<td>1</td>
	</tr>
	<tr>
		<td>timer</td>
		<td>boolean</td>
		<td>true, false</td>
		<td></td>
		<td>false</td>
	</tr>
	<tr>
		<td>useTouch</td>
		<td>boolean</td>
		<td>true, false</td>
		<td></td>
		<td>true</td>
	</tr>
</table>



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

## Acknowledgements

Using code from [Swipe](https://github.com/bradbirdsall/Swipe) by [Brad Birdsall](http://bradbirdsall.com/)

