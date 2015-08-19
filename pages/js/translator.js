var Translate = {
	last: {},
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

    		case "a":
    			current.method = "shapeshift"
    			current.params = words[1]
    			mode = "wall"
    			break;

    		case "to":
    			// to hear a piano playing pno
    			current.variable = words[3]
    			current.method = words[1]
    			current.params = words[5]
    			mode = "newmedia"
    			break;

    		case "and":
    			current.media = this.last.media
    			current.method = words[1]
    			current.params = words[2]
    			mode = "media"
    			break;


    		// walls
    	/*	case "gone":
    			current.method = "kill"
    			current.params = ""
    			mode = "wall"

    			break; */
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

    	}

   		if (mode=="wall") {

   			// output looks like: red.shapeshift("line")
   			
   			output = local.context + "." 
   				   + current.method 
   				   + "('"
   				   + current.params 
   				   + "')"
			
   		} else if (mode=="media") {

   			// output looks like: piano.open("pno")
   			
   			output = current.media + "."
   				   + current.method 
   				   + "('"
   				   + current.params 
   				   + "')"

   		} else if (mode=="newwall") {
   		} else if (mode=="newmedia") {
			
			// output looks like: var piano = red.hear("line")
   			
   			output = current.variable 
   				   + " = " + local.context + "." 
   				   + current.method 
   				   + "('"
   				   + current.params 
   				   + "')"


   		}

   		this.last = JSON.parse(JSON.stringify(current));
    	
    	return output

    }
}