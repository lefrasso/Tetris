# Tetris Game v1.1.0

A classic Tetris game implementation with modern features, built with HTML, CSS, and JavaScript, using Tone.js for audio.

## Author

*   Leandro

## Version

*   1.1.0

## Features

*   Classic Tetris gameplay.
*   Initial screen with:
    *   Player name input.
    *   Theme selection (Modern, Dark, Retro, Futuristic) affecting overall UI.
    *   Game settings (Start Level, Board Dimensions, Block Size).
*   Background music and sound effects generated with Tone.js.
*   Music toggle ('M' key).
*   "Disclaimer & Credits" modal.
*   "Back to Main Menu" functionality.
*   Responsive design elements.

## Technologies Used

*   HTML5
*   CSS3 (with CSS Variables for theming)
*   JavaScript (ES6+)
*   Tone.js (for dynamic audio generation)

## How to Play

1.  Open `Index.html` in a web browser.
2.  On the initial screen:
    *   Enter your player name.
    *   Select a theme.
    *   Adjust game settings if desired (Start Level, Board Width, Board Height, Block Size).
    *   Click "Start Game".
3.  Controls:
    *   **Arrow Left / A:** Move piece left
    *   **Arrow Right / D:** Move piece right
    *   **Arrow Down / S:** Soft drop piece
    *   **Arrow Up / W / Spacebar:** Rotate piece
    *   **P:** Pause/Resume game
    *   **M:** Toggle background music
    *   **Enter (on Game Over screen):** Restart game

## Setup

No special setup is required. Simply clone the repository (once on GitHub) and open the `Index.html` file in a modern web browser.

## Project Structure

*   `Index.html`: Main HTML file containing the game structure.
*   `style.css`: CSS file for all styling, including themes.
*   `main.js`: JavaScript file containing all game logic and Tone.js audio implementation.
*   `README.md`: This file.
