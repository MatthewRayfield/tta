window.onload = function () {
    var context = new webkitAudioContext();
    var oscillators = {};

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
        var ocscillator;

        if (freq) {
            oscillator = oscillators[key];
            if (oscillator) {
                oscillator.disconnect();
            }
            oscillator = oscillators[key] = new Oscillator(context);
            oscillator.freq = freq;
            oscillator.play();
        }

        console.log(key);
    };

    document.onkeyup = function (e) {
        var key = e.which;
        var oscillator = oscillators[key];

        if (oscillator) {
            oscillator.release();
        }
    };

    function Oscillator(context) {
        var self = this;
        var x = 0;
        var node = context.createJavaScriptNode(1024, 1, 1);
        var gainNode = context.createGainNode();
        var sampleRate = context.sampleRate;

        self.freq = 440;

        node.onaudioprocess = process;

        function process(e) {
            var data = e.outputBuffer.getChannelData(0);
            var i;
            var l = data.length;
            var out;

            for (i = 0; i < l; i ++) {
                out = Math.floor(x / (sampleRate / self.freq)) % 2;
                //out = Math.sin(x / (sampleRate / (self.freq * 2 * Math.PI)));
                data[i] = out;
                x++;
            }
        }

        this.play = function () {
            node.connect(gainNode);
            gainNode.connect(context.destination);

        };

        this.release = function () {
            function reduceVolume() {
                gainNode.gain.value -= .01;
                if (gainNode.gain.value <= 0) {
                    self.disconnect();
                }
                else {
                    setTimeout(reduceVolume, 5);
                }
            }
            reduceVolume();
        };

        this.disconnect = function () {
            node.disconnect();
            gainNode.disconnect();
        };
    }
};
