import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TirLine = {
  id: string;
  time: number;
};

const STORAGE_KEY = 'tirLines';

export default function EditorScreen() {
  const [lines, setLines] = useState<TirLine[]>([]);
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const navigation = useNavigation();
  const secondsRef = useRef<TextInput>(null);

  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const loadLines = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setLines(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Erreur de chargement', e);
      }
    };
    loadLines();
  }, []);

  const saveLines = async (linesToSave: TirLine[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(linesToSave));
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
    if (text.length >= 2) {
      secondsRef.current?.focus();
    }
  };

  const addOrUpdateLine = () => {
    const min = parseInt(minutes, 10) || 0;
    const sec = parseFloat(seconds) || 0;
    const totalSeconds = min * 60 + sec;

    if (editId) {
      const updated = lines
        .map(line => line.id === editId ? { ...line, time: totalSeconds } : line)
        .sort((a, b) => a.time - b.time);
      setLines(updated);
      setEditId(null);
    } else {
      const newLine: TirLine = {
        id: Date.now().toString(),
        time: totalSeconds,
      };
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {statusMessage ? (
          <Text style={styles.statusMessage}>{statusMessage}</Text>
        ) : null}
      </View>

      <Text style={styles.title}>Éditeur de feuille de tir</Text>

      <View style={styles.inputRow}>
        <View style={styles.timeInputs}>
          <TextInput
            style={styles.input}
            placeholder="Min"
            placeholderTextColor={'white'}
            keyboardType="numeric"
            value={minutes}
            onChangeText={handleMinutesChange}
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="Sec"
            placeholderTextColor={'white'}
            keyboardType="numeric"
            value={seconds}
            onChangeText={setSeconds}
            ref={secondsRef}
            maxLength={5}
          />
        </View>
        <Button title={editId ? 'Modifier' : 'Ajouter'} onPress={addOrUpdateLine} />
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
                <TouchableOpacity onPress={() => editLine(item)} style={styles.actionButton}>
                  <Text style={styles.actionText}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteLine(item.id)} style={styles.actionButton}>
                  <Text style={styles.actionText}>✖</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.buttonRow}>
        <Button
          title="💾 Sauvegarder"
          onPress={() => saveLines(lines)}
          color="#4CAF50"
        />
        <Button
          title="🗑️ Réinitialiser"
          onPress={() => { clearLines();}}
          color="#F44336"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64, paddingHorizontal: 16, backgroundColor: '#111' },
  title: {
    fontSize: 26,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
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
    color: 'white',
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
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#444',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  actionText: {
    color: 'white',
    fontSize: 18,
  },
  backButtonText: {
    fontSize: 28,
    color: 'white',
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
    color: '#0f0',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
});
