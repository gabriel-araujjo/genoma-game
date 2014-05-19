var Dice = (function(Kinetic, $){
  var Dice = function(){
	  var dice = this
	    , value = Math.ceil(Math.random()*6)
	    , shape
	    , loadCB = [];
    
    dice.dice = function(done){
		  value = Math.ceil(Math.random()*6);
		  function rollDice(){
		  	shape.animation('rolling');
		  }
		  if(shape){
		  	rollDice();
		  }else{
		  	dice.load(rollDice);
		  }
		  dice.onStopRolling = done;
	  };
	      
    dice.syncWithServer = function(){

	  };
    
    function _init(){
      _configureShape();
    }

	  function _configureShape(){
	    var diceSprite = new Image();
      diceSprite.onload = function() {
        shape = new Kinetic.Sprite({
          x: $(window).width()-200,
          y: $(window).height()-200,
          image: diceSprite,
          animation: '1',
          animations: {
          	'rolling': [
               // x, y, width, height (16 frames)
               0,0,189,199,
               189,0,189,199,
               378,0,189,199,
               567,0,189,199,
               756,0,189,199,
               0,199,189,199,
               189,199,189,199,
               378,199,189,199
            ],
            '1': [
              // x, y, width, height (1 frame)
              567,199,189,199
            ],
            '2': [
              // x, y, width, height (1 frame)
              756,199,189,199
            ],
            '3': [
              // x, y, width, height (1 frame)
              0,398,189,199
            ],
            '4': [
              // x, y, width, height (1 frame)
              189,398,189,199
            ],
            '5': [
              // x, y, width, height (1 frame)
              378,398,189,199
            ],
            '6': [
              // x, y, width, height (1 frame)
              567,398,189,199
            ]
          },
          frameRate: 24,
          frameIndex: 0
        });
				shape.setDraggable(true);
		    _configureDiceEvents();

		    _load();
        shape.start();
      };
      diceSprite.src = '/images/sprite.png';
	  }
	  
	  function _load(){
	  	for(var i in loadCB){
	  		loadCB[i]();
	  	}
	  }
	  
	  dice.load = function(f){
	  	if(typeof f === 'function') loadCB.push(f);
	  }
	  
	  function _configureDiceEvents(){
	    var frameCount = 0;
	    shape.on('frameIndexChange', function(evt) {
        if (shape.animation() === 'rolling' ) {
        	if(++frameCount > 16){
            shape.animation(value);
            frameCount = 1;
      	  }
        }else if(frameCount == 1){
        	typeof dice.onStopRolling == 'function' && dice.onStopRolling();
        	frameCount = 0;
        }
      });
	  }
	  
	  dice.__defineGetter__('shape', function(){return shape;});
    dice.__defineGetter__('value', function(){return value;});
    
    _init();
  };
  
  return Dice;
})(Kinetic, jQuery)
