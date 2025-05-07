import React, { useRef, useEffect, useState, useCallback } from "react";
import { prompts } from "../data/prompts";

const Spinner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const wheelSize = 300;
  const numSlices = prompts.length;
  const anglePerSlice = (2 * Math.PI) / numSlices;

  const drawWheel = useCallback(
    (angleOffset: number) => {
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

        // Draw slice
        ctx.fillStyle = `hsl(${(i * 360) / numSlices}, 80%, 70%)`;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, angle, angle + anglePerSlice);
        ctx.closePath();
        ctx.fill();

        // Draw text
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + anglePerSlice / 2);

        ctx.fillStyle = "#222";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Rotate text upright
        ctx.rotate(-1 * (angle + anglePerSlice / 2));

        // Then draw the text further outward from center
        const textAngle = angle + anglePerSlice / 2;
        const x = Math.cos(textAngle) * (radius * 0.65);
        const y = Math.sin(textAngle) * (radius * 0.65);
        ctx.setTransform(1, 0, 0, 1, radius, radius); // reset rotation
        ctx.translate(x, y);
        ctx.rotate(textAngle);

        // Word-wrap logic if needed
        const maxWidth = radius * 0.6;
        const words = prompts[i].split(" ");
        let line = "";
        let yOffset = 0;

        for (let j = 0; j < words.length; j++) {
          const testLine = line + words[j] + " ";
          const { width } = ctx.measureText(testLine);
          if (width > maxWidth && j > 0) {
            ctx.fillText(line.trim(), 0, yOffset);
            line = words[j] + " ";
            yOffset += 16;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), 0, yOffset);

        ctx.restore();
      }
    },
    [anglePerSlice, numSlices]
  );

  useEffect(() => {
    drawWheel(rotation);
  }, [rotation, drawWheel]);

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
      <div
        className="relative inline-block"
        style={{ width: wheelSize, height: wheelSize }}
      >
        {/* Pointer */}
        <div
          className="absolute left-1/2 -top-3 transform -translate-x-1/2 z-10"
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "16px solid red",
          }}
        />
        <canvas ref={canvasRef} className="rounded-full" />
      </div>

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
