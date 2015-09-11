var Translate = {
	last: {},
	toCode: function translate(command) {

    	var output = "";

      var parsed = command.split(" @ ")
      var code = parsed[0]
      if (parsed[1]) {
        var beat = parsed[1]
      }

      if (code.split(" ")[0] == "-l") {
        var loop = code.split(" ")[0]
        code = code.slice(code.indexOf(code.split(" ")[2]))
        console.log(code)
      }

      if (code.split(" ")[0] == parseInt(code.split(" ")[0])) {
        var reference = parseInt(code.split(" ")[0])
        code = code.slice(code.indexOf(" ")+1)
      }

     // interval = "interval(1000,function() { eval( code ) })"

      //var tag = command.slice(command.indexOf("|")-1,command.length)

      //var codes = code.split(" | ")

     // output = code

    	return {
        code: code, // eventually an array?
        beat: beat,
        reference: reference
      }

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





    
