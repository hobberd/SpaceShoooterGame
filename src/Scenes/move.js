class Move extends Phaser.Scene 
{
    constructor() 
    {
        super("moveScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        
        this.playerX = 300;
        this.playerY = 500;
        this.arrowFly = false;
        this.arrowHit = false;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() 
    {
        this.load.setPath("./assets/");
        this.load.image("player", "player.png");
        this.load.image("zombie", "zombie.png");
        this.load.image("robot", "robot.png");
        this.load.image("arrow", "item_arrow.png");
    }

    create() 
    {
        let my = this.my;   // create an alias to this.my for readability
        my.sprite.player = this.add.sprite(this.playerX, this.playerY, "player");
        my.sprite.arrow = this.add.sprite(this.playerX, this.playerY, "arrow");
        my.sprite.player.visible = true;
        my.sprite.arrow.visible = false;
        my.sprite.player.angle = -90;
        my.sprite.arrow.angle = -90;

        this.arrowFly = false;
        
        this.input.keyboard.on('keydown-SPACE', (event) =>
        {
            my.sprite.arrow.visible = true;
            this.arrowFly = true;
        });
        
    }
    
    update() 
    {
        let my = this.my;    // create an alias to this.my for readability
        
        var a = this.input.keyboard.addKey("a").isDown;
        var d = this.input.keyboard.addKey("d").isDown;
        //console.log(my.sprite.player.x);
        
        if(a && my.sprite.player.x >= 20)
        {
            my.sprite.player.x -= 10;
        }
        if(d && my.sprite.player.x <= 780)
        {
            my.sprite.player.x += 10;
        }

        if(my.sprite.arrow.y <= 0)
        {
            this.arrowHit = true;
        }
        if(this.arrowFly && !this.arrowHit)
        {
            my.sprite.arrow.y -= 30;
        }
        else
        {
            var dx = my.sprite.arrow.x - my.sprite.player.x;
            var dy = my.sprite.arrow.y - my.sprite.player.y;
            var avY = Math.sin(angle) * 30;
            my.sprite.arrow.x += avX;
            my.sprite.arrow.y += avY;
            if(my.sprite.arrow.x == my.sprite.player.x && my.sprite.arrow.y == my.sprite.player.y)
            {
                my.sprite.arrow.visible = false;
                my.sprite.arrow.x = my.sprite.player.x;
                my.sprite.arrow.y = my.sprite.player.y;
                this.arrowFly = false;
                this.arrowHit = false;
            }
            
        }

        
    }

}