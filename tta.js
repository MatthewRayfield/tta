window.onload = function () {
    var context = new webkitAudioContext();
    var instrument = new Instrument(context);
    var stepsByKey = {
        90: -9,
        83: -8,
        88: -7,
        68: -6,
        67: -5,
        86: -4,
        71: -3,
        66: -2,
        72: -1,
        78: 0,
        74: 1,
        77: 2
    };
    var octave = 4;

    document.onkeydown = function (e) {
        var key = e.which;
        var steps = stepsByKey[key];
        var freq;

        if (typeof steps !== 'undefined') {
            steps = steps + ((octave-4)*12)
            freq = Math.pow(2, steps/12)*440;
            if (!instrument.playing) {
                instrument.play(freq);
            }
        }
    };

    document.onkeyup = function (e) {
        instrument.stop();
    };

    function Instrument(context) {
        var self = this;
        var t = 0;
        var audioNode;
        var gainNode;
        var startTime;

        // Properties
        self.volume = 1;
        self.type = 0;
        self.playing = false;

        // Volume envelope
        self.attack = .1;
        self.decay = .2;
        self.sustain = .1;
        self.release = .5;

        self.play = function (frequency) {
            gainNode = context.createGainNode();
            startTime = context.currentTime;
            gainNode.gain.linearRampToValueAtTime(0, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(self.volume, context.currentTime + self.attack);
            gainNode.gain.linearRampToValueAtTime(self.sustain, context.currentTime + self.attack + self.decay);
            gainNode.connect(context.destination);

            if (!self.type) {
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
                audioNode.type = self.type - 1;
                audioNode.frequency.value = frequency;
            }
            audioNode.connect(gainNode);
            self.playing = true;
        };

        self.stop = function () {
            var releaseTime;
            var playTime = context.currentTime - startTime;
            var adTime = self.attack + self.decay;
            var diff = adTime - playTime;

            if (gainNode) {
                if (diff > 0) {
                    releaseTime = self.release + diff;
                }
                else {
                    releaseTime = self.release;
                }
                gainNode.gain.linearRampToValueAtTime(0, context.currentTime + releaseTime);
            }
            self.playing = false;
        };
    }

    document.getElementById('type').onchange = function () {
        instrument.type = parseFloat(this.value);
    };
    document.getElementById('attack').onchange = function () {
        instrument.attack = parseFloat(this.value);
    };
    document.getElementById('decay').onchange = function () {
        instrument.decay = parseFloat(this.value);
    };
    document.getElementById('sustain').onchange = function () {
        instrument.sustain = parseFloat(this.value);
    };
    document.getElementById('release').onchange = function () {
        instrument.release = parseFloat(this.value);
    };
    document.getElementById('octave').onchange = function () {
        octave = parseFloat(this.value);
    };
};
