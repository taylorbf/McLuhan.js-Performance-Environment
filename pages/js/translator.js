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


    		// wall-specific
    		case "gone":
    			current.method = "kill"
    			current.params = ""
    			mode = "wall"
    			// need to delete wall from local.walls too
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

   		if (mode=="wall") {

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