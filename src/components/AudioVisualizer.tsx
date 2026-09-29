import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
  isActive: boolean;
  color?: string;
  height?: number;
  simulated?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  stream,
  isActive,
  color = '#3b82f6',
  height = 36,
  simulated = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaStreamAudioSourceNode | null = null;

    if (isActive && stream && !simulated) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContext = new AudioCtx();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
      } catch (err) {
        console.warn('AudioContext error for visualizer:', err);
      }
    }

    const bufferLength = analyser ? analyser.frequencyBinCount : 24;
    const dataArray = new Uint8Array(bufferLength);

    let phase = 0;

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, width, h);

      const barCount = 20;
      const barWidth = 3;
      const gap = (width - barCount * barWidth) / (barCount - 1);

      if (isActive) {
        if (analyser) {
          analyser.getByteFrequencyData(dataArray);
        } else {
          // Simulated pulsing wave
          phase += 0.08;
          for (let i = 0; i < barCount; i++) {
            const val = Math.sin(phase + i * 0.4) * 0.5 + 0.5;
            dataArray[i] = Math.floor(val * 160 + 40);
          }
        }
      }

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4; // minimum height
        if (isActive) {
          const sample = dataArray[i % dataArray.length] || 0;
          barHeight = Math.max(4, (sample / 255) * (h - 6));
        }

        const x = i * (barWidth + gap);
        const y = (h - barHeight) / 2;

        ctx.fillStyle = isActive ? color : '#94a3b8';
        ctx.beginPath();
        // Rounded bars
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (source) source.disconnect();
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [stream, isActive, color, simulated]);

  return (
    <canvas
      ref={canvasRef}
      width={140}
      height={height}
      className="inline-block"
      style={{ verticalAlign: 'middle' }}
    />
  );
};
