"use strict";

let drum, twang, guitarC;
let monsters;
let thumper, boomer, dunner;

let sounds;
document.addEventListener("DOMContentLoaded", function() {

window.onload = (e) => {
    const slider = document.querySelector("#interval");
    slider.oninput = change;
    setup();
    createMonsters();
}

function change(){
    const sliderNum = document.querySelector("#intervalnum");
    sliderNum.innerHTML = document.querySelector("#interval").value;
}

function setup(){
    sounds = [
        drum = new Howl({
            src:["Sounds/DrumBoop.mp3"],
        }),
        twang = new Howl({
            src:["Sounds/Twang.mp3"]
        }),
        guitarC = new Howl({
            src:["Sounds/GuiterC.wav"]
        })
    ]

    monsters = [
        thumper = {name: "thumper", interval: 1, intervalID: "",playing: false, rate: 1.0, sound: drum, soundID: getID(drum)},
        boomer = {name: "boomer", interval: 2, intervalID:"", playing: false, rate: 1.0, sound: twang, soundID: getID(twang)},
        dunner = {name: "dunner", interval: 1, intervalID:"", playing: false, rate: 1.0, sound: guitarC, soundID: getID(guitarC)}
    ];
}

function getID(sound){
    const id = sound.play();
    sound.stop();
    return id;
}

function createMonsters(){
    for(let i = 0; i < monsters.length; i++){
        const newItem = document.createElement("div");
        newItem.className = "monster";
        newItem.id = monsters[i].name;
        newItem.onclick = toggler;
        document.querySelector("#display").appendChild(newItem);
    }
}

function toggler(){
    let audio;
    for(let i = 0; i< monsters.length;i++){
        if(this.id == monsters[i].name){
            const item = document.querySelector(`#${monsters[i].name}`);
            audio = monsters[i].sound;
            if(monsters[i].playing == false){
                audio.play();
                monsters[i].intervalID = setInterval(playSound, monsters[i].interval * 1000, audio);
                monsters[i].playing = true;
                item.style.transform = 'translateY(4px)';
                item.style.boxShadow = '0 5px #666';
            }
            else if(monsters[i].playing == true){
                clearInterval(monsters[i].intervalID);
                monsters[i].playing = false;
                item.style.transform = 'none';
                item.style.boxShadow = '0 9px #999';
            }
        }
    }
}

function playSound(audio){
    audio.play();
}
})
