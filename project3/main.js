"use strict";

let drum, twang, guitarC;
let monsters;
let thumper, boomer, dunner;
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
        drum = new Howl({
            src:["Sounds/DrumBoop.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        twang = new Howl({
            src:["Sounds/Twang.mp3"],
            volume: 1.0,
            rate: 1.0
        }),
        guitarC = new Howl({
            src:["Sounds/GuiterC.wav"],
            volume: 1.0,
            rate: 1.0
        })
    ]
    monsters = [
        thumper = {name: "thumper", interval: 1, intervalID: "",playing: false, loop:true, volume:1.0, rate: 1.0, sound: drum},
        boomer = {name: "boomer", interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: twang},
        dunner = {name: "dunner", interval: 1, intervalID:"", playing: false, loop:true, volume:1.0, rate: 1.0, sound: guitarC}
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
