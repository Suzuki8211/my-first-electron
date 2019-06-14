'use strict'
const { ipcRenderer }  = require('electron')
//import ipcRenderer from 'electron';

ipcRenderer.on('dspStart', ()=>{

    console.log("load completed");
    const audioctx = new AudioContext();
    const osc = new OscillatorNode(audioctx, {frequency: 220, type:"sine"});
    const depth = new GainNode(autioctx, {gain: 10});
    let playing = false;
    osc.connect(audioctx.destination);

    document.getElementById('play').addEventListenner('click', ()=>{
        if(playing) return;
        osc.start();
        playing = true;
    });

    document.getElementById("volume").addEventListener("input", Setup);
    document.getElementById('waveform').addEventListener('change', Setup);

    Setup();

    function Setup() {
        depth.gain = document.getElementById("volume").value;
        osc.type = event.target.value;
    }
});