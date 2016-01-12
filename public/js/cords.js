socket.on('updatedata', function (type, data) {
	if (type=="echo") {
		echoes.push(data);
	} else {
		//console.log(type);
	}
});




// tune stuff
// 

var tune = new Tune();
tune.loadScale("partch_43");
console.log(tune.note(60))

/* matrix 



			5/4
			1/1		3/2		9/8		27/16	
			


			7/4
			11/8
			13/8
			15/8


*/

/* matrix 


									
						9/8									27/16
			1/1									3/2								
										11/8			   	 7/4
															13/8
								5/4			  					 15/8
			

*/



var scale = [{
			ratio: 1/1,
			row: 0,
			radius: 30
		},{
			ratio: 9/8,
			row: 1,
			radius: 18
		},{
			ratio: 5/4,
			row: 2,
			radius: 18
		},{
			ratio: 11/8,
			row: -1,
			radius: 12
		},{
			ratio: 3/2,
			row: 0,
			radius: 24
		},{
			ratio: 13/8,
			row: -1,
			radius: 12
		},{
			ratio: 27/16,
			row: 1,
			radius: 12
		},{
			ratio: 7/4,
			row: -1,
			radius: 12
		},{
			ratio: 15/8,
			row: 2,
			radius: 12
		}
	]
	
	// 1/1, 9/8, 5/4, 11/8, 3/2, 13/8, 27/16, 7/4, 15/8]


//global variables

var incomingNotes = new Array();

// array of coordinate objects for all 100+ notes on the canvas
var notestack = []

// properties of THIS USER

var player = {
	name: "me",
	grabindex: false,
	linkindex: false
}


var mousePos;
var voiceReg = 132;


// activity by others

var echoes = []



// AUDIO STUFF
var synth = new Tone.PolySynth(10, Tone.SimpleSynth, {
		"oscillator" : {
			"partials" : [0, 1, 2, 3, 4, 5],
		}
}).toMaster();









$(document).ready(function() {
	
	canvas = document.getElementById("harp");
	visctx = canvas.getContext("2d");
	
	canvas.width = $(window).width();
	canvas.height = 500;

	canvasOffset = findPosition(canvas);


	// calculate node placements

	for (var j=0;j<4;j++) {
		for (var i=0;i<scale.length;i++) {
			var xi = scale[i].ratio * Math.pow(2,j)
			console.log(scale[i].ratio * Math.pow(2,j), Math.log(xi)/Math.log(2))
			var adjustedx = Math.log(xi)/Math.log(2)

			notestack.push({
				x: adjustedx * canvas.width/4 + 30, 
				y: canvas.height/2 - scale[i].row*40 ,
				r: scale[i].radius,
				freq: 100 * Math.pow(2,j) * scale[i].ratio 
			})
		}
	}



	$( window ).resize(function() {
		canvas.width = $(window).width();
	})

});


function playpearl(e) {

	
}

function movesilentpearl(e) {
		
	
}


 
function limitRange(val,low,high) {
	if (val<low) {
		val = low;
	} else if (val>high) {
		val = high;
	}
	return val;
}


var harpStrings = [ 1/1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2/1, 9/4, 5/2, 8/3, 3/1, 10/3, 15/4, 4/1];


function drawHarp() {

	//erase
	visctx.fillStyle = "#FFF";
	visctx.fillRect(0,0,canvas.width,canvas.height);


	with (visctx) {
		lineWidth = 3
		lineCap = "round"
		strokeStyle = "#0af"
		fillStyle = "#0af"
	}
	for (var i=0;i<notestack.length;i++) {
		with (visctx) {

			beginPath();
			arc(notestack[i].x, notestack[i].y, notestack[i].r, 0, Math.PI*2, false );
			stroke();
			closePath();

			if (notestack[i].active) {
				fill()
			}

		}
	}


	if (player.grabindex != false || player.grabindex === 0) {
		with (visctx) {
			lineWidth = 7
			beginPath()
			moveTo(notestack[player.grabindex].x, notestack[player.grabindex].y)
			if (player.linkindex) {
				lineTo(notestack[player.linkindex].x, notestack[player.linkindex].y)
			} else {
				lineTo(mousePos.x, mousePos.y)
			}
			
			stroke()
			closePath()
		}
	}
	
	for (var i=0;i<echoes.length;i++) {
		with (visctx) {
			globalAlpha = echoes[i][2]
		/*	lineWidth = 7
			beginPath()
			moveTo(notestack[echoes[i][0]].x, notestack[echoes[i][0]].y)
			lineTo(notestack[echoes[i][1]].x, notestack[echoes[i][1]].y)
			stroke()
			closePath() */

			lineWidth = 7
			beginPath()
			arc(notestack[echoes[i][0]].x, notestack[echoes[i][0]].y, 7, 0, Math.PI*2)
			arc(notestack[echoes[i][1]].x, notestack[echoes[i][1]].y, 7, 0, Math.PI*2)
			fill()
			stroke()
			closePath()

			globalAlpha = 1
		}
		echoes[i][2] -= 0.05
		if (echoes[i][2] <= 0) {
			echoes.splice(i,1)
			i--
		}
	}

	var scaledPos = new Object();

	if (mousePos) {
		if (mousePos.x && mousePos.y) {
			scaledPos.x = mousePos.x / canvas.width;
			scaledPos.y = mousePos.y / canvas.height;
		}
	}
	
	socket.emit('senddata', "mouse", scaledPos);

	incomingNotes = new Array();
	
}


	setInterval("drawHarp();", 33);




// interactions

//mousedown
function grab(e) {

		mousePos = getCursorPosition(e, canvasOffset);
		for (var i=0;i<notestack.length;i++) {
			if (mousePos.x < notestack[i].x+notestack[i].r && mousePos.x > notestack[i].x-notestack[i].r && mousePos.y < notestack[i].y+notestack[i].r && mousePos.y > notestack[i].y-notestack[i].r) {
				notestack[i].active = true
				player.grabindex = i
			}
		}
}


//mousemove
function wrap(e) {

		mousePos = getCursorPosition(e, canvasOffset);
		if (player.grabindex || player.grabindex===0) {
			for (var i=0;i<notestack.length;i++) {
				if (mousePos.x < notestack[i].x+notestack[i].r && mousePos.x > notestack[i].x-notestack[i].r && mousePos.y < notestack[i].y+notestack[i].r && mousePos.y > notestack[i].y-notestack[i].r) {
					notestack[i].active = true
					mousePos.x = notestack[i].x
					mousePos.y = notestack[i].y
				} else if (player.grabindex != i) {
					notestack[i].active = false
				}
			}
		}
}

//mouseup
function link(e) {

		mousePos = getCursorPosition(e, canvasOffset);

		for (var i=0;i<notestack.length;i++) {
			if (mousePos.x < notestack[i].x+notestack[i].r && mousePos.x > notestack[i].x-notestack[i].r && mousePos.y < notestack[i].y+notestack[i].r && mousePos.y > notestack[i].y-notestack[i].r && player.grabindex != i) {
				notestack[i].active = true
				player.linkindex = i
				synth.triggerAttackRelease(  notestack[player.grabindex].freq, 1  );
				synth.triggerAttackRelease(  notestack[player.linkindex].freq, 1  );
				
				socket.emit('senddata', "echo", [player.grabindex, player.linkindex, 1]);
			} else if (player.grabindex != i) {
				notestack[i].active = false
			}
		}

		for (var i=0;i<notestack.length;i++) {
			notestack[i].active = false
		}
		player.grabindex = false
		player.linkindex = false

}

