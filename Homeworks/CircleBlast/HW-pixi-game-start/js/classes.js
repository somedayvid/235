// class Ship extends PIXI.Sprite {
//     constructor(x = 0, y = 0){
//         super(app.loader.resources["images/spaceship.png"].texture);
//         this.anchor.set(.5, .5); 
//         this.scale.set(0.1);
//         this.x = x;
//         this.y = y;
//     }
// }

class Ship extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["images/spaceship.png"].texture);
        this.anchor.set(0.5, 0.5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
    }
}