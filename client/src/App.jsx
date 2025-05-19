import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

let socket;

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    socket = io("https://draw-e2jv.onrender.com");

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    socket.on("draw", ({ x0, y0, x1, y1, color }) => {
      drawLine(x0, y0, x1, y1, color);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const drawLine = (x0, y0, x1, y1, color, emit = false) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();

    if (emit) {
      socket.emit("draw", { x0, y0, x1, y1, color });
    }
  };

  const getOffset = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getOffset(e);
    setDrawing(true);
    setPrevPos({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const { x, y } = getOffset(e);
    drawLine(prevPos.x, prevPos.y, x, y, "black", true);
    setPrevPos({ x, y });
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  return (
    <div className="w-screen h-screen">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}

export default App;
