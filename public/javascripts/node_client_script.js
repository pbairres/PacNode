// socket.io connection
var socket = io.connect();

// //////////////////////////////
// SERVER CALLS
// //////////////////////////////

// on connect
socket.on('connect', function() {
	$('#chat').addClass('connected');

});

// announcement
socket.on('announcement', function(msg) {
	$('#lines').append($('<p>').append($('<em>').text(msg)));
});

// user moves
socket.on('user movement', function(nick, direction) {

	movePacman(null, direction);

});

// new nickname
socket.on('nicknames', function(nicknames) {
	$('#nicknames').empty().append($('<span>Online: </span>'));
	for ( var i in nicknames) {
		$('#nicknames').append($('<b>').text(nicknames[i]));
	}
	// you can now control your pacman
	$(document).keydown(checkKey);
});

socket.on('user message', message);

// on reconnect
socket.on('reconnect', function() {
	$('#lines').remove();
	message('System', 'Reconnected to the server');
});

// reconnecting message
socket.on('reconnecting', function() {
	message('System', 'Attempting to re-connect to the server');
});

// error message
socket.on('error', function(e) {
	message('System', e ? e : 'A unknown error occurred');
});

// new message
function message(from, msg) {
	$('#lines').append($('<p>').append($('<b>').text(from), msg));
}

// //////////////////////////////
// CLIENT CALLS
// //////////////////////////////

// dom manipulation
$(function() {

	// focus inputbox
	$("#nick").focus();

	// set nickname on cient
	$('#set-nickname').submit(function(ev) {
		socket.emit('nickname', $('#nick').val(), function(set) {
			if (!set) {
				clear();
				return $('#chat').addClass('nickname-set');
			}
			$('#nickname-err').css('visibility', 'visible');
		});
		return false;
	});

	// send message client call
	// $('#send-message').submit(function() {
	// message('me', $('#message').val());
	// socket.emit('user message', $('#message').val());
	// clear();
	// $('#lines').get(0).scrollTop = 10000000;
	// return false;
	// });

	function clear() {
		$('#message').val('').focus();
	}
	;
});

// //////////////////////////////
// MOVEMENT
// //////////////////////////////

function checkKey(e) {
	switch (e.keyCode) {
	case 115:
	case 83:
		movePacman(null, "down");
		socket.emit('user movement', "down");
		break;
	case 119:
	case 87:
		movePacman(null, "up");
		socket.emit('user movement', "up");
		break;
	case 100:
	case 68:
		movePacman(null, "right");
		socket.emit('user movement', "right");
		break;
	case 97:
	case 65:
		movePacman(null, "left");
		socket.emit('user movement', "left");
		break;
	default:
		break;
	}
}

function findPosX(obj) {
	var curleft = 0;
	if (obj.offsetParent)
		while (1) {
			curleft += obj.offsetLeft;
			if (!obj.offsetParent)
				break;
			obj = obj.offsetParent;
		}
	else if (obj.x)
		curleft += obj.x;
	return curleft;
}

function findPosY(obj) {
	var curtop = 0;
	if (obj.offsetParent)
		while (1) {
			curtop += obj.offsetTop;
			if (!obj.offsetParent)
				break;
			obj = obj.offsetParent;
		}
	else if (obj.y)
		curtop += obj.y;
	return curtop;
}

// movement variables
var speed = 50;
var distance = 50 + "px";

function movePacman(imageId, direction) {

	if (imageId == null) {
		imageId = '#pacman';
	}
	console.log(imageId + ": going -> " + direction + " | L:"
			+ $(imageId).position().left+" T:"+$(imageId).position().top);

	switch (direction) {

	case "up":
		$(imageId).animate({
			bottom : '+=' + distance
		}, speed, function() {
			// Animation complete.
		});

		break;

	case "down":
		$(imageId).animate({
			bottom : '+=-' + distance
		}, speed, function() {
			// Animation complete.
		});

		break;

	case "left":
		$(imageId).animate({
			marginLeft : '-=' + distance
		}, speed, function() {
			// Animation complete.
		});

		break;

	case "right":
		$(imageId).animate({
			marginLeft : '+=' + distance
		}, speed, function() {
			// Animation complete.
		});

		break;
	}
}
