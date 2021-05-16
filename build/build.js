var gui = new dat.GUI();
var params = {
    Download_Image: function () { return save(); },
    Nombre: 0,
    steps: 4,
    temperature: 1,
};
var Usertext;
var output;
var Tabmot;
var Partition;
var music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
music_rnn.initialize();
var rnnPlayer = new mm.Player();
var player = new mm.Player();
function setup() {
    p6_CreateCanvas();
    Usertext = createInput();
    Usertext.input(newTyping);
    output = select('#output');
    document.getElementById('demarrer').onclick = function (event) {
        Partition = separer(Usertext);
        var chant = createPartition(Partition);
        document.getElementById('chanson').onclick = function (event) {
            player.start(chant);
            player.stop();
            if (rnnPlayer.isPlaying()) {
                rnnPlayer.stop();
                return;
            }
            console.log(chant.notes);
            var qns = mm.sequences.quantizeNoteSequence(chant, 4);
            music_rnn
                .continueSequence(qns, 20, 2.5)
                .then(function (sample) { return rnnPlayer.start(sample); });
        };
    };
}
function newTyping() {
    output.html(Usertext.value());
}
function separer(Usertext) {
    var Tabmot = splitTokens(Usertext.elt.value);
    print(Tabmot);
    return Tabmot;
}
function createPartition(Partition) {
    var debut = 0.0;
    var fin = 0.5;
    var note;
    var mot = 0;
    var chanson = {
        notes: [],
        totalTime: 0
    };
    var x = Partition.length;
    for (var i = 0; i < x; i++) {
        var y = Partition[i].length;
        for (var j = 0; j < y; j++) {
            mot = ((mot + unchar(Partition[i][j]) - 20) / y | 0);
        }
        if (mot > 80) {
            mot = (random(70, 80) | 0);
        }
        if (mot < 50) {
            mot = (random(50, 60) | 0);
        }
        note = { pitch: mot, startTime: debut, endTime: fin };
        chanson.notes.push(note);
        debut = debut + 0.5;
        fin = fin + 0.5;
        chanson.totalTime = chanson.totalTime + 0.5;
    }
    return chanson;
}
function playInterpolation() {
    var vaePlayer = new mm.Player();
    if (vaePlayer.isPlaying()) {
        vaePlayer.stop();
        return;
    }
}
function windowResized() {
    p6_ResizeCanvas();
}
var __ASPECT_RATIO = 1;
var __MARGIN_SIZE = 25;
function __desiredCanvasWidth() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return windowWidth - __MARGIN_SIZE * 2;
    }
    else {
        return __desiredCanvasHeight() * __ASPECT_RATIO;
    }
}
function __desiredCanvasHeight() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return __desiredCanvasWidth() / __ASPECT_RATIO;
    }
    else {
        return windowHeight - __MARGIN_SIZE * 2;
    }
}
var __canvas;
function __centerCanvas() {
    __canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
function p6_CreateCanvas() {
    __canvas = createCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
function p6_ResizeCanvas() {
    resizeCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
var p6_SaveImageSequence = function (durationInFrames, fileExtension) {
    if (frameCount <= durationInFrames) {
        noLoop();
        var filename_1 = nf(frameCount - 1, ceil(log(durationInFrames) / log(10)));
        var mimeType = (function () {
            switch (fileExtension) {
                case 'png':
                    return 'image/png';
                case 'jpeg':
                case 'jpg':
                    return 'image/jpeg';
            }
        })();
        __canvas.elt.toBlob(function (blob) {
            p5.prototype.downloadFile(blob, filename_1, fileExtension);
            setTimeout(function () { return loop(); }, 100);
        }, mimeType);
    }
};
//# sourceMappingURL=../src/src/build.js.map