import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Undo2, Check, AlertCircle } from 'lucide-react';
import Button from '../components/Button.jsx';
import { sound } from '../game/audio.js';

export default function DotConnectionCanvas({
  level,
  onComplete,
  disabled = false
}) {
  const { points = [], maxLines = 4, gridSize = 3 } = level.data || {};
  const [lines, setLines] = useState([]); // [{ start: {x,y}, end: {x,y}, visitedPoints: [id, id] }]
  const [currentStroke, setCurrentStroke] = useState(null); // active line being drawn { start, current }
  const [visitedDotIds, setVisitedDotIds] = useState(new Set());
  const [statusMessage, setStatusMessage] = useState(null);
  const svgRef = useRef(null);

  // Define canvas coordinate space
  const viewBoxSize = 480;

  // External outside-the-box guide targets for Level 5
  // (3x3 grid points are around 140, 240, 340. Outside target points are at 40, 440)
  const outsideHelpers = level.id === 5 ? [
    { id: 'out-top-right', x: 440, y: 140, label: 'Overshoot Node' },
    { id: 'out-bottom-left', x: 140, y: 440, label: 'Overshoot Node' },
    { id: 'out-top-left', x: 40, y: 140, label: 'Overshoot Node' },
    { id: 'out-bottom-right', x: 340, y: 440, label: 'Overshoot Node' }
  ] : [];

  // Helper: check if a straight line segment from p1 to p2 intersects a point pt with radius tolerance
  const lineIntersectsPoint = (p1, p2, pt, tolerance = 18) => {
    const l2 = (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2;
    if (l2 === 0) return Math.hypot(pt.x - p1.x, pt.y - p1.y) <= tolerance;
    // Projection of pt onto line p1-p2
    let t = ((pt.x - p1.x) * (p2.x - p1.x) + (pt.y - p1.y) * (p2.y - p1.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = p1.x + t * (p2.x - p1.x);
    const projY = p1.y + t * (p2.y - p1.y);
    const dist = Math.hypot(pt.x - projX, pt.y - projY);
    return dist <= tolerance;
  };

  // Find all level points intersected by a segment
  const getPointsIntersectedByLine = (p1, p2) => {
    const intersected = [];
    points.forEach(pt => {
      if (lineIntersectsPoint(p1, p2, pt)) {
        intersected.push(pt.id);
      }
    });
    return intersected;
  };

  // Convert client/touch coord to SVG coord
  const getSvgCoordinates = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * viewBoxSize;
    const y = ((clientY - rect.top) / rect.height) * viewBoxSize;
    return { x, y };
  };

  const handlePointerDown = (e) => {
    if (disabled) return;
    if (lines.length >= maxLines) {
      setStatusMessage(`Maximum of ${maxLines} lines reached. Reset or undo to try another path.`);
      return;
    }

    e.preventDefault();
    const coords = getSvgCoordinates(e.clientX, e.clientY);

    // If we have previous lines, the new line must start from the end of the last line (continuous stroke)
    let startPoint = coords;
    if (lines.length > 0) {
      startPoint = lines[lines.length - 1].end;
    } else {
      // Snap to nearest point or helper if close
      const allTargets = [...points, ...outsideHelpers];
      for (const t of allTargets) {
        if (Math.hypot(coords.x - t.x, coords.y - t.y) < 32) {
          startPoint = { x: t.x, y: t.y };
          break;
        }
      }
    }

    sound.playSelect();
    setCurrentStroke({ start: startPoint, current: coords });
  };

  const handlePointerMove = (e) => {
    if (!currentStroke) return;
    e.preventDefault();
    const coords = getSvgCoordinates(e.clientX, e.clientY);
    setCurrentStroke(prev => prev ? { ...prev, current: coords } : null);
  };

  const handlePointerUp = (e) => {
    if (!currentStroke) return;
    e.preventDefault();
    const coords = getSvgCoordinates(e.clientX, e.clientY);

    // Check snapping to points or outside targets
    let endPoint = coords;
    const allTargets = [...points, ...outsideHelpers];
    for (const t of allTargets) {
      if (Math.hypot(coords.x - t.x, coords.y - t.y) < 28) {
        endPoint = { x: t.x, y: t.y };
        break;
      }
    }

    // Reject zero-length click
    if (Math.hypot(endPoint.x - currentStroke.start.x, endPoint.y - currentStroke.start.y) < 15) {
      setCurrentStroke(null);
      return;
    }

    const hitPointIds = getPointsIntersectedByLine(currentStroke.start, endPoint);
    const newLine = {
      start: currentStroke.start,
      end: endPoint,
      visitedPoints: hitPointIds
    };

    const updatedLines = [...lines, newLine];
    setLines(updatedLines);
    setCurrentStroke(null);

    // Update visited points
    const newVisited = new Set(visitedDotIds);
    hitPointIds.forEach(id => newVisited.add(id));
    setVisitedDotIds(newVisited);
    sound.playSelect();

    // Check completion condition
    if (newVisited.size >= points.length) {
      sound.playSuccess();
      setStatusMessage("All dots connected! Verification successful.");
      setTimeout(() => {
        onComplete(updatedLines);
      }, 700);
    } else if (updatedLines.length >= maxLines) {
      setStatusMessage(`Completed ${updatedLines.length}/${maxLines} lines, but only ${newVisited.size}/${points.length} dots covered. Remember to extend past the border!`);
    } else {
      setStatusMessage(`Line ${updatedLines.length} committed. ${points.length - newVisited.size} dots remaining. Next stroke must continue from the endpoint.`);
    }
  };

  // Helper to click outside target node directly
  const handleTargetClick = (target) => {
    if (disabled || lines.length >= maxLines) return;
    const startPoint = lines.length > 0 ? lines[lines.length - 1].end : { x: target.x, y: target.y };
    if (lines.length > 0) {
      const hitPointIds = getPointsIntersectedByLine(startPoint, { x: target.x, y: target.y });
      const newLine = {
        start: startPoint,
        end: { x: target.x, y: target.y },
        visitedPoints: hitPointIds
      };
      const updatedLines = [...lines, newLine];
      setLines(updatedLines);
      const newVisited = new Set(visitedDotIds);
      hitPointIds.forEach(id => newVisited.add(id));
      setVisitedDotIds(newVisited);
      sound.playSelect();

      if (newVisited.size >= points.length) {
        sound.playSuccess();
        setTimeout(() => onComplete(updatedLines), 700);
      }
    }
  };

  const handleReset = () => {
    sound.playClick();
    setLines([]);
    setCurrentStroke(null);
    setVisitedDotIds(new Set());
    setStatusMessage(null);
  };

  const handleUndo = () => {
    if (lines.length === 0) return;
    sound.playClick();
    const updated = lines.slice(0, -1);
    setLines(updated);
    // Recompute visited
    const newVisited = new Set();
    updated.forEach(l => l.visitedPoints.forEach(id => newVisited.add(id)));
    setVisitedDotIds(newVisited);
    setStatusMessage(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
      {/* HUD Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '480px',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Lines:</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: lines.length > maxLines ? '#f43f5e' : '#22d3ee'
          }}>
            {lines.length} / {maxLines}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Dots Covered:</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: visitedDotIds.size === points.length ? '#34d399' : '#fbbf24'
          }}>
            {visitedDotIds.size} / {points.length}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <Button size="sm" variant="secondary" icon={Undo2} onClick={handleUndo} disabled={lines.length === 0}>
            Undo
          </Button>
          <Button size="sm" variant="secondary" icon={RotateCcw} onClick={handleReset} disabled={lines.length === 0}>
            Reset
          </Button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        aspectRatio: '1/1',
        background: 'radial-gradient(circle at center, #141727 0%, #0b0d18 100%)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-glow-cyan)',
        touchAction: 'none',
        overflow: 'hidden',
        userSelect: 'none'
      }}>
        {/* Subtle grid frame */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '60%',
          height: '60%',
          border: '1px dashed rgba(148, 163, 184, 0.25)',
          borderRadius: '8px',
          pointerEvents: 'none'
        }}>
          <span style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.65rem',
            color: 'rgba(148, 163, 184, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Visible Grid Box (Do not stay inside!)
          </span>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ width: '100%', height: '100%', cursor: 'crosshair', display: 'block' }}
        >
          {/* Committed lines */}
          {lines.map((line, idx) => (
            <line
              key={idx}
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke="#22d3ee"
              strokeWidth="5"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.8))' }}
            />
          ))}

          {/* Active stroke while dragging */}
          {currentStroke && (
            <line
              x1={currentStroke.start.x}
              y1={currentStroke.start.y}
              x2={currentStroke.current.x}
              y2={currentStroke.current.y}
              stroke="#a78bfa"
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
          )}

          {/* Outside helper beacons for Level 5 */}
          {outsideHelpers.map((h) => (
            <g
              key={h.id}
              onClick={() => handleTargetClick(h)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={h.x}
                cy={h.y}
                r="14"
                fill="rgba(139, 92, 246, 0.15)"
                stroke="#8b5cf6"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle cx={h.x} cy={h.y} r="3" fill="#a78bfa" />
              <text
                x={h.x}
                y={h.y + 24}
                textAnchor="middle"
                fill="var(--accent-violet-light)"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                Outer Apex
              </text>
            </g>
          ))}

          {/* Grid points / dots */}
          {points.map((pt) => {
            const isVisited = visitedDotIds.has(pt.id);
            return (
              <g key={pt.id}>
                {isVisited && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="16"
                    fill="rgba(52, 211, 153, 0.2)"
                    style={{ animation: 'pulseGlow 2s infinite' }}
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isVisited ? "9" : "8"}
                  fill={isVisited ? "#34d399" : "#cbd5e1"}
                  stroke={isVisited ? "#059669" : "#475569"}
                  strokeWidth="2"
                  style={{
                    filter: isVisited ? 'drop-shadow(0 0 8px #34d399)' : 'none',
                    transition: 'all 200ms ease'
                  }}
                />
              </g>
            );
          })}

          {/* Endpoint marker of last line */}
          {lines.length > 0 && (
            <circle
              cx={lines[lines.length - 1].end.x}
              cy={lines[lines.length - 1].end.y}
              r="6"
              fill="#fbbf24"
              stroke="#ffffff"
              strokeWidth="2"
              style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }}
            />
          )}
        </svg>
      </div>

      {/* Instructions & Feedback */}
      <div style={{
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: statusMessage ? '#22d3ee' : 'var(--text-muted)',
        background: 'rgba(18, 21, 34, 0.6)',
        padding: '0.6rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        minHeight: '2.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {statusMessage || "Click or drag to draw continuous straight strokes through the dots. Extend outside the box!"}
      </div>
    </div>
  );
}

