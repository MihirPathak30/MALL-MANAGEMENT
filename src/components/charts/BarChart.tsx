import { useEffect, useRef } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
}

const BarChart = ({ data, width = 600, height = 300, color = "#b794f4" }: BarChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Padding and dimensions
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find max value
    const maxValue = Math.max(...data.map((d) => d.value));
    const yScale = chartHeight / maxValue;
    const barWidth = chartWidth / data.length - 10;

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#cbd5e0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Draw bars
    data.forEach((point, index) => {
      const x = padding.left + index * (chartWidth / data.length) + 5;
      const barHeight = point.value * yScale;
      const y = height - padding.bottom - barHeight;

      // Gradient for bar
      const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color}80`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Bar border
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Value on top of bar
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(point.value.toLocaleString(), x + barWidth / 2, y - 5);
    });

    // Draw labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    data.forEach((point, index) => {
      const x = padding.left + index * (chartWidth / data.length) + barWidth / 2 + 5;
      ctx.fillText(point.label, x, height - padding.bottom + 20);
    });

    // Draw y-axis labels
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxValue / 5) * (5 - i));
      const y = padding.top + (chartHeight / 5) * i;
      ctx.fillText(value.toLocaleString(), padding.left - 10, y + 4);
    }
  }, [data, width, height, color]);

  return <canvas ref={canvasRef} className="w-full" />;
};

export default BarChart;
