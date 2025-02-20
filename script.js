const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
  if (window.innerWidth <= 768) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
  } else {
    canvas.width = 500;
    canvas.height = Math.min(1000, window.innerHeight * 0.8);
  }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game objects
const car = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 40,
  height: 70,
  speed: 5,
  maxSpeed: 25,
  acceleration: 0.1,
  currentSpeed: 5,
  speedMPH: 0,
  steeringSpeed: 4, // Base steering speed
  maxSteeringSpeed: 7 // Maximum steering speed
};

// Road properties
const road = {
  lineWidth: 10,
  lineHeight: 40,
  lineGap: 40,
  lines: [],
  speed: 5,
  signs: []
};

let obstacles = [];
let score = 0;
let gameOver = false;
let isPaused = false;

// Car controls
let leftPressed = false;
let rightPressed = false;
let upPressed = false;

// Event listeners for keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = true;
  if (e.key === 'ArrowRight') rightPressed = true;
  if (e.key === 'ArrowUp') upPressed = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = false;
  if (e.key === 'ArrowRight') rightPressed = false;
  if (e.key === 'ArrowUp') upPressed = false;
});

// Mobile controls
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const upBtn = document.getElementById('upBtn');

leftBtn.addEventListener('touchstart', () => leftPressed = true);
leftBtn.addEventListener('touchend', () => leftPressed = false);
rightBtn.addEventListener('touchstart', () => rightPressed = true);
rightBtn.addEventListener('touchend', () => rightPressed = false);
upBtn.addEventListener('touchstart', () => upPressed = true);
upBtn.addEventListener('touchend', () => upPressed = false);

// Draw fire effect
function drawFire() {
  const fireColors = ['#FF4500', '#FF6B00', '#FF8C00', '#FFA500']; // Orange to yellow gradient

  fireColors.forEach((color, index) => {
    ctx.fillStyle = color;
    // Create flickering effect with Math.random()
    const flicker = Math.random() * 3;
    const fireWidth = (car.width * 0.6) - (index * 5);
    const fireHeight = (20 - index * 3) + flicker;

    ctx.beginPath();
    ctx.moveTo(car.x + car.width * 0.2, car.y + car.height);
    ctx.lineTo(car.x + car.width * 0.2 + fireWidth, car.y + car.height);
    ctx.lineTo(car.x + car.width * 0.2 + fireWidth / 2, car.y + car.height + fireHeight);
    ctx.closePath();
    ctx.fill();
  });
}

// Draw car
function drawCar() {
  // Main body
  ctx.fillStyle = '#9C27B0'; // Purple for Lamborghini
  ctx.fillRect(car.x, car.y, car.width, car.height);

  // Draw fire effect if speed is above 250 MPH
  if (car.speedMPH > 250) {
    drawFire();
  }

  // Windshield (slanted for sporty look)
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(car.x + 5, car.y + car.height * 0.2);
  ctx.lineTo(car.x + car.width - 5, car.y + car.height * 0.2);
  ctx.lineTo(car.x + car.width - 10, car.y + car.height * 0.35);
  ctx.lineTo(car.x + 10, car.y + car.height * 0.35);
  ctx.fill();

  // Back window
  ctx.fillRect(
    car.x + 8,
    car.y + car.height * 0.55,
    car.width - 16,
    car.height * 0.15
  );

  // Side windows
  ctx.fillStyle = '#333';
  ctx.fillRect(
    car.x + 2,
    car.y + car.height * 0.35,
    4,
    car.height * 0.3
  );
  ctx.fillRect(
    car.x + car.width - 6,
    car.y + car.height * 0.35,
    4,
    car.height * 0.3
  );

  // Wheels with sporty rims
  ctx.fillStyle = '#000';
  const wheelWidth = car.width * 0.25;
  const wheelHeight = car.height * 0.15;

  // Front wheels
  ctx.fillRect(
    car.x - wheelWidth / 4,
    car.y + car.height * 0.15,
    wheelWidth,
    wheelHeight
  );
  ctx.fillRect(
    car.x + car.width - wheelWidth * 0.75,
    car.y + car.height * 0.15,
    wheelWidth,
    wheelHeight
  );

  // Back wheels
  ctx.fillRect(
    car.x - wheelWidth / 4,
    car.y + car.height * 0.7,
    wheelWidth,
    wheelHeight
  );
  ctx.fillRect(
    car.x + car.width - wheelWidth * 0.75,
    car.y + car.height * 0.7,
    wheelWidth,
    wheelHeight
  );

  // Wheel rims (silver details)
  ctx.fillStyle = '#DDD';
  const rimSize = wheelWidth * 0.3;
  [0.15, 0.7].forEach(yPos => {
    [-wheelWidth / 4, car.width - wheelWidth * 0.75].forEach(xOffset => {
      // Center rim detail
      ctx.fillRect(
        car.x + xOffset + wheelWidth * 0.35,
        car.y + car.height * yPos + wheelHeight * 0.25,
        rimSize,
        rimSize
      );
    });
  });

  // Headlights
  ctx.fillStyle = '#FFF';
  ctx.fillRect(
    car.x + 2,
    car.y + 5,
    8,
    8
  );
  ctx.fillRect(
    car.x + car.width - 10,
    car.y + 5,
    8,
    8
  );

  // Taillights
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(
    car.x + 2,
    car.y + car.height - 12,
    8,
    8
  );
  ctx.fillRect(
    car.x + car.width - 10,
    car.y + car.height - 12,
    8,
    8
  );

  // Hood line detail
  ctx.fillStyle = '#7B1FA2'; // Darker purple
  ctx.fillRect(
    car.x + car.width * 0.2,
    car.y + car.height * 0.1,
    car.width * 0.6,
    2
  );

  // Side skirts
  ctx.fillRect(
    car.x - 2,
    car.y + car.height * 0.4,
    2,
    car.height * 0.2
  );
  ctx.fillRect(
    car.x + car.width,
    car.y + car.height * 0.4,
    2,
    car.height * 0.2
  );
}

// Initialize road lines
function initRoadLines() {
  const numberOfLines = Math.ceil(canvas.height / (road.lineHeight + road.lineGap)) + 1;
  for (let i = 0; i < numberOfLines; i++) {
    road.lines.push({
      y: i * (road.lineHeight + road.lineGap)
    });
  }
}

// Draw road
function drawRoad() {
  // Draw road background
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw center lines (white)
  ctx.fillStyle = '#fff';
  road.lines.forEach(line => {
    ctx.fillRect(canvas.width / 2 - road.lineWidth / 2, line.y, road.lineWidth, road.lineHeight);
  });

  // Draw side lines (yellow) - now solid
  ctx.fillStyle = '#FFD700'; // Golden yellow
  // Left solid line
  ctx.fillRect(canvas.width * 0.1, 0, road.lineWidth, canvas.height);
  // Right solid line
  ctx.fillRect(canvas.width * 0.9 - road.lineWidth, 0, road.lineWidth, canvas.height);
}

// Update road lines
function updateRoad() {
  const currentSpeed = upPressed ? car.currentSpeed : road.speed;
  road.lines.forEach(line => {
    line.y += currentSpeed;
    if (line.y > canvas.height) {
      line.y = -road.lineHeight;
    }
  });
}

// Create obstacles
function createObstacle() {
  const types = ['smallCar', 'stone1', 'stone2'];
  const type = types[Math.floor(Math.random() * types.length)];

  let width, height, color;
  switch (type) {
    case 'smallCar':
      width = 30;
      height = 50;
      color = '#4CAF50'; // Green
      break;
    case 'stone1':
      width = 25;
      height = 25;
      color = '#808080'; // Gray
      break;
    case 'stone2':
      width = 35;
      height = 30;
      color = '#696969'; // Darker gray
      break;
  }

  // Adjust lane positions to be between the yellow lines
  const lanePosition = Math.random() < 0.5 ?
    canvas.width * 0.25 - width / 2 : // Left lane
    canvas.width * 0.75 - width / 2; // Right lane

  return {
    x: lanePosition,
    y: -height,
    width: width,
    height: height,
    type: type,
    color: color,
    speed: road.speed
  };
}

// Draw obstacles
function drawObstacles() {
  obstacles.forEach(obstacle => {
    if (obstacle.type === 'smallCar') {
      // Draw car body
      ctx.fillStyle = obstacle.color;
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      // Windows
      ctx.fillStyle = '#333';
      const windowHeight = obstacle.height * 0.15;
      const windowWidth = obstacle.width * 0.7;
      const windowX = obstacle.x + (obstacle.width - windowWidth) / 2;

      // Front window
      ctx.fillRect(
        windowX,
        obstacle.y + obstacle.height * 0.1,
        windowWidth,
        windowHeight
      );

      // Back window
      ctx.fillRect(
        windowX,
        obstacle.y + obstacle.height * 0.6,
        windowWidth,
        windowHeight
      );

      // Wheels
      ctx.fillStyle = '#000';
      const wheelWidth = obstacle.width * 0.2;
      const wheelHeight = obstacle.height * 0.15;

      // Front wheels
      ctx.fillRect(
        obstacle.x - wheelWidth / 4,
        obstacle.y + obstacle.height * 0.15,
        wheelWidth,
        wheelHeight
      );
      ctx.fillRect(
        obstacle.x + obstacle.width - wheelWidth * 0.75,
        obstacle.y + obstacle.height * 0.15,
        wheelWidth,
        wheelHeight
      );

      // Back wheels
      ctx.fillRect(
        obstacle.x - wheelWidth / 4,
        obstacle.y + obstacle.height * 0.7,
        wheelWidth,
        wheelHeight
      );
      ctx.fillRect(
        obstacle.x + obstacle.width - wheelWidth * 0.75,
        obstacle.y + obstacle.height * 0.7,
        wheelWidth,
        wheelHeight
      );

      // Wheel highlights
      ctx.fillStyle = '#fff';
      const highlightSize = wheelWidth * 0.3;
      [0.15, 0.7].forEach(yPos => {
        [-wheelWidth / 4, obstacle.width - wheelWidth * 0.75].forEach(xOffset => {
          ctx.fillRect(
            obstacle.x + xOffset + wheelWidth * 0.1,
            obstacle.y + obstacle.height * yPos + wheelHeight * 0.2,
            highlightSize,
            highlightSize
          );
        });
      });
    } else {
      // Draw stone
      ctx.fillStyle = obstacle.color;
      ctx.beginPath();
      ctx.moveTo(obstacle.x + obstacle.width * 0.2, obstacle.y);
      ctx.lineTo(obstacle.x + obstacle.width * 0.8, obstacle.y);
      ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height * 0.6);
      ctx.lineTo(obstacle.x + obstacle.width * 0.7, obstacle.y + obstacle.height);
      ctx.lineTo(obstacle.x + obstacle.width * 0.3, obstacle.y + obstacle.height);
      ctx.lineTo(obstacle.x, obstacle.y + obstacle.height * 0.6);
      ctx.closePath();
      ctx.fill();

      // Add stone details (cracks/texture)
      ctx.strokeStyle = '#606060';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(obstacle.x + obstacle.width * 0.3, obstacle.y + obstacle.height * 0.3);
      ctx.lineTo(obstacle.x + obstacle.width * 0.7, obstacle.y + obstacle.height * 0.7);
      ctx.moveTo(obstacle.x + obstacle.width * 0.5, obstacle.y + obstacle.height * 0.2);
      ctx.lineTo(obstacle.x + obstacle.width * 0.5, obstacle.y + obstacle.height * 0.8);
      ctx.stroke();

      // Add highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(obstacle.x + obstacle.width * 0.2, obstacle.y + obstacle.height * 0.2);
      ctx.lineTo(obstacle.x + obstacle.width * 0.4, obstacle.y + obstacle.height * 0.2);
      ctx.lineTo(obstacle.x + obstacle.width * 0.3, obstacle.y + obstacle.height * 0.4);
      ctx.closePath();
      ctx.fill();
    }
  });
}

// Check collision
function checkCollision(car, obstacle) {
  return car.x < obstacle.x + obstacle.width &&
    car.x + car.width > obstacle.x &&
    car.y < obstacle.y + obstacle.height &&
    car.y + car.height > obstacle.y;
}

// Traffic sign definitions
const trafficSigns = [
  {
    type: 'speed',
    text: '60',
    width: 40,
    height: 40
  },
  {
    type: 'warning',
    text: '!',
    width: 40,
    height: 40
  },
  {
    type: 'stop',
    text: 'STOP',
    width: 40,
    height: 40
  }
];

// Create traffic sign
function createTrafficSign() {
  const sign = trafficSigns[Math.floor(Math.random() * trafficSigns.length)];
  const isLeftSide = Math.random() < 0.5;

  return {
    ...sign,
    x: isLeftSide ? canvas.width * 0.05 - sign.width / 2 : canvas.width * 0.95 - sign.width / 2,
    y: -sign.height,
    isLeftSide
  };
}

// Draw traffic signs
function drawTrafficSigns() {
  road.signs.forEach(sign => {
    // Draw sign post
    ctx.fillStyle = '#808080';
    ctx.fillRect(
      sign.x + sign.width / 2 - 2,
      sign.y,
      4,
      sign.height + 20
    );

    // Draw sign background
    ctx.fillStyle = '#fff';
    if (sign.type === 'stop') {
      // Octagon for stop sign
      ctx.beginPath();
      const center = { x: sign.x + sign.width / 2, y: sign.y + sign.height / 2 };
      const radius = sign.width / 2;
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4 - Math.PI / 8;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = '#ff0000';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (sign.type === 'warning') {
      // Triangle for warning sign
      ctx.beginPath();
      ctx.moveTo(sign.x + sign.width / 2, sign.y);
      ctx.lineTo(sign.x + sign.width, sign.y + sign.height);
      ctx.lineTo(sign.x, sign.y + sign.height);
      ctx.closePath();
      ctx.fillStyle = '#ffeb3b';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Circle for speed sign
      ctx.beginPath();
      ctx.arc(
        sign.x + sign.width / 2,
        sign.y + sign.height / 2,
        sign.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw sign text
    ctx.fillStyle = sign.type === 'stop' ? '#fff' : '#000';
    ctx.font = sign.type === 'stop' ? 'bold 12px Arial' : 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      sign.text,
      sign.x + sign.width / 2,
      sign.y + sign.height / 2
    );
  });
}

// Game loop
function update() {
  if (gameOver) {
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create centered box for game over text
    const boxWidth = 350;
    const boxHeight = 200;
    const boxX = (canvas.width - boxWidth) / 2;
    const boxY = (canvas.height - boxHeight) / 2;

    // Draw box background
    ctx.fillStyle = 'rgba(25, 25, 25, 0.9)';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Draw box border
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Game Over text with shadow
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, boxY + 70);

    // Score text
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, boxY + 120);

    // Restart text with animation and glow effect
    ctx.font = 'bold 28px Arial';
    const blinkRate = Math.sin(Date.now() / 400);

    // Add glow effect
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 15;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + blinkRate * 0.3})`;
    ctx.fillText('Click to restart', canvas.width / 2, boxY + 170);

    // Reset shadow effect
    ctx.shadowBlur = 0;

    return;
  }

  if (isPaused) {
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pause text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add glow effect
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 15;
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);

    // Add tap to resume text
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Tap to resume', canvas.width / 2, canvas.height / 2 + 40);

    // Reset shadow effect
    ctx.shadowBlur = 0;

    requestAnimationFrame(update);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw road first
  drawRoad();
  updateRoad();

  // Update and create traffic signs
  if (Math.random() < 0.01) road.signs.push(createTrafficSign());

  const currentSpeed = upPressed ? car.currentSpeed : road.speed;
  road.signs = road.signs.filter(sign => {
    sign.y += currentSpeed;
    return sign.y < canvas.height;
  });

  // Move car left/right with controlled steering
  const steeringSpeed = Math.max(
    car.steeringSpeed,
    car.maxSteeringSpeed - (car.currentSpeed / car.maxSpeed) * 3
  );

  if (leftPressed && car.x > 0) car.x -= steeringSpeed;
  if (rightPressed && car.x < canvas.width - car.width) car.x += steeringSpeed;

  // Handle acceleration
  if (upPressed) {
    if (car.currentSpeed < car.maxSpeed) {
      car.currentSpeed += car.acceleration;
      car.speedMPH = car.currentSpeed * 20;
    }
  } else {
    if (car.currentSpeed > car.speed) {
      car.currentSpeed -= car.acceleration;
      car.speedMPH = car.currentSpeed * 20;
    }
  }

  // Update obstacles
  if (Math.random() < 0.02) obstacles.push(createObstacle());

  obstacles = obstacles.filter(obstacle => {
    obstacle.y += currentSpeed;
    return obstacle.y < canvas.height;
  });

  // Update score based on speed
  score += Math.round(1 + (car.currentSpeed - car.speed));

  // Check collisions
  obstacles.forEach(obstacle => {
    if (checkCollision(car, obstacle)) {
      gameOver = true;
    }
  });

  // Draw everything
  drawObstacles();
  drawTrafficSigns();
  drawCar();

  // Draw score and speed
  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 10, 25);
  ctx.textAlign = 'right';
  ctx.fillText(`Speed: ${Math.round(car.speedMPH)} MPH`, canvas.width - 10, 25);

  requestAnimationFrame(update);
}

// Start game and handle pause
canvas.addEventListener('click', () => {
  if (gameOver) {
    gameOver = false;
    isPaused = false;
    obstacles = [];
    road.signs = [];
    score = 0;
    car.x = canvas.width / 2;
    car.currentSpeed = car.speed;
    car.speedMPH = 0;
    initRoadLines();
    update();
  } else {
    isPaused = !isPaused;
    if (!isPaused) {
      update();
    }
  }
});

// Initialize road and start game
initRoadLines();
update();
