/* SERVER */

/* Put connection address here */
var socket = io();


// chat data
socket.on('updatedata', function (type, data) {
	if (type=="chat") {
		postToChat(data);
	}
});

socket.on('updatepearlchat', function (type, data) {
	postToChat(data);
});

socket.on('updateusers', function (users) {
	$("#uservis").html("")
	for (var key in users) {
		$("#uservis").append('<div style="height:10px;width:2px;margin:2px;background-color:black;display:inline-block"></div>')
	}
});



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



// helper functions


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






