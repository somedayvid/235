"use strict";

let click, crump, drum, keclunk, knock, phwhip, slump, thrun, thump, thwhip, ting, tink, twaang, wawhee;
let clicker, crumper, drummer, keclunker, knocker, phwhipper, slumper, thrunner, thumper, thwhipper, tinger, tinker, twaanger, wawheeer;
let monsters;

let currentMonster;

let sounds;

document.addEventListener("DOMContentLoaded", function() {

window.onload = (e) => {
    const intervalSlider = document.querySelector("#interval");
    const speedSlider = document.querySelector("#rate");
    const volumeSlider = document.querySelector("#volume");
    const loopSwitch = document.querySelector("#loop");

    const intervalnum = document.querySelector("#intervalnum");
    const volumenum = document.querySelector("#volumenum");
    const ratenum = document.querySelector("#ratenum");

    setup();
    createMonsters();

    currentMonster = monsters[0];

    intervalnum.innerHTML = intervalSlider.value;
    volumenum.innerHTML = volumeSlider.value;
    ratenum.innerHTML = speedSlider.value;

    intervalSlider.oninput = changeMonsterStats;
    speedSlider.oninput = changeMonsterStats;
    volumeSlider.oninput = changeMonsterStats;
    loopSwitch.onclick = changeMonsterStats;
}

function changeMonsterStats(){
    if(this.id != "loop"){
        document.querySelector(`#${this.id + "num"}`).innerHTML = this.value;
    }
    for(let i = 0; i < monsters.length; i++){
        if(currentMonster.id == monsters[i].name){
            switch(this.id){
                case "interval":
                    monsters[i].interval = Number(this.value);
                    break;
                case "rate":
                    monsters[i].rate = Number(this.value);
                    break;
                case "volume":
                    monsters[i].volume = Number(this.value);
                    break;
                case "loop":
                    console.log(this.checked);
                    // console.log(monsters[i].loop);
                    if(this.checked == false){
                        monsters[i].loop = false;
                    }
                    else if(this.checked == true){
                        monsters[i].loop = true;
                    }
                    break;
            }
        }
    }
}

function setup(){
    sounds = [
        click = new Howl({
            src:["Sounds/Click.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        crump = new Howl({
            src:["Sounds/Crump.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        drum = new Howl({
            src:["Sounds/Drum.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        keclunk = new Howl({
            src:["Sounds/Keclunk.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        knock = new Howl({
            src:["Sounds/Knock.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        phwhip = new Howl({
            src:["Sounds/Phwhip.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        slump = new Howl({
            src:["Sounds/Slump.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        thrun = new Howl({
            src:["Sounds/Thrun.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        thump = new Howl({
            src:["Sounds/Thump.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        thwhip = new Howl({
            src:["Sounds/Thwhip.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        ting = new Howl({
            src:["Sounds/Ting.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        tink = new Howl({
            src:["Sounds/Tink.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        twaang = new Howl({
            src:["Sounds/Twaang.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        wawhee = new Howl({
            src:["Sounds/Wawhee.mp3"],
            volume: 1.0,
            rate: 1.0
        })
    ]
    monsters = [
        clicker    = {name: "Clicker",   interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: click }, 
        crumper    = {name: "Crumper",   interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: crump}, 
        drummer    = {name: "Drummer",   interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: drum}, 
        keclunker  = {name: "Keclunker", interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: keclunk}, 
        knocker    = {name: "Knocker",   interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: knock}, 
        phwhipper  = {name: "Phwhipper", interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: phwhip}, 
        slumper    = {name: "Slumper",   interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: slump}, 
        thrunner   = {name: "Thrunner",  interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: thrun}, 
        thumper    = {name: "Thumper",   interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: thump},
        thwhipper  = {name: "Thwipper",  interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: thwhip},  
        tinger     = {name: "Tinger",    interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: ting}, 
        tinker     = {name: "Tinker",    interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: tink}, 
        twaanger   = {name: "Twaanger",  interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: twaang}, 
        wawheeer   = {name: "Wawheer",   interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: wawhee}
    ];
}

function createMonsters(){
    for(let i = 0; i < monsters.length; i++){
        const newItem = document.createElement("div");
        newItem.className = "monster";
        newItem.id = monsters[i].name;
        newItem.onclick = playing;
        newItem.addEventListener("mouseover", changeBoxDisplayInfo); 
        newItem.addEventListener("mouseover", changeMon); 
        document.querySelector("#display").appendChild(newItem);
    }
}

function playing(){
    let audio;
    for(let i = 0; i< monsters.length;i++){
        if(this.id == monsters[i].name){
            const monster = monsters[i];
            audio = monster.sound;
            audio.rate(monster.rate);
            audio.volume(monster.volume);
            if(monster.loop)
            {
                const item = document.querySelector(`#${monster.name}`);
                if(monster.playing == false){
                    monster.playing = true;
                    audio.play();
                    monster.intervalID = setInterval(playSound, monsters[i].interval * 1000, audio);
                    item.style.transform = 'translateY(4px)';
                    item.style.boxShadow = '0 5px #666';
                }
                else if(monster.playing == true){
                    clearInterval(monster.intervalID);
                    item.style.transform = 'none';
                    item.style.boxShadow = '0 9px #999';
                    monster.playing = false;
                }
            }
            else{
                audio.play();
            }
        }
    }
}

function changeBoxDisplayInfo(){
    for(let i = 0; i < monsters.length;i++){
        if(this.id == monsters[i].name){
            const monster = monsters[i];
            const intervalSlider = document.querySelector("#interval");
            const speedSlider = document.querySelector("#rate");
            const volumeSlider = document.querySelector("#volume");
            const loopSwitch = document.querySelector("#loop");

            document.querySelector("#name").innerHTML = monster.name;
            intervalSlider.value = monster.interval;
            speedSlider.value = monster.rate;
            volumeSlider.value = monster.volume;

            loopSwitch.checked = monster.loop;

            document.querySelector("#intervalnum").innerHTML = intervalSlider.value;
            document.querySelector("#volumenum").innerHTML = volumeSlider.value;
            document.querySelector("#ratenum").innerHTML = speedSlider.value;
        }
    }
}

function changeMon(){
    const word = this;
    currentMonster = word;
}

function playSound(audio){
    audio.play();
}
})
