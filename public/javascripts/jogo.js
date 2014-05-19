var Jogo = (function(jogadores, cartas){
	this.tabuleiro = new Tabuleiro();
	this.jogadores = [];
	this.daVez;
	this.cartas = [];
	this.dado = new Dado();

	var stage = new Kinetic.Stage({
		container: 'container',
		width: $(window).width(),
		height: $(window).height()
	});

	
})();