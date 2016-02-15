

var LCPlaylist = function(parentID, cb) {

	this.playlist = []

	this.lineIndex = 0;

	this.callback = cb;

	this.color = "black"

	this.limit = 20
	this.current = 0

	this.parentID = parentID

	this.container = document.createElement("div")
	this.container.className = "playlist"

	this.parent = document.getElementById(this.parentID)
	this.parent.appendChild(this.container)

	this.mover = {}

	this.nameIndex = 0

	this.nexttitle = false;

}

LCPlaylist.prototype.add = function(command, info, color) {

	this.color = color

	this.lineIndex++

	var piece = document.createElement("div")
	piece.className = "item"
	piece.style.color = this.color
	piece.id = "fragment"+this.lineIndex
	this.container.appendChild(piece)



	var text = document.createElement("input")
	text.type = "text"
	text.value = this.lineIndex + " ~ " + command;
	text.className = "text"
	text.parent = piece
	text.addEventListener('keydown',function(e) {
		if (e.which==13) {
			this.cut(e.target.parent.id.replace("fragment",""))
			var code = e.target.value.split(" ~ ")
			var info = Translate.toCode(code[1])
      this.add(code[1], info, local.context )
		} 
	}.bind(this))
	piece.appendChild(text)

	var vis = document.createElement("div")
	vis.className = "beatvis"
	vis.style.backgroundColor = color
	piece.appendChild(vis)

	var closer = document.createElement("div")
	closer.className = "close"
	closer.innerHTML = "&times;"
	piece.appendChild(closer)
	closer.addEventListener("mousedown",this.cut.bind(this,this.lineIndex))

	var newline = {
		index: this.lineIndex,
		wall: color,
		command: command,
		code: info.code,
		reference: info.reference,
		duration: info.beat, // duration is now a string to be evaluated later
		newmedia: false
	}

	//should be for any media-making method: hear, see, watch, etc.
	if (info.code.indexOf("hear")==0) {
		piece.className += " newmedia"
		newline.newmedia = true;
	}

/*	newline.interval = interval(info.beat,function(newline) {
			//with (eval(newline.color)) {
				eval(newline.code) // distant, most likely....
			//}
			//console.log(this)
			this.ping(newline)
	}.bind(this,newline))
		//.bind(eval(color)) */

	this.playlist.push(newline)

	var self = this;

	$([this.container]).sortable({
	  containment: "parent",
	  start: function( event, ui ) {
	  	this.mover.start = ui.item.index()
	  }.bind(self),
	  update: function( event, ui ) {
	  	this.mover.end = ui.item.index()
	  	this.move(this.mover.start,this.mover.end)
	  }.bind(self)
	})

	var data = newline
	data.event = "add"

	if (this.playlist.length>=this.limit) {
		var index = this.playlist[0].name
		this.cut(index,document.getElementById("fragment"+index))
	}

	this.parent.scrollTop = 10000;

	//executes playlist callback
	this.callback(data);

}

LCPlaylist.prototype.move = function(start,end) {
	this.playlist.splice(end, 0, this.playlist.splice(start, 1)[0])
}

LCPlaylist.prototype.tick = function() {

	var poemstring = ""
	var infinitycheck = 0;

	if (this.playlist.length==0) {
		return ""
	}
	this.current++;
	if (this.current>=this.playlist.length) {
		this.current = 0;
	}

	while (this.playlist[this.current].norepeat) {
		this.current++;
		if (this.current>=this.playlist.length) {
			this.current = 0;
		}
		infinitycheck++;
		if (infinitycheck >= this.limit) {
			return false;
		}
	}

	$(".item").css("font-weight", "normal")
	$(".item:eq("+this.current+")").css("font-weight", "bold")

	var data = this.playlist[this.current]
	data.event = "playback"

	this.callback(data);

}

LCPlaylist.prototype.cut = function(index) {
	for (var i=0;i<this.playlist.length;i++) {
		if (this.playlist[i].index == index) {
			this.container.removeChild(document.getElementById("fragment"+index))
			if (local.intervals["line"+index]) {
				local.intervals["line"+index].stop()
				local.intervals["line"+index] = null
				//distant.intervals["line"+index].stop()
				//distant.intervals["line"+index] = null
				//
							
			}

			if (socket) {
				var data = {"index": index, "newmedia": false}
				if (this.playlist[i].newmedia) {
					data.newmedia = true
				}
				socket.emit("senddata", "removeentry", data)
			}

			this.playlist.splice(i,1)

		}
	}
}

LCPlaylist.prototype.ping = function(line) {
	$("#fragment"+line.index+" .beatvis").stop().css("opacity","1").animate({"opacity":0},100)
}








var PoemVis = function(parent) {

	this.parent = document.getElementById(parent)

	// array of strings (no, have multiple of same string)
	// array of objects with nameIndex & command
	// or object list of index: commandString
	this.fragments = []

}

PoemVis.prototype.add = function(fragment) {


	var piece = document.createElement("span")
	piece.className = "poemvis-fragment"
	piece.id = "poemfragment"+fragment.name
	piece.innerHTML = fragment.command

	this.parent.appendChild(piece)

}


PoemVis.prototype.highlight = function(data) {

	$(".poemvis-fragment").css("opacity", "0.7")
	if (data) {
		$("#poemfragment"+data.name).css("opacity", "1")
	}

}




