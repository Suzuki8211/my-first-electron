'use strict'
const { ipcRenderer }  = require('electron')

ipcRenderer.on('dspStart', ()=>{

    console.log("load completed");

    const audioctx = new AudioContext();

    const analyser = new AnalyserNode(audioctx, {smoothingTimeConstant: 0.5});
    analyser.connect(audioctx.destination);

    const gainNode = audioctx.createGain();
    gainNode.connect(analyser);

    const limiter = new DynamicsCompressorNode(audioctx, {
        threshold: -10,
        knee: 0,
        ratio: 20,
        attack: 0,
        release: 0.1
    });
    limiter.connect(gainNode);

    const masterHiFilter = new BiquadFilterNode(audioctx, {
        frequency: 70,
        q: 1000,
        type: 'highpass'
    });
    masterHiFilter.connect(limiter);

    const masterLoFilter = new BiquadFilterNode(audioctx, {
        frequency: 10000,
        q: 500,
        type: 'lowpass'
    });
    masterLoFilter.connect(masterHiFilter);

    const osc = new OscillatorNode(audioctx, {frequency: 220, type:"sine"});
    osc.connect(masterLoFilter);

    const lfo = new OscillatorNode(audioctx, {frequency: 5, type:"sine"});
    const lfoGain = audioctx.createGain();
    lfo.connect(lfoGain).connect(osc.frequency);

    let playing = false;

    document.getElementById('on').addEventListener('click', ()=>{
        if(playing) return;
        osc.start();
        lfo.start();
        playing = true;

        setInterval(()=>{
            lfo.frequency.value = Math.pow(Math.random(), 3)*200;
        }, 740)

        setInterval(()=>{
            lfoGain.gain.value = Math.pow(Math.random(), 0.75)*1000;
        }, 534)

    });

    document.getElementById("volume").addEventListener("input", Setup);
    document.getElementById('pitchBase').addEventListener('change', SetupPitchBase);
    document.getElementById('waveform').addEventListener('change', SetupWaveform);

    Setup();
    SetupWaveform();
    SetupPitchBase();

    function Setup() {
        gainNode.gain.value = document.getElementById("volume").value;
    }

    function SetupWaveform() {
        const interval = document.getElementById("waveform").value;
        let counter = 0
        let i = setInterval(()=> {
            gainNode.gain.value = document.getElementById("volume").value;
            const waveIndex = Math.floor(Math.random()*6);
            switch(waveIndex) {
                case 0:
                    osc.type = "sine";
                    document.getElementById("waveName").innerHTML = "sine";
                    break;
                case 1:
                    osc.type = "square";
                    document.getElementById("waveName").innerHTML = "square";
                    break;
                case 2:
                    osc.type = "sawtooth";
                    document.getElementById("waveName").innerHTML = "saw";
                    break;
                case 3:
                    osc.type = "triangle";
                    document.getElementById("waveName").innerHTML = "tri";
                    break;
                case 4:
                    gainNode.gain.value = 0;
                    document.getElementById("waveName").innerHTML = "";
                    break;
                case 5:
                    osc.type = "sine";
                    document.getElementById("waveName").innerHTML = "sine";
            }
            counter++;
            if(counter == 75) {
                clearInterval(i);
            }
        }, Number(interval));
    }

    function SetupPitchBase() {
        const interval = document.getElementById("pitchBase").value;
        let counter = 0
        let i = setInterval(()=> {
            const freq = Math.pow(Math.random(), 9)*4000 + 60;
            osc.frequency.value = freq;
            document.getElementById("freqValue").innerHTML = Math.floor(freq)+"Hz";
            counter++;
            if(counter == 75) {
                clearInterval(i);
            }
        }, Number(interval));
    }

    const canvasctx = document.getElementById("graph").getContext("2d");
    const gradbase = canvasctx.createLinearGradient(0, 0, 0, 256);
    const mode = 0;
    gradbase.addColorStop(0, "rgb(20,22,20)");
    gradbase.addColorStop(1, "rgb(20,20,200)");
    const gradline = [];
    for(let i = 0; i < 256; ++i) {
        gradline[i] = canvasctx.createLinearGradient(0, 256 - i, 0, 256);
        const n = (i & 64) * 2;
        gradline[i].addColorStop(0, "rgb(255,0,0)");
        gradline[i].addColorStop(1, "rgb(255," + i + ",0)");
    }
    function DrawGraph() {
        canvasctx.fillStyle = gradbase;
        canvasctx.fillRect(0, 0, 256, 256);
        const data = new Uint8Array(256);
        if(mode == 0) analyser.getByteFrequencyData(data); //Spectrum Data
        else analyser.getByteTimeDomainData(data); //Waveform Data
        for(var i = 0; i < 256; ++i) {
            canvasctx.fillStyle = gradline[data[i]];
            canvasctx.fillRect(i, 256 - data[i], 1, data[i]);
        }
    }
    setInterval(DrawGraph, 30);
});