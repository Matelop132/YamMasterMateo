# YamMaster
### Lancement du projet
## Installer et lancer le front

``` bash
npm install
npx expo install @expo/metro-runtime
npx expo install expo-linear-gradient
npx expo start
```

## Installer et lancer le back

``` bash
cd websocket-game-server
npm install
npm run start
```

## Important

Dans l'éventualité où le jeu plante, relancer le back et le front.

## Stack Technique

### Frontend
- **Framework**: React Native avec Expo
- **Navigation**: React Navigation
- **Communication**: Socket.io-client
- **UI Components**: 
  - Expo Linear Gradient
  - Composants personnalisés pour le jeu
- **État**: Gestion d'état via les props et le contexte React

### Backend
- **Serveur Principal**: Node.js avec Express
- **WebSocket**: Socket.io
- **Gestion des IDs**: Uniqid
- **Architecture**: 
  - Game Manager (WebSocket Server)
  - Stockage Service (Database Server)
  - BOT Game Manager

### Composants Frontend
- **Écrans Principaux**:
  - MenuScreen
  - OnlineGameScreen
  - VsBotGameScreen
  - AuthScreen
- **Composants de Jeu**:
  - Board
  - Grid
  - DeckPlayer
  - Choices
  - PlayerInfos
  - OpponentInfos
  - Timers
  - Scores

### API WebSocket
- **Événements Écoutés**:
  - queue.added
  - game.start
  - game.end
  - game.timer
  - game.opponent.leave
- **Événements Émis**:
  - disconnect
  - queue.join
  - game.leave
  - game.end-turn
  - game.dices.roll
  - game.dices.lock
  - game.choices.selected
  - game.grid.selected


