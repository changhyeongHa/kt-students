class AngryBirdsGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.level = 1;
        this.birdsLeft = 3;
        this.isPaused = false;
        this.isGameOver = false;
        
        // 물리 상수
        this.gravity = 0.5;
        this.friction = 0.98;
        
        // 게임 객체들
        this.birds = [];
        this.launchedBirds = []; // 발사된 새들을 별도로 관리
        this.pigs = [];
        this.blocks = [];
        this.explosions = [];
        
        // 이미지 로딩
        this.images = {};
        this.loadImages();
        
        // 마우스 상태
        this.mouse = {
            x: 0,
            y: 0,
            isPressed: false,
            startX: 0,
            startY: 0
        };
        
        // 새 발사 준비 상태
        this.readyToLaunch = false;
        this.currentBird = null;
        
        // 레벨 초기화 상태
        this.levelInitialized = false;
        this.initFrameCount = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createLevel();
        this.gameLoop();
    }
    
    loadImages() {
        const imageFiles = {
            bird: 'images/bird.png',
            pig1: 'images/pig1.png',
            pig3: 'images/pig3.png',
            pigDamaged: 'images/pig_damaged.png',
            block1: 'images/block1.png',
            blockDestroyed: 'images/block_destroyed1.png',
            wallHorizontal: 'images/wall_horizontal.png',
            wallVertical: 'images/wall_vertical.png'
        };
        
        let loadedCount = 0;
        const totalImages = Object.keys(imageFiles).length;
        
        Object.keys(imageFiles).forEach(key => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    console.log('모든 이미지가 로드되었습니다!');
                }
            };
            img.src = imageFiles[key];
            this.images[key] = img;
        });
    }
    
    setupEventListeners() {
        // 마우스 이벤트
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // 버튼 이벤트
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.mouse.isPressed = true;
        this.mouse.startX = this.mouse.x;
        this.mouse.startY = this.mouse.y;
        
        // 새를 클릭했는지 확인
        if (this.birds.length > 0 && !this.readyToLaunch) {
            const bird = this.birds[0];
            const distance = Math.sqrt(
                Math.pow(this.mouse.x - bird.x, 2) + 
                Math.pow(this.mouse.y - bird.y, 2)
            );
            
            // 클릭 범위를 좀 더 넓게 설정
            if (distance < bird.radius + 10) {
                this.readyToLaunch = true;
                this.currentBird = bird;
                console.log('새를 클릭했습니다!');
            }
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    handleMouseUp(e) {
        if (this.readyToLaunch && this.currentBird) {
            this.launchBird();
        }
        this.mouse.isPressed = false;
        this.readyToLaunch = false;
        this.currentBird = null;
    }
    
    launchBird() {
        const power = Math.min(
            Math.sqrt(
                Math.pow(this.mouse.startX - this.mouse.x, 2) + 
                Math.pow(this.mouse.startY - this.mouse.y, 2)
            ) * 0.25, 35 // 파워 대폭 증가
        );
        
        const angle = Math.atan2(
            this.mouse.startY - this.mouse.y,
            this.mouse.startX - this.mouse.x
        );
        
        this.currentBird.vx = Math.cos(angle) * power;
        this.currentBird.vy = Math.sin(angle) * power;
        this.currentBird.isLaunched = true;
        
        console.log('새를 발사했습니다!', { power, angle, vx: this.currentBird.vx, vy: this.currentBird.vy });
        
        // 발사된 새를 별도 배열에 추가
        this.launchedBirds.push(this.currentBird);
        this.birds.shift();
        this.birdsLeft--;
        this.updateUI();
    }
    
    createLevel() {
        // 새 생성 (슬링샷 위치)
        this.birds = [
            new Bird(150, 520, 20, '#FF6B35'),
            new Bird(150, 520, 20, '#FF6B35'),
            new Bird(150, 520, 20, '#FF6B35')
        ];
        
        // 새들을 슬링샷에 정확히 위치시킴
        this.birds.forEach((bird, index) => {
            bird.x = 150;
            bird.y = 520 - (index * 5); // 새들을 약간씩 겹치게 배치
        });
        
        // 돼지 생성 (서로 겹치지 않도록 배치)
        this.pigs = [
            new Pig(800, 480, 25, '#90EE90'), // 중앙 하단
            new Pig(780, 450, 25, '#90EE90'), // 왼쪽 중간
            new Pig(820, 450, 25, '#90EE90')  // 오른쪽 중간
        ];
        
        // 블록 생성 (정확한 위치에 배치하여 겹침 방지)
        this.blocks = [
            // 왼쪽 벽 (정확한 층별 배치)
            new Block(710, 500, 15, 100, '#8B4513'), // 왼쪽 벽 1층 (바닥에 닿음)
            new Block(710, 450, 15, 100, '#8B4513'), // 왼쪽 벽 2층
            new Block(710, 400, 15, 100, '#8B4513'), // 왼쪽 벽 3층
            
            // 오른쪽 벽 (정확한 층별 배치)
            new Block(890, 500, 15, 100, '#8B4513'), // 오른쪽 벽 1층 (바닥에 닿음)
            new Block(890, 450, 15, 100, '#8B4513'), // 오른쪽 벽 2층
            new Block(890, 400, 15, 100, '#8B4513'), // 오른쪽 벽 3층
            
            // 천장 블록들 (벽 위에 정확히 배치)
            new Block(800, 350, 200, 20, '#8B4513'), // 천장 1층 (벽 위에 정확히)
            new Block(800, 330, 200, 20, '#8B4513'), // 천장 2층 (천장 1층 위에)
        ];
    }
    
    update() {
        if (this.isPaused || this.isGameOver) return;
        
        // 레벨 초기화 처리
        if (!this.levelInitialized) {
            this.initFrameCount++;
            if (this.initFrameCount > 60) { // 1초 후 초기화 완료 (빠른 초기화)
                this.levelInitialized = true;
            }
        }
        
        // 새 업데이트 (슬링샷에 있는 새들)
        this.birds.forEach(bird => {
            if (bird.isLaunched) {
                bird.update(this.gravity, this.friction, this.canvas.height);
            }
        });
        
        // 발사된 새들 업데이트
        this.launchedBirds.forEach(bird => {
            bird.update(this.gravity, this.friction, this.canvas.height);
        });
        
        // 블록 업데이트 (레벨 초기화 완료 후에만)
        if (this.levelInitialized) {
            this.blocks.forEach(block => {
                block.update(this.gravity, this.friction, this.canvas.height);
            });
        }
        
        // 돼지 업데이트
        this.pigs.forEach(pig => {
            pig.update(this.gravity, this.friction, this.canvas.height);
        });
        
        // 충돌 검사 (레벨 초기화 완료 후에만)
        if (this.levelInitialized) {
            this.checkCollisions();
        }
        
        // 화면 밖으로 나간 객체 제거
        this.removeOffScreenObjects();
        
        // 게임 상태 확인
        this.checkGameState();
    }
    
    checkCollisions() {
        // 발사된 새들과 블록/돼지 충돌
        this.launchedBirds.forEach(bird => {
            // 블록과 충돌
            this.blocks.forEach((block, blockIndex) => {
                if (this.checkCollision(bird, block)) {
                    this.handleCollision(bird, block);
                    this.blocks.splice(blockIndex, 1);
                    this.createExplosion(bird.x, bird.y);
                }
            });
            
            // 돼지와 충돌
            this.pigs.forEach((pig, pigIndex) => {
                if (this.checkCollision(bird, pig)) {
                    this.handleCollision(bird, pig);
                    this.pigs.splice(pigIndex, 1);
                    this.score += 100;
                    this.createExplosion(bird.x, bird.y);
                    this.updateUI();
                }
            });
        });
        
        // 블록과 블록 충돌
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = i + 1; j < this.blocks.length; j++) {
                if (this.checkCollision(this.blocks[i], this.blocks[j])) {
                    this.handleCollision(this.blocks[i], this.blocks[j]);
                }
            }
        }
        
        // 돼지와 돼지 충돌
        for (let i = 0; i < this.pigs.length; i++) {
            for (let j = i + 1; j < this.pigs.length; j++) {
                if (this.checkCollision(this.pigs[i], this.pigs[j])) {
                    this.handleCollision(this.pigs[i], this.pigs[j]);
                }
            }
        }
    }
    
    checkCollision(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (obj1.radius && obj2.radius) {
            // 원형 객체들
            return distance < obj1.radius + obj2.radius;
        } else if (obj1.radius) {
            // 원형과 사각형
            const closestX = Math.max(obj2.x - obj2.width/2, Math.min(obj1.x, obj2.x + obj2.width/2));
            const closestY = Math.max(obj2.y - obj2.height/2, Math.min(obj1.y, obj2.y + obj2.height/2));
            const distanceX = obj1.x - closestX;
            const distanceY = obj1.y - closestY;
            return (distanceX * distanceX + distanceY * distanceY) < (obj1.radius * obj1.radius);
        } else if (obj2.radius) {
            // 사각형과 원형
            const closestX = Math.max(obj1.x - obj1.width/2, Math.min(obj2.x, obj1.x + obj1.width/2));
            const closestY = Math.max(obj1.y - obj1.height/2, Math.min(obj2.y, obj1.y + obj1.height/2));
            const distanceX = obj2.x - closestX;
            const distanceY = obj2.y - closestY;
            return (distanceX * distanceX + distanceY * distanceY) < (obj2.radius * obj2.radius);
        } else {
            // 사각형들
            return !(obj1.x + obj1.width/2 < obj2.x - obj2.width/2 ||
                    obj1.x - obj1.width/2 > obj2.x + obj2.width/2 ||
                    obj1.y + obj1.height/2 < obj2.y - obj2.height/2 ||
                    obj1.y - obj1.height/2 > obj2.y + obj2.height/2);
        }
    }
    
    handleCollision(obj1, obj2) {
        // 탄성 충돌 (블록 간 충돌 시 탄성 감소 및 겹침 방지)
        const dx = obj2.x - obj1.x;
        const dy = obj2.y - obj1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;
        
        const nx = dx / distance;
        const ny = dy / distance;
        
        // 블록 간 충돌인 경우 겹침 방지
        if (obj1.width && obj2.width) {
            // 두 블록의 최소 분리 거리 계산
            const minSeparationX = (obj1.width + obj2.width) / 2;
            const minSeparationY = (obj1.height + obj2.height) / 2;
            
            // 겹침 정도 계산
            const overlapX = minSeparationX - Math.abs(dx);
            const overlapY = minSeparationY - Math.abs(dy);
            
            // 겹침이 있는 경우 위치 조정
            if (overlapX > 0 && overlapY > 0) {
                // 더 작은 겹침 방향으로 분리
                if (overlapX < overlapY) {
                    const separationX = overlapX + 1; // 1px 여유 추가
                    if (dx > 0) {
                        obj1.x -= separationX / 2;
                        obj2.x += separationX / 2;
                    } else {
                        obj1.x += separationX / 2;
                        obj2.x -= separationX / 2;
                    }
                } else {
                    const separationY = overlapY + 1; // 1px 여유 추가
                    if (dy > 0) {
                        obj1.y -= separationY / 2;
                        obj2.y += separationY / 2;
                    } else {
                        obj1.y += separationY / 2;
                        obj2.y -= separationY / 2;
                    }
                }
            }
        }
        
        const relativeVelocityX = obj1.vx - obj2.vx;
        const relativeVelocityY = obj1.vy - obj2.vy;
        
        const speed = relativeVelocityX * nx + relativeVelocityY * ny;
        
        if (speed < 0) return;
        
        // 블록 간 충돌인지 확인하고 탄성 조절
        let elasticity = 1.0; // 기본 탄성
        if (obj1.width && obj2.width) { // 둘 다 블록인 경우
            elasticity = 0.1; // 블록 간 충돌 시 탄성 대폭 감소 (더 부드럽게)
        }
        
        const impulse = 2 * speed * elasticity;
        obj1.vx -= impulse * nx;
        obj1.vy -= impulse * ny;
        obj2.vx += impulse * nx;
        obj2.vy += impulse * ny;
        
        // 블록 간 충돌 시 추가 마찰 적용
        if (obj1.width && obj2.width) {
            const collisionFriction = 0.3; // 블록 간 충돌 시 마찰력 (극대화)
            obj1.vx *= collisionFriction;
            obj1.vy *= collisionFriction;
            obj2.vx *= collisionFriction;
            obj2.vy *= collisionFriction;
            
            // 충돌 후 매우 작은 속도는 완전히 정지
            if (Math.abs(obj1.vx) < 0.1) obj1.vx = 0;
            if (Math.abs(obj1.vy) < 0.1) obj1.vy = 0;
            if (Math.abs(obj2.vx) < 0.1) obj2.vx = 0;
            if (Math.abs(obj2.vy) < 0.1) obj2.vy = 0;
        }
    }
    
    createExplosion(x, y) {
        this.explosions.push(new Explosion(x, y));
    }
    
    removeOffScreenObjects() {
        this.birds = this.birds.filter(bird => 
            bird.x > -50 && bird.x < this.canvas.width + 50 && 
            bird.y > -50 && bird.y < this.canvas.height + 50
        );
        
        this.launchedBirds = this.launchedBirds.filter(bird => 
            bird.x > -50 && bird.x < this.canvas.width + 50 && 
            bird.y > -50 && bird.y < this.canvas.height + 50
        );
        
        this.blocks = this.blocks.filter(block => 
            block.x > -100 && block.x < this.canvas.width + 100 && 
            block.y > -100 && block.y < this.canvas.height + 100
        );
        
        this.pigs = this.pigs.filter(pig => 
            pig.x > -50 && pig.x < this.canvas.width + 50 && 
            pig.y > -50 && pig.y < this.canvas.height + 50
        );
        
        this.explosions = this.explosions.filter(explosion => explosion.life > 0);
    }
    
    checkGameState() {
        // 모든 돼지가 파괴되면 레벨 클리어
        if (this.pigs.length === 0) {
            this.level++;
            this.score += 500;
            this.birdsLeft = 3;
            // 레벨 클리어 시 모든 새들 초기화
            this.birds = [];
            this.launchedBirds = [];
            this.readyToLaunch = false;
            this.currentBird = null;
            this.createLevel();
            this.updateUI();
        }
        
        // 새를 모두 사용했고, 발사된 새들도 모두 화면 밖으로 나갔을 때
        if (this.birds.length === 0 && this.birdsLeft === 0) {
            // 발사된 새들이 모두 화면 밖으로 나갔는지 확인
            const allBirdsOffScreen = this.launchedBirds.every(bird => 
                bird.x < -100 || bird.x > this.canvas.width + 100 || 
                bird.y < -100 || bird.y > this.canvas.height + 100
            );
            
            if (allBirdsOffScreen) {
                // 돼지가 한 마리라도 살아있으면 게임 오버
                if (this.pigs.length > 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    gameOver() {
        this.isGameOver = true;
        setTimeout(() => {
            alert(`게임 오버! 모든 새를 사용했지만 돼지를 파괴하지 못했습니다.\n최종 점수: ${this.score}`);
            this.restart();
        }, 1000);
    }
    
    draw() {
        // 배경 지우기
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 지면 그리기
        this.drawGround();
        
        // 슬링샷 그리기
        this.drawSlingshot();
        
        // 새 그리기 (슬링샷에 있는 새들)
        this.birds.forEach(bird => bird.draw(this.ctx));
        
        // 발사된 새들 그리기
        this.launchedBirds.forEach(bird => bird.draw(this.ctx));
        
        // 블록 그리기
        this.blocks.forEach(block => block.draw(this.ctx));
        
        // 돼지 그리기
        this.pigs.forEach(pig => pig.draw(this.ctx));
        
        // 폭발 효과 그리기
        this.explosions.forEach(explosion => explosion.draw(this.ctx));
        
        // 발사 준비 상태 그리기
        if (this.readyToLaunch && this.currentBird) {
            this.drawLaunchPreview();
        }
    }
    
    drawGround() {
        // 지면 그리기
        this.ctx.fillStyle = '#8FBC8F';
        this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
        
        // 지면 질감
        this.ctx.strokeStyle = '#228B22';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, this.canvas.height - 20);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
    }
    
    drawSlingshot() {
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(150, this.canvas.height - 20);
        this.ctx.lineTo(150, 520);
        this.ctx.stroke();
        
        // 슬링샷 고리
        this.ctx.beginPath();
        this.ctx.arc(150, 520, 10, 0, Math.PI * 2);
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fill();
    }
    
    drawLaunchPreview() {
        if (!this.mouse.isPressed) return;
        
        this.ctx.strokeStyle = '#FF6B35';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentBird.x, this.currentBird.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('birds-left').textContent = this.birdsLeft;
    }
    
    restart() {
        this.score = 0;
        this.level = 1;
        this.birdsLeft = 3;
        this.isPaused = false;
        this.isGameOver = false;
        this.birds = [];
        this.launchedBirds = []; // 발사된 새들도 초기화
        this.pigs = [];
        this.blocks = [];
        this.explosions = [];
        this.readyToLaunch = false;
        this.currentBird = null;
        this.levelInitialized = false;
        this.initFrameCount = 0;
        this.createLevel();
        this.updateUI();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? '계속' : '일시정지';
    }
}

// 게임 객체 클래스들
class Bird {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.isLaunched = false;
    }
    
    update(gravity, friction, groundY) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;
        this.vx *= friction;
        this.vy *= friction;
        
        // 지면 충돌 처리
        if (this.y + this.radius > groundY) {
            this.y = groundY - this.radius;
            this.vy = -this.vy * 0.3; // 바운스 효과 (30% 반사)
            this.vx *= 0.8; // 마찰력 증가
        }
    }
    
    draw(ctx) {
        // 이미지가 로드되었으면 이미지 사용, 아니면 기본 원형 그리기
        if (window.game && window.game.images && window.game.images.bird) {
            const img = window.game.images.bird;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.drawImage(img, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
            ctx.restore();
        } else {
            // 기본 원형 그리기
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // 눈 그리기
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x - 5, this.y - 5, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x - 5, this.y - 5, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class Pig {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
    }
    
    update(gravity, friction, groundY) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;
        this.vx *= friction;
        this.vy *= friction;
        
        // 지면 충돌 처리
        if (this.y + this.radius > groundY) {
            this.y = groundY - this.radius;
            this.vy = -this.vy * 0.3; // 바운스 효과 (30% 반사)
            this.vx *= 0.8; // 마찰력 증가
        }
    }
    
    draw(ctx) {
        // 이미지가 로드되었으면 이미지 사용, 아니면 기본 원형 그리기
        if (window.game && window.game.images && window.game.images.pig1) {
            const img = window.game.images.pig1;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.drawImage(img, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
            ctx.restore();
        } else {
            // 기본 원형 그리기
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // 코 그리기
            ctx.fillStyle = '#FFB6C1';
            ctx.beginPath();
            ctx.arc(this.x, this.y + 5, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 콧구멍
            ctx.fillStyle = '#FF69B4';
            ctx.beginPath();
            ctx.arc(this.x - 1, this.y + 5, 1, 0, Math.PI * 2);
            ctx.arc(this.x + 1, this.y + 5, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class Block {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
    }
    
    update(gravity, friction, groundY) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;
        
        // 블록은 매우 강한 마찰력 적용
        const blockFriction = 0.6; // 블록 전용 마찰력 (매우 강함)
        this.vx *= blockFriction;
        this.vy *= blockFriction;
        
        // 매우 작은 속도는 완전히 정지
        if (Math.abs(this.vx) < 0.1) this.vx = 0;
        if (Math.abs(this.vy) < 0.1) this.vy = 0;
        
        // 지면 충돌 처리
        if (this.y + this.height/2 > groundY) {
            this.y = groundY - this.height/2;
            this.vy = -this.vy * 0.02; // 바운스 효과 (2% 반사로 극도로 줄임)
            this.vx *= 0.1; // 지면 접촉 시 마찰력 극대화
        }
    }
    
    draw(ctx) {
        // 이미지가 로드되었으면 이미지 사용, 아니면 기본 사각형 그리기
        if (window.game && window.game.images && window.game.images.block1) {
            const img = window.game.images.block1;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.drawImage(img, -this.width/2, -this.height/2, this.width, this.height);
            ctx.restore();
        } else {
            // 기본 사각형 그리기
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
            
            // 나무 질감
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x - this.width/2, this.y);
            ctx.lineTo(this.x + this.width/2, this.y);
            ctx.stroke();
        }
    }
}

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 20;
        this.maxLife = 20;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        const size = (this.maxLife - this.life) * 2;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        this.life--;
    }
}

// 게임 시작
window.addEventListener('load', () => {
    window.game = new AngryBirdsGame();
}); 