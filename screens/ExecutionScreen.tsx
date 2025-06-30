import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const STORAGE_KEY = 'tirLines';

type TirLine = {
  id: string;
  time: number;
};

const COLORS = {
  default: '#34495e',
  ready: '#2ecc71',
  warning: '#f39c12',
  danger: '#e74c3c',
};

export default function ExecutionScreen() {
  const [lines, setLines] = useState<TirLine[]>([]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation();

  const nextLine = lines.find(line => line.time >= elapsed);
  const timeToNext = nextLine ? nextLine.time - elapsed : null;

  const lastLineIdRef = useRef<string | null>(null);

  // Chargement des lignes
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setLines(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur chargement tirLines:', e);
        Alert.alert('Erreur', 'Impossible de charger la feuille de tir');
      }
    })();
  }, []);

  // Tick timer
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

  // Vibration à chaque nouvelle ligne
  useEffect(() => {
    if (!running || !nextLine) return;

    if (lastLineIdRef.current !== nextLine.id && nextLine.time === elapsed) {
      Vibration.vibrate(1000);
      lastLineIdRef.current = nextLine.id;
    }
  }, [elapsed, nextLine, running]);

  // Décompte initial
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Exécution</Text>

      {/* Bloc compte à rebours (espace réservé même s’il disparaît) */}
      <View style={styles.countdownContainer}>
        {countdown !== null ? (
          <Text style={styles.countdownText}>{countdown}</Text>
        ) : (
          <Text style={styles.countdownPlaceholder} />
        )}
      </View>

      {/* Bloc info ligne */}
      {nextLine ? (
        <View style={styles.infoBlock}>
          <Text style={styles.nextText}>Prochaine ligne à tirer :</Text>
          <Text style={styles.lineText}>
            Ligne #{lines.indexOf(nextLine) + 1} — {formatTime(nextLine.time)}
          </Text>
          <Text style={styles.timerText}>Temps restant : {timeToNext}s</Text>
        </View>
      ) : (
        <Text style={styles.finishedText}>Séquence terminée !</Text>
      )}

      <Text style={styles.elapsedText}>Temps écoulé : {formatTime(elapsed)}</Text>

      {/* Boutons */}
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

// Helpers
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s < 10 ? '0' : ''}${s}s`;
}

function getBackgroundColor({
  running,
  countdown,
  timeToNext,
}: {
  running: boolean;
  countdown: number | null;
  timeToNext: number | null;
}) {
  if (!running) return COLORS.default;
  if (countdown !== null) return countdown === 1 ? COLORS.danger : COLORS.warning;
  if (timeToNext !== null) {
    if (timeToNext > 5) return COLORS.ready;
    if (timeToNext > 0) return COLORS.warning;
    if (timeToNext === 0) return COLORS.danger;
  }
  return COLORS.default;
}


// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    color: '#fff',
    fontSize: 28,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  nextText: {
    fontSize: 20,
    color: '#eee',
  },
  lineText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 10,
  },
  timerText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 30,
  },
  elapsedText: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 50,
  },
  finishedText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#95a5a6',
    marginBottom: 50,
  },
  buttons: {
    gap: 20,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  skipButton: {
    backgroundColor: '#9b59b6',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
    countdownContainer: {
    height: 100,
    justifyContent: 'center',
    marginBottom: 20,
  },
  countdownPlaceholder: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'transparent',
  },
  infoBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
});
