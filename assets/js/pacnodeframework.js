function checkKey(e) {
	switch (e.keyCode) {
	case 115:
	case 83:
		moveDown();
		break;
	case 119:
	case 87:
		moveUp();
		break;
	case 100:
	case 68:
		moveRight();
		break;
	case 97:
	case 65:
		moveLeft();
		break;
	default:
		break;
	}
}

if ($.browser.mozilla) {
	$(document).keypress(checkKey);
} else {
	$(document).keydown(checkKey);
}

// movement variables
var speed = 50;
var distance = 50;

function moveUp() {
	console.log("cima");

	$('#pacman').animate({

		bottom : '+=' + distance + 'px'

	}, speed, function() {
		// Animation complete.
	});
}

// RIGHT
function moveDown() {
	console.log("baixo");
	$('#pacman').animate({

		bottom : '+=-' + distance + 'px'

	}, speed, function() {
		// Animation complete.
	});
}

// RIGHT
function moveRight() {
	console.log("direita");
	$('#pacman').animate({

		marginLeft : '+=' + distance + 'px'

	}, speed, function() {
		// Animation complete.
	});
}

// LEFT
function moveLeft() {
	console.log("esquerda");
	$('#pacman').animate({

		marginLeft : '-=' + distance + 'px'

	}, speed, function() {
		// Animation complete.
	});
}