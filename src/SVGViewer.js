import { useState, useRef, useEffect } from 'react';

const SVGViewer = () => {
  const [selectedSVG, setSelectedSVG] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(true);
  const viewerRef = useRef(null);

  // SVG file paths in public folder
  const svgPaths = [
    '/cdt-svgs/Final_Complex_1_Flowchart.svg',
    '/cdt-svgs/Final_Complex_2_Flowchart.svg',
    '/cdt-svgs/Final_Complex_3_Flowchart.svg',
    '/cdt-svgs/Final_Complex_4_Flowchart.svg',
    '/cdt-svgs/Final_Complex_5_Flowchart.svg',
  ];

  // Load SVG content when selected SVG changes
  useEffect(() => {
    const loadSvg = async () => {
      setLoading(true);
      try {
        const response = await fetch(svgPaths[selectedSVG]);
        const svgText = await response.text();
        setSvgContent(svgText);
      } catch (error) {
        console.error('Error loading SVG:', error);
        setSvgContent('<svg viewBox="0 0 100 100"><text x="10" y="50" fill="red">Error loading SVG</text></svg>');
      } finally {
        setLoading(false);
      }
    };

    loadSvg();
  }, [selectedSVG]);

  // Handle wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();

    // Get mouse position relative to the viewer
    const rect = viewerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate position relative to current transform
    const relativeX = (mouseX - position.x) / scale;
    const relativeY = (mouseY - position.y) / scale;

    // Zoom factor - smaller value for more gradual zoom
    const zoomFactor = 0.05;
    const delta = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;
    
    // Limit scale between 0.5 and 10
    const newScale = Math.max(0.5, Math.min(10, scale * delta));

    // Calculate new position to zoom toward cursor
    const newX = mouseX - relativeX * newScale;
    const newY = mouseY - relativeY * newScale;

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  // Add/remove wheel event listener
  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        viewer.removeEventListener('wheel', handleWheel);
      };
    }
  }, [scale, position]);

  const handleMouseDown = (e) => {
    // Only start dragging on left mouse button
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case '+':
        case '=':
          setScale(s => Math.min(s * 1.1, 10));
          break;
        case '-':
          setScale(s => Math.max(s * 0.9, 0.5));
          break;
        case '0':
          handleReset();
          break;
        case 'ArrowRight':
          setSelectedSVG(s => (s + 1) % svgPaths.length);
          break;
        case 'ArrowLeft':
          setSelectedSVG(s => (s - 1 + svgPaths.length) % svgPaths.length);
          break;
        default:
          return;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [svgPaths.length]);

  return (
    <div className="flex flex-col w-full" style={{height: "95vh" }}>
      {/* Top SVG display area - now takes most of the screen */}
      <div 
        ref={viewerRef}
        className="flex-grow bg-white relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading SVG...</div>
          </div>
        ) : (
          <div 
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: '0 0',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>
      
      {/* Bottom control panel */}
      <div className="bg-gray-100 border-t border-gray-300 p-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* SVG Selection */}
          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-1">Diagram Selection</div>
            <div className="flex flex-wrap gap-1">
              {svgPaths.map((path, index) => (
                <button
                  key={index}
                  className={`px-2 py-1 text-sm rounded ${selectedSVG === index ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
                  onClick={() => setSelectedSVG(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-1">Zoom</div>
            <div className="flex gap-1">
              <button
                className="px-2 py-1 text-sm bg-gray-300 rounded"
                onClick={() => setScale(s => Math.min(s * 1.2, 10))}
              >
                +
              </button>
              <button
                className="px-2 py-1 text-sm bg-gray-300 rounded"
                onClick={() => setScale(s => Math.max(s * 0.8, 0.5))}
              >
                -
              </button>
              <button
                className="px-2 py-1 text-sm bg-gray-300 rounded"
                onClick={handleReset}
              >
                Reset
              </button>
              <span className="px-2 py-1 text-sm">{Math.round(scale * 100)}%</span>
            </div>
          </div>
          
          {/* Help text */}
          <div className="flex flex-col">
            <div className="text-sm font-semibold mb-1">Controls</div>
            <div className="text-xs text-gray-600">
              Scroll to zoom • Drag to pan • +/- keys to zoom • Arrow keys to change diagrams
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SVGViewer;