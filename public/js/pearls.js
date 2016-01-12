/* SERVER */

/* Put connection address here */
var socket = io();



var incomingNotes = new Array();

// LISTEN for data
socket.on('updatedata', function (type, data) {
	if (type=="mouse") {
		incomingNotes.push(data);
	} else {
		console.log(type);
	}
	if (type=="chat") {
		console.log("yep");
		postToChat(data);
	}
});
socket.on('updatepearlchat', function (type, data) {
	postToChat(data);
});


/* Onload */
var imgObj;

$(document).ready(function() {
	
	canvas = document.getElementById("harp");
	visctx = canvas.getContext("2d");
	
	canvas.width = $(window).width();
	canvas.height = 500;
	
	
	// audio priming
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	context = new AudioContext();
	
	prefxbus = context.createGain();	
	prefxbus.gain.value = 0.0;
	
	/* fx - needs work */
	
	delay = context.createDelay();
	delay.delayTime.value = 0.5;
	
	delayGain = context.createGain();
	delayGain.gain.value = 0.7;
	
	sine1 = context.createOscillator();
	sine1.type = 0;
	sine1.frequency.value = 200;
	sine1.start(context.currentTime);
	
	sine2 = context.createOscillator();
	sine2.type = "sine";
	sine2.frequency.value = 300;
	sine2.start(context.currentTime);
	
	sine1.connect(prefxbus);
	sine2.connect(prefxbus);
	prefxbus.connect(context.destination);
	prefxbus.connect(delay);
	delay.connect(delayGain);
	delayGain.connect(context.destination);
	delayGain.connect(delay);
	
	// load mouse pic
	
	imgObj = new Image();
	imgObj.src= "mouse.png";

	//handle shift key
	//$(document).bind('keyup keydown', function(e){shifted = e.shiftKey} );
	
	$( window ).resize(function() {
		canvas.width = $(window).width();
	});

	$(".button").click(function() {
		$(".button").css("border-color", "#aaa");
		$(this).css("border-color", "#7ae");
	})



});

var mousePos;
var voiceReg = 132;

function playpearl(e) {

		var now = context.currentTime;
		
		canvasOffset = findPosition(canvas);
		mousePos = getCursorPosition(e, canvasOffset);
		sine1.frequency.value = (mousePos.x/canvas.width)*voiceReg*3 + voiceReg;
		sine2.frequency.value = ((mousePos.x/canvas.width)*voiceReg*3 + voiceReg)*1.5;
		//prefxbus.gain.linearRampToValueAtTime(((1 - Math.abs(mousePos.y/(canvas.height/2) - 1)) * 0.4), now + 1);
		prefxbus.gain.value = (1 - Math.abs(mousePos.y/(canvas.height/2) - 1)) * 0.2;
		
}

function movesilentpearl(e) {
		
		canvasOffset = findPosition(canvas);
		mousePos = getCursorPosition(e, canvasOffset);
		sine1.frequency.value = (mousePos.x/canvas.width)*voiceReg*3 + voiceReg;
		sine2.frequency.value = ((mousePos.x/canvas.width)*voiceReg*3 + voiceReg)*1.5;
		
}

function endpearl() {
	prefxbus.gain.value = 0.0;
}


 
function limitRange(val,low,high) {
	if (val<low) {
		val = low;
	} else if (val>high) {
		val = high;
	}
	return val;
}

function startPulse() {
	
	setInterval("drawHarp();", 75);
	
}

var harpStrings = [ 1/1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2/1, 9/4, 5/2, 8/3, 3/1, 10/3, 15/4, 4/1];


function drawHarp() {

	//erase
	visctx.globalAlpha = 0.2;
	visctx.fillStyle = "#FFF";
	visctx.fillRect(0,0,canvas.width,canvas.height);

	//strings
	visctx.globalAlpha = 1;
	for (var i=0;i<harpStrings.length;i++) {
		var stringPos = (canvas.width * harpStrings[i] - canvas.width) / 3;
		with (visctx) {
			lineWidth = 3;
			if (i%2) {
				strokeStyle = "#aaa";
			} else {
				strokeStyle = "#39c";
			}

		/*	var grd=visctx.createLinearGradient(stringPos-5,0,stringPos+5,0); 
			grd.addColorStop(1,"rgb(256,256,256)");
			grd.addColorStop(0.5, visctx.strokeStyle);
			grd.addColorStop(0,"rgb(256,256,256)");
			visctx.fillStyle = grd;

			fillRect(stringPos-2, 0, stringPos+2, canvas.height); */

			beginPath();
			moveTo(stringPos, 0);
			lineTo(stringPos, canvas.height);
			stroke();
			closePath();
			

		}
	}

	
	
	var grd=visctx.createLinearGradient(0,0,0,canvas.height); 
	grd.addColorStop(1,"rgba(256,256,256,256)");
	grd.addColorStop(0.5,"rgba(256,256,256,0)");
	grd.addColorStop(0,"rgba(256,256,256,256)");
	
	with (visctx) {
		fillStyle = grd;
		fillRect(0,0,canvas.width,canvas.height);
	}
	
	for (var i=0;i<incomingNotes.length;i++) {
		with (visctx) {
			//fillStyle = "#06a";
			//fillRect(incomingNotes[i].x, incomingNotes[i].y, 4,4);
			if (incomingNotes[i]) {
				if (incomingNotes[i].x && incomingNotes[i].y) {
					visctx.drawImage(imgObj, incomingNotes[i].x*canvas.width, incomingNotes[i].y*canvas.height);		
				}
			}
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

startPulse();





/* HANDLE KEYS */

function handleKeys(e) {
	
	/*console.log(e.which);
	
	switch (e.which) {
		case 16:
			voiceReg = 800;
			break;
		case 65:
			voiceReg = 400;
			break;
		case 84:
			voiceReg = 200;
			break;
		case 66:
			voiceReg = 100;
			break;
		
	} */
}


function Point(x,y){
	this.x = x;
	this.y = y;
}



function getCursorPosition(e, canvas_offset) {
	var x;
  var y;
  if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
  } else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
	x -= canvas_offset.left;
  y -= canvas_offset.top;
	var click_position = new Point(x,y);
	return click_position;
}


function findPosition(element) {
    var body = document.body,
        win = document.defaultView,
        docElem = document.documentElement,
        box = document.createElement('div');
    box.style.paddingLeft = box.style.width = "1px";
    body.appendChild(box);
    var isBoxModel = box.offsetWidth == 2;
    body.removeChild(box);
    box = element.getBoundingClientRect();
    var clientTop  = docElem.clientTop  || body.clientTop  || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        scrollTop  = win.pageYOffset || isBoxModel && docElem.scrollTop  || body.scrollTop,
        scrollLeft = win.pageXOffset || isBoxModel && docElem.scrollLeft || body.scrollLeft;
    return {
        top : box.top  + scrollTop  - clientTop,
        left: box.left + scrollLeft - clientLeft
  	};
}



function submitChat(e) {
	if (e.which==13) {
		var newChat = {
			user: "pearl",
			text: $("#chatinput").val()
		}
		socket.emit('sendpearlchat', "chat", newChat);
		$("#chatinput").val("")
	}
	
}

function postToChat(data) {
	
	var htmlstr = data.user
				+ ": "
				+ data.text
				+ "<br>";
	
	$("#chatmessages").prepend(htmlstr);
	
}



