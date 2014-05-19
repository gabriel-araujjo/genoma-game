var Question = (function(){
	var Question = function(wording, options, right_answer){
		this.wording = wording;
		this.options = options;
		
		this.checkAnswer = function(answer){
			//TODO: make anything to test subjective questions.
			return answer == right_answer;
		};
	}
})();
