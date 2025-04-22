import React, { useRef, useEffect, useState } from "react";
import { prompts } from "../data/prompts";

const Spinner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const wheelSize = 300;
  const numSlices = prompts.length;
  const anglePerSlice = (2 * Math.PI) / numSlices;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = wheelSize;
    canvas.height = wheelSize;
    const radius = wheelSize / 2;

    ctx.clearRect(0, 0, wheelSize, wheelSize);

    for (let i = 0; i < numSlices; i++) {
      const angle = i * anglePerSlice;

      // Set color
      ctx.fillStyle = `hsl(${(i * 360) / numSlices}, 80%, 70%)`;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, angle, angle + anglePerSlice);
      ctx.lineTo(radius, radius);
      ctx.fill();

      // Draw text
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angle + anglePerSlice / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#333";
      ctx.font = "14px sans-serif";
      ctx.fillText(prompts[i], radius - 10, 5);
      ctx.restore();
    }
  }, []);

  // Spin the wheel
  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * numSlices);
    const selected = prompts[randomIndex];
    setSelectedPrompt(null); // Hide while spinning

    // Simulate spin animation (you can improve this with CSS or canvas rotation later)
    setTimeout(() => {
      setSelectedPrompt(selected);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="text-center">
      <canvas ref={canvasRef} style={{ borderRadius: "50%" }} />
      <button
        onClick={spin}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "Spin!"}
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
