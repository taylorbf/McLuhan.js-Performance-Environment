/* SERVER */


$(function() {
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
	console.log($("#usertally").html())
	$("#usertally").html("connected: " + users)
});

socket.on('discotally', function (disco) {
	console.log(disco)
	$("#discotally").html("disconnections: " + disco)
});

})



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






