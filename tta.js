window.onload = function () {
    var context = new webkitAudioContext();
    var instrument = new Instrument(context);

    document.onkeydown = function (e) {
        var key = e.which;

        instrument.play();
    };

    document.onkeyup = function (e) {
        var key = e.which;
    };

    function Instrument(context) {
        var self = this;

        // Properties
        self.volume = 1;
        self.type = 0;
        self.octave = 4;
        self.semitone = 0;

        // Volume envelope
        self.attack = .1;
        self.decay = .1;
        self.sustain = .1;
        self.sustainDuration = .2;
        self.release = .5;

        self.play = function () {
            var audioNode;
            var gainNode = context.createGainNode();

            var playTime = self.attack + self.decay + self.sustainDuration + self.release;

            // Yeah, this could be cleaner...
            var frequency = Math.pow(2, ((((self.octave - 4) * 12) + (self.semitone - 9))/12)) * 440;

            console.log(frequency);

            gainNode.gain.linearRampToValueAtTime(0, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(self.volume, context.currentTime + self.attack);
            gainNode.gain.linearRampToValueAtTime(self.sustain, context.currentTime + self.attack + self.decay);
            gainNode.gain.linearRampToValueAtTime(self.sustain, context.currentTime + self.attack + self.decay + self.sustainDuration);
            gainNode.gain.linearRampToValueAtTime(0, context.currentTime + self.attack + self.decay + self.sustainDuration + self.release);

            gainNode.connect(context.destination);

            if (self.type > 4) {
                audioNode = context.createJavaScriptNode(1024, 1, 1);
                audioNode.onaudioprocess = function(e) {
                    var data = e.outputBuffer.getChannelData(0);
                    var i;
                    var l = data.length;

                    for (i = 0; i < l; i ++) {
                        data[i] = Math.random();
                    }
                };
            }
            else {
                audioNode = context.createOscillator();
                audioNode.type = self.type;
                audioNode.frequency.value = frequency;

                audioNode.noteOn(0);
                audioNode.noteOff(context.currentTime + playTime);
            }

            audioNode.connect(gainNode);

            setTimeout(function () {
                // Clean up
                gainNode.disconnect();
                gainNode = null;
                audioNode.disconnect();
                audioNode = null;

            }, 1000 * playTime);
        };
    }
};
