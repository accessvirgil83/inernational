"use client";

import * as React from "react";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: "yurt" | "rock" | "shrub";
}

export function HorseGame() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = React.useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = React.useState(0);
  const [highScore, setHighScore] = React.useState(0);

  // Game loop references
  const stateRef = React.useRef({
    gameState: "idle" as "idle" | "playing" | "gameover",
    score: 0,
    speed: 4.5,
    horse: {
      x: 50,
      y: 130,
      width: 44,
      height: 36,
      vy: 0,
      isGrounded: true,
      legFrame: 0,
    },
    obstacles: [] as Obstacle[],
    cloudOffset: 0,
    mountainOffset: 0,
    groundOffset: 0,
    nextSpawnDistance: 120,
    animationId: 0,
  });

  // Load high score
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("tulpar_high_score");
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  // Play audio sound using Web Audio API
  const playSound = (type: "jump" | "gameover" | "score") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "jump") {
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === "gameover") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.28);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      }
    } catch {
      // audio context not allowed before user gesture
    }
  };

  const jump = React.useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === "idle") {
      s.gameState = "playing";
      setGameState("playing");
      playSound("jump");
      return;
    }
    if (s.gameState === "gameover") {
      restart();
      return;
    }
    if (s.horse.isGrounded) {
      s.horse.vy = -10.5;
      s.horse.isGrounded = false;
      playSound("jump");
    }
  }, []);

  const restart = () => {
    const s = stateRef.current;
    s.gameState = "playing";
    s.score = 0;
    s.speed = 4.5;
    s.horse.y = 130;
    s.horse.vy = 0;
    s.horse.isGrounded = true;
    s.obstacles = [];
    s.nextSpawnDistance = 120;
    setScore(0);
    setGameState("playing");
    playSound("jump");
  };

  // Keyboard controls
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  // Main canvas rendering & physics loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameCount = 0;

    const render = () => {
      const s = stateRef.current;
      frameCount++;

      const width = canvas.width;
      const height = canvas.height;
      const groundY = 160;

      // Update state if playing
      if (s.gameState === "playing") {
        s.score += 0.2;
        const currentScoreInt = Math.floor(s.score);
        setScore(currentScoreInt);

        // Increase speed gradually
        s.speed = 4.5 + Math.min(6, currentScoreInt * 0.005);

        // Horse physics
        s.horse.vy += 0.65; // gravity
        s.horse.y += s.horse.vy;

        if (s.horse.y >= groundY - s.horse.height) {
          s.horse.y = groundY - s.horse.height;
          s.horse.vy = 0;
          s.horse.isGrounded = true;
        }

        // Running animation legs toggle
        if (s.horse.isGrounded && frameCount % 6 === 0) {
          s.horse.legFrame = (s.horse.legFrame + 1) % 4;
        }

        // Parallax offsets
        s.cloudOffset = (s.cloudOffset + 0.3) % width;
        s.mountainOffset = (s.mountainOffset + 0.6) % width;
        s.groundOffset = (s.groundOffset + s.speed) % 40;

        // Obstacles movement & spawn
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          s.obstacles[i].x -= s.speed;
          if (s.obstacles[i].x + s.obstacles[i].width < 0) {
            s.obstacles.splice(i, 1);
          }
        }

        s.nextSpawnDistance -= s.speed;
        if (s.nextSpawnDistance <= 0) {
          const types: ("yurt" | "rock" | "shrub")[] = ["yurt", "rock", "shrub"];
          const type = types[Math.floor(Math.random() * types.length)];
          let obsW = 28;
          let obsH = 22;

          if (type === "yurt") {
            obsW = 34;
            obsH = 26;
          } else if (type === "rock") {
            obsW = 24;
            obsH = 18;
          } else {
            obsW = 20;
            obsH = 22;
          }

          s.obstacles.push({
            x: width + 20,
            width: obsW,
            height: obsH,
            type,
          });

          // Next obstacle distance
          s.nextSpawnDistance = 140 + Math.random() * 180;
        }

        // Collision detection
        const hx = s.horse.x + 8;
        const hy = s.horse.y + 4;
        const hw = s.horse.width - 14;
        const hh = s.horse.height - 8;

        for (const obs of s.obstacles) {
          const ox = obs.x + 4;
          const oy = groundY - obs.height;
          const ow = obs.width - 8;
          const oh = obs.height;

          if (hx < ox + ow && hx + hw > ox && hy < oy + oh && hy + hh > oy) {
            // Collision!
            s.gameState = "gameover";
            setGameState("gameover");
            playSound("gameover");

            // Update high score
            if (currentScoreInt > highScore) {
              setHighScore(currentScoreInt);
              try {
                localStorage.setItem("tulpar_high_score", currentScoreInt.toString());
              } catch {
                // ignore
              }
            }
            break;
          }
        }
      }

      // ================= CLEAR & DRAW =================
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const fgColor = isDark ? "#f4f4f5" : "#18181b";
      const mutedColor = isDark ? "#71717a" : "#a1a1aa";
      const skyGradColor = isDark ? "#27272a" : "#e4e4e7";

      // 1. Draw distant mountains (Steppe backdrop)
      ctx.fillStyle = isDark ? "#1f1f23" : "#f1f1f4";
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = 0; x <= width + 100; x += 80) {
        const peakY = groundY - 45 - Math.sin((x + s.mountainOffset * 0.5) * 0.02) * 20;
        ctx.lineTo(x - (s.mountainOffset % 80), peakY);
      }
      ctx.lineTo(width, groundY);
      ctx.closePath();
      ctx.fill();

      // 2. Draw steppe sun / moon
      ctx.fillStyle = isDark ? "#e4e4e7" : "#fde047";
      ctx.beginPath();
      ctx.arc(width - 60, 36, 16, 0, Math.PI * 2);
      ctx.fill();

      // 3. Ground line
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Steppe grass tufts on ground
      ctx.strokeStyle = mutedColor;
      ctx.lineWidth = 1.5;
      for (let x = -s.groundOffset; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x + 4, groundY + 5);
        ctx.stroke();
      }

      // 4. Draw Obstacles (Yurt / Rock / Shrub)
      for (const obs of s.obstacles) {
        const oy = groundY - obs.height;
        if (obs.type === "yurt") {
          // Киіз үй (Kazakh yurt)
          ctx.fillStyle = isDark ? "#3f3f46" : "#e4e4e7";
          ctx.strokeStyle = fgColor;
          ctx.lineWidth = 1.8;

          // Dome base
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, oy + obs.height, obs.width / 2, Math.PI, 0, false);
          ctx.fill();
          ctx.stroke();

          // Door
          ctx.fillStyle = isDark ? "#a1a1aa" : "#71717a";
          ctx.fillRect(obs.x + obs.width / 2 - 3, oy + obs.height - 10, 6, 10);

          // Shanyrak crown cross
          ctx.strokeStyle = "#eab308";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, oy + 4, 3, 0, Math.PI * 2);
          ctx.stroke();
        } else if (obs.type === "rock") {
          // Steppe stone
          ctx.fillStyle = isDark ? "#52525b" : "#a1a1aa";
          ctx.strokeStyle = fgColor;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(obs.x, groundY);
          ctx.lineTo(obs.x + obs.width * 0.3, oy);
          ctx.lineTo(obs.x + obs.width * 0.7, oy + 2);
          ctx.lineTo(obs.x + obs.width, groundY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          // Shrub
          ctx.fillStyle = isDark ? "#22c55e" : "#16a34a";
          ctx.beginPath();
          ctx.arc(obs.x + 6, groundY - 6, 6, 0, Math.PI * 2);
          ctx.arc(obs.x + 14, groundY - 10, 8, 0, Math.PI * 2);
          ctx.arc(obs.x + 20, groundY - 5, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Draw Kazakh Horse (Тұлпар)
      const hx = s.horse.x;
      const hy = s.horse.y;

      ctx.save();
      ctx.fillStyle = isDark ? "#f4f4f5" : "#18181b";
      ctx.strokeStyle = isDark ? "#f4f4f5" : "#18181b";
      ctx.lineWidth = 2;

      // Body (torso)
      ctx.beginPath();
      ctx.roundRect(hx + 10, hy + 12, 22, 14, 4);
      ctx.fill();

      // Neck & Head
      ctx.beginPath();
      ctx.moveTo(hx + 24, hy + 16);
      ctx.lineTo(hx + 34, hy + 4);
      ctx.lineTo(hx + 40, hy + 6);
      ctx.lineTo(hx + 38, hy + 12);
      ctx.lineTo(hx + 28, hy + 20);
      ctx.closePath();
      ctx.fill();

      // Horse ears
      ctx.beginPath();
      ctx.moveTo(hx + 33, hy + 4);
      ctx.lineTo(hx + 35, hy);
      ctx.lineTo(hx + 37, hy + 4);
      ctx.fill();

      // Mane (flowing hair)
      ctx.strokeStyle = isDark ? "#fbbf24" : "#b45309";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hx + 26, hy + 14);
      ctx.lineTo(hx + 24, hy + 10);
      ctx.moveTo(hx + 30, hy + 10);
      ctx.lineTo(hx + 28, hy + 6);
      ctx.stroke();

      // Tail
      ctx.strokeStyle = isDark ? "#fbbf24" : "#b45309";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(hx + 10, hy + 16);
      ctx.quadraticCurveTo(hx - 2, hy + 18 + Math.sin(frameCount * 0.3) * 3, hx - 4, hy + 26);
      ctx.stroke();

      // Saddle accent (Traditional Kazakh saddle blanket)
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(hx + 16, hy + 12, 10, 6);

      // Legs animation
      ctx.strokeStyle = isDark ? "#f4f4f5" : "#18181b";
      ctx.lineWidth = 2.4;
      const legFrame = s.horse.legFrame;

      if (!s.horse.isGrounded) {
        // Jumping legs (tucked in)
        // Front legs
        ctx.beginPath();
        ctx.moveTo(hx + 28, hy + 24);
        ctx.lineTo(hx + 34, hy + 30);
        ctx.stroke();

        // Back legs
        ctx.beginPath();
        ctx.moveTo(hx + 14, hy + 24);
        ctx.lineTo(hx + 8, hy + 30);
        ctx.stroke();
      } else {
        // Galloping legs
        const offsets = [
          { f1: 6, f2: -4, b1: -6, b2: 4 },
          { f1: -4, f2: 6, b1: 4, b2: -6 },
          { f1: 8, f2: 2, b1: -8, b2: -2 },
          { f1: 2, f2: 8, b1: -2, b2: -8 },
        ][legFrame] || { f1: 0, f2: 0, b1: 0, b2: 0 };

        // Front leg 1
        ctx.beginPath();
        ctx.moveTo(hx + 26, hy + 24);
        ctx.lineTo(hx + 28 + offsets.f1, hy + 36);
        ctx.stroke();

        // Front leg 2
        ctx.beginPath();
        ctx.moveTo(hx + 30, hy + 24);
        ctx.lineTo(hx + 32 + offsets.f2, hy + 36);
        ctx.stroke();

        // Back leg 1
        ctx.beginPath();
        ctx.moveTo(hx + 12, hy + 24);
        ctx.lineTo(hx + 10 + offsets.b1, hy + 36);
        ctx.stroke();

        // Back leg 2
        ctx.beginPath();
        ctx.moveTo(hx + 16, hy + 24);
        ctx.lineTo(hx + 14 + offsets.b2, hy + 36);
        ctx.stroke();
      }

      ctx.restore();

      s.animationId = requestAnimationFrame(render);
    };

    stateRef.current.animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(stateRef.current.animationId);
    };
  }, [highScore]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between w-full mb-3 px-2 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐎</span>
          <span className="font-semibold tracking-tight">Қазақ Тұлпары Runner</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
          <span>ҰПАЙ: {Math.floor(score).toString().padStart(4, "0")}</span>
          <span className="flex items-center gap-1 text-primary">
            <Trophy className="h-3 w-3" />
            РЕКОРД: {highScore.toString().padStart(4, "0")}
          </span>
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-xl border bg-muted/40 cursor-pointer select-none"
        onClick={jump}
        role="button"
        tabIndex={0}
        aria-label="Степной раннер Тұлпар: Нажмите пробел или коснитесь экрана для прыжка"
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={180}
          className="w-full h-[180px] block"
        />

        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[2px] transition-all">
            <Button size="sm" onClick={jump} className="gap-2 shadow-md">
              <Play className="h-4 w-4" />
              Бастау / Старт (Space)
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Секіру үшін <b>Пробел</b> немесе экранды түртіңіз
            </p>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm transition-all">
            <p className="text-sm font-semibold text-destructive mb-2 tracking-wide uppercase">
              Ойын аяқталды / Игра окончена!
            </p>
            <Button size="sm" onClick={restart} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Қайта бастау / Играть снова
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between w-full mt-3 px-1 text-xs text-muted-foreground">
        <span>Кедергілер: киіз үй, тас, бұта</span>
        <Button variant="ghost" size="sm" onClick={jump} className="text-xs h-7 px-2">
          Секіру ⎵
        </Button>
      </div>
    </div>
  );
}
