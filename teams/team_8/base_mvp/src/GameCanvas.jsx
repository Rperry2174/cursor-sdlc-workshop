import { useEffect, useRef, useState } from "react";

// --- Constants ---
const CANVAS_W = 800;
const CANVAS_H = 500;
const PADDLE_W = 10;
const PADDLE_H = 80;
const PADDLE_OFFSET = 20; // distance from edge
const PADDLE_SPEED = 5;
const BALL_RADIUS = 8;
const INITIAL_BALL_SPEED = 4;
const SPEED_INCREASE = 1.05;
const MAX_SPEED = 12;

export default function GameCanvas() {
  const canvasRef = useRef(null);

  // Scores in state so parent could read them later
  const [scores, setScores] = useState({ left: 0, right: 0 });

  // All mutable game state lives in a ref to avoid re-renders
  const game = useRef({
    // Paddles (y = top edge)
    leftY: CANVAS_H / 2 - PADDLE_H / 2,
    rightY: CANVAS_H / 2 - PADDLE_H / 2,
    // Ball
    ballX: CANVAS_W / 2,
    ballY: CANVAS_H / 2,
    ballVX: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    ballVY: INITIAL_BALL_SPEED * (Math.random() - 0.5),
    // Scores
    leftScore: 0,
    rightScore: 0,
    // Pressed keys
    keys: {},
  });

  // Reset ball to center with a random direction
  function resetBall() {
    const g = game.current;
    g.ballX = CANVAS_W / 2;
    g.ballY = CANVAS_H / 2;
    g.ballVX = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    g.ballVY = INITIAL_BALL_SPEED * (Math.random() - 0.5);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    // --- Key listeners ---
    const onKeyDown = (e) => {
      game.current.keys[e.key] = true;
    };
    const onKeyUp = (e) => {
      game.current.keys[e.key] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // --- Game loop ---
    function loop() {
      const g = game.current;

      // Move paddles
      if (g.keys["w"] || g.keys["W"]) g.leftY -= PADDLE_SPEED;
      if (g.keys["s"] || g.keys["S"]) g.leftY += PADDLE_SPEED;
      if (g.keys["ArrowUp"]) g.rightY -= PADDLE_SPEED;
      if (g.keys["ArrowDown"]) g.rightY += PADDLE_SPEED;

      // Clamp paddles
      g.leftY = Math.max(0, Math.min(CANVAS_H - PADDLE_H, g.leftY));
      g.rightY = Math.max(0, Math.min(CANVAS_H - PADDLE_H, g.rightY));

      // Move ball
      g.ballX += g.ballVX;
      g.ballY += g.ballVY;

      // Top/bottom wall bounce
      if (g.ballY - BALL_RADIUS <= 0 || g.ballY + BALL_RADIUS >= CANVAS_H) {
        g.ballVY = -g.ballVY;
      }

      // Left paddle collision
      const lPaddleRight = PADDLE_OFFSET + PADDLE_W;
      if (
        g.ballX - BALL_RADIUS <= lPaddleRight &&
        g.ballX + BALL_RADIUS >= PADDLE_OFFSET &&
        g.ballY >= g.leftY &&
        g.ballY <= g.leftY + PADDLE_H &&
        g.ballVX < 0
      ) {
        g.ballVX = -g.ballVX * SPEED_INCREASE;
        // Angle based on hit position
        const hitPos = (g.ballY - g.leftY) / PADDLE_H - 0.5; // -0.5 to 0.5
        g.ballVY = hitPos * 6;
        g.ballX = lPaddleRight + BALL_RADIUS; // prevent sticking
      }

      // Right paddle collision
      const rPaddleLeft = CANVAS_W - PADDLE_OFFSET - PADDLE_W;
      if (
        g.ballX + BALL_RADIUS >= rPaddleLeft &&
        g.ballX - BALL_RADIUS <= CANVAS_W - PADDLE_OFFSET &&
        g.ballY >= g.rightY &&
        g.ballY <= g.rightY + PADDLE_H &&
        g.ballVX > 0
      ) {
        g.ballVX = -g.ballVX * SPEED_INCREASE;
        const hitPos = (g.ballY - g.rightY) / PADDLE_H - 0.5;
        g.ballVY = hitPos * 6;
        g.ballX = rPaddleLeft - BALL_RADIUS;
      }

      // Cap speed
      if (Math.abs(g.ballVX) > MAX_SPEED) {
        g.ballVX = MAX_SPEED * Math.sign(g.ballVX);
      }

      // Scoring
      if (g.ballX < 0) {
        g.rightScore++;
        setScores({ left: g.leftScore, right: g.rightScore });
        resetBall();
      }
      if (g.ballX > CANVAS_W) {
        g.leftScore++;
        setScores({ left: g.leftScore, right: g.rightScore });
        resetBall();
      }

      // --- Draw ---
      // Background
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Center dashed line
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(CANVAS_W / 2, 0);
      ctx.lineTo(CANVAS_W / 2, CANVAS_H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Scores
      ctx.fillStyle = "#666";
      ctx.font = "48px monospace";
      ctx.textAlign = "center";
      ctx.fillText(g.leftScore, CANVAS_W / 4, 60);
      ctx.fillText(g.rightScore, (3 * CANVAS_W) / 4, 60);

      // Paddles
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(PADDLE_OFFSET, g.leftY, PADDLE_W, PADDLE_H);
      ctx.fillRect(CANVAS_W - PADDLE_OFFSET - PADDLE_W, g.rightY, PADDLE_W, PADDLE_H);

      // Ball
      ctx.fillStyle = "#ff6b6b";
      ctx.beginPath();
      ctx.arc(g.ballX, g.ballY, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(loop);
    }

    animationId = requestAnimationFrame(loop);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{ display: "block", margin: "0 auto", borderRadius: "8px" }}
    />
  );
}
