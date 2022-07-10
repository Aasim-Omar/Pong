let cvs = document.createElement("canvas");
cvs.width = 800;
cvs.height = 500;
cvs.id = "pong";
document.body.appendChild(cvs);
const canvas = document.getElementById("pong");

alert(`Welcome to the pong game
  click on the field to begain
  use (q) and (a) for user one controlls
  use (p) and (;) for user two controlls
`);

class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(w, h) {
    this.pos = new Vec();
    this.size = new Vec(w, h);
  }
  get left() {
    return this.pos.x;
  }
  get right() {
    return this.pos.x + this.size.x;
  }
  get top() {
    return this.pos.y;
  }
  get bottom() {
    return this.pos.y + this.size.y;
  }
}

class Ball extends Rect {
  constructor(w, h) {
    super(w, h);
    this.vel = new Vec();
  }
}

class Player extends Rect {
  constructor(w, h) {
    super(w, h);
    this.score = 0;
  }
}

class Pong {
  static CHAR_PIXEL = 10;
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");
    this.ball = new Ball(Pong.CHAR_PIXEL, Pong.CHAR_PIXEL);
    this.players = [
      new Player(Pong.CHAR_PIXEL, Pong.CHAR_PIXEL * 10),
      new Player(Pong.CHAR_PIXEL, Pong.CHAR_PIXEL * 10),
    ];
    this.players[0].pos.x = 40;
    this.players[1].pos.x = this._canvas.width - 60;
    this.players.forEach(
      (player) => (player.pos.y = this._canvas.height / 2 - player.size.y / 2)
    );
    let lastTime = 0;
    let callBack = (millis) => {
      if (lastTime) {
        let dt = (millis - lastTime) / 1000;
        this.update(dt);
      }
      lastTime = millis;
      requestAnimationFrame(callBack);
    };
    this.reset();
    callBack();
    this.CHARS = [
      "111101101101111",
      "010010010010010",
      "111001111100111",
      "111001111001111",
      "101101111001001",
      "111100111001111",
      "111100111101111",
      "111101001001001",
      "111101111101111",
      "111101111001111",
    ].map((str) => {
      let canvas = document.createElement("canvas");
      canvas.width = Pong.CHAR_PIXEL * 3;
      canvas.height = Pong.CHAR_PIXEL * 5;
      let ctx = canvas.getContext("2d");

      str.split("").forEach((el, i) => {
        if (el == "1") {
          ctx.fillStyle = "#eee";
          ctx.fillRect(
            (i % 3) * Pong.CHAR_PIXEL,
            ((i / 3) | 0) * Pong.CHAR_PIXEL,
            Pong.CHAR_PIXEL,
            Pong.CHAR_PIXEL
          );
        }
      });

      return canvas;
    });
  }

  reset = () => {
    this.ball.pos.x = canvas.width / 2;
    this.ball.pos.y = canvas.height / 2;
    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  };

  drawScore() {
    const align = this._canvas.width / 3;
    const CHAR_W = Pong.CHAR_PIXEL * 4;
    this.players.forEach((player, index) => {
      const chars = player.score.toString().split("");
      const CHARS_LEN = chars.length;
      const offset =
        (index + 1) * align - (CHARS_LEN * CHAR_W) / 2 + Pong.CHAR_PIXEL;
      chars.forEach((char, i) => {
        this._ctx.drawImage(this.CHARS[char | 0], offset + i * CHAR_W, 20);
      });
    });
  }

  start = () => {
    this.ball.vel.x = 300 * (Math.random() > 0.5 ? 1 : -1);
    this.ball.vel.y = 400 * (Math.random() > 0.5 ? 1 : -1);
  };

  draw() {
    this._ctx.fillStyle = "#222";
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this.players.forEach((player) => this.drawRect(player));
    this.drawRect(this.ball);
    this.drawScore();
  }

  drawRect(rect) {
    this._ctx.fillStyle = "#eee";
    this._ctx.fillRect(rect.pos.x, rect.pos.y, rect.size.x, rect.size.y);
  }

  collide(player, ball) {
    if (
      player.top <= ball.bottom &&
      player.bottom >= ball.top &&
      player.left <= ball.right &&
      player.right >= ball.left
    ) {
      ball.vel.x = -ball.vel.x;
    }
  }

  update(dt) {
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }

    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      let playerId = (this.ball.vel.x < 0) | 0;
      this.players[playerId].score++;
      this.reset();
    }
    this.players.forEach((player) => {
      this.collide(player, this.ball);
    });
    this.draw();
  }
}

document.addEventListener("keydown", function (e) {
  if (e.keyCode == 81) {
    if (pong.players[0].pos.y > 0) {
      pong.players[0].pos.y -= 50;
    }
  }
  if (e.keyCode == 65) {
    if (pong.players[0].pos.y < canvas.height - pong.players[0].size.y) {
      pong.players[0].pos.y += 50;
    }
  }
  if (e.keyCode == 80) {
    if (pong.players[1].pos.y > 0) {
      pong.players[1].pos.y -= 50;
    }
  }
  if (e.keyCode == 59) {
    if (pong.players[1].pos.y < canvas.height - pong.players[1].size.y) {
      pong.players[1].pos.y += 50;
    }
  }
});

document.addEventListener("keyup", () => {

})

let pong = new Pong(canvas);

canvas.addEventListener("click", () => {
  pong.start();
});
