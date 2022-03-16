function start() {
	$('#inicio').hide();

	$('#fundoGame').append("<div id='jogador' class='anima1'></div>");
	$('#fundoGame').append("<div id='inimigo1' class='anima2'></div>");
	$('#fundoGame').append("<div id='inimigo2'></div>");
	$('#fundoGame').append("<div id='amigo' class='anima3'></div>");
	$('#fundoGame').append("<div id='score'></div>");
	$('#fundoGame').append("<div id='energia'></div>");

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

	var soundShoot = document.getElementById('somDisparo');
	var soundExplosion = document.getElementById('somExplosao');
	var music = document.getElementById('musica');
	var soundGameOver = document.getElementById('somGameover');
	var soundLost = document.getElementById('somPerdido');
	var soundRescue = document.getElementById('somResgate');

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
		colisao();
		scoreBoard();
		energia();
	}

	function moveBackground() {
		esquerda = parseInt($('#fundoGame').css('background-position'));
		$('#fundoGame').css('background-position', esquerda - 1);
	}

	function movePlayer() {
		if (game.pressed[KEYS.up]) {
			var topo = parseInt($('#jogador').css('top'));
			$('#jogador').css('top', topo - 10);
			if (topo <= 0) {
				$('#jogador').css('top', topo + 10);
			}
		}

		if (game.pressed[KEYS.down]) {
			var topo = parseInt($('#jogador').css('top'));
			$('#jogador').css('top', topo + 10);
			if (topo >= 434) {
				$('#jogador').css('top', topo - 10);
			}
		}

		if (game.pressed[KEYS.D]) {
			disparo();
		}
	}

	function moveEnemy1() {
		posicaoX = parseInt($('#inimigo1').css('left'));
		$('#inimigo1').css('left', posicaoX - gameSpeed);
		$('#inimigo1').css('top', positionY);

		if (posicaoX <= 0) {
			positionY = parseInt(Math.random() * 334);
			$('#inimigo1').css('left', 694);
			$('#inimigo1').css('top', positionY);
		}
	}

	function moveEnemy2() {
		posicaoX = parseInt($('#inimigo2').css('left'));
		$('#inimigo2').css('left', posicaoX - 3);

		if (posicaoX <= 0) {
			$('#inimigo2').css('left', 775);
		}
	}

	function moveFriend() {
		posicaoX = parseInt($('#amigo').css('left'));
		$('#amigo').css('left', posicaoX + 1);

		if (posicaoX > 906) {
			$('#amigo').css('left', 0);
		}
	}

	function disparo() {
		if (canShoot == true) {
			soundShoot.play();
			canShoot = false;

			topo = parseInt($('#jogador').css('top'));
			posicaoX = parseInt($('#jogador').css('left'));
			tiroX = posicaoX + 190;
			topoTiro = topo + 37;
			$('#fundoGame').append("<div id='disparo'></div");
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

	function colisao() {
		var colisao1 = $('#jogador').collision($('#inimigo1'));
		var colisao2 = $('#jogador').collision($('#inimigo2'));
		var colisao3 = $('#disparo').collision($('#inimigo1'));
		var colisao4 = $('#disparo').collision($('#inimigo2'));
		var colisao5 = $('#jogador').collision($('#amigo'));
		var colisao6 = $('#inimigo2').collision($('#amigo'));

		if (colisao1.length > 0) {
			actualEnergy--;
			inimigo1X = parseInt($('#inimigo1').css('left'));
			inimigo1Y = parseInt($('#inimigo1').css('top'));
			explosao1(inimigo1X, inimigo1Y);

			positionY = parseInt(Math.random() * 334);
			$('#inimigo1').css('left', 694);
			$('#inimigo1').css('top', positionY);
		}

		if (colisao2.length > 0) {
			actualEnergy--;
			inimigo2X = parseInt($('#inimigo2').css('left'));
			inimigo2Y = parseInt($('#inimigo2').css('top'));
			explosao2(inimigo2X, inimigo2Y);

			$('#inimigo2').remove();

			reposicionaInimigo2();
		}

		if (colisao3.length > 0) {
			gameSpeed = gameSpeed + 0.3;
			score = score + 100;
			inimigo1X = parseInt($('#inimigo1').css('left'));
			inimigo1Y = parseInt($('#inimigo1').css('top'));

			explosao1(inimigo1X, inimigo1Y);
			$('#disparo').css('left', 950);

			positionY = parseInt(Math.random() * 334);
			$('#inimigo1').css('left', 694);
			$('#inimigo1').css('top', positionY);
		}

		if (colisao4.length > 0) {
			score = score + 50;
			inimigo2X = parseInt($('#inimigo2').css('left'));
			inimigo2Y = parseInt($('#inimigo2').css('top'));
			$('#inimigo2').remove();

			explosao2(inimigo2X, inimigo2Y);
			$('#disparo').css('left', 950);

			reposicionaInimigo2();
		}

		if (colisao5.length > 0) {
			soundRescue.play();
			saved++;
			reposicionaAmigo();
			$('#amigo').remove();
		}

		if (colisao6.length > 0) {
			lost++;
			amigoX = parseInt($('#amigo').css('left'));
			amigoY = parseInt($('#amigo').css('top'));
			explosao3(amigoX, amigoY);
			$('#amigo').remove();

			reposicionaAmigo();
		}
	}

	function explosao1(inimigo1X, inimigo1Y) {
		soundExplosion.play();
		$('#fundoGame').append("<div id='explosao1'></div");
		$('#explosao1').css('background-image', 'url(imgs/explosao.png)');
		var div = $('#explosao1');
		div.css('top', inimigo1Y);
		div.css('left', inimigo1X);
		div.animate(
			{
				width: 200,
				opacity: 0,
			},
			'slow',
		);

		var tempoExplosao = window.setInterval(removeExplosao, 1000);

		function removeExplosao() {
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao = null;
		}
	}

	function reposicionaInimigo2() {
		var tempoColisao4 = window.setInterval(reposiciona4, 5000);

		function reposiciona4() {
			window.clearInterval(tempoColisao4);
			tempoColisao4 = null;

			if (endGame == false) {
				$('#fundoGame').append('<div id=inimigo2></div');
			}
		}
	}

	function explosao2(inimigo2X, inimigo2Y) {
		soundExplosion.play();
		$('#fundoGame').append("<div id='explosao2'></div");
		$('#explosao2').css('background-image', 'url(imgs/explosao.png)');
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

		var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

		function removeExplosao2() {
			div2.remove();
			window.clearInterval(tempoExplosao2);
			tempoExplosao2 = null;
		}
	}

	function reposicionaAmigo() {
		var tempoAmigo = window.setInterval(reposiciona6, 6000);

		function reposiciona6() {
			window.clearInterval(tempoAmigo);
			tempoAmigo = null;

			if (endGame == false) {
				$('#fundoGame').append("<div id='amigo' class='anima3'></div>");
			}
		}
	}

	function explosao3(amigoX, amigoY) {
		soundLost.play();
		$('#fundoGame').append("<div id='explosao3' class='anima4'></div");
		$('#explosao3').css('top', amigoY);
		$('#explosao3').css('left', amigoX);
		var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

		function resetaExplosao3() {
			$('#explosao3').remove();
			window.clearInterval(tempoExplosao3);
			tempoExplosao3 = null;
		}
	}

	function scoreBoard() {
		$('#score').html(
			'<h2> Score: ' + score + ' Saved: ' + saved + ' Lost: ' + lost + '</h2>',
		);
	}

	function energia() {
		if (actualEnergy == 3) {
			$('#energia').css('background-image', 'url(imgs/energia3.png)');
		}

		if (actualEnergy == 2) {
			$('#energia').css('background-image', 'url(imgs/energia2.png)');
		}

		if (actualEnergy == 1) {
			$('#energia').css('background-image', 'url(imgs/energia1.png)');
		}

		if (actualEnergy == 0) {
			$('#energia').css('background-image', 'url(imgs/energia0.png)');

			gameOver();
		}
	}

	function gameOver() {
		endGame = true;
		music.pause();
		soundGameOver.play();

		window.clearInterval(game.timer);
		game.timer = null;

		$('#jogador').remove();
		$('#inimigo1').remove();
		$('#inimigo2').remove();
		$('#amigo').remove();

		$('#fundoGame').append("<div id='fim'></div>");

		$('#fim').html(
			'<h1> Game Over </h1><p>Your score is: ' +
				score +
				'</p>' +
				"<div id='reinicia' onClick=reiniciaJogo()><button>Play again!</button></div>",
		);
	}
}

function reiniciaJogo() {
	somGameover.pause();
	$('#fim').remove();
	start();
}
