import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, Save, Trash2, X, Download } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentSize, setCurrentSize] = useState(3);
  const [notes, setNotes] = useLocalStorage("focusflow-notes", []);
  const [whiteboardData, setWhiteboardData] = useLocalStorage("focusflow-whiteboard", null);

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", 
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && whiteboardData) {
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = whiteboardData;
    }
  }, [whiteboardData]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    ctx.lineTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL();
      setWhiteboardData(dataURL);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setWhiteboardData(null);
  };

  const saveToNotes = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();

    const newNote = {
      id: Date.now().toString(),
      title: "Whiteboard Drawing",
      content: `Whiteboard drawing saved on ${new Date().toLocaleDateString()}\n\n[Whiteboard Image: ${dataURL}]`,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      isFavorite: false,
      folderId: null,
      isWhiteboard: true,
      whiteboardData: dataURL,
    };

    setNotes([newNote, ...notes]);
    alert("Whiteboard saved to Notes!");
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="text-sm font-medium">Color:</span>
          <div className="flex gap-1">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded border-2 ${
                  currentColor === color ? 'border-gray-400' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Size:</span>
          <Input
            type="range"
            min="1"
            max="10"
            value={currentSize}
            onChange={(e) => setCurrentSize(e.target.value)}
            className="w-16"
          />
          <span className="text-xs text-gray-500">{currentSize}px</span>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={clearCanvas}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={downloadImage}>
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={saveToNotes}>
            <Save className="h-4 w-4 mr-2" />
            Save to Notes
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="block w-full bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}