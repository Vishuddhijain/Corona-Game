function load_images() {
  virus_image = new Image();
  virus_image.src = "Assets/v1.png";

  player_img = new Image();
  player_img.src = "Assets/superhero.png";

  gem_image = new Image();
  gem_image.src = "Assets/gemm.png";
}

function init() {
  canvas = document.getElementById("mycanvas");
  console.log(canvas);

  //Change the height and width of the canvas using Javascript
  W = 700;
  H = 400;

  canvas.width = W;
  canvas.height = H;

  // try to work with canvas
  pen = canvas.getContext("2d");
  console.log(pen);

  score = 0;
  game_over = false;

  // We want to create a box
  // JSON Objects

  e1 = {
    x: 150,
    y: 50,
    w: 60,
    h: 60,
    speed: 20,
  };
  e2 = {
    x: 300,
    y: 150,
    w: 60,
    h: 60,
    speed: 30,
  };
  e3 = {
    x: 450,
    y: 20,
    w: 60,
    h: 60,
    speed: 40,
  };
  enemy = [e1, e2, e3];

  player = {
    x: 20,
    y: H / 2,
    w: 60,
    h: 60,
    speed: 20,
    moving: "false",
  };
  player.health = 3;
  gem = {
    x: W - 100,
    y: H / 2,
    w: 60,
    h: 60,
  };
  //Create an event listener
  // canvas.addEventListener('mousedown',function(){
  // 	console.log("You pressed the mouse");
  // 	player.moving = true;
  // });
  // canvas.addEventListener('mouseup',function(){
  // 	console.log("You released the mouse");
  // 	player.moving = false;
  // });
  //Different key
  /*
	
	});*/
  document.addEventListener("keydown", function (e) {
    console.log("Key Pressed:", e.key);

    if (e.key === "ArrowUp") {
      player.y -= player.speed;
    } else if (e.key === "ArrowDown") {
      player.y += player.speed;
    } else if (e.key === "ArrowRight") {
      player.x += player.speed;
      score += 20; // Optional: Increment score if moving right
    } else if (e.key === "ArrowLeft") {
      player.x -= player.speed;
    }

    // Optional: Clamp player position to stay within canvas
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.w > W) player.x = W - player.w;
    if (player.y + player.h > H) player.y = H - player.h;
  });
  enemy.forEach((e) => {
    e.speed = Math.random() * 8 + 4; // Speed between 4 and 12
  });
  enemy.forEach((e) => {
    e.dirX = 1; // initial direction
  });
}
// Game Loop
function draw() {
  //Clear the old screen (entire area)
  pen.clearRect(0, 0, W, H);

  //Draw this bird on the screen
  pen.fillStyle = "red";
  //pen.fillRect(bird.x,bird.y,bird.w,bird.h);

  pen.drawImage(player_img, player.x, player.y, player.w, player.h);
  pen.drawImage(gem_image, gem.x, gem.y, gem.w, gem.h);

  for (let i = 0; i < enemy.length; i++) {
    pen.drawImage(virus_image, enemy[i].x, enemy[i].y, enemy[i].w, enemy[i].h);
  }
  pen.fillStyle = "white";
  pen.fillText("Score " + score, 10, 10);
  pen.fillText("Health: " + player.health, 10, 30);
}

function isColliding(b1, b2) {
  //x,y,w,h
  //   if (Math.abs(b1.x - b2.x) <= 30 && Math.abs(b1.y - b2.y) <= 30) {
  if (
    b1.x < b2.x + b2.w &&
    b1.x + b1.w > b2.x &&
    b1.y < b2.y + b2.h &&
    b1.y + b1.h > b2.y
  ) {
    return true;
  }
  return false;
}

function update() {
  //player state
  // if(player.moving==true){
  // 	player.x += player.speed;
  // 	score += 20;
  // }
  //Looop check collision btw corona and player
  for (let i = 0; i < enemy.length; i++) {
    if (isColliding(enemy[i], player)) {
      player.health -= 1;
      enemy[i].x = Math.random() * (W - enemy[i].w);
      if (player.health <= 0) {
        game_over = true;
        alert("Game Over! Final Score: " + score);
      }
    }
  }

  //collision gem and player
  if (isColliding(gem, player)) {
  game_over = true;
  draw();
  setTimeout(function () {
    alert("🎉 You won! Your Score: " + score);
    location.reload(); // Reloads the game page
  }, 100);
  return; // 🔁 prevents double alerts
}

  //   for (let i = 0; i < enemy.length; i++) {
  //     enemy[i].y += enemy[i].speed;
  //     if (enemy[i].y > H - enemy[i].h || enemy[i].y < 0) {
  //       enemy[i].speed *= -1;
  //     }
  //   }
  for (let i = 0; i < enemy.length; i++) {
    // Vertical AI chasing
    // Smooth vertical AI chasing with threshold to avoid vibration
let dy = player.y - enemy[i].y;
if (Math.abs(dy) > 2) {
  enemy[i].y += (dy > 0 ? 1 : -1) * enemy[i].speed * 0.2;
}


    // Horizontal movement (patrolling)
    enemy[i].x += enemy[i].dirX * enemy[i].speed * 0.5;
    if (enemy[i].x <= 0 || enemy[i].x + enemy[i].w >= W) {
      enemy[i].dirX *= -1; // reverse direction when hitting canvas edges
    }
  }
}

function gameloop() {
  if (game_over == true) {
    clearInterval(f);
  }
  draw();
  update();
}

//start of the game
load_images();
init();

//repeated call gameloop
var f = setInterval(gameloop, 100);
