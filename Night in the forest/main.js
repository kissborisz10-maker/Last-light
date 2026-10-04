const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const minimap = document.getElementById('minimap');
const miniCtx = minimap.getContext('2d');

const menuOverlay = document.getElementById('menu-overlay');
const hud = document.getElementById('hud');
const message = document.getElementById('message');
const healthLabel = document.getElementById('health');
const objectiveBulbs = Array.from(document.querySelectorAll('#objective-bulbs .bulb-icon'));

const menuButtons = Array.from(document.querySelectorAll('.menu-item'));
const mapMenu = document.getElementById('map-menu');
const mapCards = Array.from(document.querySelectorAll('.map-card'));
const characterMenu = document.getElementById('character-menu');
const characterCards = Array.from(document.querySelectorAll('.character-card'));
const multiplayerMenu = document.getElementById('multiplayer-menu');
const lobbyMenu = document.getElementById('lobby-menu');
const settingsPanel = document.getElementById('settings-panel');
const graphicsSlider = document.getElementById('graphics-slider');
const volumeSlider = document.getElementById('volume-slider');
const brightnessSlider = document.getElementById('brightness-slider');
const graphicsValue = document.getElementById('graphics-value');
const volumeValue = document.getElementById('volume-value');
const brightnessValue = document.getElementById('brightness-value');
const backButton = document.querySelector('[data-action="back"]');
const characterBackButton = document.querySelector('[data-action="character-back"]');
const mapBackButton = document.querySelector('[data-action="map-back"]');
const multiplayerBackButton = document.querySelector('[data-action="multiplayer-back"]');
const lobbyBackButton = document.querySelector('[data-action="lobby-back"]');
const joinCodeInput = document.getElementById('join-code');
const joinCodeButton = document.getElementById('join-code-button');
const startLobbyButton = document.getElementById('start-lobby');
const readyLobbyButton = document.getElementById('ready-lobby');
const chooseMapLobbyButton = document.getElementById('choose-map-lobby');
const lobbyStatusText = document.getElementById('lobby-status');
const lobbyMapName = document.getElementById('lobby-map-name');
const lobbyRoomCode = document.getElementById('lobby-room-code');
const lobbySlotsContainer = document.querySelector('.slots-grid');
let lobbySlots = Array.from(document.querySelectorAll('.player-slot'));

const nextbotImages = ['1.jpg', '2.png', '3.png', '4.png', '5.png', '6.jpg'].map((filename) => {
  const image = new Image();
  image.src = `./assets/${filename}`;
  return image;
});

const macheteImage = new Image();
macheteImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="metal" x1="0" x2="1">
        <stop offset="0%" stop-color="#f3f5f7"/>
        <stop offset="45%" stop-color="#b4bcc4"/>
        <stop offset="100%" stop-color="#737d86"/>
      </linearGradient>
      <linearGradient id="wood" x1="0" x2="1">
        <stop offset="0%" stop-color="#b98a43"/>
        <stop offset="100%" stop-color="#6a4324"/>
      </linearGradient>
    </defs>
    <g transform="translate(100 100)">
      <rect x="-18" y="-76" width="36" height="150" rx="12" fill="url(#wood)"/>
      <rect x="-11" y="-84" width="22" height="28" rx="8" fill="#d9b376"/>
      <rect x="-6" y="-75" width="12" height="68" rx="5" fill="#8a5d2c"/>
      <rect x="-7" y="22" width="14" height="28" rx="6" fill="#8a5d2c"/>
      <rect x="-12" y="-24" width="24" height="110" rx="6" fill="url(#metal)"/>
      <path d="M -30 -18 L 30 -18 L 45 10 L 35 18 L -35 18 L -45 10 Z" fill="#dfe5ea"/>
      <path d="M -6 -26 L 6 -26 L 14 9 L -14 9 Z" fill="#a1a9b2"/>
      <path d="M -4 -70 L 4 -70 L 10 -28 L -10 -28 Z" fill="#c49b5d"/>
      <circle cx="0" cy="-84" r="11" fill="#7e5638"/>
    </g>
  </svg>
`)}`;

const bulbImage = new Image();
bulbImage.src = './assets/bulb.avif';

const forestAtmosphereImage = new Image();
forestAtmosphereImage.src = './assets/f.jpg';

const backroomsAtmosphereImage = new Image();
backroomsAtmosphereImage.src = './assets/b.jpg';

const hillsHouseTexture = document.createElement('canvas');
hillsHouseTexture.width = 128;
hillsHouseTexture.height = 128;
const hillsHouseCtx = hillsHouseTexture.getContext('2d');
hillsHouseCtx.fillStyle = '#59412d';
hillsHouseCtx.fillRect(0, 0, 128, 128);
hillsHouseCtx.fillStyle = '#8a4d31';
hillsHouseCtx.beginPath();
hillsHouseCtx.moveTo(0, 48);
hillsHouseCtx.lineTo(64, 4);
hillsHouseCtx.lineTo(128, 48);
hillsHouseCtx.closePath();
hillsHouseCtx.fill();
hillsHouseCtx.fillStyle = '#e7d7af';
hillsHouseCtx.fillRect(12, 46, 104, 82);
hillsHouseCtx.fillStyle = '#c4ad83';
hillsHouseCtx.fillRect(12, 46, 10, 82);
hillsHouseCtx.fillRect(106, 46, 10, 82);
hillsHouseCtx.fillRect(12, 46, 104, 8);
hillsHouseCtx.fillStyle = '#281d18';
hillsHouseCtx.fillRect(53, 88, 23, 40);
hillsHouseCtx.fillStyle = '#344047';
[[31, 66], [82, 66], [30, 108], [84, 108]].forEach(([x, y]) => {
  hillsHouseCtx.fillRect(x, y, 13, 15);
  hillsHouseCtx.fillStyle = '#d9caa6';
  hillsHouseCtx.fillRect(x + 5, y, 3, 15);
  hillsHouseCtx.fillRect(x, y + 6, 13, 3);
  hillsHouseCtx.fillStyle = '#344047';
});

const game = {
  mode: 'menu',
  time: 0,
  world: [],
  worldSize: 44,
  player: null,
  monster: null,
  relics: [],
  exit: { x: 14.5, y: 14.5 },
  collected: 0,
  totalRelics: 3,
  keys: {},
  lastTime: 0,
  rain: [],
  lightningTimer: 0,
  lightningFlash: 0,
  jumpScareTimer: 0,
  map: 'f',
  multiplayer: false,
  nextbotImageIndex: -1,
  roomCode: 'NIGHT',
  lobbyPlayers: [],
  lobbyReady: false,
};

function getNextbotImage(index = game.monster?.imageIndex ?? game.nextbotImageIndex) {
  const imageIndex = Number.isInteger(index) ? index : 0;
  return nextbotImages[((imageIndex % nextbotImages.length) + nextbotImages.length) % nextbotImages.length];
}

const sound = {
  ctx: null,
  master: null,
  rainSource: null,
  rainGain: null,
  rainBuffer: null,
  rainEnabled: false,
  lampTimer: null,
  musicTimer: null,
  musicStep: 0,
};

const network = {
  peer: null,
  connection: null,
  connections: [],
  isHost: false,
  connected: false,
  remotePlayers: Object.create(null),
  stateTimer: null,
};

const MAX_PLAYERS = 3;

const settings = {
  graphics: 78,
  volume: 70,
  brightness: 82,
};

let activeIndex = 0;

const characterOptions = {
  sanyi: { name: 'Sanyi', image: './assets/sanyi.png' },
  boti: { name: 'A KOPASZ', image: './assets/boti.png' },
  judith: { name: 'Judith', image: './assets/a.png' },
};

game.selectedCharacter = 'sanyi';

function setActiveMenu(index) {
  activeIndex = Math.max(0, Math.min(menuButtons.length - 1, index));
  menuButtons.forEach((button, i) => {
    button.classList.toggle('active', i === activeIndex);
  });
}

function updateSettingsText() {
  graphicsValue.textContent = `${graphicsSlider.value}%`;
  volumeValue.textContent = `${volumeSlider.value}%`;
  brightnessValue.textContent = `${brightnessSlider.value}%`;
}

function applySettings() {
  settings.graphics = Number(graphicsSlider.value);
  settings.volume = Number(volumeSlider.value);
  settings.brightness = Number(brightnessSlider.value);
  document.documentElement.style.filter = `brightness(${0.7 + settings.brightness / 100})`;
  updateSettingsText();
}

function openSettings() {
  settingsPanel.classList.add('active');
  menuOverlay.style.pointerEvents = 'none';
}

function closeSettings() {
  settingsPanel.classList.remove('active');
  menuOverlay.style.pointerEvents = 'auto';
}

function openMultiplayerMenu() {
  if (multiplayerMenu) {
    multiplayerMenu.classList.remove('hidden');
  }
  if (menuOverlay) {
    menuOverlay.classList.add('hidden');
  }
}

function closeMultiplayerMenu() {
  if (multiplayerMenu) {
    multiplayerMenu.classList.add('hidden');
  }
  if (menuOverlay) {
    menuOverlay.classList.remove('hidden');
  }
}

function openLobbyMenu() {
  game.multiplayer = true;
  ensureAudio();
  startLobbyMusic();
  if (!game.lobbyPlayers.length) {
    game.lobbyPlayers = [{ name: 'HOST', role: 'SURVIVOR', ready: false, isHost: true }];
  }
  if (lobbyMenu) {
    lobbyMenu.classList.remove('hidden');
  }
  if (multiplayerMenu) {
    multiplayerMenu.classList.add('hidden');
  }
  if (menuOverlay) {
    menuOverlay.classList.add('hidden');
  }
  if (lobbyRoomCode) {
    lobbyRoomCode.textContent = game.roomCode || 'NIGHT';
  }
  updateLobbyStatus();
}

function closeLobbyMenu() {
  if (lobbyMenu) {
    lobbyMenu.classList.add('hidden');
  }
  if (menuOverlay) {
    menuOverlay.classList.remove('hidden');
  }
  stopLobbyMusic();
  closeNetwork();
}

function ensureLobbySlots() {
  if (!lobbySlotsContainer) return;

  while (lobbySlots.length < MAX_PLAYERS) {
    const index = lobbySlots.length;
    const slot = document.createElement('div');
    slot.className = 'player-slot slot-survivor';
    slot.dataset.slot = String(index);
    slot.innerHTML = `<div class="slot-head"><span class="slot-label">PLAYER ${index + 1}</span><span class="slot-status waiting">WAITING</span></div><div class="slot-name">WAITING</div><div class="slot-meta"><span class="slot-ready not-ready">NOT READY</span></div>`;
    lobbySlotsContainer.append(slot);
    lobbySlots.push(slot);
  }
}

function updateLobbyStatus() {
  ensureLobbySlots();
  const mapLabel = game.map === 'b' ? 'BACKROOMS' : game.map === 'h' ? 'HILLS' : 'FOREST';
  if (lobbyMapName) {
    lobbyMapName.textContent = mapLabel;
  }
  if (lobbyRoomCode) {
    lobbyRoomCode.textContent = game.roomCode || 'NIGHT';
  }
  if (lobbyStatusText) {
    const playerCount = Math.max(1, game.lobbyPlayers.length || 1);
    const text = `${playerCount}/${MAX_PLAYERS} JÁTÉKOS`;
    lobbyStatusText.textContent = text;
  }

  if (readyLobbyButton) {
    readyLobbyButton.textContent = game.lobbyReady ? 'NOT READY' : 'READY';
    readyLobbyButton.classList.toggle('ready-on', game.lobbyReady);
  }
  if (startLobbyButton) {
    startLobbyButton.disabled = !network.isHost || !network.connected;
  }

  if (!lobbySlots.length) return;

  const players = game.lobbyPlayers.length ? game.lobbyPlayers : [{
    name: 'HOST',
    role: 'SURVIVOR',
    ready: false,
    isHost: true,
  }];

  lobbySlots.forEach((slot, index) => {
    const player = players[index] || { name: 'WAITING', role: 'SURVIVOR', ready: false, isHost: false };
    slot.classList.add('slot-survivor');

    const slotName = slot.querySelector('.slot-name');
    const readyChip = slot.querySelector('.slot-ready');
    const slotStatus = slot.querySelector('.slot-status');

    if (slotName) {
      slotName.textContent = player.name || 'WAITING';
    }
    if (readyChip) {
      readyChip.textContent = player.ready ? 'READY' : 'NOT READY';
      readyChip.classList.toggle('ready', player.ready);
      readyChip.classList.toggle('not-ready', !player.ready);
    }
    if (slotStatus) {
      slotStatus.textContent = player.name === 'WAITING' ? 'WAITING' : 'CONNECTED';
      slotStatus.classList.toggle('waiting', player.name === 'WAITING');
      slotStatus.classList.toggle('online', player.name !== 'WAITING');
    }
  });
}

function openMapMenu() {
  if (mapMenu) {
    mapMenu.classList.remove('hidden');
  }
  if (menuOverlay) {
    menuOverlay.classList.add('hidden');
  }
  if (canvas) {
    canvas.style.pointerEvents = 'none';
  }
}

function closeMapMenu() {
  if (mapMenu) {
    mapMenu.classList.add('hidden');
  }
  if (menuOverlay) {
    menuOverlay.classList.remove('hidden');
  }
}

function openOfflineMapSelection() {
  closeNetwork();
  network.isHost = false;
  game.multiplayer = false;
  game.map = 'f';
  openMapMenu();
}

function normalizeMapKey(key) {
  if (!key) return 'f';
  if (key === 'b' || key === 'backrooms' || key === 'Backrooms') return 'b';
  if (key === 'h' || key === 'hills' || key === 'HILLS' || key === 'Hill' || key === 'house') return 'h';
  if (key === 'f' || key === 'forest' || key === 'Forest' || key === 'FOREST') return 'f';
  return 'f';
}

function chooseMap(key) {
  if (game.multiplayer && !network.isHost) {
    showMessage('CSAK A HOST VÁLASZTHAT PÁLYÁT');
    return;
  }
  const normalized = normalizeMapKey(key);
  game.map = normalized;
  closeMapMenu();
  if (game.multiplayer) {
    sendLobbyState();
    if (lobbyMenu) lobbyMenu.classList.remove('hidden');
    updateLobbyStatus();
    return;
  }
  openCharacterMenu();
  updateMapAudio();
}

function openCharacterMenu() {
  if (characterMenu) {
    characterMenu.classList.remove('hidden');
  }
  if (mapMenu) {
    mapMenu.classList.add('hidden');
  }
  if (menuOverlay) {
    menuOverlay.classList.add('hidden');
  }
  if (canvas) {
    canvas.style.pointerEvents = 'none';
  }
}

function closeCharacterMenu() {
  if (characterMenu) {
    characterMenu.classList.add('hidden');
  }
  if (menuOverlay) {
    menuOverlay.classList.remove('hidden');
  }
  if (canvas) {
    canvas.style.pointerEvents = 'auto';
  }
}

function chooseCharacter(key) {
  if (!characterOptions[key]) return;
  game.selectedCharacter = key;
  if (killerFaceImage && characterOptions[key].image) {
    killerFaceImage.src = characterOptions[key].image;
  }
  closeCharacterMenu();
  if (canvas) {
    canvas.style.pointerEvents = 'auto';
  }
  startGame();
}

function makeRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function makePeer(id) {
  if (!window.Peer) {
    showMessage('PEERJS NEM TÖLTÖTT BE');
    return null;
  }
  return new window.Peer(id, { host: '0.peerjs.com', port: 443, path: '/', secure: true });
}

function closeNetwork() {
  if (network.stateTimer) clearInterval(network.stateTimer);
  network.stateTimer = null;
  network.connections.forEach((connection) => connection.close());
  network.connections = [];
  if (network.connection) network.connection.close();
  network.connection = null;
  if (network.peer) network.peer.destroy();
  network.peer = null;
  network.connected = false;
  network.remotePlayers = Object.create(null);
}

function sendToHost(data) {
  if (network.connection?.open) network.connection.send(data);
}

function broadcastToClients(data, except = null) {
  network.connections.forEach((connection) => {
    if (connection !== except && connection.open) connection.send(data);
  });
}

function sendLobbyState() {
  if (!network.isHost) return;
  broadcastToClients({ type: 'lobby', roomCode: game.roomCode, map: game.map, players: game.lobbyPlayers });
}

function handleNetworkData(data, connection) {
  if (!data || typeof data.type !== 'string') return;

  if (network.isHost && data.type === 'join') {
    if (game.lobbyPlayers.length >= MAX_PLAYERS) {
      connection.send({ type: 'error', message: 'TELE A SZOBA' });
      connection.close();
      return;
    }
    const player = { id: connection.peer, name: String(data.name || 'FRIEND').slice(0, 16), role: 'SURVIVOR', ready: false, isHost: false };
    connection.player = player;
    game.lobbyPlayers.push(player);
    updateLobbyStatus();
    sendLobbyState();
    return;
  }

  if (network.isHost && data.type === 'ready' && connection.player) {
    connection.player.ready = Boolean(data.ready);
    const player = game.lobbyPlayers.find((entry) => entry.id === connection.peer);
    if (player) player.ready = connection.player.ready;
    updateLobbyStatus();
    sendLobbyState();
    return;
  }

  if (network.isHost && data.type === 'player-state' && connection.player) {
    network.remotePlayers[connection.peer] = { ...data.player, name: connection.player.name, role: 'SURVIVOR' };
    broadcastToClients({ type: 'remote-player', id: connection.peer, player: network.remotePlayers[connection.peer] }, connection);
    return;
  }

  if (!network.isHost && data.type === 'lobby') {
    game.roomCode = data.roomCode;
    game.map = normalizeMapKey(data.map);
    game.lobbyPlayers = data.players || [];
    game.lobbyReady = Boolean(game.lobbyPlayers.find((player) => player.id === network.peer?.id)?.ready);
    updateLobbyStatus();
    return;
  }

  if (!network.isHost && data.type === 'remote-player') {
    network.remotePlayers[data.id] = data.player;
    return;
  }

  if (!network.isHost && data.type === 'match-start') {
    game.map = normalizeMapKey(data.map);
    game.multiplayer = true;
    startGame();
    game.world = data.world;
    game.exit = data.exit;
    game.relics = data.relics;
    game.totalRelics = data.relics.length;
    game.collected = data.collected || 0;
    updateHud();
    startNetworkStateSync();
    return;
  }

  if (data.type === 'match-state' && !network.isHost) {
    network.remotePlayers[data.hostId || 'HOST'] = { ...data.player, name: 'HOST', role: 'SURVIVOR' };
    game.relics = data.relics;
    game.collected = data.collected;
    game.time = data.time;
    updateHud();
    return;
  }

  if (data.type === 'error') showMessage(data.message || 'KAPCSOLÓDÁSI HIBA');
}

function attachHostConnection(connection) {
  network.connections.push(connection);
  connection.on('open', () => {
    network.connected = true;
  });
  connection.on('data', (data) => handleNetworkData(data, connection));
  connection.on('close', () => {
    network.connections = network.connections.filter((entry) => entry !== connection);
    game.lobbyPlayers = game.lobbyPlayers.filter((entry) => entry.id !== connection.peer);
    delete network.remotePlayers[connection.peer];
    network.connected = network.connections.some((entry) => entry.open);
    updateLobbyStatus();
    sendLobbyState();
  });
  connection.on('error', () => showMessage('KLIENS KAPCSOLATI HIBA'));
}

function startNetworkStateSync() {
  if (network.stateTimer) clearInterval(network.stateTimer);
  network.stateTimer = setInterval(() => {
    if (!game.player || game.mode !== 'game') return;
    const player = { x: game.player.x, y: game.player.y, angle: game.player.angle };
    if (network.isHost) {
      broadcastToClients({ type: 'match-state', hostId: network.peer?.id, player, relics: game.relics, collected: game.collected, time: game.time });
    } else {
      sendToHost({ type: 'player-state', player });
    }
  }, 80);
}

function hostCreateRoom() {
  closeNetwork();
  network.isHost = true;
  game.roomCode = makeRoomCode();
  game.multiplayer = true;
  game.map = 'f';
  game.selectedCharacter = 'boti';
  game.lobbyPlayers = [{ name: 'HOST', role: 'SURVIVOR', ready: false, isHost: true }];
  if (joinCodeInput) joinCodeInput.value = '';
  if (killerFaceImage && characterOptions.boti?.image) killerFaceImage.src = characterOptions.boti.image;
  network.peer = makePeer(game.roomCode);
  if (!network.peer) return;
  network.peer.on('open', (id) => {
    game.roomCode = id;
    openLobbyMenu();
    showMessage(`SZOBA KÉSZ: ${id}`);
  });
  network.peer.on('connection', attachHostConnection);
  network.peer.on('error', (error) => {
    showMessage(error.type === 'unavailable-id' ? 'KÓD FOGLALT, PRÓBÁLD ÚJRA' : 'HOST KAPCSOLATI HIBA');
    closeNetwork();
  });
  network.peer.on('disconnected', () => showMessage('MEGSZAKADT A SZERVERKAPCSOLAT'));
}

function joinMultiplayerByCode() {
  const entered = (joinCodeInput?.value || '').trim().toUpperCase();
  if (!entered) {
    showMessage('ÍRD BE A KÓDOT');
    return;
  }
  closeNetwork();
  network.isHost = false;
  game.multiplayer = true;
  game.roomCode = entered;
  game.selectedCharacter = 'sanyi';
  game.lobbyPlayers = [];
  network.peer = makePeer();
  if (!network.peer) return;
  network.peer.on('open', () => {
    network.connection = network.peer.connect(entered, { reliable: true });
    network.connection.on('open', () => {
      network.connected = true;
      network.connection.send({ type: 'join', name: 'FRIEND' });
      openLobbyMenu();
      showMessage('CSATLAKOZVA');
    });
    network.connection.on('data', (data) => handleNetworkData(data, network.connection));
    network.connection.on('close', () => {
      network.connected = false;
      showMessage('A HOST KILÉPETT');
    });
    network.connection.on('error', () => showMessage('NEM SIKERÜLT CSATLAKOZNI'));
  });
  network.peer.on('error', (error) => {
    showMessage(error.type === 'peer-unavailable' ? 'NEM TALÁLHATÓ A SZOBA' : 'KAPCSOLÓDÁSI HIBA');
    closeNetwork();
  });
}

function showMessage(text) {
  message.textContent = text;
  message.classList.remove('hidden');
  clearTimeout(showMessage.timer);
  showMessage.timer = setTimeout(() => message.classList.add('hidden'), 1300);
}

function ensureAudio() {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return;
  if (!sound.ctx) {
    sound.ctx = new AudioContextCtor();
    sound.master = sound.ctx.createGain();
    sound.master.gain.setValueAtTime(0.26, sound.ctx.currentTime);
    sound.master.connect(sound.ctx.destination);
  }
  if (sound.ctx.state === 'suspended') {
    sound.ctx.resume();
  }
}

function playTone(freq, duration = 0.12, volume = 0.022, type = 'triangle') {
  if (!sound.ctx || !sound.master) return;
  const now = sound.ctx.currentTime;
  const oscillator = sound.ctx.createOscillator();
  const gain = sound.ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.setTargetAtTime(volume, now, 0.02);
  gain.gain.setTargetAtTime(0.0001, now + duration, 0.04);

  oscillator.connect(gain);
  gain.connect(sound.master);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

function playLampClick() {
  ensureAudio();
  if (!sound.ctx || !sound.master) return;
  playTone(850, 0.035, 0.02, 'square');
  playTone(510, 0.04, 0.015, 'square');
}

function startLobbyMusic() {
  ensureAudio();
  if (!sound.ctx || !sound.master || sound.musicTimer) return;

  const melody = [146.83, 164.81, 196.0, 220.0, 246.94, 196.0, 174.61, 146.83];
  sound.musicTimer = setInterval(() => {
    if (!sound.ctx || !sound.master) return;
    const freq = melody[sound.musicStep % melody.length];
    playTone(freq, 0.16, 0.013, 'triangle');
    playTone(freq / 2, 0.2, 0.01, 'sine');
    sound.musicStep += 1;
  }, 300);
}

function startSoundtrack() {
  ensureAudio();
  if (!sound.ctx || !sound.master || sound.soundtrackTimer) return;

  const melody = [110, 123.47, 146.83, 164.81, 174.61, 164.81, 146.83, 123.47];
  sound.soundtrackTimer = setInterval(() => {
    if (!sound.ctx || !sound.master) return;
    const freq = melody[sound.soundtrackStep % melody.length];
    playTone(freq, 0.2, 0.011, 'triangle');
    playTone(freq / 2, 0.24, 0.008, 'sine');
    sound.soundtrackStep += 1;
  }, 480);
}

function stopSoundtrack() {
  if (sound.soundtrackTimer) {
    clearInterval(sound.soundtrackTimer);
    sound.soundtrackTimer = null;
  }
}

function stopLobbyMusic() {
  if (sound.musicTimer) {
    clearInterval(sound.musicTimer);
    sound.musicTimer = null;
  }
}

function makeRainNoiseBuffer() {
  if (!sound.ctx || !sound.master || sound.rainBuffer) return;

  const sampleRate = sound.ctx.sampleRate;
  const duration = 2;
  const buffer = sound.ctx.createBuffer(1, sampleRate * duration, sampleRate);
  const channel = buffer.getChannelData(0);

  for (let i = 0; i < channel.length; i += 1) {
    channel[i] = (Math.random() * 2 - 1) * 0.46;
  }

  sound.rainBuffer = buffer;
}

function startRain() {
  ensureAudio();
  if (!sound.ctx || !sound.master || sound.rainEnabled) return;

  makeRainNoiseBuffer();
  if (!sound.rainBuffer) return;

  sound.rainSource = sound.ctx.createBufferSource();
  sound.rainSource.buffer = sound.rainBuffer;
  sound.rainSource.loop = true;

  sound.rainGain = sound.ctx.createGain();
  sound.rainGain.gain.setValueAtTime(0.0001, sound.ctx.currentTime);
  sound.rainGain.gain.setTargetAtTime(0.12, sound.ctx.currentTime, 0.8);

  sound.rainSource.connect(sound.rainGain).connect(sound.master);
  sound.rainSource.start();
  sound.rainEnabled = true;
}

function stopRain() {
  if (!sound.ctx || !sound.rainSource || !sound.rainGain) return;

  const now = sound.ctx.currentTime;
  sound.rainGain.gain.setTargetAtTime(0.0001, now, 0.08);
  setTimeout(() => {
    try {
      sound.rainSource.stop();
    } catch {
      // Source may already be stopped by the browser.
    }
    sound.rainSource.disconnect();
    sound.rainSource = null;
    sound.rainGain.disconnect();
    sound.rainGain = null;
    sound.rainEnabled = false;
  }, 120);
}

function startLampTicks() {
  ensureAudio();
  if (!sound.ctx || !sound.master || sound.lampTimer) return;

  sound.lampTimer = setInterval(() => {
    if (!sound.ctx || !sound.master) return;
    playLampClick();
  }, 1800 + Math.random() * 800);
}

function stopLampTicks() {
  if (sound.lampTimer) {
    clearInterval(sound.lampTimer);
    sound.lampTimer = null;
  }
}

function updateMapAudio() {
  ensureAudio();
  if (!sound.ctx || !sound.master) return;

  if (game.mode === 'game' && (game.map === 'f' || game.map === 'b')) {
    startRain();
    if (game.map === 'b') {
      startLampTicks();
    } else {
      stopLampTicks();
    }
  } else {
    stopRain();
    stopLampTicks();
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalizeAngle(a) {
  while (a < -Math.PI) a += Math.PI * 2;
  while (a > Math.PI) a -= Math.PI * 2;
  return a;
}

function wallAt(x, y) {
  const cellX = Math.floor(x);
  const cellY = Math.floor(y);
  if (cellX < 0 || cellY < 0 || cellX >= game.worldSize || cellY >= game.worldSize) return true;
  return game.world[cellY][cellX] > 0;
}

function moveEntity(entity, dx, dy) {
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 0.02));
  const stepX = dx / steps;
  const stepY = dy / steps;
  const radius = entity === game.player ? 0.08 : 0.1;
  const blocked = (x, y) => {
    const minX = Math.floor(x - radius);
    const maxX = Math.floor(x + radius);
    const minY = Math.floor(y - radius);
    const maxY = Math.floor(y + radius);

    for (let cellY = minY; cellY <= maxY; cellY += 1) {
      for (let cellX = minX; cellX <= maxX; cellX += 1) {
        if (!wallAt(cellX + 0.5, cellY + 0.5)) continue;
        const nearestX = clamp(x, cellX, cellX + 1);
        const nearestY = clamp(y, cellY, cellY + 1);
        const offsetX = x - nearestX;
        const offsetY = y - nearestY;
        if (offsetX * offsetX + offsetY * offsetY < radius * radius) return true;
      }
    }
    return false;
  };

  for (let step = 0; step < steps; step += 1) {
    const nextX = entity.x + stepX;
    const nextY = entity.y + stepY;
    const movedX = !blocked(nextX, entity.y);
    const movedY = !blocked(entity.x, nextY);
    if (movedX) entity.x = nextX;
    if (movedY) entity.y = nextY;

    if (!movedX && movedY && !blocked(entity.x + stepX, entity.y)) entity.x += stepX;
    if (!movedY && movedX && !blocked(entity.x, entity.y + stepY)) entity.y += stepY;
  }
}

function hasLineOfSight(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const steps = Math.max(8, Math.ceil(Math.hypot(dx, dy) * 12));

  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const x = a.x + dx * t;
    const y = a.y + dy * t;
    if (wallAt(x, y)) {
      return false;
    }
  }

  return true;
}

function randomOpenCell(map, padding = 1) {
  const candidates = [];
  for (let y = padding; y < game.worldSize - padding; y += 1) {
    for (let x = padding; x < game.worldSize - padding; x += 1) {
      if (map[y][x] === 0) {
        candidates.push({ x: x + 0.5, y: y + 0.5 });
      }
    }
  }

  if (!candidates.length) {
    return { x: 1.7, y: 1.7 };
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function randomHillsStreetCell(map) {
  const candidates = [];
  for (let y = 2; y < game.worldSize - 2; y += 1) {
    for (let x = 2; x < game.worldSize - 2; x += 1) {
      if (map[y][x] !== 0) continue;
      let besideHouse = false;
      for (let offsetY = -2; offsetY <= 2 && !besideHouse; offsetY += 1) {
        for (let offsetX = -2; offsetX <= 2; offsetX += 1) {
          if (map[y + offsetY][x + offsetX] === 2) {
            besideHouse = true;
            break;
          }
        }
      }
      if (!besideHouse) candidates.push({ x: x + 0.5, y: y + 0.5 });
    }
  }

  return candidates.length
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : randomOpenCell(map, 1);
}

function makeRandomMaze(size, loopChance) {
  const map = Array.from({ length: size }, () => Array(size).fill(1));
  const visited = new Set(['1,1']);
  const stack = [{ x: 1, y: 1 }];
  const directions = [[2, 0], [-2, 0], [0, 2], [0, -2]];
  map[1][1] = 0;

  while (stack.length) {
    const current = stack[stack.length - 1];
    const options = directions
      .map(([dx, dy]) => ({ x: current.x + dx, y: current.y + dy, dx, dy }))
      .filter((next) => next.x > 0 && next.x < size - 1 && next.y > 0 && next.y < size - 1)
      .filter((next) => !visited.has(`${next.x},${next.y}`));

    if (!options.length) {
      stack.pop();
      continue;
    }

    const next = options[Math.floor(Math.random() * options.length)];
    visited.add(`${next.x},${next.y}`);
    map[current.y + next.dy / 2][current.x + next.dx / 2] = 0;
    map[next.y][next.x] = 0;
    stack.push({ x: next.x, y: next.y });
  }

  for (let y = 1; y < size - 1; y += 1) {
    for (let x = 1; x < size - 1; x += 1) {
      if (map[y][x] !== 1 || Math.random() >= loopChance) continue;
      const adjacentOpen = Number(map[y - 1][x] === 0)
        + Number(map[y + 1][x] === 0)
        + Number(map[y][x - 1] === 0)
        + Number(map[y][x + 1] === 0);
      if (adjacentOpen >= 2) map[y][x] = 0;
    }
  }

  return map;
}

function makeMapBackrooms() {
  return makeRandomMaze(game.worldSize, 0.2);
}

function makeMapForest() {
  return makeRandomMaze(game.worldSize, 0.4);
}

function makeMapHills() {
  const size = game.worldSize;
  const map = Array.from({ length: size }, () => Array(size).fill(0));

  for (let y = 6; y + 5 < size - 2; y += 13) {
    for (let x = 6; x + 5 < size - 2; x += 13) {
      const houseX = x + Math.floor(Math.random() * 3) - 1;
      const houseY = y + Math.floor(Math.random() * 3) - 1;
      const houseWidth = 3;
      const houseHeight = 3;
      const doorSide = Math.floor(Math.random() * 4);

      for (let offset = 0; offset < houseWidth; offset += 1) {
        map[houseY][houseX + offset] = 2;
        map[houseY + houseHeight - 1][houseX + offset] = 2;
      }
      for (let offset = 0; offset < houseHeight; offset += 1) {
        map[houseY + offset][houseX] = 2;
        map[houseY + offset][houseX + houseWidth - 1] = 2;
      }

      const doorOffsetX = Math.floor((houseWidth - 2) / 2);
      const doorOffsetY = Math.floor((houseHeight - 2) / 2);
      if (doorSide === 0 || doorSide === 1) {
        const doorY = doorSide === 0 ? houseY : houseY + houseHeight - 1;
        map[doorY][houseX + doorOffsetX] = 0;
        map[doorY][houseX + doorOffsetX + 1] = 0;
      } else {
        const doorX = doorSide === 2 ? houseX : houseX + houseWidth - 1;
        map[houseY + doorOffsetY][doorX] = 0;
        map[houseY + doorOffsetY + 1][doorX] = 0;
      }
    }
  }

  return map;
}

function makeMap() {
  if (game.map === 'b') return makeMapBackrooms();
  if (game.map === 'h') return makeMapHills();
  return makeMapForest();
}

function resetGame() {
  game.world = makeMap();
  game.nextbotImageIndex = (game.nextbotImageIndex + 1) % nextbotImages.length;

  const playerSpawn = game.map === 'h'
    ? randomHillsStreetCell(game.world)
    : randomOpenCell(game.world, 1);
  const spawnCellX = Math.floor(playerSpawn.x);
  const spawnCellY = Math.floor(playerSpawn.y);
  const openDirections = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ].filter(({ x, y }) => game.world[spawnCellY + y]?.[spawnCellX + x] === 0);
  const initialDirection = openDirections[Math.floor(Math.random() * openDirections.length)] || { x: 1, y: 0 };
  const monsterSpawn = randomOpenCell(game.world, 1);
  const exitSpot = randomOpenCell(game.world, 1);

  game.spawn = {
    player: { x: playerSpawn.x, y: playerSpawn.y },
    monster: { x: monsterSpawn.x, y: monsterSpawn.y },
  };

  game.player = {
    x: playerSpawn.x,
    y: playerSpawn.y,
    angle: Math.atan2(initialDirection.y, initialDirection.x),
    speed: 2.2,
    health: 3,
  };
  game.monster = {
    x: monsterSpawn.x,
    y: monsterSpawn.y,
    imageIndex: game.nextbotImageIndex,
    angle: Math.PI,
    speed: 0.82,
    stunnedUntil: 0,
    roamTarget: null,
    nextRoamAt: 0,
    state: 'patrol',
    aiTimer: 0,
    moveBias: 0,
  };
  game.exit = { x: exitSpot.x, y: exitSpot.y };

  const relicPositions = [
    randomOpenCell(game.world, 1),
    randomOpenCell(game.world, 1),
    randomOpenCell(game.world, 1),
  ];

  game.relics = [
    { x: relicPositions[0].x, y: relicPositions[0].y, name: 'KULCS', collected: false },
    { x: relicPositions[1].x, y: relicPositions[1].y, name: 'LÁMPA', collected: false },
    { x: relicPositions[2].x, y: relicPositions[2].y, name: 'FÉNYGÖMB', collected: false },
  ];

  game.collected = 0;
  game.time = 0;
  game.lightningTimer = 1.2;
  game.lightningFlash = 0;
  game.jumpScareTimer = 0;
  game.rain = Array.from({ length: 420 }, () => ({
    x: Math.random() * 1.5,
    y: Math.random() * 1.5,
    speed: 0.6 + Math.random() * 0.9,
    length: 12 + Math.random() * 26,
  }));
  updateObjectiveText();
  updateHud();
  saveGame();
}

function saveGame() {
  const data = {
    player: game.player,
    monster: game.monster,
    relics: game.relics,
    collected: game.collected,
    time: game.time,
    map: game.map,
    multiplayer: game.multiplayer,
  };
  localStorage.setItem('forest-save', JSON.stringify(data));
}

function loadSave() {
  try {
    const raw = localStorage.getItem('forest-save');
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || !data.player) return false;
    game.player = data.player;
    game.monster = data.monster;
    game.nextbotImageIndex = Number.isInteger(data.monster?.imageIndex) ? data.monster.imageIndex : game.nextbotImageIndex;
    game.relics = data.relics || [];
    game.collected = data.collected || 0;
    game.time = data.time || 0;
    game.map = normalizeMapKey(data.map);
    game.multiplayer = Boolean(data.multiplayer);
    return true;
  } catch {
    return false;
  }
}

function startGame() {
  ensureAudio();
  if (!network.connected) game.multiplayer = false;
  stopLobbyMusic();
  menuOverlay.classList.add('hidden');
  if (lobbyMenu) lobbyMenu.classList.add('hidden');
  if (multiplayerMenu) multiplayerMenu.classList.add('hidden');
  if (mapMenu) mapMenu.classList.add('hidden');
  if (characterMenu) characterMenu.classList.add('hidden');
  hud.classList.remove('hidden');
  game.mode = 'game';
  if (canvas) {
    canvas.style.pointerEvents = 'auto';
  }
  if (localStorage.getItem('forest-save') && menuButtons[1].dataset.action === 'continue') {
    const loaded = loadSave();
    if (loaded) {
      showMessage('FOLYTATÁS');
      updateObjectiveText();
      updateHud();
      return;
    }
  }
  resetGame();
  updateMapAudio();
  showMessage('KÍSÉRTETÉS');
}

function continueGame() {
  if (loadSave()) {
    menuOverlay.classList.add('hidden');
    hud.classList.remove('hidden');
    game.mode = 'game';
    goalText();
    showMessage('FOLYTATÁS');
    return;
  }
  resetGame();
  startGame();
}

function exitToMenu() {
  game.mode = 'menu';
  menuOverlay.classList.remove('hidden');
  hud.classList.add('hidden');
  message.classList.add('hidden');
}

function updateObjectiveText() {
  if (!objectiveBulbs.length) return;

  const collected = Math.min(game.collected || 0, objectiveBulbs.length);
  objectiveBulbs.forEach((bulb, index) => {
    bulb.classList.toggle('active', index < collected);
  });
}

function goalText() {
  updateObjectiveText();
}

function updateHud() {
  const health = game.player ? game.player.health : 3;
  const hearts = Array.from({ length: 3 }, (_, i) => (i < health ? '♥' : '♡')).join(' ');
  healthLabel.textContent = hearts;
  updateObjectiveText();
}

function raycast(px, py, angle) {
  const directionX = Math.cos(angle);
  const directionY = Math.sin(angle);
  let mapX = Math.floor(px);
  let mapY = Math.floor(py);
  const deltaX = directionX === 0 ? Infinity : Math.abs(1 / directionX);
  const deltaY = directionY === 0 ? Infinity : Math.abs(1 / directionY);
  const stepX = directionX < 0 ? -1 : 1;
  const stepY = directionY < 0 ? -1 : 1;
  let sideX = deltaX === Infinity ? Infinity : (directionX < 0 ? px - mapX : mapX + 1 - px) * deltaX;
  let sideY = deltaY === Infinity ? Infinity : (directionY < 0 ? py - mapY : mapY + 1 - py) * deltaY;

  while (mapX >= 0 && mapY >= 0 && mapX < game.worldSize && mapY < game.worldSize) {
    let distance;
    if (sideX < sideY) {
      distance = sideX;
      sideX += deltaX;
      mapX += stepX;
    } else {
      distance = sideY;
      sideY += deltaY;
      mapY += stepY;
    }
    if (game.world[mapY]?.[mapX] > 0) return distance;
  }

  return Math.hypot(game.worldSize, game.worldSize);
}

function drawNightMoon(width, height, xRatio = 0.76) {
  const moonX = width * xRatio;
  const moonY = height * 0.18;
  const glow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, height * 0.34);
  glow.addColorStop(0, 'rgba(232, 239, 213, 0.32)');
  glow.addColorStop(0.25, 'rgba(201, 220, 207, 0.12)');
  glow.addColorStop(1, 'rgba(201, 220, 207, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(moonX - height * 0.34, moonY - height * 0.34, height * 0.68, height * 0.68);
  ctx.fillStyle = '#d9dfca';
  ctx.beginPath();
  ctx.arc(moonX, moonY, Math.max(12, height * 0.035), 0, Math.PI * 2);
  ctx.fill();
}

function drawNightStars(width, height) {
  ctx.fillStyle = 'rgba(225, 237, 225, 0.48)';
  for (let star = 0; star < 42; star += 1) {
    const x = (star * 197.3) % width;
    const y = (star * 61.7) % (height * 0.42);
    const radius = star % 7 === 0 ? 1.6 : 0.8;
    ctx.fillRect(x, y, radius, radius);
  }
}

function drawForestBackground() {
  const width = canvas.width;
  const height = canvas.height;

  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  sky.addColorStop(0, '#030609');
  sky.addColorStop(0.52, '#0b1516');
  sky.addColorStop(1, '#18251d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  drawNightStars(width, height);
  drawNightMoon(width, height, 0.77);

  const horizon = height * 0.64;
  const ground = ctx.createLinearGradient(0, horizon, 0, height);
  ground.addColorStop(0, '#17251b');
  ground.addColorStop(1, '#030605');
  ctx.fillStyle = ground;
  ctx.fillRect(0, horizon, width, height - horizon);
}

function drawBackroomsBackground() {
  const width = canvas.width;
  const height = canvas.height;

  const ceiling = ctx.createLinearGradient(0, 0, 0, height * 0.43);
  ceiling.addColorStop(0, '#66583d');
  ceiling.addColorStop(1, '#b8a16a');
  ctx.fillStyle = ceiling;
  ctx.fillRect(0, 0, width, height * 0.5);

  ctx.fillStyle = '#b8a36f';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.34);
  ctx.lineTo(width * 0.5, height * 0.43);
  ctx.lineTo(width, height * 0.34);
  ctx.lineTo(width, height * 0.68);
  ctx.lineTo(0, height * 0.68);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(75, 61, 39, 0.46)';
  ctx.lineWidth = Math.max(2, width * 0.003);
  for (let seam = -3; seam <= 3; seam += 1) {
    const x = width * (0.5 + seam * 0.1);
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.43);
    ctx.lineTo(x, height * 0.68);
    ctx.stroke();
  }

  const floor = ctx.createLinearGradient(0, height * 0.68, 0, height);
  floor.addColorStop(0, '#766346');
  floor.addColorStop(1, '#30291f');
  ctx.fillStyle = floor;
  ctx.fillRect(0, height * 0.68, width, height * 0.32);
}

function drawHillsBackground() {
  const width = canvas.width;
  const height = canvas.height;
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#04070b');
  sky.addColorStop(0.46, '#111b24');
  sky.addColorStop(0.72, '#10171a');
  sky.addColorStop(1, '#080b09');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
  drawNightStars(width, height);
  drawNightMoon(width, height, 0.72);
}

function drawBackground() {
  if (game.map === 'b') return drawBackroomsBackground();
  if (game.map === 'h') return drawHillsBackground();
  return drawForestBackground();
}

function renderWalls() {
  if (!game.player) return;

  const width = canvas.width;
  const height = canvas.height;
  const fov = Math.PI / 2.8;
  const numRays = Math.min(280, width);

  for (let i = 0; i < numRays; i++) {
    const ratio = i / numRays;
    const rayAngle = game.player.angle - fov / 2 + ratio * fov;
    const dist = raycast(game.player.x, game.player.y, rayAngle);
    if (dist >= Math.hypot(game.worldSize, game.worldSize)) continue;
    const corrected = dist * Math.cos(rayAngle - game.player.angle);
    const wallHeight = clamp((height / (corrected + 0.0001)) * 0.9, 0, height * 0.95);
    const top = height / 2 - wallHeight / 2;
    const shade = clamp(1 - corrected / 10, 0.2, 1);

    const x = (i / numRays) * width;
    const sliceWidth = Math.max(1, width / numRays);

    const hitX = game.player.x + Math.cos(rayAngle) * (dist + 0.0001);
    const hitY = game.player.y + Math.sin(rayAngle) * (dist + 0.0001);
    const hitCell = game.world[Math.floor(hitY)]?.[Math.floor(hitX)] || 1;

    const wallTexture = game.map === 'b'
      ? backroomsAtmosphereImage
      : game.map === 'f'
        ? forestAtmosphereImage
        : game.map === 'h' && hitCell === 2
          ? hillsHouseTexture
          : null;
    const textureWidth = wallTexture?.naturalWidth || wallTexture?.width || 0;
    const textureHeight = wallTexture?.naturalHeight || wallTexture?.height || 0;
    const textureReady = wallTexture && wallTexture.complete !== false && textureWidth > 0 && textureHeight > 0;

    if (textureReady) {
      const textureU = Math.abs(Math.cos(rayAngle)) > Math.abs(Math.sin(rayAngle))
        ? hitY - Math.floor(hitY)
        : hitX - Math.floor(hitX);
      const textureX = Math.min(textureWidth - 1, Math.floor(textureU * textureWidth));
      ctx.drawImage(wallTexture, textureX, 0, 1, textureHeight, x, top, sliceWidth + 1, wallHeight);
      ctx.fillStyle = `rgba(0, 0, 0, ${0.14 + (1 - shade) * 0.58})`;
      ctx.fillRect(x, top, sliceWidth + 1, wallHeight);
    } else if (game.map === 'f') {
      ctx.fillStyle = `rgba(27, 23, 18, ${0.58 + shade * 0.18})`;
      ctx.fillRect(x, top + wallHeight * 0.28, sliceWidth + 1, wallHeight * 0.72);
      ctx.fillStyle = `rgba(20, 42, 24, ${0.5 + shade * 0.38})`;
      ctx.fillRect(x - 3, top + wallHeight * 0.02, sliceWidth + 7, wallHeight * 0.35);
      ctx.fillStyle = `rgba(9, 17, 11, ${0.18 + (1 - shade) * 0.48})`;
      ctx.fillRect(x, top, sliceWidth + 1, wallHeight);
    } else {
      const wallColor = game.map === 'b' ? [119, 99, 61] : [46, 58, 49];
      const darkness = 0.48 + (1 - shade) * 0.35;
      ctx.fillStyle = `rgb(${Math.floor(wallColor[0] * (1 - darkness))}, ${Math.floor(wallColor[1] * (1 - darkness))}, ${Math.floor(wallColor[2] * (1 - darkness))})`;
      ctx.fillRect(x, top, sliceWidth + 1, wallHeight);
    }
  }
}

function drawSprite(sprite, colorA, colorB, sizeScale = 1) {
  const width = canvas.width;
  const height = canvas.height;
  const dx = sprite.x - game.player.x;
  const dy = sprite.y - game.player.y;
  const dist = Math.hypot(dx, dy) || 0.0001;
  const angleToSprite = normalizeAngle(Math.atan2(dy, dx) - game.player.angle);
  const fov = Math.PI / 2.8;

  if (Math.abs(angleToSprite) > fov * 0.75 || dist < 0.5 || !hasLineOfSight(game.player, sprite)) return;

  const screenX = width * (0.5 + angleToSprite / fov);
  const size = clamp((height / dist) * 0.74 * sizeScale, 20, height * 0.85);
  const groundY = height * 0.88;

  ctx.save();
  ctx.translate(screenX, groundY);

  const faceWidth = size;
  const faceHeight = size * 1.12;
  const imageX = -faceWidth * 0.5;
  const imageY = -faceHeight;
  const faceImage = getNextbotImage(sprite.imageIndex);

  if (faceImage.complete && faceImage.naturalWidth) {
    const imgW = faceImage.naturalWidth;
    const imgH = faceImage.naturalHeight;
    const srcX = Math.round(imgW * 0.04);
    const srcY = Math.round(imgH * 0.05);
    const srcW = Math.max(1, Math.round(imgW * 0.92));
    const srcH = Math.max(1, Math.round(imgH * 0.90));
    ctx.drawImage(faceImage, srcX, srcY, srcW, srcH, imageX, imageY, faceWidth, faceHeight);
  } else {
    ctx.fillStyle = '#0d1115';
    ctx.fillRect(imageX, imageY, faceWidth, faceHeight);
  }

  ctx.restore();
}

function drawMonster() {
  if (!game.monster) return;
  drawSprite(game.monster, '#090d12', '#1b2124', 1.9);
}

function drawNetworkPlayers() {
  if (!game.player) return;
  const width = canvas.width;
  const height = canvas.height;
  const fov = Math.PI / 2.8;

  Object.values(network.remotePlayers).forEach((remote) => {
    if (!Number.isFinite(remote.x) || !Number.isFinite(remote.y)) return;
    const distance = Math.hypot(remote.x - game.player.x, remote.y - game.player.y);
    const angle = normalizeAngle(Math.atan2(remote.y - game.player.y, remote.x - game.player.x) - game.player.angle);
    if (distance < 0.5 || Math.abs(angle) > fov * 0.75 || !hasLineOfSight(game.player, remote)) return;

    const screenX = width * (0.5 + angle / fov);
    const size = clamp((height / distance) * 0.34, 12, height * 0.4);
    const screenY = height * 0.68;
    ctx.fillStyle = '#31c5d2';
    ctx.fillRect(screenX - size * 0.22, screenY - size * 0.68, size * 0.44, size * 0.68);
    ctx.beginPath();
    ctx.arc(screenX, screenY - size * 0.82, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(remote.name || 'PLAYER', screenX, screenY - size);
  });
}

function drawRelics() {
  if (!game.player) return;
  for (const relic of game.relics) {
    if (relic.collected) continue;
    if (!hasLineOfSight(game.player, relic)) continue;
    const dx = relic.x - game.player.x;
    const dy = relic.y - game.player.y;
    const dist = Math.hypot(dx, dy) || 0.0001;
    const angleTo = normalizeAngle(Math.atan2(dy, dx) - game.player.angle);
    const fov = Math.PI / 2.8;

    if (Math.abs(angleTo) > fov * 0.75) continue;

    const screenX = canvas.width * (0.5 + angleTo / fov);
    const heightOnScreen = clamp((canvas.height / dist) * 0.5, 18, 110);
    const screenY = canvas.height * 0.62;

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.shadowColor = 'rgba(255, 202, 64, 0.7)';
    ctx.shadowBlur = 12;

    if (bulbImage.complete && bulbImage.naturalWidth) {
      const bulbWidth = heightOnScreen * 0.62;
      const bulbHeight = heightOnScreen * 0.84;
      ctx.drawImage(bulbImage, -bulbWidth / 2, -bulbHeight / 2, bulbWidth, bulbHeight);
    } else {
      ctx.fillStyle = '#f7dd71';
      ctx.beginPath();
      ctx.arc(0, 0, heightOnScreen * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function drawObjectiveArrow() {
  if (!game.player || game.mode !== 'game') return;

  let nearestRelic = null;
  let nearestDistance = Infinity;
  for (const relic of game.relics) {
    if (relic.collected || !hasLineOfSight(game.player, relic)) continue;
    const distance = dist(game.player, relic);
    const angle = normalizeAngle(Math.atan2(relic.y - game.player.y, relic.x - game.player.x) - game.player.angle);
    if (Math.abs(angle) > Math.PI / 2.8 * 0.72 || distance >= nearestDistance) continue;
    nearestRelic = relic;
    nearestDistance = distance;
  }
  if (!nearestRelic) return;

  const angle = normalizeAngle(Math.atan2(nearestRelic.y - game.player.y, nearestRelic.x - game.player.x) - game.player.angle);
  const screenX = canvas.width * (0.5 + angle / (Math.PI / 2.8));
  const bulbHeight = clamp((canvas.height / nearestDistance) * 0.5, 18, 110);
  const arrowSize = clamp(bulbHeight * 0.82, 30, 76);
  const arrowTipY = canvas.height * 0.62 - bulbHeight * 0.48 - 5;

  ctx.save();
  ctx.translate(screenX, arrowTipY - arrowSize);
  ctx.shadowColor = 'rgba(255, 194, 43, 0.95)';
  ctx.shadowBlur = arrowSize * 0.55;
  ctx.fillStyle = 'rgba(25, 18, 8, 0.88)';
  ctx.beginPath();
  ctx.moveTo(-arrowSize * 0.25, -arrowSize * 0.08);
  ctx.lineTo(arrowSize * 0.25, -arrowSize * 0.08);
  ctx.lineTo(arrowSize * 0.25, arrowSize * 0.42);
  ctx.lineTo(arrowSize * 0.52, arrowSize * 0.42);
  ctx.lineTo(0, arrowSize);
  ctx.lineTo(-arrowSize * 0.52, arrowSize * 0.42);
  ctx.lineTo(-arrowSize * 0.25, arrowSize * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd34f';
  ctx.beginPath();
  ctx.moveTo(-arrowSize * 0.16, 0);
  ctx.lineTo(arrowSize * 0.16, 0);
  ctx.lineTo(arrowSize * 0.16, arrowSize * 0.4);
  ctx.lineTo(arrowSize * 0.38, arrowSize * 0.4);
  ctx.lineTo(0, arrowSize * 0.86);
  ctx.lineTo(-arrowSize * 0.38, arrowSize * 0.4);
  ctx.lineTo(-arrowSize * 0.16, arrowSize * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawExit() {
  if (!game.player) return;
  if (!hasLineOfSight(game.player, game.exit)) return;
  const dx = game.exit.x - game.player.x;
  const dy = game.exit.y - game.player.y;
  const dist = Math.hypot(dx, dy) || 0.0001;
  const angleTo = normalizeAngle(Math.atan2(dy, dx) - game.player.angle);
  const fov = Math.PI / 2.8;

  if (Math.abs(angleTo) > fov * 0.8) return;

  const screenX = canvas.width * (0.5 + angleTo / fov);
  const doorHeight = clamp((canvas.height / dist) * 0.58, 22, canvas.height * 0.48);
  const doorWidth = doorHeight * 0.58;
  const doorBottom = canvas.height * 0.86;
  const doorTop = doorBottom - doorHeight;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(screenX - doorWidth * 0.62, doorTop - doorWidth * 0.14, doorWidth * 1.24, doorHeight + doorWidth * 0.14);
  ctx.fillStyle = '#4b3524';
  ctx.fillRect(screenX - doorWidth * 0.5, doorTop, doorWidth, doorHeight);
  ctx.fillStyle = '#9d7849';
  ctx.fillRect(screenX - doorWidth * 0.4, doorTop + doorHeight * 0.04, doorWidth * 0.8, doorHeight * 0.92);
  ctx.fillStyle = '#39291e';
  ctx.fillRect(screenX - doorWidth * 0.27, doorTop + doorHeight * 0.14, doorWidth * 0.54, doorHeight * 0.62);
  ctx.fillStyle = '#f2c66f';
  ctx.beginPath();
  ctx.arc(screenX + doorWidth * 0.25, doorTop + doorHeight * 0.54, Math.max(1.5, doorWidth * 0.035), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#a4e5bd';
  ctx.fillRect(screenX - doorWidth * 0.4, doorBottom - doorHeight * 0.04, doorWidth * 0.8, doorHeight * 0.035);
}

function updateWeather(dt) {
  game.lightningTimer -= dt;
  if (game.lightningTimer <= 0) {
    game.lightningTimer = 2.6 + Math.random() * 3.0;
    game.lightningFlash = 1;
  }
  game.lightningFlash = Math.max(0, game.lightningFlash - dt * 1.6);

  for (const drop of game.rain) {
    drop.y += drop.speed * 0.3;
    drop.x += 0.015;
    if (drop.y > 1.5) {
      drop.y = -0.05;
      drop.x = Math.random() * 1.5;
    }
  }
}

function drawRain() {
  if (!game.rain.length) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.strokeStyle = `rgba(180, 210, 255, ${0.36 + game.lightningFlash * 0.4})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (const drop of game.rain) {
    const x = drop.x * w;
    const y = drop.y * h;
    const endX = x - 6;
    const endY = y + drop.length;
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
  }
  ctx.stroke();
}

function drawJumpScare() {
  const faceImage = getNextbotImage();
  if (game.mode !== 'jumpscare' || !faceImage.complete || !faceImage.naturalWidth) return;

  const alpha = 1 - Math.max(0, game.jumpScareTimer / 1.4);
  const width = canvas.width;
  const height = canvas.height;
  ctx.fillStyle = `rgba(0, 0, 0, ${0.2 + alpha * 0.8})`;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.1 + alpha * 0.9;
  const imageWidth = faceImage.naturalWidth;
  const imageHeight = faceImage.naturalHeight;
  const sourceX = Math.round(imageWidth * 0.04);
  const sourceY = Math.round(imageHeight * 0.05);
  const sourceWidth = Math.max(1, Math.round(imageWidth * 0.92));
  const sourceHeight = Math.max(1, Math.round(imageHeight * 0.90));
  const faceScale = Math.max(width / sourceWidth, height / sourceHeight) * 1.18;
  const faceWidth = sourceWidth * faceScale;
  const faceHeight = sourceHeight * faceScale;
  const faceX = (width - faceWidth) / 2;
  const faceY = (height - faceHeight) / 2;
  ctx.drawImage(faceImage, sourceX, sourceY, sourceWidth, sourceHeight, faceX, faceY, faceWidth, faceHeight);
  ctx.restore();

  ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + alpha * 0.35})`;
  ctx.fillRect(0, 0, width, height);
}

function renderGame() {
  drawBackground();
  drawRain();
  renderWalls();
  drawExit();
  drawRelics();
  drawMonster();
  drawNetworkPlayers();
  drawJumpScare();

  const hillsLighting = game.map === 'h';
  const flashlight = ctx.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.5,
    canvas.width * 0.06,
    canvas.width * 0.5,
    canvas.height * 0.5,
    canvas.width * 0.56
  );
  flashlight.addColorStop(0, `rgba(255, 255, 200, ${hillsLighting ? 0.055 : 0.18})`);
  flashlight.addColorStop(0.18, `rgba(255, 235, 180, ${hillsLighting ? 0.035 : 0.12})`);
  flashlight.addColorStop(0.45, 'rgba(0, 0, 0, 0.08)');
  flashlight.addColorStop(1, `rgba(0, 0, 0, ${hillsLighting ? 0.82 : 0.9})`);
  ctx.fillStyle = flashlight;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!hillsLighting) {
    const beam = ctx.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.52,
    canvas.width * 0.015,
    canvas.width * 0.5,
    canvas.height * 0.52,
    canvas.width * 0.4
    );
    beam.addColorStop(0, 'rgba(255, 244, 190, 0.12)');
    beam.addColorStop(0.35, 'rgba(255, 232, 160, 0.08)');
    beam.addColorStop(0.72, 'rgba(255, 220, 130, 0.025)');
    beam.addColorStop(1, 'rgba(255, 220, 130, 0)');
    ctx.fillStyle = beam;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (game.lightningFlash > 0.02) {
    ctx.fillStyle = `rgba(186, 216, 255, ${0.12 + game.lightningFlash * 0.38})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const vignette = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.15,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.9
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.22)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.82)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawObjectiveArrow();
}

function handleInput(dt) {
  if (!game.player) return;
  const p = game.player;
  const sprinting = !!(game.keys['Shift'] || game.keys['shift']);
  const forwardPressed = !!(game.keys['w'] || game.keys['W'] || game.keys['ArrowUp']);
  const backwardPressed = !!(game.keys['s'] || game.keys['S'] || game.keys['ArrowDown']);
  const strafeRightPressed = !!(game.keys['d'] || game.keys['D'] || game.keys['ArrowRight']);
  const strafeLeftPressed = !!(game.keys['a'] || game.keys['A'] || game.keys['ArrowLeft']);

  const moveForward = Number(forwardPressed) - Number(backwardPressed);
  const moveSide = Number(strafeRightPressed) - Number(strafeLeftPressed);

  if (moveForward !== 0 || moveSide !== 0) {
    const forwardX = Math.cos(p.angle);
    const forwardY = Math.sin(p.angle);
    const rightX = Math.cos(p.angle + Math.PI / 2);
    const rightY = Math.sin(p.angle + Math.PI / 2);
    const dx = forwardX * moveForward + rightX * moveSide;
    const dy = forwardY * moveForward + rightY * moveSide;
    const len = Math.hypot(dx, dy) || 1;
    const normalizedX = dx / len;
    const normalizedY = dy / len;
    const moveSpeed = p.speed * (sprinting ? 1.3 : 1) * dt;

    moveEntity(p, normalizedX * moveSpeed, normalizedY * moveSpeed);
  }

  if (game.keys[' ']) {
    const d = dist(p, game.monster);
    if (d < 2.3 && game.monster.stunnedUntil <= game.time) {
      game.monster.stunnedUntil = game.time + 2.2;
      showMessage('KABÍTÁS');
    }
    game.keys[' '] = false;
  }
}

function chooseMonsterRoamTarget() {
  if (!game.monster) return;
  const monster = game.monster;
  const min = 1;
  const max = game.worldSize - 2;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const x = min + Math.random() * (max - min);
    const y = min + Math.random() * (max - min);
    if (!wallAt(x, y)) {
      monster.roamTarget = { x, y };
      monster.nextRoamAt = game.time + 2.0 + Math.random() * 2.4;
      return;
    }
  }

  monster.roamTarget = { x: monster.x, y: monster.y };
  monster.nextRoamAt = game.time + 1.5;
}

function decideMonsterAction(monster, playerDistance) {
  if (playerDistance < 6.5) {
    monster.state = 'hunt';
    monster.aiTimer = game.time + 0.9;
    monster.roamTarget = { x: game.player.x, y: game.player.y };
    return;
  }

  if (playerDistance < 10 && Math.random() < 0.55) {
    monster.state = 'stalk';
    monster.aiTimer = game.time + 1.8 + Math.random() * 2.4;
    const angle = Math.atan2(game.player.y - monster.y, game.player.x - monster.x) + (Math.random() - 0.5) * 1.4;
    const offsetDistance = 1.5 + Math.random() * 2.2;
    monster.roamTarget = {
      x: monster.x + Math.cos(angle) * offsetDistance,
      y: monster.y + Math.sin(angle) * offsetDistance,
    };
    return;
  }

  monster.state = 'patrol';
  monster.aiTimer = game.time + 2.7 + Math.random() * 2.3;
  chooseMonsterRoamTarget();
}

function moveMonsterStep(monster, target, moveSpeed) {
  const dx = target.x - monster.x;
  const dy = target.y - monster.y;
  const dist = Math.hypot(dx, dy) || 0.0001;
  if (dist < 0.1) return;

  const angle = Math.atan2(dy, dx);
  const stepX = monster.x + Math.cos(angle) * moveSpeed;
  const stepY = monster.y + Math.sin(angle) * moveSpeed;

  const tries = [
    { x: stepX, y: stepY },
    { x: monster.x + Math.cos(angle + 0.45) * moveSpeed, y: monster.y + Math.sin(angle + 0.45) * moveSpeed },
    { x: monster.x + Math.cos(angle - 0.45) * moveSpeed, y: monster.y + Math.sin(angle - 0.45) * moveSpeed },
  ];

  for (const candidate of tries) {
    if (!wallAt(candidate.x, candidate.y) && !wallAt(candidate.x, monster.y) && !wallAt(monster.x, candidate.y)) {
      monster.x = clamp(candidate.x, 0.5, game.worldSize - 1.5);
      monster.y = clamp(candidate.y, 0.5, game.worldSize - 1.5);
      monster.angle = angle;
      return;
    }
  }

  monster.angle = angle;
}

function findGridPath(start, goal) {
  const size = game.worldSize;
  const startX = clamp(Math.floor(start.x), 1, size - 2);
  const startY = clamp(Math.floor(start.y), 1, size - 2);
  const goalX = clamp(Math.floor(goal.x), 1, size - 2);
  const goalY = clamp(Math.floor(goal.y), 1, size - 2);
  const startIndex = startY * size + startX;
  const goalIndex = goalY * size + goalX;
  if (startIndex === goalIndex) return [{ x: goal.x, y: goal.y }];

  const parents = new Int32Array(size * size).fill(-1);
  const queue = new Int32Array(size * size);
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let readIndex = 0;
  let writeIndex = 0;
  queue[writeIndex++] = startIndex;
  parents[startIndex] = startIndex;

  while (readIndex < writeIndex && parents[goalIndex] === -1) {
    const current = queue[readIndex++];
    const x = current % size;
    const y = Math.floor(current / size);

    for (const [dx, dy] of directions) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 1 || nextX >= size - 1 || nextY < 1 || nextY >= size - 1) continue;
      const nextIndex = nextY * size + nextX;
      if (parents[nextIndex] !== -1 || game.world[nextY][nextX] > 0) continue;
      parents[nextIndex] = current;
      queue[writeIndex++] = nextIndex;
    }
  }

  if (parents[goalIndex] === -1) return [];

  const path = [];
  let pathIndex = goalIndex;
  while (pathIndex !== startIndex) {
    path.push({ x: pathIndex % size + 0.5, y: Math.floor(pathIndex / size) + 0.5 });
    pathIndex = parents[pathIndex];
  }
  path.reverse();
  return path;
}

function findMonsterPathStep(monster, player) {
  const path = findGridPath(monster, player);
  return path[0] || { x: player.x, y: player.y };
}

function updateMonster(dt) {
  if (!game.monster || game.monster.stunnedUntil > game.time || game.mode === 'jumpscare') return;

  const monster = game.monster;
  const p = game.player;
  const distanceToPlayer = dist(p, monster);

  if (!monster.pathTarget || game.time >= monster.nextPathAt) {
    monster.pathTarget = findMonsterPathStep(monster, p);
    monster.nextPathAt = game.time + 0.22;
  }

  monster.state = 'hunt';
  moveMonsterStep(monster, monster.pathTarget, monster.speed * 1.55 * dt);

  if (distanceToPlayer < 0.78) {
    if (game.monster && game.monster.stunnedUntil <= game.time) {
      game.mode = 'jumpscare';
      game.jumpScareTimer = 1.4;
      p.health = Math.max(0, p.health - 1);
      updateHud();
      showMessage('ELKAPOTT');
    }
  }
}

function respawnAtStart() {
  if (!game.spawn || !game.player || !game.monster) return;

  if (game.player.health <= 0) {
    game.mode = 'menu';
    menuOverlay.classList.remove('hidden');
    hud.classList.add('hidden');
    message.textContent = 'MEGHALTÁL - GAME OVER';
    message.classList.remove('hidden');
    return;
  }

  game.player.x = game.spawn.player.x;
  game.player.y = game.spawn.player.y;
  game.player.angle = 0;

  game.monster.x = game.spawn.monster.x;
  game.monster.y = game.spawn.monster.y;
  game.monster.angle = Math.PI;
  game.monster.state = 'patrol';
  game.monster.stunnedUntil = 0;
  game.monster.roamTarget = null;
  game.monster.pathTarget = null;
  game.monster.nextPathAt = 0;
  game.monster.aiTimer = 0;
  game.monster.moveBias = 0;

  game.mode = 'game';
  message.classList.add('hidden');
}

function updateRelics() {
  if (!game.player) return;
  for (const relic of game.relics) {
    if (!relic.collected && dist(game.player, relic) < 0.7) {
      relic.collected = true;
      game.collected += 1;
      showMessage(`${relic.name} FELVÉVE`);
      updateObjectiveText();
    }
  }

  if (game.collected >= game.totalRelics && dist(game.player, game.exit) < 1.2) {
    game.mode = 'menu';
    menuOverlay.classList.remove('hidden');
    hud.classList.add('hidden');
    message.textContent = 'NYERTÉL • ENTER';
    message.classList.remove('hidden');
    message.style.fontSize = '2.2rem';
    message.style.letterSpacing = '0.18em';
    message.style.color = '#dfffe8';
    message.style.textTransform = 'uppercase';
    saveGame();
  }
}

function updateGame(dt) {
  if (game.mode === 'jumpscare') {
    game.jumpScareTimer -= dt;
    if (game.jumpScareTimer <= 0) {
      respawnAtStart();
      showMessage('MEGHALTÁL • ÚJRA');
    }
    return;
  }

  if (game.mode !== 'game') return;
  game.time += dt;
  updateWeather(dt);
  handleInput(dt);
  if (!game.multiplayer) {
    updateMonster(dt);
  }
  updateRelics();
  updateHud();
  saveGame();
}

function renderMinimap() {
  const size = 180;
  const cell = size / game.worldSize;
  miniCtx.clearRect(0, 0, size, size);
  miniCtx.fillStyle = 'rgba(8, 12, 14, 0.9)';
  miniCtx.fillRect(0, 0, size, size);

  for (let y = 0; y < game.worldSize; y += 1) {
    for (let x = 0; x < game.worldSize; x += 1) {
      const mapCell = game.world[y][x];
      const wall = mapCell > 0;
      miniCtx.fillStyle = mapCell === 2 ? '#80664a' : wall ? '#2d4b3a' : '#0f1719';
      miniCtx.fillRect(x * cell, y * cell, cell - 1, cell - 1);
    }
  }

  if (game.player) {
    miniCtx.fillStyle = '#d9f8ff';
    miniCtx.fillRect(game.player.x * cell - 2, game.player.y * cell - 2, 4, 4);
  }

  if (game.exit) {
    miniCtx.fillStyle = '#8de0aa';
    miniCtx.fillRect(game.exit.x * cell - 3, game.exit.y * cell - 3, 6, 6);
  }

  if (game.monster) {
    miniCtx.fillStyle = '#ff4d4d';
    miniCtx.fillRect(game.monster.x * cell - 3, game.monster.y * cell - 3, 6, 6);
  }

  for (const relic of game.relics) {
    if (!relic.collected) {
      miniCtx.fillStyle = '#f4d778';
      miniCtx.fillRect(relic.x * cell - 2, relic.y * cell - 2, 4, 4);
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  minimap.classList.toggle('hidden', game.mode === 'menu');

  if (game.mode === 'menu') {
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.35, 60, canvas.width / 2, canvas.height / 2, 520);
    gradient.addColorStop(0, 'rgba(47, 82, 90, 0.9)');
    gradient.addColorStop(1, 'rgba(7, 10, 12, 0.2)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  renderGame();
  renderMinimap();
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

function loop(ts) {
  const dt = Math.min(0.033, (ts - game.lastTime) / 1000 || 0.016);
  game.lastTime = ts;
  updateGame(dt);
  render();
  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (event) => {
  if (event.repeat && ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {
    event.preventDefault();
    return;
  }

  if (['w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {
    event.preventDefault();
  }

  game.keys[event.key] = true;

  if (event.key === 'Enter' && game.mode === 'menu') {
    const action = menuButtons[activeIndex]?.dataset.action;
    if (action === 'multiplayer') openMultiplayerMenu();
    if (action === 'offline') openOfflineMapSelection();
    if (action === 'settings') openSettings();
    if (action === 'exit') exitToMenu();
  }

  if (event.key === 'Escape') {
    if (document.pointerLockElement === canvas) {
      document.exitPointerLock();
    }
    if (settingsPanel.classList.contains('active')) {
      closeSettings();
    }
    if (mapMenu && !mapMenu.classList.contains('hidden')) {
      closeMapMenu();
    }
    if (multiplayerMenu && !multiplayerMenu.classList.contains('hidden')) {
      closeMultiplayerMenu();
    }
    if (lobbyMenu && !lobbyMenu.classList.contains('hidden')) {
      closeLobbyMenu();
    }
  }
});

window.addEventListener('keyup', (event) => {
  delete game.keys[event.key];
});

window.addEventListener('blur', () => {
  game.keys = {};
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) game.keys = {};
});

canvas.addEventListener('click', () => {
  if (game.mode === 'game') {
    canvas.requestPointerLock();
  }
});

window.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement !== canvas || !game.player) return;
  game.player.angle = normalizeAngle(game.player.angle + event.movementX * 0.0026);
});

menuButtons.forEach((button, index) => {
  button.addEventListener('mouseenter', () => setActiveMenu(index));
  button.addEventListener('focus', () => setActiveMenu(index));
  button.addEventListener('click', () => {
    setActiveMenu(index);
    const action = button.dataset.action;
    if (action === 'multiplayer') openMultiplayerMenu();
    if (action === 'offline') openOfflineMapSelection();
    if (action === 'settings') openSettings();
    if (action === 'exit') exitToMenu();
  });
});

if (multiplayerBackButton) {
  multiplayerBackButton.addEventListener('click', () => {
    closeMultiplayerMenu();
    if (menuOverlay) {
      menuOverlay.classList.remove('hidden');
    }
  });
}

if (lobbyBackButton) {
  lobbyBackButton.addEventListener('click', () => {
    closeLobbyMenu();
    if (menuOverlay) {
      menuOverlay.classList.remove('hidden');
    }
  });
}

if (multiplayerMenu) {
  multiplayerMenu.querySelector('[data-action="create-lobby"]')?.addEventListener('click', () => {
    hostCreateRoom();
  });
  multiplayerMenu.querySelector('[data-action="join-lobby"]')?.addEventListener('click', () => {
    if (joinCodeInput) {
      joinCodeInput.value = '';
      joinCodeInput.focus();
    }
    showMessage('ÍRD BE A KÓDOT');
  });
}

if (joinCodeButton) {
  joinCodeButton.addEventListener('click', joinMultiplayerByCode);
}

if (startLobbyButton) {
  startLobbyButton.addEventListener('click', () => {
    if (!network.isHost) {
      showMessage('A HOST INDÍTJA A JÁTÉKOT');
      return;
    }
    if (!network.connections.some((connection) => connection.open)) {
      showMessage('VÁRJ A JÁTÉKOSRA');
      return;
    }
    if (game.lobbyPlayers.some((player) => !player.ready)) {
      showMessage('MINDEN JÁTÉKOS LEGYEN READY');
      return;
    }

    startGame();
    broadcastToClients({
      type: 'match-start',
      map: game.map,
      world: game.world,
      exit: game.exit,
      relics: game.relics,
      collected: game.collected,
    });
    startNetworkStateSync();
  });
}

if (readyLobbyButton) {
  readyLobbyButton.addEventListener('click', () => {
    const nowReady = !game.lobbyReady;
    readyLobbyButton.classList.toggle('ready-on', nowReady);
    readyLobbyButton.textContent = nowReady ? 'NOT READY' : 'READY';
    game.lobbyReady = nowReady;

    if (network.isHost) {
      const host = game.lobbyPlayers.find((player) => player.isHost);
      if (host) host.ready = nowReady;
      sendLobbyState();
    } else {
      sendToHost({ type: 'ready', ready: nowReady });
    }

    updateLobbyStatus();
  });
}

if (chooseMapLobbyButton) {
  chooseMapLobbyButton.addEventListener('click', () => {
    if (!network.isHost) {
      showMessage('CSAK A HOST VÁLASZTHAT PÁLYÁT');
      return;
    }
    openMapMenu();
    if (lobbyMenu) {
      lobbyMenu.classList.add('hidden');
    }
  });
}

mapCards.forEach((card) => {
  card.addEventListener('click', () => {
    chooseMap(card.dataset.map);
    if (lobbyMenu && !lobbyMenu.classList.contains('hidden')) {
      updateLobbyStatus();
    }
  });
});

characterCards.forEach((card) => {
  card.addEventListener('click', () => {
    chooseCharacter(card.dataset.character);
    updateLobbyStatus();
  });
});

mapBackButton.addEventListener('click', closeMapMenu);
characterBackButton.addEventListener('click', closeCharacterMenu);
backButton.addEventListener('click', closeSettings);
[graphicsSlider, volumeSlider, brightnessSlider].forEach((slider) => slider.addEventListener('input', applySettings));

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
updateSettingsText();
applySettings();
resetGame();
requestAnimationFrame(loop);
