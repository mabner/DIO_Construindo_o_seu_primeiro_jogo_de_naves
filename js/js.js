function start() {
	$('#start').hide();

	$('#gameBackground').append("<div id='player' class='animation1'></div>");
	$('#gameBackground').append("<div id='enemy1' class='animation2'></div>");
	$('#gameBackground').append("<div id='enemy2'></div>");
	$('#gameBackground').append("<div id='friend' class='animation3'></div>");
	$('#gameBackground').append("<div id='score'></div>");
	$('#gameBackground').append("<div id='energy'></div>");

	// game variables
	var game = {};
	var gameSpeed = 5;
	var endGame = false;
	var canShoot = true;
	var positionY = parseInt(Math.random() * 334);
	var score = 0;
	var saved = 0;
	var lost = 0;
	var actualEnergy = 3;
	var KEYS = {
		up: 38,
		down: 40,
		D: 68,
	};

	game.pressed = [];

	var soundShoot = document.getElementById('soundShoot');
	var soundExplosion = document.getElementById('explosionSound');
	var music = document.getElementById('music');
	var soundGameOver = document.getElementById('soundGameOver');
	var soundLost = document.getElementById('soundLost');
	var soundRescue = document.getElementById('soundRescue');

	music.addEventListener(
		'ended',
		function () {
			music.currentTime = 0;
			music.play();
		},
		false,
	);
	music.play();

	$(document).keydown(function (e) {
		game.pressed[e.which] = true;
	});

	$(document).keyup(function (e) {
		game.pressed[e.which] = false;
	});

	game.timer = setInterval(loop, 30);

	function loop() {
		moveBackground();
		movePlayer();
		moveEnemy1();
		moveEnemy2();
		moveFriend();
		collision();
		scoreBoard();
		energyBoard();
	}

	function moveBackground() {
		left = parseInt($('#gameBackground').css('background-position'));
		$('#gameBackground').css('background-position', left - 1);
	}

	function movePlayer() {
		if (game.pressed[KEYS.up]) {
			var shootPosition = parseInt($('#player').css('top'));
			$('#player').css('top', shootPosition - 10);
			if (shootPosition <= 0) {
				$('#player').css('top', shootPosition + 10);
			}
		}

		if (game.pressed[KEYS.down]) {
			var shootPosition = parseInt($('#player').css('top'));
			$('#player').css('top', shootPosition + 10);
			if (shootPosition >= 434) {
				$('#player').css('top', shootPosition - 10);
			}
		}

		if (game.pressed[KEYS.D]) {
			disparo();
		}
	}

	function moveEnemy1() {
		posicaoX = parseInt($('#enemy1').css('left'));
		$('#enemy1').css('left', posicaoX - gameSpeed);
		$('#enemy1').css('top', positionY);

		if (posicaoX <= 0) {
			positionY = parseInt(Math.random() * 334);
			$('#enemy1').css('left', 694);
			$('#enemy1').css('top', positionY);
		}
	}

	function moveEnemy2() {
		posicaoX = parseInt($('#enemy2').css('left'));
		$('#enemy2').css('left', posicaoX - 3);

		if (posicaoX <= 0) {
			$('#enemy2').css('left', 775);
		}
	}

	function moveFriend() {
		posicaoX = parseInt($('#friend').css('left'));
		$('#friend').css('left', posicaoX + 1);

		if (posicaoX > 906) {
			$('#friend').css('left', 0);
		}
	}

	function disparo() {
		if (canShoot == true) {
			soundShoot.play();
			canShoot = false;

			shootPosition = parseInt($('#player').css('top'));
			posicaoX = parseInt($('#player').css('left'));
			tiroX = posicaoX + 190;
			topoTiro = shootPosition + 37;
			$('#gameBackground').append("<div id='disparo'></div");
			$('#disparo').css('top', topoTiro);
			$('#disparo').css('left', tiroX);

			var tempoDisparo = window.setInterval(executaDisparo, 30);
		}

		function executaDisparo() {
			posicaoX = parseInt($('#disparo').css('left'));
			$('#disparo').css('left', posicaoX + 15);

			if (posicaoX > 900) {
				window.clearInterval(tempoDisparo);
				tempoDisparo = null;
				$('#disparo').remove();
				canShoot = true;
			}
		}
	}

	function collision() {
		var collision1 = $('#player').collision($('#enemy1'));
		var collision2 = $('#player').collision($('#enemy2'));
		var collision3 = $('#disparo').collision($('#enemy1'));
		var collision4 = $('#disparo').collision($('#enemy2'));
		var collision5 = $('#player').collision($('#friend'));
		var collision6 = $('#enemy2').collision($('#friend'));

		if (collision1.length > 0) {
			actualEnergy--;
			inimigo1X = parseInt($('#enemy1').css('left'));
			inimigo1Y = parseInt($('#enemy1').css('top'));
			explosion1(inimigo1X, inimigo1Y);

			positionY = parseInt(Math.random() * 334);
			$('#enemy1').css('left', 694);
			$('#enemy1').css('top', positionY);
		}

		if (collision2.length > 0) {
			actualEnergy--;
			inimigo2X = parseInt($('#enemy2').css('left'));
			inimigo2Y = parseInt($('#enemy2').css('top'));
			explosion2(inimigo2X, inimigo2Y);

			$('#enemy2').remove();

			repositionFriend2();
		}

		if (collision3.length > 0) {
			gameSpeed = gameSpeed + 0.3;
			score = score + 100;
			inimigo1X = parseInt($('#enemy1').css('left'));
			inimigo1Y = parseInt($('#enemy1').css('top'));

			explosion1(inimigo1X, inimigo1Y);
			$('#disparo').css('left', 950);

			positionY = parseInt(Math.random() * 334);
			$('#enemy1').css('left', 694);
			$('#enemy1').css('top', positionY);
		}

		if (collision4.length > 0) {
			score = score + 50;
			inimigo2X = parseInt($('#enemy2').css('left'));
			inimigo2Y = parseInt($('#enemy2').css('top'));
			$('#enemy2').remove();

			explosion2(inimigo2X, inimigo2Y);
			$('#disparo').css('left', 950);

			repositionFriend2();
		}

		if (collision5.length > 0) {
			soundRescue.play();
			saved++;
			repositionFriend();
			$('#friend').remove();
		}

		if (collision6.length > 0) {
			lost++;
			friendX = parseInt($('#friend').css('left'));
			friendY = parseInt($('#friend').css('top'));
			explosion3(friendX, friendY);
			$('#friend').remove();

			repositionFriend();
		}
	}

	function explosion1(enemy1X, enemy1Y) {
		soundExplosion.play();
		$('#gameBackground').append("<div id='explosao1'></div");
		$('#explosao1').css('background-image', 'url(img/explosao.png)');
		var div = $('#explosao1');
		div.css('top', enemy1Y);
		div.css('left', enemy1X);
		div.animate(
			{
				width: 200,
				opacity: 0,
			},
			'slow',
		);

		var explosionTime = window.setInterval(removeExplosion, 1000);

		function removeExplosion() {
			div.remove();
			window.clearInterval(explosionTime);
			explosionTime = null;
		}
	}

	function repositionFriend2() {
		var tempocollision4 = window.setInterval(reposiciona4, 5000);

		function reposiciona4() {
			window.clearInterval(tempocollision4);
			tempocollision4 = null;

			if (endGame == false) {
				$('#gameBackground').append('<div id=inimigo2></div');
			}
		}
	}

	function explosion2(inimigo2X, inimigo2Y) {
		soundExplosion.play();
		$('#gameBackground').append("<div id='explosao2'></div");
		$('#explosao2').css('background-image', 'url(img/explosao.png)');
		var div2 = $('#explosao2');
		div2.css('top', inimigo2Y);
		div2.css('left', inimigo2X);
		div2.animate(
			{
				width: 200,
				opacity: 0,
			},
			'slow',
		);

		var explosionTime2 = window.setInterval(removeExplosion2, 1000);

		function removeExplosion2() {
			div2.remove();
			window.clearInterval(explosionTime2);
			explosionTime2 = null;
		}
	}

	function repositionFriend() {
		var friendTime = window.setInterval(reposition6, 6000);

		function reposition6() {
			window.clearInterval(friendTime);
			friendTime = null;

			if (endGame == false) {
				$('#gameBackground').append(
					"<div id='friend' class='animation3'></div>",
				);
			}
		}
	}

	function explosion3(friendX, friendY) {
		soundLost.play();
		$('#gameBackground').append("<div id='explosao3' class='animation4'></div");
		$('#explosao3').css('top', friendY);
		$('#explosao3').css('left', friendX);
		var explosionTime3 = window.setInterval(resetExplosion3, 1000);

		function resetExplosion3() {
			$('#explosao3').remove();
			window.clearInterval(explosionTime3);
			explosionTime3 = null;
		}
	}

	function scoreBoard() {
		$('#score').html(
			'<h2> Score: ' + score + ' Saved: ' + saved + ' Lost: ' + lost + '</h2>',
		);
	}

	function energyBoard() {
		if (actualEnergy == 3) {
			$('#energy').css('background-image', 'url(img/energy3.png)');
		}

		if (actualEnergy == 2) {
			$('#energy').css('background-image', 'url(img/energy2.png)');
		}

		if (actualEnergy == 1) {
			$('#energy').css('background-image', 'url(img/energy1.png)');
		}

		if (actualEnergy == 0) {
			$('#energy').css('background-image', 'url(img/energy0.png)');

			gameOver();
		}
	}

	function gameOver() {
		endGame = true;
		music.pause();
		soundGameOver.play();

		window.clearInterval(game.timer);
		game.timer = null;

		$('#player').remove();
		$('#enemy1').remove();
		$('#enemy2').remove();
		$('#friend').remove();

		$('#gameBackground').append("<div id='fim'></div>");

		$('#fim').html(
			'<h1> Game Over </h1><p>Your score is: ' +
				score +
				'</p>' +
				"<div id='reinicia' onClick=restartGame()><button>Play again!</button></div>",
		);
	}
}

function restartGame() {
	soundGameOver.pause();
	$('#fim').remove();
	start();
}
