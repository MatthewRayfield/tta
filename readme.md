# tta - a javascript soft-synth

## Try it [here](http://www.matthewrayfield.com/tta/tta.html)!

### What is it?
tta is a very feature-light software synthesizer that runs in your web browser.

### What browsers are supported?
Currently it only functions in Safari and Chrome because they support the [Web Audio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html). Firefox support could be added through use of their [Audio Data API](https://wiki.mozilla.org/Audio_Data_API), but I haven't taken the time to do that.

### Where do I use it?
At <http://www.matthewrayfield.com/tta/tta.html> or on your own computer by following the "How do I install it?" instructions below.

### How do I use it?
Press some keys please! You'll see one octave worth of keys on the screen. You can either click these directly or use your keyboard's keys with the corresponding letters.

After you do that for a bit, you might want to play with the knobs up top. These you'll have to click on and hold, then move your mouse to adjust.

The knob letters stand for the following:

- __w__ave
- __a__ttack
- __d__ecay
- __s__ustain
- __r__elease

I hope you know what these mean. If you don't, [this should help](http://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope).

### How do I install it?
If you'd like to run it off your own computer or web-server just do the following:

1. Clone this repo.
2. Clone the [luk repo](https://github.com/MatthewRayfield/luk).
3. Copy, "luk.js" and "luk.css" into your tta folder.
4. Access "tta.html".
