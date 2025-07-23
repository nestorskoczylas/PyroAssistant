# 🔥 PyroAssistant <img src="assets/logo.png" align="right" alt="PyroAssistant Logo" width="40" />

**PyroAssistant** est une application mobile React Native pour gérer et exécuter des feuilles de tir pyrotechniques. Elle permet de définir précisément les séquences de tirs, les modifier, les sauvegarder localement et les exécuter avec synchronisation vibrante.

## 📱 Fonctionnalités

* ✍️ **Édition de feuille de tir** : ajoute, modifie ou supprime des temps personnalisés.
* 💾 **Sauvegarde locale** : persistance via `MMKV`.
* 🎬 **Exécution** : lance une feuille de tir avec fond dynamique et retour haptique à chaque étape.
* 🗑️ **Réinitialisation rapide** : un bouton pour tout effacer et repartir de zéro.
* 🎨 **Thème unifié** : couleurs, tailles et polices centralisées dans `theme.ts`.

## 🛠️ Stack technique

* **React Native** (CLI, pas Expo)
* **TypeScript**
* **React Navigation**
* **AsyncStorage**
* **Vibration API**
* **Hooks et composants fonctionnels modernes**

## 🚀 Installation & Lancement

### Prérequis

#### Commun

* [Node.js](https://nodejs.org/) (≥ 18)
* [npm](https://www.npmjs.com/) (généralement installé avec Node.js)
* [Metro Bundler](https://facebook.github.io/metro/) (inclus avec React Native CLI)
* [React Native CLI](https://reactnative.dev/docs/environment-setup)

```bash
npm install -g react-native-cli
```

#### Android

* [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/javase-downloads.html) (JDK 11 ou 17 recommandé)
* [Android Studio](https://developer.android.com/studio)
* `ANDROID_HOME` défini dans les variables d’environnement
* [Android SDK](https://developer.android.com/studio#downloads) (installé via Android Studio)
* [ADB (Android Debug Bridge)](https://developer.android.com/studio/command-line/adb) (`adb devices` doit lister un device)
* `gradlew` (inclus dans les projets React Native)
* Un appareil ou un émulateur Android fonctionnel

### Installation du projet

```bash
git clone https://github.com/nestorskoczylas/PyroAssistant.git
cd pyroassistant
npm install
```

### Lancement de l'app Android

```bash
npm run start     # Lance Metro Bundler
npm run android   # Compile et envoie l'app sur un émulateur ou téléphone Android
```

## 🧭 Navigation

L'application utilise React Navigation avec une structure simple à deux écrans :

* **HomeScreen** : choix entre édition ou exécution
* **EditorScreen** : édition de la feuille de tir
* **ExecutionScreen** : affichage du compte à rebours et vibrations synchronisées
* **SettingsScreen** : gestion des paramètres de l'application

## 📁 Structure du projet

```bash
/src
  /screens
    HomeScreen.tsx
    EditorScreen.tsx
    ExecutionScreen.tsx
    SettingsScreen.tsx
  /navigation
    types.ts
  /constants
    storage.ts
    theme.ts
    types.ts
App.tsx
```
---

## 👨‍💻 Auteur

**SKOCZYLAS Nestor**
[github.com/nestorskoczylas](https://github.com/nestorskoczylas)

---

## 📝 Licence

Distribué sous licence **MIT**.
Libre de copier, modifier et redistribuer.
