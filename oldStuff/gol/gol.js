$(document).ready(function () {
    var current_game = null;
    var speed = 300;
    var stepInterval;

	current_game = new GoL($("#gol"), 40, 40, speed);
	// $("#step").hide();
    $("#makeGrid").click(function (e) {
		e.preventDefault();
		current_game.checkParameters();
		// $("#step").hide();
		
		if (current_game.running){
			clearInterval(stepInterval);
			current_game.running = false;
		}
		
		var width = parseInt($("#width").val());
		
		if (isNaN(width) || width < 20 || width > 200) {
		    alert("Illegal width: " + $("#width").val());
		    return;
		}
	
		var height = parseInt($("#height").val());
	
		if (isNaN(height) || height < 20 || height > 200) {
		    alert("Illegal height: " + $("#height").val());
		    return;
		}
		if (current_game != null) {
		    current_game.kill();
		}
		
		current_game = new GoL($("#gol"), width, height, speed);
		current_game.checkParameters();
		
		$("#resetGame").click(function(e){
			e.preventDefault();
			if (current_game.running){
				clearInterval(stepInterval);
				current_game.running = false;
			}
			current_game.kill();
    		current_game = new GoL($("#gol"), width, height, speed);
    		current_game.checkParameters();
    	});
    	
    });
    
        $("#randomize").click(function(e){
    		e.preventDefault();
    		current_game.checkParameters();
    		current_game.randomize();	
    	});
    	
    	$("#step").click(function(e){
    		e.preventDefault();
    		current_game.step();
    		// $("#step").hide();
    	});
    	
    	
    	$("#start_button").click(function(e){
    		e.preventDefault();
    		current_game.checkParameters();
    		var stepping = function(){
    			current_game.step();
    		}
    		stepInterval = setInterval(stepping,current_game.speed);
    		current_game.running = true;
    	});
    	
    	$("#stopGame").click(function(e){
    		e.preventDefault();
    		if (current_game.running){
	    		clearInterval(stepInterval);
	    		current_game.running = false;
	    		// $("#step").show();
    		}
    	});
});

function changeMode(){
	var selected = document.getElementById("cellsOffGrid").value;
	return selected;
}

var GoL = function(gol_div, width, height, speed) {
    this.gol_div = gol_div;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.started = false;
    this.running = false;
    this.killed = false;
    this.spaces = new Array(height);
    this.r = 1;
    this.l = 2;
    this.o = 3;
    this.gmin = this.gmax = 3;
    this.toroidal = false;
    this.alwaysAlive = false;
    
    var boxLength = 15;
    if (width < 40 && height < 40){
    	boxLength = 20;
    } else if (width > 100 && width < 140|| height > 100 && height < 140){
    	boxLength = 10;
    } else if (width >= 140 || height >= 140){
   		boxLength = 7;
   	}
    
    gol_div.css({position: "relative",
		       width: this.width * boxLength,
		       height: this.height * boxLength});

    for (var y=0; y<this.height; y++) {
		this.spaces[y] = new Array(width);
		for (var x=0; x<this.width; x++) {
		    var space = new Space(this, x, y, boxLength);
		    this.spaces[y][x] = space;
		    gol_div.append(space.getSpaceDiv());
		}
    }
};

GoL.prototype.kill = function () {
    if (this.killed) {
		return;
    }
    this.gol_div.empty();
    this.killed = true;
};

GoL.prototype.getSpace = function (x, y) {
    if ((x < 0) || (x >= this.width) ||(y < 0) ||(y >= this.height)) {
		return null;
    }
    return this.spaces[y][x];
}

GoL.prototype.randomize = function(){
	if (!this.running){
		// $("#step").hide();
		for (var x=0; x<this.width; x++) {
			for (var y=0; y<this.height; y++) {
			    this.spaces[y][x].clearAll();
			}
	    }
	    var minLength = 20;
	    var maxStep = (this.width < this.height) ? this.width : this.height;
	    var step = Math.floor((Math.random()*(5))+1);
	    if (this.width >= 100 || this.height >= 100){
	    	step = Math.floor((Math.random()*(3))+1);
	    	if(this.width >= 150 || this.height >= 150){
	    		step = Math.floor((Math.random()*(2))+1);
	    	}
	    }
		for (var x=0; x<this.width; x++) {
				for (var y=0; y<this.height; y+=step) {
					if ((Math.random()*minLength)+1 < (Math.random()*minLength)+1){
				    	this.spaces[y][x].forceAlive();
					}
					step = Math.floor((Math.random()*(maxStep/minLength))+1);
				}
	    }
	}
}

GoL.prototype.checkParameters = function(){
	if (!this.running){
		this.r = Number($("#radius").val());
		if (this.r < 1 || this.r > 10 || isNaN(this.r)){
			console.log("Invalid radius. Radius set to default.");
			this.r = 1;
			document.getElementById('radius').value = 1;
		}
		
		var limit = ((4*this.r*this.r) + 4*this.r)-1;
		$("#limitVal").text(limit);
		
	    this.l = Number($("#loneliness").val());
	    if (this.l < 0 || this.l >= ((4*this.r*this.r)+(4*this.r)) || isNaN(this.l)){
	    	console.log("Invalid value. Loneliness set to default.");
	    	this.l = 2;
	    	document.getElementById('loneliness').value = 2;
	    }
	    this.o = Number($("#overpopulation").val());
	    if (this.o < 0 || this.o >= ((4*this.r*this.r)+(4*this.r)) || isNaN(this.o)){
	    	console.log("Invalid value. Overpopulation set to default.");
	    	this.o = 3;
	    	document.getElementById('overpopulation').value = 3;
	    }
	    this.gmin = Number($("#gmin").val());
	        if (this.gmin < 0 || this.gmin >= ((4*this.r*this.r)+(4*this.r)) || isNaN(this.gmin)){
	    	console.log("Invalid value. Generation minimum set to default.");
	    	this.gmin = 3;
	    	document.getElementById('gmin').value = 3;
	    }
	    this.gmax = Number($("#gmax").val());
	        if (this.gmax < 0 || this.gmax >= ((4*this.r*this.r)+(4*this.r)) || isNaN(this.gmax)){
	    	console.log("Invalid value. Generation maximum set to default.");
	    	this.gmax = 3;
	    	document.getElementById('gmax').value = 3;
	    }
	    
	    this.speed = Number($("#speed").val());
	    if (this.speed < 0 || this.speed > 1000){
	    	this.speed = 1000;
	    	document.getElementById('speed').value = 1000;
	    }
	    
	    var neighborEvaluation = changeMode();
	    if (neighborEvaluation == 1){
	    	this.alwaysAlive = true;
	    }
	    else if (neighborEvaluation == 2){
	    	this.alwaysAlive = false;
	    }
	    else{
	    	this.toroidal = true;
	    }
	}
	else{
		return;
	}
}

var cells;
GoL.prototype.step = function(){
		this.checkParameters();
		cells = [];
		for (var y=0; y<this.height; y++) {
			var row = [];
			for (var x=0; x<this.width; x++) {
					row.push(this.spaces[y][x].alive);
				}
			cells.push(row);
	    }
	    
	    for (var i=0;i<cells.length;i++){
		    for (var j=0;j<cells[0].length;j++){
		        var alive_count = 0;
		        for (var i_off = 0-this.r; i_off<=this.r; i_off++){
			        for (var j_off = 0-this.r; j_off<=this.r; j_off++){
			            if (i_off == 0 && j_off == 0){
			                continue;
			            }
			            if (this.getCell(i+i_off, j+j_off)){
			                alive_count++;
			            } 
			        }
		        }
		        this.determineNextStep(i, j, alive_count);
	    	}
	    }
}

GoL.prototype.getCell = function(i,j){
    if (this.toroidal){
        if (i >= cells.length){
            i -= cells.length;
        } 
        if (j >= cells[0].length){
            j -= cells.length;
        }
        if (j < 0){
            j += cells[0].length;
        }
        if (i < 0){
            i += cells.length;
        }
    }  else if (i < 0 || j < 0 || i>=cells.length || j>=cells[0].length){
        if (this.alwaysAlive){
            return true;            
        } else {
            return false;
        }
    }
    return cells[i][j];
}

GoL.prototype.determineNextStep = function(i, j, alive){
    var cell = this.spaces[i][j];
    if (alive< this.l || alive > this.o){
        cell.forceDead();
    } else if(alive >= this.gmin && alive <= this.gmax){
        cell.forceAlive();
    }
}

var Space = function (GoL, x, y, boxLength) {
    this.GoL = GoL;
    this.x = x;
    this.y = y;
    this.alive = false;
    this.dead = false;
    this.hasBeenAlive = false;
    this.space_div = $("<div></div>").css({position: "absolute",
				           width: boxLength,
				           height: boxLength,
					   	   top: y * boxLength,
				           left: x * boxLength});
    this.space_div.addClass("space");
    this.space_div.addClass("dead");

    var space = this;

    this.space_div.on('mousedown', function (e) {
	e.preventDefault(); });

    this.space_div.click(function (e) {
		e.preventDefault();
		if ((e.button == 0) && !e.shiftKey && !e.altKey)  {
		    space.leftClick();
		} else if ((e.button == 1) || ((e.button == 0) && e.shiftKey)) {
		    space.forceAlive();
		} else if ((e.button == 0) && e.altKey){
			space.forceDead();
		}
    });
};


Space.prototype.leftClick = function() {
	if (!this.alive){
		this.space_div.addClass("alive");
		this.space_div.removeClass("dead");
		this.alive = true;
		this.dead = false;
	}
	else if (this.alive){
		this.space_div.addClass("dead");
		this.space_div.addClass("hasBeenAlive");
		this.space_div.removeClass("alive");
		this.alive = false;
		this.dead = true;
		this.hasBeenAlive = true;
	}
}

Space.prototype.forceAlive = function() {
    if (!this.alive){
    	this.space_div.addClass("alive");
		this.space_div.removeClass("dead");
		this.alive = true;
		this.dead = false;
    }
}

Space.prototype.forceDead = function() {
    if (this.alive){
    	this.space_div.addClass("dead");
		this.space_div.removeClass("alive");
		this.space_div.addClass("hasBeenAlive");
		this.alive = false;
		this.dead = true;
		this.hasBeenAlive = true;
    }
}

Space.prototype.clearAll = function() {
    if (this.alive){
    	this.space_div.addClass("dead");
		this.space_div.removeClass("alive");
		this.space_div.removeClass("hasBeenAlive");
		this.alive = false;
		this.dead = true;
		this.hasBeenAlive = false;
    }
    else{
    	this.space_div.removeClass("hasBeenAlive");
    	this.hasBeenAlive = false;
    	return;
    }
}

Space.prototype.getSpaceDiv = function() {
    return this.space_div;
};
