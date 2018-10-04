		var clickedTime; var createdTime; var reactionTime;
		 var playCounter=0;	var avgTime=0; var totalTime=0;
		 function getRandomColor() {
			var letters = '0123456789ABCDEF'.split('');
			var color = '#';
			for (var i = 0; i < 6; i++ ) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		}
		
		 function makeBox(){	
		
			 var time= Math.random();
			 time = 5000*time;
			 setTimeout(function(){
				if (Math.random()>0.5){
					document.getElementById("box").style.borderRadius="100px";
				 } else{
					document.getElementById("box").style.borderRadius="0";
				 }
				 
				 var top = Math.random();
				 top = top*250;
				 
				 var left = Math.random();
				 left = left*500;
				 
				 document.getElementById("box").style.top = top+"px"
				 document.getElementById("box").style.left= left+"px"
				 document.getElementById("box").style.backgroundColor = getRandomColor();
				 document.getElementById("box").style.display="block";
				 createdTime = Date.now(); 
				 },time);
		 }
		 
		  document.getElementById("box").onclick=function(){
			clickedTime = Date.now();
			playCounter = playCounter + 1;
			document.getElementById("playCounter").innerHTML=playCounter;
			reactionTime = (clickedTime - createdTime)/1000;
			document.getElementById("time").innerHTML=reactionTime;
			totalTime = totalTime + reactionTime;
			this.style.display="none";
			makeBox();
			calculate();
		 }
		 
		 function calculate(){
		 	avgTime = totalTime / playCounter;
			console.log(avgTime);
			avgTime = Number(avgTime).toFixed(4);
			document.getElementById("avgTime").innerHTML=avgTime;
			this.style.display="none";
		 }
		 makeBox();
		 
		 