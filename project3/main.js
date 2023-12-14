"use strict";

//declaration of monsters and their sounds
let click, crump, drum, keclunk, knock, phwhip, slump, thrun, thump, thwhip, ting, tink, twaang, wawhee;
let clicker, crumper, drummer, keclunker, knocker, phwhipper, slumper, thrunner, thumper, thwhipper, tinger, tinker, twaanger, wawheeer;
let monsters;

//used for changing current selected sound/monster
let currentMonster;

//array for sounds
let sounds;

//array of created divs for the monsters
let divArray;

//special party mode bool
let allowPartyMode = false;

//listens to make sure the content is loaded first
document.addEventListener("DOMContentLoaded", function() {

window.onload = (e) => {
    const intervalSlider = document.querySelector("#interval");
    const speedSlider = document.querySelector("#rate");
    const volumeSlider = document.querySelector("#volume");
    const loopSwitch = document.querySelector("#loop");

    const intervalnum = document.querySelector("#intervalnum");
    const volumenum = document.querySelector("#volumenum");
    const ratenum = document.querySelector("#ratenum");

    const partyButton = document.querySelector("#partyButton");

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

    partyButton.addEventListener("click",partyToggler);
    partyButton.addEventListener("click", partyTime);

    divArray = document.querySelectorAll(".monster");

    document.addEventListener("keydown", e => {
        for(let i = 0; i < monsters.length;i++){
            if(e.key == monsters[i].key){
                currentMonster = monsters[i];
                break;
            }
        }
        for(let i = 0; i < divArray.length; i++){
            if(currentMonster.name == divArray[i].id){
                divArray[i].style.backgroundColor = '#DD1C1A';
            }
            else
            divArray[i].style.backgroundColor = '#06AED5';
        }
        document.querySelector("#name").innerHTML = currentMonster.name;
        document.querySelector("#intervalnum").innerHTML = intervalSlider.value = currentMonster.interval;
        document.querySelector("#ratenum").innerHTML = speedSlider.value = currentMonster.pitch;
        document.querySelector("#volumenum").innerHTML = volumeSlider.value = currentMonster.volume;
        loopSwitch.checked = currentMonster.loop; 
    });
}

//called everytime a slider is interacted with in order to update the monster's sound setting
function changeMonsterStats(){
    //used to find the number that corresponds to the changed setting and update it
    if(this.id != "loop"){
        document.querySelector(`#${this.id + "num"}`).innerHTML = this.value;
    }
    //checks through the monsters list and then changes the corresponding values for the monster
    for(let i = 0; i < monsters.length; i++){
        if(currentMonster.name == monsters[i].name){
            switch(this.id){
                case "interval":
                    monsters[i].interval = Number(this.value);
                    break;
                case "rate":
                    monsters[i].pitch = Number(this.value);
                    break;
                case "volume":
                    monsters[i].volume = Number(this.value);
                    break;
                case "loop":
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

//initializes all the sounds and monsters
function setup(){
    sounds = [
        click = new Howl({
            src:["Sounds/Click.mp3"],
        }),
        crump = new Howl({
            src:["Sounds/Crump.mp3"],
        }),
        drum = new Howl({
            src:["Sounds/Drum.mp3"],
        }),
        keclunk = new Howl({
            src:["Sounds/Keclunk.mp3"],
        }),
        knock = new Howl({
            src:["Sounds/Knock.mp3"],
        }),
        phwhip = new Howl({
            src:["Sounds/Phwhip.mp3"],
        }),
        slump = new Howl({
            src:["Sounds/Slump.mp3"],
        }),
        thrun = new Howl({
            src:["Sounds/Thrun.mp3"],
        }),
        thump = new Howl({
            src:["Sounds/Thump.mp3"],
        }),
        thwhip = new Howl({
            src:["Sounds/Thwhip.mp3"],
        }),
        ting = new Howl({
            src:["Sounds/Ting.mp3"],
        }),
        tink = new Howl({
            src:["Sounds/Tink.mp3"],
        }),
        twaang = new Howl({
            src:["Sounds/Twaang.mp3"],
        }),
        wawhee = new Howl({
            src:["Sounds/Wawhee.mp3"],
        })
    ]
    monsters = [
        clicker    = new Monster("Clicker", click, "q"), 
        crumper    = new Monster("Crumper", crump,"w"),
        drummer    = new Monster("Drummer", drum, "e"),
        keclunker  = new Monster("Keclunker", keclunk, "r"), 
        knocker    = new Monster("Knocker", knock, "t"),
        phwhipper  = new Monster("Phwipper", phwhip, "y"), 
        slumper    = new Monster("Slumper", slump, "u"),
        thrunner   = new Monster("Thrunner", thrun, "i"),
        thumper    = new Monster("Thumper", thump, "o"),
        thwhipper  = new Monster("Thwhipper", thwhip, "p"),  
        tinger     = new Monster("Tinger", ting, "a"),
        tinker     = new Monster("Tinker", tink, "s"),
        twaanger   = new Monster("Twaanger", twaang, "d"), 
        wawheeer   = new Monster("Wawheeer", wawhee, "f")
    ];
}

//creates all the divs for the monsters 
function createMonsters(){
    for(let i = 0; i < monsters.length; i++){
        const newItem = document.createElement("div");
        newItem.innerHTML = `<p>${monsters[i].name}</p><p>${monsters[i].key}</p>`;
        newItem.className = "monster";
        newItem.id = monsters[i].name;
        newItem.addEventListener("click", playing);
        newItem.addEventListener("click", partyTime);
        newItem.addEventListener("mouseover", changeBoxDisplayInfo); 
        newItem.addEventListener("mouseover", changeMon); 
        document.querySelector("#display").appendChild(newItem);
    }
}

//the playing toggle that changes the sound once the button is clicked 
function playing(){
    let audio;
    for(let i = 0; i< monsters.length;i++){
        if(this.id == monsters[i].name){
            const monster = monsters[i];
            audio = monster.sound;
            audio.rate(monster.pitch);
            audio.volume(monster.volume);
            //gets the corresponding div to apply css effect changes
            const item = document.querySelector(`#${monster.name}`);
            if(monster.loop)
            {
                if(monster.playing == false){
                    monster.playing = true;
                    audio.play();
                    //sets an interval to continuously play the sound on
                    monster.intervalID = setInterval(playSound, monster.interval * 1000, audio);
                    //css button animation
                    item.style.transform = 'translateY(10px)';
                    item.style.boxShadow = '0 10px #666';
                }
                else if(monster.playing == true){
                    clearInterval(monster.intervalID);
                    item.style.transform = 'none';
                    item.style.boxShadow = '0 20px #999';
                    monster.playing = false;
                }
            }
            else{
                audio.play();
            }
        }
    }
}

//changes the box with information that is accurate to the current monster's sound settings
function changeBoxDisplayInfo(){
    for(let i = 0; i < monsters.length;i++){
        if(this.id == monsters[i].name){
            const monster = monsters[i];
            const intervalSlider = document.querySelector("#interval");
            const speedSlider = document.querySelector("#rate");
            const volumeSlider = document.querySelector("#volume");
            const loopSwitch = document.querySelector("#loop");

            document.querySelector(`#${monster.name}`).style.backgroundColor = 'red';

            document.querySelector("#name").innerHTML = monster.name;
            document.querySelector("#intervalnum").innerHTML = intervalSlider.value = monster.interval;
            document.querySelector("#ratenum").innerHTML = speedSlider.value = monster.pitch;
            document.querySelector("#volumenum").innerHTML =  volumeSlider.value = monster.volume;

            loopSwitch.checked = monster.loop;
        }
    }
}

//changes the current monster and the indication of the current monster on the site
function changeMon(){
    this.style.backgroundColor = '#DD1C1A';
    for(let i = 0;i< monsters.length;i++){
        if(this.id == monsters[i].name){
            currentMonster = monsters[i];
            break;
        }
    }

    //sets all other divs to stay the unselected color
    for(let i = 0; i < divArray.length; i++){
        if(currentMonster.name != divArray[i].id){
            divArray[i].style.backgroundColor = '#06AED5';
        }
    }
}

//just for calling a specific audio as a function parameter for setinterval
function playSound(audio){
    audio.play();
}

//checks if party time is possible and activates it if it is
function partyTime(){
    if(allowPartyMode)
    {
        //counts how many sounds are active to determine if party time is possible
        let partyTimeCounter = 0;
        for(let i = 0; i< monsters.length;i++){
            if(monsters[i].playing){
                partyTimeCounter++;
            }
        }

        if(partyTimeCounter > 3){
            document.querySelector("body").style.backgroundImage = "url(meow-dancing-cat.gif)";
        }
        else {
            document.querySelector("body").style.backgroundImage = "none";
        }
    }
    else if(!allowPartyMode){
        document.querySelector("body").style.backgroundImage = "none";
    }
}

//button toggler that also adjusts the partymode bool
function partyToggler(){
    if(allowPartyMode){
        allowPartyMode = false;
        this.style.transform = 'none';
        this.style.boxShadow = '0 9px #999';
    }
    else if(!allowPartyMode){
        allowPartyMode = true;

        this.style.transform = 'translateY(4px)';
        this.style.boxShadow = '0 5px #666';
    }
}

}
)


