// Carica la configurazione
var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 320,
    backgroundColor: '#FFFFAC',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale:{
        zoom: 2
    }
};

// Crea il gioco
var game = new Phaser.Game(config);
var platforms;
var player;

// Carica lo sprite sheet e la mappa
function preload() {
    this.load.spritesheet('mario', 'assets/dante.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('tiles', 'assets/level1/tiles.png');
    this.load.tilemapTiledJSON('level1', 'assets/level1/level1.json');
    
}

// Crea la scena
function create() {
    
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('map-tileset','tiles');
    map.createLayer('background', tileset);
    const platformLayer = map.createLayer('platform', tileset);
      
    platformLayer.setCollisionByExclusion(-1, true);

    this.physics.world.bounds.width = platformLayer.width;
    this.physics.world.bounds.height = platformLayer.height;

    // Crea il personaggio giocatore
    player = this.physics.add.sprite(50, 120, 'mario').setOrigin(0);
    player.setScale(1.3);

    // Abilita la fisica per il personaggio giocatore
    this.physics.world.enable(player);
    player.setCollideWorldBounds(true);

    // Crea le animazioni di Mario
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'mario', frame: 0 }]
    });
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('mario', { start:0, end: 3 }),
        frameRate: 7,
        repeat: -1
    });

    // Imposta l'animazione "idle" come animazione predefinita del personaggio
    player.anims.play('idle', true);
    this.physics.add.collider(platformLayer, player);
    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);
    
    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff'); 
}


// Gestisce l'input
function update() {
    // Gestione dell'input per muovere il personaggio
    var cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('run', true);
        player.setFlipX(true);
        if (cursors.up.isDown && player.body.onFloor()) {
            jump();}
        
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('run', true);
        player.setFlipX(false);
        if (cursors.up.isDown && player.body.onFloor()) {
            jump();}
        
    }else if (cursors.up.isDown && player.body.onFloor()) {
        jump();
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('run', true);
            player.setFlipX(true);
            
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('run', true);
            player.setFlipX(false);
            
        }
    }
    else {
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }
}

function jump(){
    
        player.setVelocityY(-350);
        player.anims.play('run', true);
        player.setFlipX(false);
    
}