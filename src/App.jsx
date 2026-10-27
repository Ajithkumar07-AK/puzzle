import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import HowToPlay from './pages/HowToPlay.jsx';
import CampaignMap from './pages/CampaignMap.jsx';
import GamePage from './pages/GamePage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import PauseMenu from './components/PauseMenu.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import AchievementToast from './components/AchievementToast.jsx';

import { storage } from './game/storage.js';
import { sound } from './game/audio.js';
import { checkNewAchievements, ACHIEVEMENTS } from './game/achievements.js';
import { getLevelById } from './data/levels.js';

export default function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'how_to_play' | 'campaign_map' | 'game' | 'results'
  const [campaignState, setCampaignState] = useState(() => storage.getCampaign());
  const [settings, setSettings] = useState(() => storage.getSettings());
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => storage.getAchievements());
  const [activeAchievement, setActiveAchievement] = useState(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply settings to body
  useEffect(() => {
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    sound.setMuted(!settings.soundEnabled);
    sound.setVolume(settings.volume);
  }, [settings]);

  // Campaign countdown interval
  useEffect(() => {
    let interval = null;
    if (screen === 'game' && !isPaused && campaignState.mode === 'campaign') {
      interval = setInterval(() => {
        setCampaignState(prev => {
          if (prev.campaignTimeRemaining <= 1) {
            // Campaign timer expired gracefully!
            clearInterval(interval);
            sound.playError();
            setScreen('results');
            const finished = { ...prev, campaignTimeRemaining: 0, isCompleted: true };
            storage.saveCampaign(finished);
            return finished;
          }

          const updated = {
            ...prev,
            campaignTimeRemaining: prev.campaignTimeRemaining - 1,
            campaignTimeElapsed: prev.campaignTimeElapsed + 1
          };
          // Persist every 10 seconds to avoid excessive writes
          if (updated.campaignTimeElapsed % 10 === 0) {
            storage.saveCampaign(updated);
          }
          return updated;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [screen, isPaused, campaignState.mode]);

  // Global key bindings (Escape to pause)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (screen === 'game') {
          setIsPaused(prev => !prev);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, isSettingsOpen]);

  // Save campaign state whenever it updates
  const updateCampaign = (updater) => {
    setCampaignState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.saveCampaign(next);
      return next;
    });
  };

  // Level Solved Handler
  const handleLevelSolved = (levelId, { scoreDetails, timeSpent, hintsUsed }) => {
    const level = getLevelById(levelId);
    const completedCopy = { ...campaignState.completedLevels };
    completedCopy[levelId] = {
      score: scoreDetails?.total || 250,
      timeSpent,
      hintsUsed,
      category: level.category,
      solvedAt: Date.now()
    };

    const nextLevelIdx = campaignState.currentLevelIndex + 1;
    const isCampaignFinished = levelId === 30 || Object.keys(completedCopy).length >= 30;

    const newScore = (campaignState.totalScore || 0) + (scoreDetails?.total || 250);
    const newUnlockedMax = Math.max(campaignState.unlockedLevelMax || 0, levelId);

    const nextCampaignState = {
      ...campaignState,
      completedLevels: completedCopy,
      totalScore: newScore,
      currentLevelIndex: Math.min(29, nextLevelIdx),
      unlockedLevelMax: newUnlockedMax,
      hintsUsedCount: (campaignState.hintsUsedCount || 0) + hintsUsed,
      isCompleted: isCampaignFinished
    };

    updateCampaign(nextCampaignState);

    // Evaluate Achievements
    const newAchievements = checkNewAchievements(
      nextCampaignState,
      level,
      { timeSpentSeconds: timeSpent },
      unlockedAchievements
    );

    if (newAchievements.length > 0) {
      const merged = [...unlockedAchievements, ...newAchievements];
      setUnlockedAchievements(merged);
      storage.saveAchievements(merged);

      const firstNew = ACHIEVEMENTS.find(a => a.id === newAchievements[0]);
      if (firstNew) {
        setActiveAchievement(firstNew);
      }
    }

    if (isCampaignFinished) {
      setTimeout(() => {
        setScreen('results');
      }, 500);
    } else {
      // Advance to next level
      updateCampaign(prev => ({ ...prev, currentLevelIndex: nextLevelIdx }));
    }
  };

  const handleStartCampaign = () => {
    sound.init();
    updateCampaign(prev => ({ ...prev, mode: 'campaign' }));
    setScreen('game');
  };

  const handleStartPractice = () => {
    sound.init();
    updateCampaign(prev => ({ ...prev, mode: 'practice' }));
    setScreen('game');
  };

  const handleSelectLevelFromMap = (lvlId) => {
    updateCampaign(prev => ({ ...prev, currentLevelIndex: lvlId - 1 }));
    setScreen('game');
  };

  const handleRestartLevel = () => {
    setIsPaused(false);
    // Reloads current level by keeping index
    setScreen('game');
  };

  const handleResetCampaign = () => {
    const fresh = storage.resetCampaign();
    setCampaignState(fresh);
    setIsPaused(false);
    setScreen('game');
  };

  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    const updated = { ...settings, soundEnabled: nextVal };
    setSettings(updated);
    storage.saveSettings(updated);
    sound.setMuted(!nextVal);
  };

  const currentLevelId = (campaignState.currentLevelIndex || 0) + 1;

  return (
    <div className="app-container">
      <div className="cognitive-grid-bg" />

      {/* Screen Routing */}
      {screen === 'landing' && (
        <LandingPage
          campaignState={campaignState}
          onStartCampaign={handleStartCampaign}
          onStartPractice={handleStartPractice}
          onOpenHowToPlay={() => setScreen('how_to_play')}
          onOpenMap={() => setScreen('campaign_map')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          soundMuted={!settings.soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {screen === 'how_to_play' && (
        <HowToPlay
          onBack={() => setScreen('landing')}
          onStartGame={handleStartCampaign}
        />
      )}

      {screen === 'campaign_map' && (
        <CampaignMap
          campaignState={campaignState}
          onSelectLevel={handleSelectLevelFromMap}
          onBack={() => setScreen(campaignState.completedLevels && Object.keys(campaignState.completedLevels).length > 0 ? 'game' : 'landing')}
        />
      )}

      {screen === 'game' && (
        <GamePage
          levelId={currentLevelId}
          campaignState={campaignState}
          onLevelSolved={handleLevelSolved}
          onPause={() => setIsPaused(true)}
          onOpenMap={() => setScreen('campaign_map')}
          soundMuted={!settings.soundEnabled}
          onToggleSound={handleToggleSound}
          isPractice={campaignState.mode === 'practice'}
        />
      )}

      {screen === 'results' && (
        <ResultsPage
          campaignState={campaignState}
          unlockedAchievements={unlockedAchievements}
          onReplayCampaign={handleResetCampaign}
          onOpenPractice={handleStartPractice}
          onOpenMap={() => setScreen('campaign_map')}
        />
      )}

      {/* Pause Menu Modal */}
      <PauseMenu
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onRestartLevel={handleRestartLevel}
        onResetCampaign={handleResetCampaign}
        onOpenMap={() => {
          setIsPaused(false);
          setScreen('campaign_map');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExitHome={() => {
          setIsPaused(false);
          setScreen('landing');
        }}
        soundMuted={!settings.soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          storage.saveSettings(newSettings);
        }}
      />

      {/* In-Game Achievement Toast */}
      <AchievementToast
        achievement={activeAchievement}
        onClose={() => setActiveAchievement(null)}
      />
    </div>
  );
}

