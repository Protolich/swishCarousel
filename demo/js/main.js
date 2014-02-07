var _log;
(function(){
	_log = $('#log');
	$('.carousel').swishCarousel({
		animation: 'slide',
		timer: true
	});
})();

function logInfo(text) {
	_log.text(_log.text() + "\n " + text);
}