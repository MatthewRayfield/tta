var context = new webkitAudioContext(),
    instrument = new Instrument(context),
    keyMap = {
    'z': 0,
    's': 1,
    'x': 2,
    'd': 3,
    'c': 4,
    'v': 5,
    'g': 6,
    'b': 7,
    'h': 8,
    'n': 9,
    'j': 10,
    'm': 11
};

function Instrument(context) {
    var self = this;

    // Properties
    self.volume = 1;
    self.type = 0;
    self.octave = 4;

    // Volume envelope
    self.attack = .1;
    self.decay = .1;
    self.sustain = .1;
    self.sustainDuration = .2;
    self.release = .5;

    self.play = function (semitone) {
        var audioNode,
            gainNode,
            playTime,
            frequency;

        gainNode = context.createGain();

        playTime = self.attack + self.decay + self.sustainDuration + self.release;

        if (!semitone) {
            semitone = 0;
        }

        // Yeah, this could be cleaner...
        frequency = Math.pow(2, ((((self.octave - 4) * 12) + (semitone - 9))/12)) * 440;

        //console.log(frequency);

        // Volume envelope setup
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(self.volume, context.currentTime + self.attack);
        gainNode.gain.linearRampToValueAtTime(self.sustain, context.currentTime + self.attack + self.decay);
        gainNode.gain.linearRampToValueAtTime(self.sustain, context.currentTime + self.attack + self.decay + self.sustainDuration);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + self.attack + self.decay + self.sustainDuration + self.release);

        gainNode.connect(context.destination);

        if (self.type > 3) {
            audioNode = context.createScriptProcessor(1024, 1, 1);
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
            audioNode.type = ['sine', 'square', 'sawtooth', 'triangle'][self.type];
            audioNode.frequency.value = frequency;

            audioNode.start(0);
            audioNode.stop(context.currentTime + playTime);
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

function playKey(key) {
    var semitone = keyMap[key];

    if (semitone !== undefined) {
        instrument.play(semitone);
    }
}

// Post-DOM setup
window.onload = function () {
    var attackKnob  = new luk.Knob(document.getElementById('attack'), {'maximumValue': 1000, 'value': 0, 'sensitivity': 5}),
        decayKnob   = new luk.Knob(document.getElementById('decay'), {'maximumValue': 1000, 'value': 0, 'sensitivity': 5}),
        sustainKnob = new luk.Knob(document.getElementById('sustain'), {'maximumValue': 1000, 'value': 1000, 'sensitivity': 5}),
        releaseKnob = new luk.Knob(document.getElementById('release'), {'maximumValue': 1000, 'value': 0, 'sensitivity': 5}),
        waveKnob    = new luk.Knob(document.getElementById('wave'), {'maximumValue': 4, 'value': 2, 'sensitivity': .1});

    function adjustInstrument() {
        instrument.attack = attackKnob.value / 1000;
        instrument.decay = decayKnob.value / 1000;
        instrument.sustain = sustainKnob.value / 1000;
        instrument.release = releaseKnob.value / 1000;
        instrument.type = waveKnob.value;
    }

    // Add mouse events to keys
    [].forEach.apply(document.getElementsByClassName('key'), [function (keyElement) {
        keyElement.addEventListener('mousedown', function (event) {
            event.preventDefault();
            playKey(this.id);
        });
    }]);

    // Setup keyboard events
    document.onkeydown = function (e) {
        var key = String.fromCharCode(e.which).toLowerCase();

        playKey(key);
    };

    // Setup instrument adjusting on knob changes
    attackKnob.onchange = adjustInstrument;
    decayKnob.onchange = adjustInstrument;
    sustainKnob.onchange = adjustInstrument;
    releaseKnob.onchange = adjustInstrument;
    waveKnob.onchange = adjustInstrument;

    // Initial instrument adjustment
    adjustInstrument();
};
