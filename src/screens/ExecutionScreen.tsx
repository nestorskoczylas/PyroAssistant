import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { Settings, TirLine } from '../constants/types';
import { STORAGE_KEYS, storage } from '../constants/storage';

export default function ExecutionScreen() {
  const [lines, setLines] = useState<TirLine[]>([]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [settings, setSettings] = useState<Settings>({ subtractOneSecond: false });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const adjustedLines = applyCumulativeOffset(lines, settings.subtractOneSecond);

  const nextLine = adjustedLines.find(line => line.time >= elapsed);
  const timeToNext = nextLine ? nextLine.time - elapsed : null;

  const lastLineIdRef = useRef<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = storage.getString(STORAGE_KEYS.TIR_LINES);
        if (saved) setLines(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur chargement tirLines:', e);
        Alert.alert('Erreur', 'Impossible de charger la feuille de tir');
      }
    })();
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (!running || !nextLine) return;
    if (lastLineIdRef.current !== nextLine.id && nextLine.time === elapsed) {
      Vibration.vibrate(1000);
      lastLineIdRef.current = nextLine.id;
    }
  }, [elapsed, nextLine, running]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      setRunning(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => (c ?? 0) - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const saved = storage.getString(STORAGE_KEYS.SETTINGS);
    if (saved) {
      const parsed: Settings = JSON.parse(saved);
      setSettings(parsed);
    }
  }, []);

  const toggleRun = () => {
    if (running || countdown !== null) {
      setRunning(false);
      setCountdown(null);
    } else if (elapsed === 0) {
      setCountdown(5);
      lastLineIdRef.current = null;
    } else {
      setRunning(true);
    }
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setCountdown(null);
    lastLineIdRef.current = null;
  };

  const backgroundColor = getBackgroundColor({ running, countdown, timeToNext });

  return (
    <View style={[styles.container, { backgroundColor }]}>

      <Text style={styles.title}>Exécution</Text>

      <View style={styles.countdownContainer}>
        {countdown !== null ? (
          <Text style={styles.countdownText}>{countdown}</Text>
        ) : (
          <Text style={styles.countdownPlaceholder} />
        )}
      </View>

      {nextLine ? (
        <View style={styles.infoBlock}>
          <Text style={styles.nextText}>Prochaine ligne à tirer :</Text>
          <Text style={styles.lineText}>
            Ligne #{lines.findIndex(l => l.id === nextLine.id) + 1} — {formatTime(nextLine.time)}
          </Text>
          <Text style={styles.timerText}>Temps restant : {timeToNext}s</Text>
        </View>
      ) : (
        <Text style={styles.finishedText}>Séquence terminée !</Text>
      )}

      <Text style={styles.elapsedText}>Temps écoulé : {formatTime(elapsed)}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={toggleRun}>
          <Text style={styles.buttonText}>
            {running || countdown !== null ? 'Pause' : 'Démarrer'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
          <Text style={styles.buttonText}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s < 10 ? '0' : ''}${s}s`;
}

function getBackgroundColor({running,countdown,timeToNext,}: {
  running: boolean; countdown: number | null; timeToNext: number | null; }) {
  if (!running) return COLORS.background;
  if (countdown !== null) return countdown === 1 ? COLORS.danger : COLORS.warning;
  if (timeToNext !== null) {
    if (timeToNext > 5) return COLORS.success;
    if (timeToNext > 0) return COLORS.warning;
    if (timeToNext === 0) return COLORS.danger;
  }
  return COLORS.background;
}

function applyCumulativeOffset(originalLines: TirLine[], subtract: boolean): TirLine[] {
  if (!subtract) return originalLines;

  // On trie les lignes dans l’ordre croissant (comme dans l'exécution)
  const sorted = [...originalLines].sort((a, b) => a.time - b.time);

  // On applique l’offset progressif
  const adjusted = sorted.map((line, index) => ({
    ...line,
    time: Math.max(0, line.time - index),
  }));

  return adjusted;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 1,
  },
  backText: {
    color: COLORS.textLight,
    fontSize: 28,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 40,
  },
  countdownText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 30,
  },
  countdownPlaceholder: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.textPlaceholder,
  },
  countdownContainer: {
    height: 100,
    justifyContent: 'center',
    marginBottom: 20,
  },
  infoBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
  nextText: {
    fontSize: SIZES.text + 2,
    color: COLORS.textLight,
  },
  lineText: {
    fontSize: SIZES.subtitle,
    fontWeight: 600,
    color: COLORS.textLight,
    marginVertical: 10,
  },
  timerText: {
    fontSize: SIZES.text + 6,
    color: COLORS.textLight,
    marginBottom: 30,
  },
  finishedText: {
    fontSize: SIZES.text + 6,
    fontWeight: 600,
    color: COLORS.finished,
    marginBottom: 50,
  },
  elapsedText: {
    fontSize: SIZES.text,
    color: COLORS.textMuted,
    marginBottom: 50,
  },
  buttons: {
    gap: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: 10,
  },
  resetButton: {
    backgroundColor: COLORS.danger,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: SIZES.text,
    textAlign: 'center',
  },
});
