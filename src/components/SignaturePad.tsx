import { useRef, useState, useEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  name: string;
  cedula: string;
  onSign?: (dataUrl: string) => void;
}

export default function SignaturePad({ label, name, cedula, onSign }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const historyRef = useRef<string[]>([]);

  const getPos = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }, []);

  const startDraw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPoint.current = pos;
    setIsDrawing(true);
    setHasDrawn(true);
    historyRef.current.push(canvas.toDataURL());
  }, [getPos]);

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPoint.current = pos;
  }, [isDrawing, getPos]);

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current!;
    const dataUrl = canvas.toDataURL();
    historyRef.current.push(dataUrl);
    onSign?.(dataUrl);
  }, [isDrawing, onSign]);

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    historyRef.current = [];
    onSign?.('');
  };

  const undo = () => {
    if (historyRef.current.length < 2) {
      clear();
      return;
    }
    historyRef.current.pop();
    const prev = historyRef.current[historyRef.current.length - 1];
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      onSign?.(prev);
    };
    img.src = prev;
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = 500;
    canvas.height = 160;
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
      <p className="text-[11px] font-bold text-[#4a148c] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-extrabold text-slate-800 mb-0.5">{name}</p>
      <p className="text-[10px] text-slate-400 mb-4">{cedula}</p>

      <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50 mb-3">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair touch-none"
          style={{ height: '120px' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm text-slate-300 italic">Firme aquí...</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mb-3">
        <Eye className="w-4 h-4 text-slate-400" />
        <span className="text-[11px] text-slate-500 font-medium">OptiÆllen — Ver bien es vivir mejor</span>
      </div>

      <div className="flex justify-center gap-2">
        <button type="button" onClick={clear}
          className="px-5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          Borrar
        </button>
        <button type="button" onClick={undo}
          className="px-5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          Deshacer
        </button>
      </div>
    </div>
  );
}
