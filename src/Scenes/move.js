class Move extends Phaser.Scene 
{
    constructor() 
    {
        super("moveScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.t = {text: {}};
        

        // Game related
        this.gameOver = false;
        this.score = 0;
        this.enemiesDefeated = 0;
        this.defeatsRequired = 30;
        this.delay = 0;

        // Player related
        this.playerX = 300;
        this.playerY = 500;
        this.dodging = false;
        this.forward = false;
        this.dodgeCooldown = 0;
        this.dodgeHold = 0;
        this.playerHealth = 5;
        this.iFrames = 0;

        // Arrow related
        this.arrowFly = false;
        this.arrowHit = false;
        this.avX = 0;
        this.avY = 0;
        
        // Spawning related
        this.wave = 1;
        this.wait = 0;
        this.totalEnemies = 0;
        this.enemySpawning = true;
        
        // Robot related
        this.rSpawned = false;
        this.robots = [];
        this.laserDelay = [];
        this.lasers = [];
        this.rNum = 0;
        this.lNum = 0;

       
        // Zombie related
        this.zSpawned = false;
        this.zombies = [];
        this.zAttackHit = [];
        this.direction = [];
        this.zNum = 0;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() 
    {
        this.load.setPath("./assets/");
        this.load.image("player", "player.png");
        this.load.image("zombie", "zombie.png");
        this.load.image("robot", "robot.png");
        this.load.image("arrow", "item_arrow.png");
        this.load.image("heart", "heart.png");
        this.load.image("laser", "laser.png");
    }

    create() 
    {
        let my = this.my;   // create an alias to this.my for readability

        this.t.text.score = this.add.text(670, 20, "Score: 0");
        this.t.text.wave = this.add.text(350, 20, "WAVE 1/3");
        this.t.text.defeats = this.add.text(325, 40, "Defeated 0/30");
        this.t.text.score.setDepth(1);
        this.t.text.wave.setDepth(1);
        this.t.text.defeats.setDepth(1);
        this.t.text.nextWave = this.add.text(360, 250, "WAVE 1");
        this.t.text.nextWave.visible = false;
        this.t.text.win = this.add.text(310, 250, "YOU WIN!");
        this.t.text.win.setScale(2);
        this.t.text.win.visible = false;
        this.t.text.lose = this.add.text(310, 250, "GAME OVER");
        this.t.text.lose.setScale(2);
        this.t.text.lose.visible = false;
        

        my.sprite.player = this.add.sprite(this.playerX, this.playerY, "player");
        my.sprite.arrow = this.add.sprite(this.playerX, this.playerY, "arrow");
        my.sprite.player.visible = true;
        my.sprite.arrow.visible = false;
        my.sprite.player.angle = -90;
        my.sprite.arrow.angle = -90;

        this.arrowFly = false;

        my.sprite.health1 = this.add.sprite(20, 20, "heart");
        my.sprite.health2 = this.add.sprite(40, 20, "heart");
        my.sprite.health3 = this.add.sprite(60, 20, "heart");
        my.sprite.health4 = this.add.sprite(80, 20, "heart");
        my.sprite.health5 = this.add.sprite(100, 20, "heart");
        my.sprite.health1.visible = true;
        my.sprite.health2.visible = true;
        my.sprite.health3.visible = true;
        my.sprite.health4.visible = true;
        my.sprite.health5.visible = true;
        my.sprite.health1.setDepth(1);
        my.sprite.health2.setDepth(1);
        my.sprite.health3.setDepth(1);
        my.sprite.health4.setDepth(1);
        my.sprite.health5.setDepth(1);

        
        this.input.keyboard.on('keydown-SPACE', (event) =>
        {
            if(!this.arrowFly)
            {
                my.sprite.arrow.x = my.sprite.player.x;
                my.sprite.arrow.y = my.sprite.player.y;
                my.sprite.arrow.visible = true;
                this.arrowFly = true;
            }
        });

        this.enemySpawning = true;
        this.wave = 1;
        this.wait = 0;
        
    }
    
    update() 
    {
        let my = this.my;    // create an alias to this.my for readability
        let change = 0.6;
        let arrowSpeed = 50;
        let playerSpeed = 12;
        let enemySpeed = 2;
        let laserSpeed = 20;
        let lDelay = 40;
        
        var a = this.input.keyboard.addKey("a").isDown;
        var d = this.input.keyboard.addKey("d").isDown;
        var s = this.input.keyboard.addKey("s").isDown;
        //console.log("x: " + my.sprite.arrow.x + "  y: " + my.sprite.arrow.y);;
        
        // UI
        this.t.text.score.setText("Score: " + this.score);
        this.t.text.wave.setText("WAVE " + this.wave + "/3");
        this.t.text.defeats.setText("Defeated " + this.enemiesDefeated + "/" + this.defeatsRequired);
        
        // Ground


        // Win
        if(this.win)
        {
            this.enemySpawning = false;
            this.playerHealth = 5;
            my.sprite.player.y -= 30;
            this.t.text.win.visible = true;
        }
        
        // Game over
        if(this.gameOver)
        {
            this.enemySpawning = false;
            my.sprite.player.destroy(true);
            this.t.text.lose.visible = true;
        }


        //Player Health
        if(this.playerHealth == 4)
        {
            my.sprite.health5.visible = false;
        }
        if(this.playerHealth == 3)
        {
            my.sprite.health4.visible = false;
        }
        if(this.playerHealth == 2)
        {
            my.sprite.health3.visible = false;
        }
        if(this.playerHealth == 1)
        {
            my.sprite.health2.visible = false;
        }
        if(this.playerHealth == 0)
            {
                my.sprite.health1.visible = false;
                this.gameOver = true;
            }
    
        
        // Player 
        if(a && my.sprite.player.x >= 20)
        {
            my.sprite.player.x -= playerSpeed;
        }
        if(d && my.sprite.player.x <= 780) 
        {
            my.sprite.player.x += playerSpeed;
        }

        // dodging
        if(s && !this.dodging && this.dodgeCooldown == 0)
        {
           this.dodging = true;
           this.forward = true;
        }
        else if(this.dodgeCooldown > 0)
        {
            this.dodgeCooldown--;
        }
        
        if(this.dodging)
        {
            if(my.sprite.player.y <= this.playerY + 50 && this.forward)
            {
                my.sprite.player.y += playerSpeed;
                this.dodgeHold = 5;
            }
            else
            {
                if(this.dodgeHold <= 0)
                {
                    my.sprite.player.y -= playerSpeed;
                    this.forward = false;
                    if(my.sprite.player.y <= this.playerY)
                    {
                        this.dodging = false;
                        my.sprite.player.y = this.playerY;
                        this.dodgeCooldown = 5;
                    }
                }
                this.dodgeHold--;
                
            }

            
        }

        // Arrow 
        if(my.sprite.arrow.y <= 0)
        {
            this.arrowHit = true;
        }
        if(this.arrowFly)
        {
            //my.sprite.arrow.angle += 45;
        }
        if(!this.arrowFly)
        {
            my.sprite.arrow.visible = false;
            my.sprite.arrow.x = 0;
            my.sprite.arrow.y = 0;
            this.arrowHit = false;
        }
        else if(this.arrowFly && !this.arrowHit)
        {
            my.sprite.arrow.y -= arrowSpeed;
        }
        else if(this.arrowFly && this.arrowHit)
        {
            my.sprite.arrow.angle += 45;
            var dx = my.sprite.player.x - my.sprite.arrow.x;
            var dy = my.sprite.player.y - my.sprite.arrow.y;
            var theta = Math.atan2(dy, dx);
            my.avX = arrowSpeed*change*Math.cos(theta);
            my.avY = arrowSpeed*change*Math.sin(theta);
            my.sprite.arrow.x += my.avX;
            my.sprite.arrow.y += my.avY;
            //console.log("avx: " + my.avX + "  avy: " + my.avY);
            if(Math.round(my.sprite.arrow.y) >= my.sprite.player.y)
            {
                my.sprite.arrow.angle = -90;
                my.sprite.arrow.visible = false;
                my.sprite.arrow.x = my.sprite.player.x;
                my.sprite.arrow.y = my.sprite.player.y;
                this.arrowFly = false;
                this.arrowHit = false;
            }
            
        }

        // Hitting enemies
        if(this.zSpawned)
        {
            for(let i = 0; i < this.zNum; i++)
            {
                if(Phaser.Math.Distance.Between(my.sprite.arrow.x, my.sprite.arrow.y, this.zombies[i].x,  this.zombies[i].y) <= 30) // Zombie Defeated
                {
                    this.zombies[i].destroy(true);
                    this.zombies.splice(i, 1);
                    this.zAttackHit.splice(i, 1);
                    this.direction.splice(i, 1);
                    this.zNum--;
                    this.totalEnemies--;
                    this.enemiesDefeated++;
                    this.arrowHit = true;
                    this.score += 20;
                }
            }
        }
        if(this.rSpawned)
        {
            for(let i = 0; i < this.rNum; i++)
            {
                if(Phaser.Math.Distance.Between(my.sprite.arrow.x, my.sprite.arrow.y, this.robots[i].x,  this.robots[i].y) <= 30) // Robot Defeated
                {
                    this.robots[i].destroy(true);
                    this.robots.splice(i, 1);
                    this.laserDelay.splice(i, 1);
                    this.rNum--;
                    this.totalEnemies--;
                    this.enemiesDefeated++;
                    this.arrowHit = true;
                    this.score += 40;
                }
            }
        }

        // Getting hit
        if(this.zSpawned)
        {
            for(let i = 0; i < this.zNum; i++)
            {
                if(Phaser.Math.Distance.Between(my.sprite.player.x, my.sprite.player.y, this.zombies[i].x,  this.zombies[i].y) <= 25 && this.iFrames <= 0)
                {
                    console.log("hit");
                    this.playerHealth--;
                    this.iFrames = 30;
                    my.sprite.player.alpha = 0.5;
                }

            }
        }
        if(this.rSpawned)
        {
            for(let i = 0; i < this.rNum; i++)
            {
                if(Phaser.Math.Distance.Between(my.sprite.player.x, my.sprite.player.y, this.robots[i].x,  this.robots[i].y) <= 25 && this.iFrames <= 0)
                {
                    console.log("hit");
                    this.playerHealth--;
                    this.iFrames = 30;
                    my.sprite.player.alpha = 0.5;
                }
            }
            for(let i = 0; i < this.lNum; i++)
            {
                if(Phaser.Math.Distance.Between(my.sprite.player.x, my.sprite.player.y, this.lasers[i].x,  this.lasers[i].y) <= 20 && this.iFrames <= 0)
                {
                    console.log("hit");
                    this.playerHealth--;
                    this.iFrames = 30;
                    my.sprite.player.alpha = 0.5;
                    this.lasers[i].destroy(true);
                    this.lasers.splice(i, 1);
                    this.lNum--;
                }
            } 
        }
        
        if(this.iFrames > 0)
        {
            if(my.sprite.player.alpha == 0.5 && this.iFrames % 2 == 1)
            {
                my.sprite.player.alpha = 0.3;
            }
            if(my.sprite.player.alpha == 0.3 && this.iFrames % 2 == 0)
            {
                my.sprite.player.alpha = 0.5;
            }
            this.iFrames--;
        }
        else
        {
            my.sprite.player.alpha = 1;
        }
        
        
        // Waves & Enemy spawning
        if(this.wave == 3 && this.enemiesDefeated >= this.defeatsRequired)
        {
            this.win = true;
        }
        else if(this.enemiesDefeated >= this.defeatsRequired && this.wave <= 3)
        {
            console.log(this.totalEnemies);
            this.enemySpawning = false;
            if(this.delay > 0)
            {
                this.t.text.nextWave.visible = true;
                this.t.text.nextWave.setText("WAVE " + (this.wave + 1));
                this.delay--;
            }
            else
            {
                this.t.text.nextWave.visible = false;
                this.wave++;
                this.enemiesDefeated = 0;
                this.enemySpawning = true;
            }


        }
        if(this.enemySpawning)
        {
            this.delay = 50;
            if(this.wave == 1) // Zombies only
            {
                this.wait += 1;
                this.defeatsRequired = 30;
                //console.ldog(this.totalEnemies);
                if(Math.random() < 0.4 && this.wait >= 20 && this.totalEnemies < this.defeatsRequired) // 30% spawn chance
                {
                    this.zSpawned = true;
                    my.sprite.zombie = this.add.sprite(Math.random()*760 + 20, 0, "zombie");
                    my.sprite.zombie.angle = 90;
                    this.zombies[this.zNum] = my.sprite.zombie;
                    this.zAttackHit[this.zNum] = false;
                    this.direction[this.zNum] = false;
                    this.zNum++;
                    this.totalEnemies++;
                    this.wait = 0;
                }

            }
            if(this.wave == 2) // Robots only
            {
                this.wait += 1;
                this.defeatsRequired = 30;
                //console.ldog(this.totalEnemies);
                if(Math.random() < 0.3 && this.wait >= 20 && this.totalEnemies < this.defeatsRequired) // 40% spawn chance
                {
                    this.rSpawned = true;
                    my.sprite.robot = this.add.sprite(Math.random()*760 + 20, 0, "robot");
                    my.sprite.robot.angle = 90;
                    this.robots[this.rNum] = my.sprite.robot;
                    this.laserDelay[this.rNum] = lDelay;
                    this.rNum++;
                    this.totalEnemies++;
                    this.wait = 0;
                }
            }   
            if(this.wave == 3) // Zombies and Robots
            {
                this.wait += 1;
                this.defeatsRequired = 40;
                //console.ldog(this.totalEnemies);
                if(Math.random() < 0.3 && this.wait >= 20 && this.totalEnemies < this.defeatsRequired) // 30% spawn chance
                {
                    this.zSpawned = true;
                    my.sprite.zombie = this.add.sprite(Math.random()*760 + 20, 0, "zombie");
                    my.sprite.zombie.angle = 90;
                    this.zombies[this.zNum] = my.sprite.zombie;
                    this.zAttackHit[this.zNum] = false;
                    this.direction[this.zNum] = false;
                    this.zNum++;
                    this.totalEnemies++;
                    this.wait = 0;
                }
                if(Math.random() < 0.3 && this.wait >= 20 && this.totalEnemies < this.defeatsRequired) // 30% spawn chance
                {
                    this.rSpawned = true;
                    my.sprite.robot = this.add.sprite(Math.random()*760 + 20, 0, "robot");
                    my.sprite.robot.angle = 90;
                    this.robots[this.rNum] = my.sprite.robot;
                    this.laserDelay[this.rNum] = lDelay;
                    this.rNum++;
                    this.totalEnemies++;
                    this.wait = 0;
                }
            }  

        }

        // Zombie movement
        if(this.zSpawned)
        {
            for(let i = 0; i < this.zNum; i++)
            {
                if(this.zombies[i].y >= this.playerY)
                {   
                    if(Math.abs(my.sprite.player.x - this.zombies[i].x) < 20)
                    {
                        this.zAttackHit[i] = true; 
                    }

                    if(!this.zAttackHit[i]) // not hit
                    {
                        if(this.zombies[i].x > my.sprite.player.x)
                        {
                            this.zombies[i].x -= enemySpeed*6;
                            this.direction[i] = true;
                            this.zombies[i].angle = 180;
                        }
                        if(this.zombies[i].x < my.sprite.player.x)
                        {
                            this.zombies[i].x += enemySpeed*6;
                            this.direction[i] = false;
                            this.zombies[i].angle = 0;
                        }
                    }
                    else // hit
                    {
                        if(this.direction[i]) // left
                        {
                            this.zombies[i].x -= enemySpeed*6;
                        }
                        if(!this.direction[i]) // right
                        {
                            this.zombies[i].x += enemySpeed*6;
                        }
                        if(this.zombies[i].x < -10 || this.zombies[i].x > 800)
                        {
                            this.zombies[i].destroy(true);
                            this.zombies.splice(i, 1);
                            this.zAttackHit.splice(i, 1);
                            this.direction.splice(i, 1);
                            this.zNum--;
                            this.totalEnemies--;
                        }
                    }
                }
                else
                {
                    this.zombies[i].y += enemySpeed;
                }
            }
                
            
        }

        // Robot Movement
        if(this.rSpawned)
        {
            for(let i = 0; i < this.rNum; i++)
            {
                
                if(this.robots[i].y > 700)
                {
                    this.robots[i].destroy(true);
                    this.robots.splice(i, 1);
                    this.rNum--;
                    this.totalEnemies--;
                }
                else
                {
                    this.robots[i].y += enemySpeed;
                    if(this.laserDelay[i] > 0) // shooting delay
                    {
                        this.laserDelay[i]--;
                    }
                    else // create a new laser
                    {
                        this.laserDelay[i] = lDelay; // reset shooting delay for this robot
                        my.sprite.laser = this.add.sprite(this.robots[i].x-12, this.robots[i].y+30, "laser");
                        my.sprite.laser.setScale(0.5);
                        this.lasers[this.lNum] = my.sprite.laser;
                        this.lNum++;
                        
                    }
                }

            }   
            for(let i = 0; i < this.lNum; i++)
            {
                if(this.lasers[i].y > 700)
                {
                    this.lasers[i].destroy(true);
                    this.lasers.splice(i, 1);
                    this.lNum--;
                }
                else
                {
                    this.lasers[i].y += laserSpeed;
                }

            } 
        }
    }

}