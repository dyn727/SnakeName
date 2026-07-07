const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const speedEl = document.getElementById('speed');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

const grid = 20;
const tileCount = canvas.width / grid;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 1, dy = 0;
let score = 0, speed = 160, gameTimer = null; 
let isRunning = false, isPaused = false;
let highScore = Number(localStorage.getItem('eatSnakeHigh') || 0);

highScoreEl.textContent = highScore;

function randomFood(){
  let f;
  do{ f = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) } }while(snake.some(s=>s.x===f.x&&s.y===f.y));
  return f;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // 背景
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  // 食物
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(food.x*grid, food.y*grid, grid, grid);
  // 贪吃蛇
  snake.forEach((s,i)=>{ ctx.fillStyle = i===0? '#22c55e':'#7dd3fc'; ctx.fillRect(s.x*grid,s.y*grid,grid,grid) })
}

function update(){
  if(!isRunning||isPaused) return;
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  // 碰撞判定
  if(head.x<0||head.x>=tileCount||head.y<0||head.y>=tileCount||snake.some((s,i)=>i>0&&s.x===head.x&&s.y===head.y)){
    gameOver(); return;
  }
  snake.unshift(head);
  if(head.x===food.x&&head.y===food.y){ score += 10; speed = Math.max(60, speed-5); food = randomFood(); }
  else snake.pop();
  scoreEl.textContent = score;
  speedEl.textContent = speed;
  draw();
}

function start(){ if(isRunning) return; isRunning=true; isPaused=false; gameTimer=setInterval(update,speed); }
function pause(){ if(!isRunning) return; isPaused=!isPaused; if(!isPaused) gameTimer=setInterval(update,speed); else clearInterval(gameTimer); }
function restart(){ clearInterval(gameTimer); snake=[{x:10,y:10}]; food=randomFood(); dx=1;dy=0;score=0;speed=160;isRunning=false;isPaused=false; highScore = Number(localStorage.getItem('eatSnakeHigh')||0); scoreEl.textContent=score; speedEl.textContent=speed; draw(); }

function gameOver(){ clearInterval(gameTimer); isRunning=false; isPaused=false; if(score>highScore){ localStorage.setItem('eatSnakeHigh',score); highScore=score; highScoreEl.textContent=highScore; } alert('游戏结束，得分：'+score); }

window.addEventListener('keydown',e=>{
  switch(e.code){
    case 'ArrowUp': if(dy===0){dx=0;dy=-1;} break;
    case 'ArrowDown': if(dy===0){dx=0;dy=1;} break;
    case 'ArrowLeft': if(dx===0){dx=-1;dy=0;} break;
    case 'ArrowRight': if(dx===0){dx=1;dy=0;} break;
    case 'Space': if(!isRunning) start(); else pause(); break;
  }
})

startBtn.addEventListener('click',()=>{ start(); });
pauseBtn.addEventListener('click',()=>{ pause(); });
restartBtn.addEventListener('click',()=>{ restart(); });

// 初始化
food = randomFood(); draw();
