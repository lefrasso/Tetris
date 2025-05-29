# 🎮 Neon Tetris - Modern Web Game v1.1.0

A classic Tetris game implementation with modern features, built with HTML, CSS, and JavaScript, using Tone.js for dynamic audio generation. This version (v1.1.0) introduces an initial settings screen, multiple visual themes, and a completely revamped audio system.

<!-- Add a placeholder for a game screenshot here -->
<!-- ![Neon Tetris Gameplay](./screenshots/neon-tetris-gameplay.png) -->

## ✨ Implemented by

*   Leandro

## 🌟 Features

### 🎯 Core Gameplay
*   Classic Tetris block-stacking puzzle mechanics.
*   Score tracking and progressive level system (music speed increases with level).
*   Next piece preview.
*   Game Over detection and restart capability.

### 🎨 Visual Themes & UI
*   **Initial Screen**: Configure player name, theme, and game parameters before starting.
    *   **Player Name**: Personalize your game session.
    *   **Game Themes**: Choose from four distinct visual styles:
        *   **Modern**: Clean and bright interface.
        *   **Dark**: Sleek, modern dark mode.
        *   **Retro**: Classic arcade aesthetics with pixel-perfect fonts (VT323).
        *   **Futuristic**: Neon glows and tech-inspired fonts (Orbitron, Rajdhani).
    *   **Game Settings**:
        *   Start Level (1-10)
        *   Board Width (8-15 blocks)
        *   Board Height (15-25 blocks)
        *   Block Size (20-40 pixels)
*   **Responsive Design**: Adapts to different screen sizes for a good experience on various devices.
*   **Disclaimer & Credits Modal**: Information about the game and attributions.
*   **Back to Main Menu**: Easily return to the initial screen from the game.

### 🔊 Audio (Powered by Tone.js)
*   **Background Music**: A looping, Korobeiniki-inspired melody that speeds up with each level.
*   **Sound Effects**: For piece landing, line clearing, rotation, level up, and game over.
*   **Music Toggle**: Press 'M' to mute/unmute background music (starts enabled).

### 🛠️ Technical Features
*   Built with plain HTML, CSS, and JavaScript (ES6+).
*   Dynamic audio generation using the Tone.js library.
*   CSS Custom Properties (Variables) for easy and extensive theming.
*   No external build tools or frameworks required for core game functionality.

## 🚀 Quick Start

### Prerequisites
*   A modern web browser (e.g., Chrome, Firefox, Edge, Safari) that supports ES6+ JavaScript and Web Audio API.

### Running Locally
1.  **Clone the repository** (once it's on GitHub):
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```
2.  **Open `Index.html`** directly in your web browser.
    *   No local server is strictly necessary to run the game, but it's good practice for development if you plan to use features that might be restricted by browser security policies when opening files directly (e.g., certain types of AJAX requests, though not used in this project currently).

## 🎮 How to Play

1.  Open `Index.html` in your browser.
2.  On the **Initial Screen**:
    *   Enter your desired **Player Name**.
    *   Select a **Game Theme** (Modern, Dark, Retro, Futuristic).
    *   Optionally, adjust **Game Settings** (Start Level, Board Width, Board Height, Block Size).
    *   Click **"Start Game"**.
3.  **Controls**:
    *   **← Arrow Left / A**: Move the falling piece left.
    *   **→ Arrow Right / D**: Move the falling piece right.
    *   **↓ Arrow Down / S**: Soft drop the piece (move it down faster).
    *   **↑ Arrow Up / W / Spacebar**: Rotate the piece clockwise.
    *   **P**: Pause or resume the game.
    *   **M**: Toggle background music on/off.
    *   **Enter** (when Game Over message is displayed): Restart the game.
4.  **Objective**: Complete horizontal lines by arranging the falling tetrominoes. Completed lines disappear, and pieces above fall into the empty space. The game ends if the stack of pieces reaches the top of the board.

## 🔧 Project Structure

```
Tetris/
├── Index.html          # Main HTML structure for the game and initial screen
├── style.css           # All CSS styling, including theme definitions
├── main.js             # Core JavaScript game logic, event handling, and Tone.js audio
├── LICENSE             # MIT License file
├── README.md           # This file
├── .gitignore          # Specifies intentionally untracked files that Git should ignore
└── screenshots/        # (Optional) Directory for game screenshots
    └── (example.png)
```

## 🌐 Deployment

This project is a static website and can be deployed to various platforms:

*   **GitHub Pages**: 
    1. Push your code to a GitHub repository.
    2. Go to repository Settings → Pages.
    3. Select the source branch (e.g., `main`) and the `/ (root)` folder.
    4. Your game will be available at `https://<your-username>.github.io/<repository-name>/`.
*   **Netlify**: Drag and drop the project folder or connect your GitHub repository.
*   **Vercel**: Import your GitHub repository.
*   **Azure Static Web Apps**: Connect your GitHub repository and configure the build (no specific build step needed for this vanilla JS project).
*   Any static web hosting provider.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

*   The core Tetris concept was created by Alexey Pajitnov.
*   This specific implementation and its enhancements (v1.1.0) were developed by Leandro.
*   Uses Tone.js, which is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/lefrasso/Tetris/issues) (if you have one for your repo).

### Development Guidelines
1.  **Fork** the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

## 🐛 Known Issues

*   Currently, no major known issues. (Update as needed)
*   Mobile responsiveness is basic; dedicated touch controls are not yet implemented.

## 🔮 Future Enhancements

*   [ ] Advanced mobile touch controls.
*   [ ] High score saving (e.g., using Local Storage).
*   [ ] More complex soundscapes or music variations per theme.
*   [ ] Additional particle effects or animations for line clears/level ups.
*   [ ] A "ghost piece" feature to show where the current piece will land.

---

**Enjoy playing Neon Tetris!** 🕹️

For questions or support, please open an issue in the GitHub repository: [https://github.com/lefrasso/Tetris/issues](https://github.com/lefrasso/Tetris/issues)
