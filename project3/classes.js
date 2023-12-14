//a single monster class to make monster initialization simpler as they share many values
class Monster{
    constructor(name, sound, key){
        this.name = name;
        this.interval = 1.0;
        this.intervalID = "";
        this.playing = false;
        this.loop = true;
        this.volume = 1.0;
        this.pitch = 1.0;
        this.sound = sound;
        this.key = key;
    }

}