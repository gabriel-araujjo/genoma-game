var GenomaGame = (function(Kinetic, Dice, Player, Turn){
	
	var GenomaGame = function(scale, container){
		var game = this,
		blackSpaces = [2,18,28],
		whiteSpaces = [4,13,27],
		purpleSpaces = [8,22,34],
		loadCB = [],
		afterLoadCB = [],
		track = [],
		winner = null,
		loaded = false;
		
		function _init(){
			game.container = container;
			game.scale = scale;
			game.players = [];
		
			_createCanvas();
			_configureSpaces();
			_configurePlanets();
			_configureDice();
			game.load(function(next){
				track = [game.startPlanet].concat(game.spaces).concat(game.endPlanet);
				next && next();
			});
		}

		function _createCanvas(){
			var containerDOM = document.getElementById(game.container)
				, width = containerDOM.offsetWidth
				, height = containerDOM.offsetHeight;
			game.stage = new Kinetic.Stage({container:game.container, width: width, height: height});
			game.layer = new Kinetic.Layer();
			game.stage.add(game.layer);
		}

		function _configureSpaces(){
			var scale = game._scale;

			game.spaces = game.spaces || [];

			for(var i=0; i < pathSpaces.length; i++){

				var d = "";
				var p = pathSpaces[i];
				var pathPos = {x: scale?positions[i].x*scale:positions[i].x, y:scale?positions[i].y*scale:positions[i].y};
			
				d += ((scale && typeof p[0] == 'number')?p[0]*scale:p[0]);

				for (var j = 1; j < p.length; j++) {
					d += " "+((scale && typeof p[j] == 'number')?p[j]*scale:p[j]);
				}

				var path = game.spaces[i] || new Kinetic.Path();
				path.data(d);
				
				var fill;
				if(blackSpaces.indexOf(i)>=0){
					fill = colors.BLACK;
				}else if(whiteSpaces.indexOf(i)>=0){
					fill = colors.WHITE;
				}else if(purpleSpaces.indexOf(i)>=0){
					fill = colors.PURPLE;
				}else{
					fill = colors.RED;
				}
				
				path.setFill(fill);
				path.stroke('#fff');
				path.strokeWidth(2);
				path.setPosition(pathPos);
				path.playerPositions = calcPlayerPositions(path);
				!game.spaces[i] && (game.spaces.push(path), game.layer.add(game.spaces[i]));
				path.setZIndex(1);
			}
		}
		
		function _configurePlanets(){
			if( !(game.startPlanet && game.endPlanet)){
				var planetsSprite = new Image();

				planetsSprite.onload = function() {
					if( !(game.startPlanet && game.endPlanet)){

						game.startPlanet = new Kinetic.Shape({
							drawFunc: function(context){
								context.drawImage(planetsSprite, 0, 847, 500, 500, -125, -125, 250, 250);
							},
							rotation: 100
						});
						//game.startPlanet.setZIndex(1);
						game.endPlanet = new Kinetic.Shape({
							drawFunc: function(context){
								context.drawImage(planetsSprite, 500, 847, 500, 500, -125, -125, 250, 250);
							},
							rotation:-80
						});
						//game.endPlanet.setZIndex(1);
						console.log('carreguei os planetas');
						
						//typeof afterLoadPlanets == 'function' && afterLoadPlanets();
						
						game.startPlanet.scale({x:game.scale, y:game.scale});
						game.endPlanet.scale({x:game.scale, y:game.scale});
						
						var startPlayerPositions = [1,1,1,1,1,1,1,1,1,1,1,1],
						  endPlayerPositions = [1,1,1,1,1,1,1,1,1,1,1,1];
						
						for(var i=0; i<12; i++){
						  startPlayerPositions[i] = startPlanetPlayerPositions[i]*game.scale;
						  endPlayerPositions[i] = endPlanetPlayerPositions[i]*game.scale;
						}
						
						game.startPlanet.playerPositions = startPlayerPositions;
						game.endPlanet.playerPositions = endPlayerPositions;
						
						game.startPlanet.position({x: game.scale ? planetsPositions[0].x * game.scale : planetsPositions[0].x, y: game.scale ? planetsPositions[0].y * game.scale : planetsPositions[0].y});
						game.endPlanet.position({x: game.scale ? planetsPositions[1].x * game.scale : planetsPositions[1].x, y: game.scale ? planetsPositions[1].y * game.scale : planetsPositions[1].y});
					  
						game.layer.add(game.startPlanet);
						game.layer.add(game.endPlanet);
						
						game.startPlanet.setZIndex(2);
						game.endPlanet.setZIndex(2);
						
						onLoad();
					}
				};

				planetsSprite.src = '/images/sprite.png';
			}else{
				game.startPlanet.scale({x:game.scale, y:game.scale});
				game.endPlanet.scale({x:game.scale, y:game.scale});
				for(var i=0; i<12; i++){
				  game.startPlanet.playerPositions[i] = startPlanetPlayerPositions[i]*game.scale;
				  game.endPlanet.playerPositions[i] = endPlanetPlayerPositions[i]*game.scale;
				}
				game.startPlanet.position({x: game.scale ? planetsPositions[0].x * game.scale : planetsPositions[0].x, y: game.scale ? planetsPositions[0].y * game.scale : planetsPositions[0].y});
				game.endPlanet.position({x: game.scale ? planetsPositions[1].x * game.scale : planetsPositions[1].x, y: game.scale ? planetsPositions[1].y * game.scale : planetsPositions[1].y});
			}
		
		}
	
		function _configureDice(){
			game.dice = new Dice();
			game.dice.load(function(){
				game.layer.add(game.dice.shape);
				game.dice.shape.setZIndex(9999);
			});
		}
		
		game.addPlayer = function(player){
		  if(game.startPlanet){
		    var l = game.players.length;
		    game.players.push(player);
	      var x = game.startPlanet.playerPositions[2*l+4],
	        y = game.startPlanet.playerPositions[2*l+5];
	    
	      console.log('l ', l, ', x ', x, ', y ', y);
	    			  
	      if(player.shape){
	      	player.shape.setPosition({x:x,y:y});
		      game.layer.add(player.shape);
		      player.shape.setZIndex(3);
		      next && next();
	      }else{
		      player.onload = function(){
		      	player.shape.setPosition({x:x,y:y});
			      game.layer.add(player.shape);
			      player.shape.setZIndex(3);
			      next && next();
		      };
	      }
		  }else{
		    game.load(function(next){
			    var l = game.players.length;
			    game.players.push(player);
			    var x = game.startPlanet.playerPositions[2*l+4],
			      y = game.startPlanet.playerPositions[2*l+5];
			    
			    console.log('l ', l, ', x ', x, ', y ', y);  
			    			  
			    if(player.shape){
				    game.layer.add(player.shape);
				    player.moveTo(x,y);
				    next && next();
			    }else{
				    player.onload = function(){
					    game.layer.add(player.shape);
					    player.moveTo(x,y);
					    next && next();
				    };
			    }
			  });
			}
		}

		game.__defineGetter__('scale', function(){
			return game._scale;
		});

		game.__defineSetter__('scale', function(scale){
		
			game._scale = scale;
		
			var stage = game.stage;
			if(stage){
				stage.setWidth(stage.getWidth()*scale);
				stage.setHeight(stage.getHeight()*scale);
				_configureSpaces();
				_configurePlanets();
			}
		});

		game.getPlayerPositions = function(path){
			if(typeof path == 'number'){
				path = game.spaces[path];
			}
			if(! (path instanceof Kinetic.Path) ){
				return null;
			}
			var ac = [];
			var pos = path.position();
			for(var i = 0; i< path.playerPositions.length; ){
				ac.push(path.playerPositions[i++] + pos.x);
				ac.push(path.playerPositions[i++] + pos.y);
			}
			return ac;
		};
  
    game.load = function(f){
	    loadCB.push(f);
	  };
	  
	  function createTurn(i, pLen, dice){
	  	if(winner) return;
	  	var player = game.players[i];
	  	new Turn(
				dice,
				player,
				function(spaces){
					var space = game.spaces[player.position + spaces - 1], nextPlayer = (i+1)%pLen, fill = space?space.getFill():null;
					
					switch(fill){
						case colors.BLACK:
							createTurn(nextPlayer, pLen, dice);
							break;
						case colors.WHITE:
							nextPlayer = i;
						default:
							movePlayer(player, player.position + spaces, function(){
								createTurn(nextPlayer, pLen, dice);
							});
							break;
					}
				},
				function(){
					createTurn((i+1)%pLen, pLen, dice);
				});
	  };
		
		game.start = function(){
			function startGame(){
				var i = 0, pLen = game.players.length, dice = game.dice;
				createTurn(0, pLen, dice);
			}
			if(loaded){
				startGame();
			}else{
				_afterLoad(startGame);
			}
		};
		
	  function onLoad(){
	  	game.load(afterLoad);
	    for(var i=0,end=loadCB.length;i<end;i++){
	    	loadCB[i]();
	    }
	    loaded = true;
	  }
	  
	  function _afterLoad(f){
	  	afterLoadCB.push(f);
	  }
	  
	  function afterLoad(){
	  	for(var i=0,end=afterLoadCB.length;i<end;i++){
	      afterLoadCB[i]();
	    }
	  }
	  
	  function movePlayer(player, pos, cb){
	  	if(pos > track.length-1) {
	  		winner = player;
	  		pos = track.length-1;
	  	}
	  	var pInP6n = game.players
					.map(function(a){
						return a.position==pos?1:0
					})
					.reduce(function(a,b){
						return a+b
					}),
	  		x = track[pos].playerPositions[2*pInP6n+2],
	    	y = track[pos].playerPositions[2*pInP6n+3];
	  		
	  		player.moveTo(x,y,cb);
	  		player.position = pos;
	  }
    
		//game.draggable = function(){
		//	for (var i = 0; i < this.casas.length; i++) {
		//		var c = this.casas[i];
		//		c.setDraggable(true);
		//	};
		//};
	
		_init();
	}
	
	function _calcTriangleCentroid(x0, y0, x1, y1, x2, y2){
		return [
			(x0 + x1 + x2)/3,
			(y0 + y1 + y2)/3,
		];
	};

	function _calcTriangleArea(x0, y0, x1, y1, x2, y2){
		// 1/2 |(v x u)| metade do produto vetorial
		return Math.abs((x1-x0)*(y2-y0) -(y1-y0)*(x2-x0))/2;
	}
	
	function calcPlayerPositions(path){

		var p=[[],[]], simpleP = [[],[]], lastP = [];
		for(var i in path.dataArray){
			for(var j =0; j<path.dataArray[i].points.length;){
				p[0].push(path.dataArray[i].points[j++]);
				p[1].push(path.dataArray[i].points[j++]);
			}
			switch(path.dataArray[i].command){
				case 'M':
					simpleP[0].push(path.dataArray[i].points[0]);
					simpleP[1].push(path.dataArray[i].points[1]);
					break;
				case 'L':
					simpleP[0].push(lastP[0]);
					simpleP[1].push(lastP[1]);
					simpleP[0].push(path.dataArray[i].points[0]);
					simpleP[1].push(path.dataArray[i].points[1]);
					break;
				case 'Z':
				case 'z':
					simpleP[0].push(lastP[0]);
					simpleP[1].push(lastP[1]);
					break;
				default:
					var points = path.dataArray[i].points;
					lastP = [];
					lastP.push(points[points.length-2]);
					lastP.push(points[points.length-1]);
					break;
			 }
		}

		var c = [
				(Math.min.apply(null, p[0]) + Math.max.apply(null, p[0]) )/2,
				(Math.min.apply(null, p[1]) + Math.max.apply(null, p[1]) )/2
			];

		var last = p[0].length - 1, totalArea=0, playerPos, a, curCentroid;
		
		playerPos = [
			0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0
		];
		for(var i=last; i; i--) {
			a = _calcTriangleArea(
				p[0][i], p[1][i],
				p[0][i-1], p[1][i-1],
				c[0], c[1]
			);
			
			curCentroid = _calcTriangleCentroid(
				p[0][i], p[1][i],
				p[0][i-1], p[1][i-1],
				c[0], c[1]
			);
			
			playerPos[0] += curCentroid[0]*a;
			playerPos[1] += curCentroid[1]*a;
			totalArea+=a;
		}
		a = _calcTriangleArea(
			p[0][0], p[1][0],
			p[0][last], p[1][last],
			c[0], c[1]
		);

		curCentroid = _calcTriangleCentroid(
			p[0][0], p[1][0],
			p[0][last], p[1][last],
			c[0], c[1]
		);

		playerPos[0] += curCentroid[0]*a;
		playerPos[1] += curCentroid[1]*a;
		totalArea+=a;

		playerPos[0] /= totalArea;
		playerPos[1] /= totalArea;

		playerPos[2] = (simpleP[0][0] - playerPos[0])/2 + playerPos[0];
		playerPos[3] = (simpleP[1][0] - playerPos[1])/2 + playerPos[1];

		playerPos[4] = (simpleP[0][1] - playerPos[0])/2 + playerPos[0];
		playerPos[5] = (simpleP[1][1] - playerPos[1])/2 + playerPos[1];

		playerPos[6] = (simpleP[0][2] - playerPos[0])/2 + playerPos[0];
		playerPos[7] = (simpleP[1][2] - playerPos[1])/2 + playerPos[1];

		playerPos[8] = (simpleP[0][3] - playerPos[0])/2 + playerPos[0];
		playerPos[9] = (simpleP[1][3] - playerPos[1])/2 + playerPos[1];

		playerPos[10] = (simpleP[0][2] - playerPos[0] + simpleP[0][3] - playerPos[0])/4 + playerPos[0];
		playerPos[11] = (simpleP[1][2] - playerPos[0] + simpleP[1][3] - playerPos[0])/4 + playerPos[0];
		
		var offsetX = path.position().x, offsetY = path.position().y;
		
		for(var i=0; i<6;i++){
		  playerPos[2*i] += offsetX;
		  playerPos[2*i+1] += offsetY;
		}

		return playerPos;
	}
	
	var pathSpaces = [
		["m", 0, 0, "c", -2.369459, 14.47555, -4.157914, 27.77958, -5.555312, 38.30447, "l", 48.0776, 21.52752, "c", 1.6896, -12.72574, 3.14248, -28.89553, 5.17237, -46.02973, "z"],
		["m", 0, 0, "c", -3.056978, 13.24745, -5.570168, 26.64285, -7.619828, 39.16467, "l", 47.694658, 13.80226, "c", 1.51846, -12.81717, 3.36653, -26.18066, 5.8883, -39.05923, "z"],
		["m", 0, 0, "c", -3.8842, 11.14334, -7.19283, 23.21376, -10.01177, 35.42969, "l", 45.96313, 13.9077, "c", 2.25561, -11.51929, 5.06558, -22.62876, 8.65208, -32.63815, "z"],
		["m", 0, 0, "c", -8.15845, 9.70273, -14.84681, 23.60209, -20.35653, 39.40887, "l", 44.60344, 16.69924, "c", 3.65342, -10.19614, 8.12076, -19.23318, 13.67462, -26.32808, "z"],
		["m", 0, 0, "c", -17.08856, 5.24169, -29.87048, 12.05165, -38.03252, 18.6028, -2.46338, 1.9772, -4.80188, 4.33993, -7.0371, 6.99825, "l", 37.92153, 29.78003, "c", 2.40946, -3.07802, 5.02302, -5.79462, 7.86401, -8.0749, 5.41474, -4.34607, 10.14802, -7.77601, 15.83903, -10.42246, "z"],
		["m", 0, 0, "c", -15.47725, 1.53161, -29.07134, 4.33953, -40.65202, 7.89176, "l", 16.55495, 36.88372, "c", 7.01928, -3.26413, 15.54016, -5.32022, 28.61457, -6.39887, "z"],
		["m", 0, 0, "c", -4.09239, -0.0756, -8.08915, -0.16898, -12.37042, -0.21644, -0.84763, -0.009, -1.69164, -0.0147, -2.5307, -0.0166, -9.46388, -0.0221, -18.34414, 0.44957, -26.6999, 1.27645, "l", 4.5175, 38.37661, "c", 8.84775, -0.72996, 19.89854, -0.99717, 33.90905, -0.89352, "z"],
		["m", 0, 0, "c", -11.79805, -0.91643, -24.50737, -1.38796, -38.29336, -1.64273, "l", -3.17447, 38.52645, "c", 1.02776, 0.008, 1.941, -7.1e-4, 3.00242, 0.0111, 12.83613, 0.1423, 23.73287, 0.66453, 33.15429, 1.50399, "z"],
		["m", 0, 0, "c", -11.61972, -2.90367, -24.42375, -4.68179, -38.5986, -5.78285, "l", -5.31112, 38.39881, "c", 13.35036, 1.18952, 23.5322, 3.06457, 31.42275, 5.53866, "z"],
		["m", 0, 0, "c", -0.7469, -0.59475, -1.50354, -1.19121, -2.34755, -1.79257, -10.90141, -7.76738, -23.30316, -12.98652, -37.472, -16.5272, "l", -12.48697, 38.15462, "c", 9.64059, 3.02282, 15.80679, 6.95742, 19.94585, 11.6878, "z"],
		["m", 0, 0, "c", 0.50887, -6.43893, 0.97342, -14.22956, 0.59383, -16.3496, -1.33884, -7.4774, 1.62256, -17.64311, -12.72006, -29.06411, "l", -32.36067, 31.52265, "c", 0.72861, 0.83271, 1.41645, 1.68199, 2.02567, 2.56399, 2.50916, 3.63268, 3.06712, 8.91808, 2.59174, 14.37944, "z"],
		["m", 0, 0, "c", 5.11922, -10.71355, 6.42629, -23.4068, 8.41899, -33.26528, 0.15175, -0.75077, 0.50321, -4.52667, 0.83801, -8.76307, "l", -39.86949, 3.05237, "c", -0.60841, 6.98961, -2.92411, 14.25369, -5.10579, 18.7582, "z"],
		["m", 0, 0, "c", 10.68875, -5.3087, 20.08629, -11.0208, 26.55007, -18.88584, 2.10467, -2.56094, 3.79775, -5.3882, 5.21678, -8.35795, "l", -35.71828, -20.21778, "c", -0.36383, 0.75121, -0.72321, 1.44319, -1.0711, 2.02566, -4.23557, 7.09164, -12.11751, 13.38901, -18.24207, 16.97673, "z"],
		["m", 0, 0, "c", 11.88679, -6.39028, 24.10678, -11.40153, 34.9857, -16.80468, "l", -23.2646, -28.45918, "c", -1.75468, 1.02787, -3.38932, 1.86731, -4.72285, 2.39749, -6.75452, 2.68547, -15.39981, 5.3429, -23.81403, 8.43564, "z"],
		["m", 0, 0, "c", 2.46776, -3.52143, 4.87021, -6.22708, 6.95385, -7.81407, 5.88839, -4.48482, 12.13705, -8.26381, 18.47516, -11.67115, "l", -16.81578, -34.43073, "c", -11.16352, 4.10329, -24.05509, 12.22301, -31.79459, 22.77623, -0.83301, 1.13585, -1.5524, 2.16076, -2.33645, 3.24661, "z"],
		["m", 0, 0, "c", 3.13549, -7.9387, 6.90611, -14.95925, 10.54455, -20.15118, "l", -25.51781, -27.89311, "c", -8.18565, 11.3365, -13.79374, 20.19796, -18.11443, 30.98433, "z"],
		["m", 0, 0, "c", 1.23797, -7.57499, 3.41578, -15.00869, 6.08254, -21.76063, "l", -33.08769, -17.05996, "c", -2.66352, 6.64931, -4.84228, 14.02755, -6.82066, 23.17581, -0.78383, 3.62454, -1.43128, 7.22162, -1.97016, 10.78874, "z"],
		["m", 0, 0, "c", -0.97802, -7.00874, -0.6891, -14.33935, 0.48838, -21.54418, "l", -35.79597, -4.85604, "c", -1.80259, 11.93221, -2.22085, 23.46369, -1.24315, 34.11439, "z"],
		["m", 0, 0, "c", -3.74147, -5.75674, -5.89647, -12.23139, -6.84286, -19.01348, "l", -36.55074, 7.71417, "c", 1.09346, 11.91178, 3.96408, 22.69547, 8.61878, 31.70024, "z"],
		["m", 0, 0, "c", -1.47342, -0.80091, -3.00781, -1.89511, -4.61186, -3.35206, -2.70656, -2.45843, -4.95649, -5.15116, -6.82065, -8.01942, "l", -34.77482, 20.40093, "c", 5.03969, 9.74956, 12.17432, 17.41034, 21.50533, 22.06584, 3.96688, 1.9792, 7.89329, 3.4119, 11.75995, 4.3677, "z"],
		["m", 0, 0, "c", -3.96168, 4.44519, -8.69779, 6.03017, -14.39053, 2.93584, "l", -12.94205, 35.46299, "c", 16.04994, 3.9673, 31.02499, -0.3419, 43.26595, -8.308, "z"],
		["m", 0, 0, "c", -2.55362, 8.21533, -5.67157, 15.39165, -9.56224, 19.75715, "l", 15.93337, 30.09083, "c", 12.90233, -8.39653, 22.73986, -20.85639, 27.58232, -32.0277, "z"],
		["m", 0, 0, "c", -1.60019, 9.22958, -3.64676, 19.27231, -6.39888, 28.1262, "l", 33.95345, 17.82028, "c", 1.28481, -2.96397, 2.23895, -5.8429, 2.78043, -8.52444, 2.55679, -12.66173, 3.37518, -22.84637, 4.37322, -30.97876, "z"],
		["m", 0, 0, "c", -6.87801, 11.01929, -11.19273, 26.34475, -12.8477, 35.89031, "l", 34.70822, 6.44328, "c", 1.19858, -9.76653, 3.69807, -18.86569, 8.81857, -23.12033, "z"],
		["m", 0, 0, "c", -8.64993, 3.38677, -17.29032, 8.06646, -24.13037, 13.39714, -3.03516, 2.36537, -5.75482, 5.7085, -8.1637, 9.56779, "l", 30.67909, 19.21326, "c", 0.12196, -0.10131, 0.23577, -0.21501, 0.36073, -0.31078, 3.51869, -2.69651, 8.56118, -5.30803, 16.29966, -6.582, "z"],
		["m", 0, 0, "c", -7.65603, -2.13425, -15.08467, -3.49935, -21.52198, -3.59625, -7.04776, -0.10608, -16.21867, 2.02973, -25.37907, 5.61636, "l", 15.04541, 35.28541, "c", 4.07476, -0.67086, 8.88327, -0.97749, 14.64027, -0.71593, 2.41376, 0.10966, 4.70162, 0.3354, 6.87061, 0.66041, "z"],
		["m", 0, 0, "c", -10.84985, -6.4624, -24.8092, -12.58905, -38.06027, -16.28301, "l", -10.34476, 37.25, "c", 9.59897, 1.43837, 16.8537, 4.88226, 22.40994, 9.31806, "z"],
		["m", 0, 0, "c", -1.66186, -5.14921, -3.79368, -10.61385, -6.82065, -16.16647, -3.56631, -6.54192, -8.60883, -11.75442, -19.35204, -18.15327, "l", -25.99508, 30.28505, "c", 7.02967, 5.6121, 11.30615, 12.81873, 14.09085, 19.61842, "z"],
		["m", 0, 0, "c", -4.77914, -3.50134, -5.53905, -15.3052, -10.18382, -29.69677, "l", -38.07692, 15.58373, "c", 2.44614, 5.97304, 3.74408, 11.63335, 4.7062, 15.60593, 2.30929, 9.53535, 5.02665, 16.8169, 8.086, 22.33225, "z"],
		["m", 0, 0, "c", -4.97829, 2.55184, -9.67884, 4.63809, -14.0298, 5.01698, -1.61699, 0.14082, -2.92097, -0.22849, -4.01803, -1.03225, "l", -35.46854, 23.82514, "c", 13.37216, 24.1071, 33.45759, 14.08785, 56.09146, 6.95384, "z"],
		["m", 0, 0, "c", -3.27124, -1.87799, -6.61626, -3.78865, -10.06726, -5.63856, -17.47951, -9.36992, -33.21636, 1.21468, -46.7512, 8.15259, "l", 2.57509, 34.76371, "c", 14.31047, -4.51054, 29.6311, -7.84718, 44.95308, -0.66597, "z"],
		["m", 0, 0, "c", -5.02524, 6.72825, -17.12362, -0.34872, -31.46161, -8.57991, "l", -9.29029, 36.61177, "c", 1.41587, 0.66361, 2.83042, 1.38533, 4.24556, 2.23657, 19.34839, 11.63798, 36.88444, 11.18434, 50.14212, 5.63855, "z"],
		["m", 0, 0, "c", 0.0687, 7.18109, -1.02853, 13.85029, -3.98473, 19.76272, -0.24299, 0.48594, -0.51866, 0.91374, -0.81027, 1.30418, "l", 13.63578, 35.90698, "c", 8.43161, -3.52703, 15.13781, -9.10688, 19.46301, -14.96771, 6.42934, -8.71203, 8.39527, -21.15892, 8.01385, -35.42413, "z"],
		["m", 0, 0, "c", 3.04318, 11.65431, 5.53569, 22.88643, 5.633, 33.05993, "l", 36.31764, 6.58204, "c", -0.35529, -13.28857, -2.76225, -28.16577, -5.53866, -43.11056, "z"],
		["m", 0, 0, "c", 2.33007, 11.87557, 5.91738, 23.94319, 8.95734, 35.58508, "l", 36.41198, -3.46859, "c", -2.30634, -12.41456, -4.8541, -24.86052, -6.70965, -36.49525, "z"],
		["m", 0, 0, "c", -4.80038, 13.15615, -3.87052, 27.87932, -0.92128, 42.91076, "l", 38.65967, -4.37876, "c", -1.74483, -10.94033, -2.87929, -21.16511, -2.57509, -29.91877, "l", -35.1633, -8.61323, "z"]
	];

	var positions = [
		{"x":71.5,"y":183},
		{"x":79,"y":144},
		{"x":89,"y":109},
		{"x":109,"y":70},
		{"x":154,"y":44.5},
		{"x":194.5,"y":36.5},
		{"x":236,"y":35.5},
		{"x":274.5,"y":37},
		{"x":313,"y":43},
		{"x":353,"y":61.5},
		{"x":365,"y":107},
		{"x":356,"y":149},
		{"x":324,"y":176},
		{"x":289,"y":192.5},
		{"x":264,"y":212},
		{"x":253.5,"y":232},
		{"x":247.5,"y":253.5},
		{"x":247,"y":275},
		{"x":254,"y":294},
		{"x":265,"y":305},
		{"x":279,"y":302},
		{"x":288.5,"y":282.5},
		{"x":295,"y":254.5},
		{"x":308,"y":219},
		{"x":340,"y":196},
		{"x":386.5,"y":194},
		{"x":424.5,"y":210.5},
		{"x":450.5,"y":244.5},
		{"x":460,"y":274},
		{"x":478,"y":270},
		{"x":534.5,"y":267.5},
		{"x":566,"y":276},
		{"x":571,"y":255},
		{"x":565,"y":222},
		{"x":556,"y":186.5},
		{"x":557,"y":144}
	];

	var planetsPositions = [
		{x:50, y:330},
		{x:600, y:44}
	];
	
	var startPlanetPlayerPositions = [
		60, 260,
		100, 290,
		60, 260,
		100, 290,
		70, 230,
		40, 300
	];
	
	var endPlanetPlayerPositions = [
		570, 120,
		550, 90,
		570, 120,
		550, 90,
		600, 90,
		580, 50
	];
	
	var colors = {
		BLACK: '#000',
		WHITE: '#fff',
		PURPLE: 'rgba(131, 78, 243, 0.77)',
		RED: 'rgba(160, 26, 26, 0.78)'
	}
	
	return GenomaGame;
})(Kinetic, Dice, Player, Turn);
