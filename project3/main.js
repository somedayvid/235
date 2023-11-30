"use strict";

let monster1Audio, twang;
let monsters;
let thumper;
let boomer;

window.onload = (e) => {
    setup();
    createMonsters();
}

function setup(){
    monster1Audio = new Howl({
        src:["Sounds/DrumBoop.mp3"]
    });
    twang = new Howl({
        src:["Sounds/Twang.mp3"]
    });

    monsters = [
        thumper = {name: "thumper", interval: 1, playing: false, sound: monster1Audio},
        boomer = {name: "boomer", interval: 2, playing: false, sound: twang}
    ];
}

function createMonsters(){
    for(let i = 0; i < monsters.length; i++){
        const newItem = document.createElement("div");
        newItem.className = "monster";
        newItem.id = monsters[i].name;
        newItem.onclick = test;
        document.querySelector("#display").appendChild(newItem);
    }
}

function test(){
    let audio;
    for(let i = 0; i< monsters.length;i++){
        if(this.id == monsters[i].name){
            audio = monsters[i].sound;
        }
    }

    audio.play();
}