import React from 'react';
import DotConnectionCanvas from '../puzzles/DotConnectionCanvas.jsx';
import MathSequencePuzzle from '../puzzles/MathSequencePuzzle.jsx';
import MatrixPuzzle from '../puzzles/MatrixPuzzle.jsx';
import CircuitSwitchesPuzzle from '../puzzles/CircuitSwitchesPuzzle.jsx';
import ChoicePuzzle from '../puzzles/ChoicePuzzle.jsx';
import MemorySequencePuzzle from '../puzzles/MemorySequencePuzzle.jsx';
import HarmonicDialsPuzzle from '../puzzles/HarmonicDialsPuzzle.jsx';
import BossBattleView from '../puzzles/BossBattleView.jsx';

export default function PuzzleEngine({
  level,
  onComplete,
  disabled = false
}) {
  if (level.isBoss) {
    return <BossBattleView level={level} onComplete={onComplete} disabled={disabled} />;
  }

  if (level.category === 'dots') {
    return <DotConnectionCanvas level={level} onComplete={onComplete} disabled={disabled} />;
  }

  if (level.data?.type === 'matrix3x3') {
    return <MatrixPuzzle level={level} onComplete={onComplete} disabled={disabled} />;
  }

  if (level.data?.type === 'circuitSwitches') {
    return <CircuitSwitchesPuzzle level={level} onComplete={onComplete} disabled={disabled} />;
  }

  if (level.data?.type?.startsWith('memory')) {
    return <MemorySequencePuzzle level={level} onComplete={onComplete} disabled={disabled} />;
  }

  if (level.data?.type === 'dialEquation') {
    return <HarmonicDialsPuzzle level={level} onComplete={onComplete} disabled={disabled} />;
  }

  if (level.category === 'math' && (level.data?.sequence || level.data?.equations)) {
    return <MathSequencePuzzle level={level} onComplete={onComplete} disabled={disabled} />;
  }

  // Fallback to Choice / Deduction / Spatial / Lateral Puzzle
  return <ChoicePuzzle level={level} onComplete={onComplete} disabled={disabled} />;
}

