import confetti from "canvas-confetti";

export function launchConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.65 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ["#ff4d6d", "#ff758f", "#ffb3c1"],
  });
  
  fire(0.2, {
    spread: 60,
    colors: ["#ffd166", "#06d6a0", "#118ab2"],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ["#ff4d6d", "#ff758f", "#fff"],
  });
}

export function fireMoreHearts() {
  confetti({
    particleCount: 60,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#ff4d6d", "#ff758f", "#ffb3c1", "#ffccd5"],
  });
}

export function popBalloonConfetti(x: number, y: number) {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { x, y },
    colors: ["#ff758f", "#ffd166", "#06d6a0", "#118ab2", "#b5e2fa"],
  });
}
