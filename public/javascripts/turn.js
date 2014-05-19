var Turn = (function(utils){
	var Turn = function(dice, player, right, wrong){
		var turn = this;
		utils.getQuestion(function(err, question){
			if(err) {// no more questions maybe - end game
				turn.question = null;
				return;
			}
			utils.showQuestion(player, question, function(ok){
				if(ok){
					dice.dice(function(){
						right(dice.value);
						delete turn;
					});
				}else{
					wrong();
				}
			});
		});	
	};
	return Turn;
})(utils);
