var Player = (function(Kinetic){
  var Player = function(name, color){
	  var player = this
	    , position = player.position = 0
	    , shape;

    function _init(){
      player.name = name;
      player.color = color;
      _configureShape();
    }

    function _configureShape(){
      var bacteriumSprite = new Image();
      bacteriumSprite.onload = function() {
          shape = new Kinetic.Sprite({
          	x: 25,
          	y: 25,
          	offset: {x:25, y:25},
          	image: bacteriumSprite,
          	animation: color,
          	animations: {
	            	'red': [
	                  // x, y, width, height (6 frames)
	                  0,647,50,50,
	                  50,647,50,50,
	                  100,647,50,50,
	                  150,647,50,50,
	                  200,647,50,50,
	                  250,647,50,50
	              ],
	              'blue': [
	              	  0,647+50*1,50,50,
	                  50,647+50*1,50,50,
	                  100,647+50*1,50,50,
	                  150,647+50*1,50,50,
	                  200,647+50*1,50,50,
	                  250,647+50*1,50,50
	              ],
	              'yellow': [
	              	  0,647+50*2,50,50,
	                  50,647+50*2,50,50,
	                  100,647+50*2,50,50,
	                  150,647+50*2,50,50,
	                  200,647+50*2,50,50,
	                  250,647+50*2,50,50
	              ],
	              'green': [
	              	  0,647+50*3,50,50,
	                  50,647+50*3,50,50,
	                  100,647+50*3,50,50,
	                  150,647+50*3,50,50,
	                  200,647+50*3,50,50,
	                  250,647+50*3,50,50
	              ]
              },
              frameRate: 10,
              frameIndex: 0
          });
		      typeof player.onload == 'function' && player.onload();
          var randomTime = Math.floor(Math.random()*5)*100;
          setTimeout(function(){shape.start()}, randomTime);
      };
      
      bacteriumSprite.src = '/images/sprite.png';
    }

	  player.moveTo = function(x, y, cb){
		  if(typeof x === "object"){
			  y = x.y;
			  x = x.x;
		  }
		  if(shape){
			  (new Kinetic.Tween({
		          node: shape, 
		          duration: 1,
		          x: x,
		          y: y,
		          easing: Kinetic.Easings.StrongEaseInOut,
		          onFinish: function() {
		              typeof cb == 'function' && cb();
		          }
		      })).play();
		  }
	  }
	  Object.defineProperties(player, {
				"shape": { get: function () { return shape; } }
		});
	  
	  _init();
  };
  
  return Player;
})(Kinetic)
