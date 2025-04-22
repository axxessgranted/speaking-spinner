import React, { useRef, useEffect, useState } from "react";
import { prompts } from "../data/prompts";

const Spinner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const wheelSize = 300;
  const numSlices = prompts.length;
  const anglePerSlice = (2 * Math.PI) / numSlices;

  const drawWheel = (angleOffset: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = wheelSize;
    canvas.height = wheelSize;
    const radius = wheelSize / 2;

    ctx.clearRect(0, 0, wheelSize, wheelSize);

    for (let i = 0; i < numSlices; i++) {
      const angle = i * anglePerSlice + angleOffset;

      ctx.fillStyle = `hsl(${(i * 360) / numSlices}, 80%, 70%)`;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, angle, angle + anglePerSlice);
      ctx.lineTo(radius, radius);
      ctx.fill();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angle + anglePerSlice / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#333";
      ctx.font = "14px sans-serif";
      ctx.fillText(prompts[i], radius - 10, 5);
      ctx.restore();
    }
  };

  useEffect(() => {
    drawWheel(rotation);
  }, [rotation]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedPrompt(null);

    const duration = 3000;
    const totalSpins = 5;
    const randomIndex = Math.floor(Math.random() * numSlices);
    const finalAngle =
      2 * Math.PI * totalSpins +
      randomIndex * anglePerSlice +
      anglePerSlice / 2;

    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const angle = rotation + easeOut * (finalAngle - rotation);

      setRotation(angle);
      drawWheel(angle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setRotation(finalAngle % (2 * Math.PI));
        setSelectedPrompt(prompts[randomIndex]);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="text-center">
      <canvas ref={canvasRef} style={{ borderRadius: "50%" }} />
      <button
        onClick={spin}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={isSpinning}
      >
        {isSpinning ? "Spinning..." : "Spin!"}
      </button>
      {selectedPrompt && (
        <div className="mt-6 text-xl font-bold text-gray-800">
          🎤 {selectedPrompt}
        </div>
      )}
    </div>
  );
};

export default Spinner;
