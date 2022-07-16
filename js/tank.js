class Tank {
    constructor(x, y, width, height, tankPos, tankImage) {
      this.image = tankImage;
      this.speed = 0.05;
      this.body = Bodies.rectangle(x, y, width, height);
      this.width = width;
      this.height = height;
    
      this.tankPosition = tankPos;
      this.image = loadImage("assets/military_tank.png");

      World.add(world, this.body);
    }

    animate() {
        this.speed += 0.05;
    }

    remove(index) {
        this.image = tankImage;
        this.speed = 0.05;
        this.width = 300;
        this.height = 300;

        setTimeout(() => {
            Matter.World.remove(world, tanks[index.body]);
        }, 2000);
    }

    display() {
        var angle = this.body.angle;
        var pos = this.body.position;
        var index = floor(this.speed % this.image.length);

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.image, 0, this.tankPosition, this.width, this.height);
        pop();
    }
}
