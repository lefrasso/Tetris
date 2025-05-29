// Tetris Moderno Configurable - main.js
// v1.1.0 - Using Tone.js for audio

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const canvas = document.getElementById('tetrisCanvas');
    const context = canvas.getContext('2d');
    const nextCanvas = document.getElementById('nextPieceCanvas');
    const nextContext = nextCanvas.getContext('2d');
    
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const gameOverMessageElement = document.getElementById('gameOverMessage');

    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const backToMenuButton = document.getElementById('backToMenuButton'); // New button

    // --- Inputs de Configuración (now on initial screen) ---
    const startLevelInput = document.getElementById('startLevel');
    const boardWidthInput = document.getElementById('boardWidth');
    const boardHeightInput = document.getElementById('boardHeight');
    const blockSizeInput = document.getElementById('blockSize');
    // const themeColorSelect = document.getElementById('themeColor'); // No longer exists as a select element

    // --- Elements for Initial Screen ---
    const initialScreen = document.getElementById('initialScreen');
    const playerNameInput = document.getElementById('playerName');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const startGameFromInitialScreenButton = document.getElementById('startGameFromInitialScreen');
    const mainContainer = document.querySelector('.main-container');
    // const backgroundMusicElement = document.getElementById('backgroundMusic'); // Removed
    const bodyElement = document.body;

    // --- Sound Effect Audio Elements --- (Removed)
    // const lineClearSound = document.getElementById('lineClearSound');
    // const pieceLandSound = document.getElementById('pieceLandSound');
    // const pieceRotateSound = document.getElementById('pieceRotateSound');
    // const levelUpSound = document.getElementById('levelUpSound');
    // const gameOverSound = document.getElementById('gameOverSound');

    // --- Tone.js Synths and Effects ---
    let musicEnabled = false;
    let soundEffectsEnabled = true; // Separate toggle for sound effects if desired, or use musicEnabled for both

    // Background Music Synth
    const musicSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: 'pulse',
            width: 0.6
        },
        envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.2,
            release: 0.3
        },
        volume: -18 // Quieter for background
    }).toDestination();

    const musicPart = new Tone.Part((time, note) => {
        musicSynth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
    }, [
        // Simple Korobeiniki-like melody pattern (can be expanded)
        { time: '0:0', name: 'E5', duration: '8n', velocity: 0.7 },
        { time: '0:0:2', name: 'B4', duration: '16n', velocity: 0.7 },
        { time: '0:0:3', name: 'C5', duration: '16n', velocity: 0.7 },
        { time: '0:1', name: 'D5', duration: '8n', velocity: 0.7 },
        { time: '0:1:2', name: 'C5', duration: '16n', velocity: 0.7 },
        { time: '0:1:3', name: 'B4', duration: '16n', velocity: 0.7 },
        { time: '0:2', name: 'A4', duration: '8n', velocity: 0.7 },
        { time: '0:2:2', name: 'A4', duration: '16n', velocity: 0.7 },
        { time: '0:2:3', name: 'C5', duration: '16n', velocity: 0.7 },
        { time: '0:3', name: 'E5', duration: '8n', velocity: 0.7 },
        { time: '0:3:2', name: 'D5', duration: '16n', velocity: 0.7 },
        { time: '0:3:3', name: 'C5', duration: '16n', velocity: 0.7 },
        { time: '0:4', name: 'B4', duration: '4n', velocity: 0.6 },
        { time: '0:4:2', name: 'C5', duration: '8n', velocity: 0.7 },
        { time: '0:5', name: 'D5', duration: '4n', velocity: 0.7 },
        { time: '0:6', name: 'E5', duration: '4n', velocity: 0.7 },
        { time: '0:7', name: 'C5', duration: '4n', velocity: 0.7 },
        { time: '0:8', name: 'A4', duration: '2n', velocity: 0.6 }, 
        { time: '0:9', name: 'A4', duration: '2n', velocity: 0.6 } // Ensure loop is long enough
    ]);
    musicPart.loop = true;
    musicPart.loopEnd = '2m'; // Loop the part every 2 measures (adjust as needed for your melody length)
    musicPart.playbackRate = 1; // Can be adjusted with level

    // Sound Effect Synths
    const pieceLandSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
        volume: -10
    }).toDestination();

    const lineClearSynth = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.1 },
        volume: -10
    }).toDestination();

    const pieceRotateSynth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.1 },
        volume: -15
    }).toDestination();

    const levelUpSynth = new Tone.PolySynth(Tone.Synth, {
        volume: -8
    }).toDestination();

    const gameOverSynth = new Tone.PolySynth(Tone.Synth, {
        volume: -5
    }).toDestination();

    // Helper to play sound effects
    function playSoundEffect(type) {
        if (!soundEffectsEnabled || Tone.context.state !== 'running') return;
        try {
            switch (type) {
                case 'land':
                    pieceLandSynth.triggerAttackRelease('C2', '16n');
                    break;
                case 'clear':
                    lineClearSynth.triggerAttackRelease('8n');
                    break;
                case 'rotate':
                    pieceRotateSynth.triggerAttackRelease('G4', '32n');
                    break;
                case 'levelup':
                    levelUpSynth.triggerAttackRelease(['C5', 'E5', 'G5'], '8n');
                    break;
                case 'gameover':
                    gameOverSynth.triggerAttackRelease(['C3', 'G2', 'C2'], '2n');
                    break;
            }
        } catch (error) {
            console.error(`Error playing sound ${type}:`, error);
        }
    }

    // --- Elements for Disclaimer Modal ---
    const disclaimerModal = document.getElementById('disclaimerModal');
    const disclaimerCreditsButton = document.getElementById('disclaimerCreditsButton');
    const closeDisclaimerModalButton = document.getElementById('closeDisclaimerModalButton');

    // --- Variables de Configuración del Juego (con valores por defecto) ---
    let BLOCK_SIZE = parseInt(blockSizeInput.value);
    let BOARD_WIDTH_UNITS = parseInt(boardWidthInput.value);
    let BOARD_HEIGHT_UNITS = parseInt(boardHeightInput.value);
    
    // --- Paletas de Colores para las Piezas ---
    const THEMES = {
        modern: ['#00BCD4', '#FFEB3B', '#FF5722', '#4CAF50', '#E91E63', '#3F51B5', '#9C27B0'], // Cyan, Yellow, Deep Orange, Green, Pink, Indigo, Purple
        dark: ['#37474F', '#FF6F00', '#AD1457', '#0097A7', '#D84315', '#5E35B1', '#00695C'], // Blue Grey, Amber, Deep Pink, Dark Cyan, Deep Orange, Deep Purple, Dark Teal
        retro: ['#D2691E', '#BDB76B', '#CD5C5C', '#8FBC8F', '#F4A460', '#ADD8E6', '#DAA520'], // Chocolate, Dark Khaki, Indian Red, Dark Sea Green, Sandy Brown, Light Blue, Goldenrod
        futuristic: ['#00E5FF', '#76FF03', '#D500F9', '#FFEA00', '#FF3D00', '#FFFFFF', '#651FFF']  // Electric Blue, Electric Green, Electric Purple, Electric Yellow, Bright Orange, White, Deep Purple
    };
    // Ensure the default active theme from HTML is used for initialization
    let currentPieceColors = THEMES.modern; // Default to modern, will be updated by initializeApp
    let currentPlayerName = 'Player1';

    // --- Definición de las Piezas (Tetrominós) ---
    const PIECE_DEFINITIONS = [
        { matrix: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], id: 'I' },
        { matrix: [[2,0,0],[2,2,2],[0,0,0]], id: 'J' },
        { matrix: [[0,0,3],[3,3,3],[0,0,0]], id: 'L' },
        { matrix: [[4,4],[4,4]], id: 'O' },
        { matrix: [[0,5,5],[5,5,0],[0,0,0]], id: 'S' },
        { matrix: [[0,6,0],[6,6,6],[0,0,0]], id: 'T' },
        { matrix: [[7,7,0],[0,7,7],[0,0,0]], id: 'Z' }
    ];

    // --- Variables de Estado del Juego ---
    let board = [];
    let currentPiece;
    let nextPiece;
    let score = 0;
    let level = 1;
    let linesClearedTotal = 0;
    
    let dropCounter = 0;
    let dropInterval = 1000;
    let lastTime = 0;
    let isPaused = false;
    let gameOver = false;
    let gameLoopId;

    // --- Funciones del Juego ---
    function playSound(soundElement) {
        if (soundElement && soundElement.readyState >= 2) { // Check if ready to play
            soundElement.currentTime = 0; // Rewind to start
            soundElement.play().catch(error => console.error(`Error playing sound ${soundElement.id}:`, error));
        }
    }

    function initializeGameVariables() {
        // Read settings from the input fields on the initial screen
        BLOCK_SIZE = parseInt(blockSizeInput.value) || 30;
        BOARD_WIDTH_UNITS = parseInt(boardWidthInput.value) || 10;
        BOARD_HEIGHT_UNITS = parseInt(boardHeightInput.value) || 20;
        level = parseInt(startLevelInput.value) || 1;
        // currentPieceColors is set by theme button click

        canvas.width = BLOCK_SIZE * BOARD_WIDTH_UNITS;
        canvas.height = BLOCK_SIZE * BOARD_HEIGHT_UNITS;
        context.scale(1, 1);

        nextCanvas.width = BLOCK_SIZE * 5;
        nextCanvas.height = BLOCK_SIZE * 5;
        nextContext.scale(1, 1);
        
        // level = parseInt(startLevelInput.value) || 1; // Moved up
        score = 0;
        linesClearedTotal = 0;
        updateDropInterval();
    }

    function createBoard() {
        board = Array.from({ length: BOARD_HEIGHT_UNITS }, () => Array(BOARD_WIDTH_UNITS).fill(0));
    }
    
    function generatePiece(pieceDef) {
        const matrix = pieceDef.matrix.map(row => row.slice());
        const colorIndex = pieceDef.matrix.flat().find(val => val !== 0);
        return {
            matrix: matrix,
            color: currentPieceColors[colorIndex - 1],
            id: pieceDef.id,
            x: Math.floor(BOARD_WIDTH_UNITS / 2) - Math.floor(matrix[0].length / 2),
            y: (pieceDef.id === 'I') ? -1 : 0
        };
    }

    function getRandomPiece() {
        const randomIndex = Math.floor(Math.random() * PIECE_DEFINITIONS.length);
        return generatePiece(PIECE_DEFINITIONS[randomIndex]);
    }

    function drawBlock(x, y, color, ctx = context, blockSize = BLOCK_SIZE) {
        ctx.fillStyle = color;
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }

    function drawBoard() {
        board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    drawBlock(x, y, currentPieceColors[value - 1]);
                }
            });
        });
    }

    // function drawPiece(piece, ctx = context, blockSize = BLOCK_SIZE, offsetX = 0, offsetY = 0) { // OLD SIGNATURE
    function drawPiece(piece, ctx = context, blockSize = BLOCK_SIZE, customRenderCoordinates = null) {
        // piece: { matrix, color, x (main board), y (main board) }
        // customRenderCoordinates: { x, y } in block units, for overriding piece.x, piece.y for special contexts like nextPieceCanvas.
        // These coordinates are the top-left for where the piece's matrix (0,0) should start drawing.
    
        const startDrawX = customRenderCoordinates ? customRenderCoordinates.x : piece.x;
        const startDrawY = customRenderCoordinates ? customRenderCoordinates.y : piece.y;
    
        piece.matrix.forEach((rowArray, yMatrix) => { // yMatrix is the row index in piece.matrix
            rowArray.forEach((value, xMatrix) => {   // xMatrix is the col index in piece.matrix
                if (value !== 0) {
                    // Ensure piece.color is valid, fallback if necessary (should be set by generatePiece)
                    const colorToDraw = piece.color || currentPieceColors[0]; 
                    drawBlock(startDrawX + xMatrix, startDrawY + yMatrix, colorToDraw, ctx, blockSize);
                }
            });
        });
    }

    function drawNextPiece() {
        const currentThemeCanvasBg = getComputedStyle(document.body).getPropertyValue('--canvas-bg').trim() || '#0f172a';
        nextContext.fillStyle = currentThemeCanvasBg;
        nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

        if (nextPiece) {
            // Determine the actual visual bounds of the piece within its matrix
            let minR = nextPiece.matrix.length, maxR = -1, minC = nextPiece.matrix[0].length, maxC = -1;
            let hasBlocks = false;
            nextPiece.matrix.forEach((rowArr, r) => {
                rowArr.forEach((val, c) => {
                    if (val !== 0) {
                        hasBlocks = true;
                        minR = Math.min(minR, r);
                        maxR = Math.max(maxR, r);
                        minC = Math.min(minC, c);
                        maxC = Math.max(maxC, c);
                    }
                });
            });

            if (!hasBlocks) return; // Should not happen with valid pieces

            const pieceActualWidthInBlocks = (maxC - minC + 1);
            const pieceActualHeightInBlocks = (maxR - minR + 1);

            // Calculate offsets to center the piece's actual content in the nextCanvas (5x5 blocks)
            const canvasWidthInBlocks = nextCanvas.width / BLOCK_SIZE;   // Should be 5
            const canvasHeightInBlocks = nextCanvas.height / BLOCK_SIZE; // Should be 5

            // Target top-left for the *visual content* of the piece
            const targetXforContent = (canvasWidthInBlocks - pieceActualWidthInBlocks) / 2;
            const targetYforContent = (canvasHeightInBlocks - pieceActualHeightInBlocks) / 2;

            // The customRenderCoordinates for drawPiece are where matrix[0][0] should start.
            // So, we adjust by minC and minR.
            const customCoords = {
                x: targetXforContent - minC,
                y: targetYforContent - minR
            };
            
            drawPiece(nextPiece, nextContext, BLOCK_SIZE, customCoords);
        }
    }

    function drawGame() {
        const currentThemeCanvasBg = getComputedStyle(document.body).getPropertyValue('--canvas-bg').trim() || '#0f172a';
        context.fillStyle = currentThemeCanvasBg;
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        if (currentPiece) {
            drawPiece(currentPiece);
        }
        drawNextPiece();
        scoreElement.textContent = score;
        levelElement.textContent = level;
    }

    function pieceFall() {
        if (gameOver || isPaused || !currentPiece) return;
        currentPiece.y++;
        if (checkCollision()) {
            currentPiece.y--;
            mergePieceToBoard();
            removeCompletedLines();
            spawnNewPiece();
            if (checkCollision()) {
                handleGameOver();
            }
        }
        dropCounter = 0;
    }

    function pieceMove(direction) {
        if (gameOver || isPaused || !currentPiece) return;
        currentPiece.x += direction;
        if (checkCollision()) {
            currentPiece.x -= direction;
        }
    }

    function pieceRotate() {
        if (gameOver || isPaused || !currentPiece) return;
        const originalMatrix = currentPiece.matrix.map(row => row.slice());
        const N = currentPiece.matrix.length;
        const rotatedMatrix = Array.from({ length: N }, () => Array(N).fill(0));
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                rotatedMatrix[j][N - 1 - i] = currentPiece.matrix[i][j];
            }
        }
        currentPiece.matrix = rotatedMatrix;
        let offset = 0;
        if (checkCollision()) {
            offset = currentPiece.x < BOARD_WIDTH_UNITS / 2 ? 1 : -1;
            currentPiece.x += offset;
            if (checkCollision()) {
                currentPiece.x += offset;
                if (checkCollision()) {
                    currentPiece.x -= offset * 2;
                    currentPiece.matrix = originalMatrix;
                }
            }
        } else {
            // playSound(pieceRotateSound); // Old
            playSoundEffect('rotate');
        }
    }

    function checkCollision() {
        if (!currentPiece) return false;
        const { matrix, x, y } = currentPiece;
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] !== 0) {
                    const newX = x + col;
                    const newY = y + row;
                    if (newX < 0 || newX >= BOARD_WIDTH_UNITS || newY >= BOARD_HEIGHT_UNITS) return true;
                    if (newY >= 0 && board[newY] && board[newY][newX] !== 0) return true;
                }
            }
        }
        return false;
    }

    function mergePieceToBoard() {
        if (!currentPiece) return;
        const pieceDef = PIECE_DEFINITIONS.find(p => p.id === currentPiece.id);
        const colorValueInBoard = pieceDef.matrix.flat().find(val => val !== 0);
        currentPiece.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    if (currentPiece.y + y >= 0 && currentPiece.y + y < BOARD_HEIGHT_UNITS &&
                        currentPiece.x + x >= 0 && currentPiece.x + x < BOARD_WIDTH_UNITS) {
                        board[currentPiece.y + y][currentPiece.x + x] = colorValueInBoard;
                    }
                }
            });
        });
        // playSound(pieceLandSound); // Old
        playSoundEffect('land');
    }

    function removeCompletedLines() {
        let linesClearedThisTurn = 0;
        for (let y = BOARD_HEIGHT_UNITS - 1; y >= 0; y--) {
            if (board[y].every(value => value !== 0)) {
                board.splice(y, 1);
                board.unshift(Array(BOARD_WIDTH_UNITS).fill(0));
                linesClearedThisTurn++;
                y++;
            }
        }
        if (linesClearedThisTurn > 0) {
            if (linesClearedThisTurn === 1) score += 100 * level;
            else if (linesClearedThisTurn === 2) score += 300 * level;
            else if (linesClearedThisTurn === 3) score += 500 * level;
            else if (linesClearedThisTurn >= 4) score += 800 * level; // Tetris!
            linesClearedTotal += linesClearedThisTurn;
            // playSound(lineClearSound); // Old
            playSoundEffect('clear');

            if (linesClearedTotal >= level * 10) {
                level++;
                updateDropInterval();
                // playSound(levelUpSound); // Old
                playSoundEffect('levelup');
                // Increase music playback speed slightly with level
                if (musicEnabled) {
                    musicPart.playbackRate = 1 + (level -1) * 0.05;
                }
            }
        }
    }

    function spawnNewPiece() {
        currentPiece = nextPiece || getRandomPiece();
        nextPiece = getRandomPiece();
        drawNextPiece();
    }

    function updateDropInterval() {
        dropInterval = Math.max(100, 1000 - (level - 1) * 75);
    }

    function handleGameOver() {
        gameOver = true;
        isPaused = true;
        cancelAnimationFrame(gameLoopId);
        gameOverMessageElement.style.display = 'flex';
        startButton.textContent = "Restart";
        pauseButton.disabled = true;
        backToMenuButton.style.display = 'inline-block';
        // if (musicEnabled && backgroundMusicElement) { // Old
        //     backgroundMusicElement.pause(); 
        // }
        if (musicEnabled && Tone.Transport.state === "started") {
            Tone.Transport.pause();
        }
        // playSound(gameOverSound); // Old
        playSoundEffect('gameover');
    }

    function gameLoop(currentTime = 0) {
        if (gameOver && !isPaused) {
            isPaused = true;
        }
        if (isPaused && !gameOver) {
            if (gameLoopId) cancelAnimationFrame(gameLoopId);
            drawGame();
            return;
        }
        if (gameOver) return;
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            pieceFall();
        }
        drawGame();
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
        }
        // Ensure Tone.js context is running (user interaction needed first)
        if (Tone.context.state !== 'running') {
            Tone.start().then(() => {
                console.log("AudioContext started by user interaction.");
                // Now safe to start transport or play sounds
                if (musicEnabled && Tone.Transport.state !== "started") {
                    Tone.Transport.start();
                    musicPart.start(0);
                }
            }).catch(e => console.error("Error starting AudioContext: ", e));
        } else {
            if (musicEnabled && Tone.Transport.state !== "started") {
                Tone.Transport.start();
                musicPart.start(0); // Start music if already enabled and transport is ready
            }
        }

        initializeGameVariables();
        createBoard();
        spawnNewPiece();
        spawnNewPiece(); 
        gameOver = false;
        isPaused = false;
        dropCounter = 0;
        lastTime = performance.now();
        gameOverMessageElement.style.display = 'none';
        startButton.textContent = "Restart";
        pauseButton.textContent = "Pause";
        pauseButton.disabled = false;
        backToMenuButton.style.display = 'inline-block';

        if (initialScreen.style.display !== 'none') {
            initialScreen.style.display = 'none';
            mainContainer.style.display = 'flex';
        }

        gameLoop();

        // if (musicEnabled && backgroundMusicElement && backgroundMusicElement.readyState >= 2) { // Old
        //     backgroundMusicElement.currentTime = 0; 
        //     backgroundMusicElement.play().catch(error => console.error("Error auto-playing music on game start:", error));
        // } else if (backgroundMusicElement) {
        //     backgroundMusicElement.pause();
        // }
        // Music is handled by Tone.Transport and musicPart, started above if enabled
    }

    function togglePause() {
        if (gameOver) return;
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? "Reanudar" : "Pausa";
        if (!isPaused) {
            lastTime = performance.now();
            gameLoop();
        } else {
            if (gameLoopId) cancelAnimationFrame(gameLoopId);
            drawGame();
            // Pause music if game is paused and music is enabled
            // if (musicEnabled && backgroundMusicElement) { // Old
            //     backgroundMusicElement.pause();
            // }
            if (musicEnabled && Tone.Transport.state === "started") {
                Tone.Transport.pause();
            }
        }
    }

    function toggleMusic() {
        // if (!backgroundMusicElement) { // Old
        //     console.error('Background music element not found!');
        //     return;
        // }
        musicEnabled = !musicEnabled;
        if (musicEnabled) {
            if (Tone.context.state !== 'running') {
                Tone.start().then(() => {
                    console.log("AudioContext started by user interaction for music.");
                    Tone.Transport.start();
                    musicPart.start(0); // Start the music part
                    musicPart.playbackRate = 1 + (level -1) * 0.05; // Apply current level speed
                }).catch(e => console.error("Error starting AudioContext for music: ", e));
            } else {
                if (Tone.Transport.state !== "started") {
                    Tone.Transport.start();
                }
                musicPart.start(0); // Ensure part is started if transport was already running
                musicPart.playbackRate = 1 + (level -1) * 0.05; // Apply current level speed
            }
        } else {
            if (Tone.Transport.state === "started") {
                Tone.Transport.pause(); // Pause the transport, which stops the part
                // musicPart.stop(); // Alternatively, stop the part directly
            }
        }
        console.log(`Music ${musicEnabled ? 'enabled' : 'disabled'}. Press M to toggle.`);
    }

    // --- Disclaimer Modal Functions ---
    function openDisclaimerModal() {
        disclaimerModal.style.display = 'flex';
    }

    function closeDisclaimerModal() {
        disclaimerModal.style.display = 'none';
    }

    document.addEventListener('keydown', event => {
        if (gameOver && event.key !== 'Enter' && event.key !== ' ') return;
        if (event.key === 'p' || event.key === 'P') {
            togglePause();
            event.preventDefault();
            return;
        }
        if (isPaused && !gameOver) return;
        switch (event.key) {
            case 'ArrowLeft':
            case 'a': case 'A':
                pieceMove(-1);
                event.preventDefault();
                break;
            case 'ArrowRight':
            case 'd': case 'D':
                pieceMove(1);
                event.preventDefault();
                break;
            case 'ArrowDown':
            case 's': case 'S':
                pieceFall();
                event.preventDefault();
                break;
            case 'ArrowUp':
            case 'w': case 'W':
            case ' ':
                pieceRotate();
                event.preventDefault();
                break;
            case 'Enter':
                if (gameOver) startGame();
                event.preventDefault();
                break;
            case 'm': // Music toggle
            case 'M':
                toggleMusic();
                event.preventDefault();
                break;
        }
    });

    // --- Event Listeners for Initial Screen ---
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            themeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const selectedTheme = button.dataset.theme;
            currentPieceColors = THEMES[selectedTheme];
            
            // Apply theme class to body
            bodyElement.className = ''; // Clear existing theme classes
            bodyElement.classList.add(`theme-${selectedTheme}`);
            console.log(`Theme changed to: ${selectedTheme}`);

            // Potentially update colors immediately if a preview is desired
        });
    });

    startGameFromInitialScreenButton.addEventListener('click', () => {
        // Validate settings before starting
        const sLevel = parseInt(startLevelInput.value);
        const bWidth = parseInt(boardWidthInput.value);
        const bHeight = parseInt(boardHeightInput.value);
        const bSize = parseInt(blockSizeInput.value);

        if (sLevel < 1 || sLevel > 10 || 
            bWidth < 8 || bWidth > 15 ||
            bHeight < 15 || bHeight > 25 ||
            bSize < 20 || bSize > 40) {
            alert("Please enter valid values in the specified ranges for all settings.");
            return;
        }

        currentPlayerName = playerNameInput.value || 'Player1';
        console.log(`Player: ${currentPlayerName}, Starting Level: ${sLevel}, Board: ${bWidth}x${bHeight}, Block: ${bSize}px, Theme: ${Object.keys(THEMES).find(key => THEMES[key] === currentPieceColors)}`);
        
        initialScreen.style.display = 'none';
        mainContainer.style.display = 'flex';
        
        startGame(); 
    });

    // --- Event listener for Disclaimer & Credits button ---
    disclaimerCreditsButton.addEventListener('click', openDisclaimerModal);
    closeDisclaimerModalButton.addEventListener('click', closeDisclaimerModal);

    // Close modal if user clicks outside the modal content (on the overlay)
    disclaimerModal.addEventListener('click', (event) => {
        if (event.target === disclaimerModal) { // Check if the click is on the overlay itself
            closeDisclaimerModal();
        }
    });

    // --- Event listener for Back to Main Menu button ---
    backToMenuButton.addEventListener('click', () => {
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
        }
        gameOver = true; 
        isPaused = true;
        mainContainer.style.display = 'none';
        initialScreen.style.display = 'flex';
        gameOverMessageElement.style.display = 'none';
        pauseButton.disabled = true;
        startButton.textContent = "Start"; 
        backToMenuButton.style.display = 'none'; 

        // if (backgroundMusicElement) { // Old
        //     backgroundMusicElement.pause(); 
        //     backgroundMusicElement.currentTime = 0; 
        // }
        if (Tone.Transport.state === "started") {
            Tone.Transport.pause(); // Stop music
            // musicPart.stop(); // Could also stop the part and reset its progress if needed
        }
    });

    // --- Original Event Listeners & Initialization ---
    startButton.addEventListener('click', startGame); // This button now primarily acts as a restart button
    pauseButton.addEventListener('click', togglePause);
    // applySettingsButton.addEventListener('click', () => { ... }); // Removed as settings are on initial screen

    // --- Initial Application Setup ---
    function initializeApp() {
        initialScreen.style.display = 'flex';
        mainContainer.style.display = 'none';
        gameOverMessageElement.style.display = 'none';
        backToMenuButton.style.display = 'none'; // Hide back to menu button initially

        // Set default theme on load (e.g., modern)
        const defaultThemeButton = document.querySelector('.theme-btn[data-theme="modern"]');
        if (defaultThemeButton) {
            defaultThemeButton.click(); // Simulate a click to set theme and colors
        } else {
            // Fallback if modern theme button isn't found (should not happen)
            currentPieceColors = THEMES.modern;
            bodyElement.className = 'theme-modern';
        }

        // Set default player name if input is empty
        if (!playerNameInput.value) {
            playerNameInput.value = 'Player1';
        }
    }

    initializeApp();
});
