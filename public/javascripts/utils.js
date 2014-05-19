var utils = (function($){
	
  $.fn.drags = function(opt) {

      opt = $.extend({handle:"",cursor:"default"}, opt);

      if(opt.handle === "") {
          var $el = this;
      } else {
          var $el = this.find(opt.handle);
      }

      return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
          if(opt.handle === "") {
              var $drag = $(this).addClass('draggable');
          } else {
              var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
          }
          var z_idx = $drag.css('z-index'),
              drg_h = $drag.outerHeight(),
              drg_w = $drag.outerWidth(),
              pos_y = $drag.offset().top + drg_h - e.pageY,
              pos_x = $drag.offset().left + drg_w - e.pageX;
          $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
              $('.draggable').offset({
                  top:e.pageY + pos_y - drg_h,
                  left:e.pageX + pos_x - drg_w
              }).on("mouseup", function() {
                  $(this).removeClass('draggable').css('z-index', z_idx);
              });
          });
          e.preventDefault(); // disable selection
      }).on("mouseup", function() {
          if(opt.handle === "") {
              $(this).removeClass('draggable');
          } else {
              $(this).removeClass('active-handle').parent().removeClass('draggable');
          }
      });

  }

	
  var questions = [],
   answers = [],
   onloadQuestions = [],
   loadedQuestions = false,
   onloadAnswers = [],
   loadedAnswers = false,
   ready = false;
   onready = [function(){ready = true;}],
   curQuestion = 0;
	
  $.getJSON('/questions.json', function(data){
  	questions = data;
  	loadedQuestions = true;
  	onloadQuestions.map(function(cb){
  		cb();
  	});
  	loadedAnswers && onready.map(function(cb){
  		cb();
  	});
  });
  
  $.ajax({
  	url:'/answers',
  	method: 'post',
  	data: {pswd:Date.now()},
  	success: function(data){
  		answers = data;
  		loadedAnswers = true;
  		onloadAnswers.map(function(cb){
				cb();
			});
			loadedQuestions && onready.map(function(cb){
				cb();
			});
  	}
  });
    
  function shuffleQuestions(){
  	for(var j, x, y, i = questions.length; i; j = parseInt(Math.random() * i), x = questions[--i], y = answers[i], questions[i] = questions[j], answers[i] = answers[j], questions[j] = x, answers[j] = y);
  };
  
  onready.push(function(){
  	shuffleQuestions();
  });
  
	var utils = {};
	
	utils.getQuestion = function(cb){
		var getQuestion = function(){
				var q;
				while(true){
					q=questions[curQuestion++];
					if(q.options){
						return cb(null,q);
					}
					if(curQuestion>=questions.length){
						shuffleQuestions();
						curQuestion = 0;
					}
				}
			};
		if(ready) return getQuestion();
		onready.push(getQuestion);
	};
	
	utils.checkAnswer = function(question, candidate_answer, cb){
		var check = function(){
			var rightAnswer = answers[questions.indexOf(question)];
			return cb(rightAnswer == candidate_answer);
		};
		if(ready) return check();
		onready.push(check);
	};
	
	var wrapper = $('<div>', {'class':'q-wrapper'}).appendTo($('body'));
	var playerText = $('<div>', {'class':'q-player-text'}).appendTo(wrapper);
	var wording = $('<div>', {'class':'q-wording'}).appendTo(wrapper);
	var options = $('<ol>', {'class':'q-options'}).appendTo(wrapper);
	var button = $('<button>', {'class':'q-submit'}).text('Responder').appendTo(wrapper);
	
	
	wrapper.drags({handle:'.q-player-text'});
	
	options.on('click', 'li', function(e){
		var selected = options.find('.selected');
		var clicked = $(e.target);
		selected.removeClass('selected');
		if(!clicked.is(selected)){
			clicked.addClass('selected');
		}
	});
	
	utils.showQuestion = function(player, question, cb){
		playerText.text(player.name);
		wrapper[0].className = wrapper[0].className.replace(/\bcolor\-.*?\b/g, '');
		wrapper.addClass('color-'+player.color);
		wording.text(question.wording);
		options.html('');
		if(question.options){
			for (var i in question.options){
				options.append($('<li>'+question.options[i]+'</li>'));
			}
		}
		
		button.on('click', function(){
			var selected = options.find('.selected');
			if(selected){
				button.off('click');
				utils.checkAnswer(question, selected.index(), cb);
			}else{
				utils.checkAnswer(question, -1, cb);
			}
		});
	}
	
	utils.RectAccum = function(){
		this.left=0;
		this.top=0;
		this.right=0;
		this.bottom=0;
		this.startX=true;
		this.startY=true;
	};
	
	utils.RectAccum.prototype={
		width:function(){
			return this.right-this.left
		},
		height:function(){
			return this.bottom-this.top
		},
		addX:function(x){
			this.left=(this.startX) ? x : Math.min(x,this.left);
			this.right=(this.startX) ? x : Math.max(x,this.right);
			this.startX=false;
		},
		addY:function(y){
			this.top=(this.startY) ? y : Math.min(y,this.top);
			this.bottom=(this.startY) ? y : Math.max(y,this.bottom);
			this.startY=false;
		},
		addXY:function(x,y){
			this.addX(x); this.addY(y);
		}
	};
		 
	utils.getPathDimensions = function(path){
		var data=path.dataArray;
		var ra=new RectAccum();
		for(var i=0;i<data.length;i++){
		 switch(data[i].command){
		  case "L":
		   ra.addXY(data[i].start.x,data[i].start.y);
		   ra.addXY(data[i].points[0],data[i].points[1]);
		   break;
		 }
		}
		return {left:ra.left,top:ra.top,width:ra.width(),height:ra.height()}
	};
		
	return utils;
})(jQuery);
