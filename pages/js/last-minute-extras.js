/* Ben Library */

var Counter = function(limit) {
  this.max = 0;
  this.current = -1;
  this.tick = function() {
    this.current++;
    if (this.current>=this.limit) {
      this.current = 0;
    }
    return this.current;
  }
  this.downtick = function() {
    this.current--;
    if (this.current <= this.limit) {
      this.current = this.limit-1;
    }
    return this.current;
  }
}



 /*

 PHONE
 -- this should all go in manager and be applied to window?

 API:

 phone.dialtone.start()
 phone.dialtone.stop()
 phone.dial(1-9)
 phone.dial(1-9,1)

 */

function PhoneEvent(transposition) {
	//	this.transposition = transposition
    this.status = 0;

    this._freqs = {
    	"dialtone": {f1: 350, f2: 440},
	    "1": {f1: 697, f2: 1209},
	    "2": {f1: 697, f2: 1336},
	    "3": {f1: 697, f2: 1477},
	    "4": {f1: 770, f2: 1209},
	    "5": {f1: 770, f2: 1336},
	    "6": {f1: 770, f2: 1477},
	    "7": {f1: 852, f2: 1209},
	    "8": {f1: 852, f2: 1336},
	    "9": {f1: 852, f2: 1477},
	    "*": {f1: 941, f2: 1209},
	    "0": {f1: 941, f2: 1336},
	    "#": {f1: 941, f2: 1477}
		}
		this.dialfreqs = {}

		this.transpose(transposition)


}

PhoneEvent.prototype.setup = function(){
    this.osc1 = Tone.context.createOscillator();
    this.osc2 = Tone.context.createOscillator();
    this.osc1.frequency.value = 0;
    this.osc2.frequency.value = 0;

    this.gainNode = Tone.context.createGain();
    this.gainNode.gain.value = 0.05;

    this.filter = Tone.context.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 8000;

    this.osc1.connect(this.gainNode);
    this.osc2.connect(this.gainNode);

    this.gainNode.connect(this.filter);
    this.filter.connect(m.fx);
}

PhoneEvent.prototype.start = function(freq1,freq2){
		this.setup()
		this.osc1.frequency.value = freq1
		this.osc2.frequency.value = freq2
    this.osc1.start(0)
    this.osc2.start(0)
    this.status = 1
}

PhoneEvent.prototype.stop = function(duration){
		duration = duration || 0
    this.osc1.stop(Tone.context.currentTime + duration);
    this.osc2.stop(Tone.context.currentTime + duration);
    this.status = 0;
}

PhoneEvent.prototype.dialtone = function() {
  this.start(this.dialfreqs["dialtone"].f1,this.dialfreqs["dialtone"].f2)
}

PhoneEvent.prototype.dial = function(number,duration) {
  this.start(this.dialfreqs[number].f1,this.dialfreqs[number].f2)
  this.stop(duration)
}

PhoneEvent.prototype.transpose = function(step) {
	step = step || 0;
  for (var key in this._freqs) {
  	this.dialfreqs[key] = {
  		f1: prune( this._freqs[key].f1 * Math.pow(2,step*100/1200), 8),
  		f2: prune( this._freqs[key].f2 * Math.pow(2,step*100/1200), 8)
  	}
  }
}





var Phone = function() {
	var self = this

	this.synth = false

	this.dialtone = {
		start: function() {
			self.synth ? self.synth.stop() : false;
			self.synth = new PhoneEvent(self.transposition)
			self.synth.dialtone()
		},
		stop: function() {
			self.synth.stop()
		}
	}

	this.tones = []
	this.toneIndex = 0

	this.transposition = 0

}

Phone.prototype.dial = function(number,duration) {

	this.toneIndex++
	this.tones[this.toneIndex] = new PhoneEvent(this.transposition)
	this.tones[this.toneIndex].dial(number,duration)

}

Phone.prototype.transpose = function(step) {

	this.transposition = step

}

phone = new Phone()
