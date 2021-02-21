let gameScene = new Phaser.Scene('Game');
let loadScene = new Phaser.Scene('Load');
let menuScene = new Phaser.Scene('Menu');

let config = {
    type:Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [loadScene, menuScene, gameScene],
    physics: {
        default:"arcade",
        arcade:{
            debug: false,
            gravity: {y:2500}
        }
    }
}

var game = new Phaser.Game(config);

loadScene.create = function() {
    this.add.text(360, 200, "Loading...");
    this.time.addEvent({
        delay: 1000, 
        loop: false,
        callback: () => {
            this.scene.start("Menu");
        }
    })
}

menuScene.preload = function() {
    menuScene.load.image("menuBackground", "StarBackground3.jpg");
    menuScene.load.image("start","start.jpg");
    this.load.image("spaceHighway", "space_highway.png");
}

menuScene.create = function() {
    let background = this.add.image(400, 300, 'menuBackground');
    background.setScale(.3);

    this.title = this.add.sprite(400, 180, "spaceHighway");
    this.title.setScale(.37);

    this.start = this.add.sprite(400,450,"start");
    this.start.setScale(.11);
    this.start.setInteractive();

    function createTweens(item){
        item.onClickTween = menuScene.tweens.add({
            targets: item,
            scaleX: .12,
            scaleY: .12,
            duration: 100,
            yoyo: true,
            ease: "Quad.easeOut",
            onStart: function(){
                item.setScale(.11,.11);
            }
        });
    
        item.onHoverTween = menuScene.tweens.add({
            targets: item,
            scaleX: .12,
            scaleY: .12,
            duration: 200,
            ease: "Quad.easeIn",
            onStart: function(){
                item.setScale(.11,.11);
            }
        });
    
        item.onLeaveTween = menuScene.tweens.add({
            targets: item,
            scaleX: .11,
            scaleY: .11,
            duration: 200,
            ease: "Quad.easeOut",
            onStart: function(){
                item.setScale(.12,.12);
            }
        });

    }

    createTweens(this.start);

    this.start.setInteractive();

    this.start.on('pointerdown', function(){
        menuScene.start.onClickTween.restart();
        menuScene.scene.start("Game");
        
    });

    this.start.on('pointerover', function(){
        menuScene.start.onHoverTween.restart();
        menuScene.start.onClickTween.stop();
        menuScene.start.onLeaveTween.stop();
    });

    this.start.on('pointerout', function(){
        menuScene.start.onLeaveTween.restart();
        menuScene.start.onClickTween.stop();
        menuScene.start.onHoverTween.stop();
    });
}



gameScene.preload = function() {
    this.load.image("gameBackground", "StarBackground2.jpg");
    this.load.image("circleOne", "space.png");
    this.load.image("2-circle", "2.png");
    this.load.image("3-circle", "3.png");
    this.load.image("4-circle", "4.png");
    this.load.image("ground", "ground.png"); 
    this.load.image('1-box',"box1.png");
    this.load.image('2-box','box2.png');
    this.load.image('3-box','box3.png');
    this.load.image("circleLeft", "left.png");
    this.load.image("circleRight", "right.png");
    this.load.audio('hit','PUNCH.mp3');
    this.load.audio('jump','jump.wav');
    this.load.audio('theme', 'Huma-Huma-Crimson-Fly.mp3')
}

var score = 0;

gameScene.create = function() {
    this.background = this.add.image(400, 300, "gameBackground");

    this.ground = this.physics.add.sprite(400, 700, "ground");
    this.ground.setScale(.42);
    this.ground.body.allowGravity = false;
    this.ground.body.setImmovable(true);

    this.circleOne = this.physics.add.sprite(150, 437, "circleOne");
    this.circleOne.setScale(.15);
    this.add.existing(this.circleOne);
    this.circleOne.setCollideWorldBounds(true);
    
    this.scoreText = this.add.text(15, 15, "score: " + score, {
        font: "20px Arial",
        fill: "#e3fae9",
        align: "center"
    });

    this.boxOne = this.physics.add.sprite(850,465,"1-box");
    this.boxOne.body.allowGravity = false;
    this.boxOne.setScale(.16);
    this.boxOne.body.setImmovable(true);
    
    this.box2 = this.physics.add.sprite(-50,0,'2-box');
    this.box2.body.allowGravity = false;
    this.box2.scaleY=.11;
    this.box2.scaleX=.25;
    this.box2.body.setImmovable(true);
    
    this.box3 = this.physics.add.sprite(-200,0,'3-box');
    this.box3.body.allowGravity = false;
    this.box3.scaleY=.27;
    this.box3.scaleX=.13;
    this.box3.body.setImmovable(true);
    
    var circles = [this.circleOne]
    var boxes = [this.boxOne, this.box2, this.box3];
    //setting up colliders for circleOne
    for(i = 0; i < circles.length; i++){
        this.physics.add.collider(circles[i], this.ground, stopFall);
        for(j =0; j < boxes.length; j++){
        this.physics.add.collider(circles[i], boxes[j], restart);
        }     
    }

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.hit = this.sound.add('hit', {volume: 0.2});
    this.jump = this.sound.add('jump',{volume:0.2});
    this.theme = this.sound.add('theme',{volume:0.05});
    gameScene.theme.play()
    gameScene.theme.setLoop(true);
    gameScene.theme.setVolume(.5);
}

function stopFall(){
    jumped = false;
}
function stopFall2(){
    jumped2 = false;
}
function stopFall3(){
    jumped3 = false;
}

function restart(){
    gameScene.hit.play();    
    score = 0;
    gameScene.boxOne.x = 850;
    gameScene.box2.x = -100;
    gameScene.box3.x = -200;
    if(circleLeftIsIn){
        gameScene.circleLeft.x = 1200;
    }
    if (circleRightIsIn){
        gameScene.circleRight.x = 1500;
        
    }
    jumped = false;
    jumped2 = false;
    jumped3 = false;
    circleLeftIsIn =false;
    circleRightIsIn = false;
}

//circle____IsIn establishes if next circle has been added yet
var circleLeftIsIn =false;
var circleRightIsIn = false;

var lifted = true;
var leftLifted = true;
var rightLifted = false;

var speed = 400;

gameScene.update = function(time, delta) {
    this.boxOne.x -= delta/1000 * speed;
    this.box2.x -= delta/1000 * speed;
    this.box3.x -= delta/1000 * speed;
    
    score += (parseInt(delta/16));
    gameScene.scoreText.text = "score: " + score;

    if(!this.cursorKeys.space.isDown){  
        lifted = true;
        this.circleOne.body.allowGravity = true; 
    }

    if(this.cursorKeys.space.isDown && lifted){  
        jump(this.circleOne);
        this.circleOne.body.allowGravity = true;
        console.log("SPACE");
        lifted = false;
    }
    
//sees if circleLeft and circleRight are in
//if not dont have to check if key pressed
    if (circleLeftIsIn){
        if(!this.cursorKeys.left.isDown){  
            leftLifted = true;
            this.circleLeft.body.allowGravity = true;
        }
        if(this.cursorKeys.left.isDown && leftLifted){  
            jump2(this.circleLeft);
            this.circleLeft.body.allowGravity = true;
            console.log("LEFT");
            leftLifted = false;
        }
    }

    if (circleRightIsIn){
        if(!this.cursorKeys.right.isDown){  
            rightLifted = true;
            this.circleRight.body.allowGravity =true;
        }
        if(this.cursorKeys.right.isDown && rightLifted){  
            jump3(this.circleRight);
            this.circleRight.body.allowGravity =true;
            console.log("RIGHT");
            rightLifted = false;
        }
    }



   //checks if all boxes out of view window, so can pull one of them back onto the screen
    if(this.boxOne.x < -50 && this.box2.x < -50 && this.box3.x <-50 && (score < 925 || score > 1075) && (score<2425 || score > 2575)){
        spawnNewBox();
    }
    
    if (score > 1000 && circleLeftIsIn === false){
        getNewCircle(2);
        
    }
    if (score > 2500&& circleRightIsIn === false){
        getNewCircle(3);
        
    }
    
}

function getNewCircle(number){
    if (number === 2){

        gameScene.circleLeft = gameScene.physics.add.sprite(300, 0, "circleLeft");
        gameScene.circleLeft.setScale(.15);
        
        circleLeftIsIn = true;
        gameScene.physics.add.collider(gameScene.circleLeft, gameScene.ground,stopFall2);
        gameScene.physics.add.collider(gameScene.circleLeft, gameScene.boxOne,restart);
        gameScene.physics.add.collider(gameScene.circleLeft, gameScene.box2,restart);
        gameScene.physics.add.collider(gameScene.circleLeft, gameScene.box3,restart);
    }
    else if (number === 3){
        gameScene.circleRight = gameScene.physics.add.sprite(450, 100, "circleRight");
        gameScene.circleRight.setScale(.15);
        gameScene.add.existing(gameScene.circleRight);
        circleRightIsIn = true;
        gameScene.physics.add.collider(gameScene.circleRight, gameScene.ground,stopFall3);
        gameScene.physics.add.collider(gameScene.circleRight, gameScene.boxOne,restart);
        gameScene.physics.add.collider(gameScene.circleRight, gameScene.box2,restart);
        gameScene.physics.add.collider(gameScene.circleRight, gameScene.box3,restart);

    }
}

function jump(circle){
    while (jumped === false){
        circle.setVelocityY(-900);
        jumped = true;
        gameScene.jump.play();

    }
}
function jump2(circle){
    while (jumped2 === false){
        circle.setVelocityY(-900);   
        jumped2 = true;
        gameScene.jump.play();
    }
}
function jump3(circle){
    while (jumped3 === false){
        circle.setVelocityY(-900);
        jumped3 = true;
        gameScene.jump.play();
    }
}

function spawnNewBox(){
    let random = Math.random();
    if(random < .34){
        gameScene.boxOne.x = 850;
        gameScene.boxOne.y = 465;
    }
    else if(random < .67){
        gameScene.box2.x = 850;
        gameScene.box2.y = 468;
    }
    else if(random < 1){
        gameScene.box3.x = 850;
        gameScene.box3.y = 460;
    }
    console.log(random);
}


