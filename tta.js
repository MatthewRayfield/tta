window.onload = function () {
    var context = new webkitAudioContext();
    var instrument = new Instrument(context);

    document.onkeydown = function (e) {
        var key = e.which;
        var freqs = {
            90: 261.63,
            88: 293.66,
            67: 329.63,
            86: 349.23,
            66: 392.00,
            78: 440.00,
            77: 493.88
        };
        var freq = freqs[key];

        if (freq) {
            if (!instrument.playing) {
                instrument.play(freq);
            }
        }

        console.log(key);
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
};
