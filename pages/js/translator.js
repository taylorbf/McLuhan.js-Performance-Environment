var Translate = {
	toCode: function translate(command) {

    	var words = command.split(" ");
    	var output = "";

    	var current = {}
    	current.media = false
    	current.type = false
    	current.method = false
    	current.params = false
    	current.rhythm = false

    	switch (words[0]) {
    		case "a":
    			current.method = "shapeshift"
    			current.params = words[1]
    			//output = local.context + '.shapeshift("'+words[1]+'")';
    			//distant.walls.shapeshift(words[1])
    			break;
    		case "to":
    			// to hear a piano
    			current.method = "shapeshift"
    			current.params = words[1]
    			//output = local.context + '.shapeshift("'+words[1]+'")';
    			//distant.walls.shapeshift(words[1])
    			break;
    		case "and":
    			//and open pno3
    			//i.e. "and" 
    			break;
    	}

   		if (!current.media) {
   			output = local.context + "." 
   				   + current.method 
   				   + "('"
   				   + current.params 
   				   + "')"
   		}
    	
    	return output

    }
}