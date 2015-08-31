var Translate = {
	last: {},
	shorthands: {
		//audio/video
		find: "load",
		is: "play",
		isnt: "stop",
		seek: "jumpTo",
		clamp: "skip",
		release: "unskip",
		time: "speed"


	},
	toCode: function translate(command) {

    	var words = command.split(" ");
    	var output = "";

    	var mode = ""
    	// modes: wall, media, newmedia, newwall

    	var current = {}

    	current.variable = false;
    	current.media = false
    	current.type = false
    	current.method = false
    	current.params = false
    	current.rhythm = false

    	

    	switch (words[0]) {

    		// phrase starters

    		case "a":
    			current.method = "shapeshift"
    			current.params = words.slice(1)
    			mode = "wall"
    			break;

    		case "to":
    			// to hear a piano playing pno
    			current.variable = words[3]
    			current.method = words[1]
    			current.params = words.slice(5)
    			mode = "newmedia"
    			// for 'and's later ...
    			current.media = words[3]
    			break;

    		case "and":
    			console.log(this.last.media)
    			current.media = this.last.media
    			current.method = words[1]
    			current.params = words.slice(2)
    			mode = "media"
    			break;
    		//case or
        

        case "wander":
          //cut off the first 3
          //send everything else through this.toCode()
          //wander by foot piano move A B
          //=> var something = m.interval("piano.move(A1,B1)",50)
          //or..
          //=> gesture1.add(piano.move)
          //what about for walls?
          //
          current.method = "scramble"
          current.params = ""
          mode = "wall"
          break;


    		// wall-specific
        case "gone":
          current.method = "kill"
          current.params = ""
          mode = "wall"
          // need to delete wall from local.walls too
          break; 
        case "move":
          current.method = "move"
          current.params = words.slice(1)
          mode = "wall"
          break; 
    		case "blink":
    			current.method = "hide"
    			current.params = ""
    			mode = "wall"
    			break;
    		case "unblink":
    			current.method = "show"
    			current.params = ""
    			mode = "wall"
    			break;
        case "clarity":
          current.method = "xray"
          current.params = ""
          mode = "wall"
          break;
        case "break":
          current.method = "scramble"
          current.params = ""
          mode = "wall"
          break;

    		// media
    		
    		default: 
    			current.media = words[0]
    			current.method = words[1]
    			current.params = words.slice(2)

    			mode = "media"


    	}

  		for (var key in this.shorthands) {
  			if (current.method==key) {
  				current.method = this.shorthands[key]
  			}
  		}

      if (current.params[0]=="by") {
        // var a = new Gesture(box.move.bind(box),100,100)
        if (mode=="wall") {
          var subject = local.context
        } else if (mode=="media") {
          var subject = current.media
        }
        output = "var a = new Gesture("+subject+"."+current.method+".bind("+subject+"),"+current.params[1]+","+current.params[2]+","+current.params[3]+","+current.params[4]+","+current.params[4]+")"
      } else if (mode=="wall") {

   			// output looks like: red.shapeshift("line")
   			
   			output = local.context + "." 
   				   + current.method 
   				   + "("
   				   + this.parseParams(current.params)
   				   + ")"
			
   		} else if (mode=="media") {

   			// output looks like: piano.open("pno")
   			
   			output = current.media + "."
   				   + current.method 
   				   + "("
   				   + this.parseParams(current.params) 
   				   + ")"

   		} else if (mode=="newmedia") {
			
			// output looks like: var piano = red.hear("line")
   			
   			output = current.variable 
   				   + " = " + local.context + "." 
   				   + current.method 
   				   + "("
   				   + this.parseParams(current.params) 
   				   + ")"


   		}

   		current.media = current.media ? current.media : this.last.media
   		this.last = JSON.parse(JSON.stringify(current));
    	
      console.log(output)

    	return output

    },
    parseParams: function(paramsIn) {

    	var paramString = ""

    	for (var i=0;i<paramsIn.length;i++) {
    		if (i>0) {
    			paramString += ","
    		}
    		if (paramsIn[i]=="any") {
    			if (paramsIn[i+1]) {
    				if (paramsIn[i+1].indexOf("-")>0) {
    					var range = paramsIn[i+1].split("-")
    					paramsIn[i+1] = paramsIn[i+1][0]+","+paramsIn[i+1][1]
    				}
    				paramString += "eval(m.random("+paramsIn[i+1]+"))"
    				i++;
    			}
				
			} else if (parseFloat(paramsIn[i])==paramsIn[i]) {
				paramString += paramsIn[i]
			} else {
				paramString += "'" + paramsIn[i] + "'"
			}
    	}

    	return paramString;

    }
}




var Gesture = function(cb,xlow,xhigh,ylow,yhigh) {

      this.buffer = [
        [0,0],
        [.5,0],
        [0,.5],
        [1,1],
        [1,.75],
        [0,.2]
      ]
    
    
  
      this.bufferIndex = 0
      this.speed = 1
      this.limit = 100

      this.cb = cb
      this.interval;

      this.scale = {
        x: [ xlow ? xlow : 0 , xhigh ? xhigh : 1 ],
        y: [ ylow ? ylow : 0 , yhigh ? yhigh : 1 ]
      }


      this.motor = setInterval(this.tick.bind(this), 300);
      

    }

    Gesture.prototype.setBuffer = function(buff) {
      this.buffer = buff ? buff : this.buffer
      
    }

    Gesture.prototype.kill = function() {
      clearInterval(this.motor)
    }

    Gesture.prototype.tick = function() {

      this.bufferIndex += this.speed
      this.bufferIndex %= this.limit


      var interval = this.limit / this.buffer.length;

      var lowerIndex = Math.floor(this.bufferIndex/interval)
      var upperIndex = lowerIndex + 1

      upperIndex %= this.buffer.length

      var interpDistance = (this.bufferIndex - lowerIndex*interval) / interval

      var x = nx.interp(interpDistance, this.buffer[lowerIndex][0],this.buffer[upperIndex][0])
      var y = nx.interp(interpDistance, this.buffer[lowerIndex][1],this.buffer[upperIndex][1])

      x = nx.scale(x,0,1,this.scale.x[0],this.scale.x[1])
      y = nx.scale(y,0,1,this.scale.y[0],this.scale.y[1])

      this.cb(x,y)

    }
