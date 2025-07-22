import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet
} from 'react-native';
import { TirLine } from '../constants/types';
import { COLORS, SIZES } from '../constants/theme';
import { STORAGE_KEYS, storage } from '../constants/storage';

export default function EditorScreen() {
  const [lines, setLines] = useState<TirLine[]>([]);
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const secondsRef = useRef<TextInput>(null);

  useEffect(() => {
    const loadLines = async () => {
      try {
        const saved = storage.getString(STORAGE_KEYS.TIR_LINES);
        if (saved) setLines(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur de chargement', e);
      }
    };
    loadLines();
  }, []);

  const saveLines = async (linesToSave: TirLine[]) => {
    try {
      storage.set(STORAGE_KEYS.TIR_LINES, JSON.stringify(linesToSave));
      setStatusMessage('Sauvegardé avec succès');
      setTimeout(() => setStatusMessage(''), 2000);
    } catch (e) {
      console.error('Erreur de sauvegarde', e);
    }
  };

  const clearLines = () => {
    setLines([]);
    saveLines([]);
    setStatusMessage('Effacé avec succès');
    setTimeout(() => setStatusMessage(''), 2000);
  };

  const handleMinutesChange = (text: string) => {
    setMinutes(text);
    if (text.length >= 2) secondsRef.current?.focus();
  };

  const addOrUpdateLine = () => {
    const min = parseInt(minutes, 10) || 0;
    const sec = parseFloat(seconds) || 0;
    const totalSeconds = min * 60 + sec;

    if (editId) {
      const updated = lines.map(line =>
        line.id === editId ? { ...line, time: totalSeconds } : line
      ).sort((a, b) => a.time - b.time);
      setLines(updated);
      setEditId(null);
    } else {
      const newLine: TirLine = { id: Date.now().toString(), time: totalSeconds };
      const updated = [...lines, newLine].sort((a, b) => a.time - b.time);
      setLines(updated);
    }

    setMinutes('');
    setSeconds('');
  };

  const deleteLine = (id: string) => {
    const updated = lines.filter(line => line.id !== id);
    setLines(updated);
    if (editId === id) setEditId(null);
  };

  const editLine = (line: TirLine) => {
    setEditId(line.id);
    setMinutes(Math.floor(line.time / 60).toString());
    setSeconds(Math.floor(line.time % 60).toString());
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}m ${s}s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {statusMessage ? <Text style={styles.statusMessage}>{statusMessage}</Text> : null}
      </View>

      <Text style={styles.title}>Éditeur de feuille de tir</Text>

      <View style={styles.inputRow}>
        <View style={styles.timeInputs}>
          <TextInput
            style={styles.input}
            placeholder="Min"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            value={minutes}
            onChangeText={handleMinutesChange}
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="Sec"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            value={seconds}
            onChangeText={setSeconds}
            ref={secondsRef}
            maxLength={5}
          />
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={addOrUpdateLine}>
          <Text style={styles.actionButtonText}>
            {editId ? 'Modifier' : 'Ajouter'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={lines}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.line}>
            <View style={styles.lineContent}>
              <Text style={styles.lineText}>
                Ligne {index + 1} — {formatTime(item.time)}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => editLine(item)} style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteLine(item.id)} style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>✖</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.appButton, { backgroundColor: COLORS.success }]} onPress={() => saveLines(lines)}>
          <Text style={styles.appButtonText}>💾 Sauvegarder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.appButton, { backgroundColor: COLORS.danger }]} onPress={clearLines}>
          <Text style={styles.appButtonText}>🗑️ Réinitialiser</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: SIZES.title,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 24,
  },
  timeInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    backgroundColor: '#222',
    color: COLORS.textLight,
    padding: 10,
    borderRadius: 6,
    flex: 1,
  },
  line: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
  lineContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineText: {
    color: COLORS.textLight,
    fontSize: SIZES.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  smallButtonText: {
    color: COLORS.textLight,
    fontSize: 18,
  },
  actionButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.textLight,
    fontSize: SIZES.text,
    fontWeight: 600,
  },
  backButtonText: {
    fontSize: 28,
    color: COLORS.textLight,
  },
  topBar: {
    position: 'absolute',
    top: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  statusMessage: {
    color: COLORS.success,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  appButton: {
    flex: 1,
    padding: 12,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
  },
  appButtonText: {
    color: COLORS.textLight,
    fontSize: SIZES.text,
    fontWeight: 600,
  },
});
