import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./hw3/Scenes/MainMenu";
import { HW3Controls } from "./hw3/HW3Controls";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 34, g: 32, b: 52},   // The color the game clears to
        inputs: [
            {name: HW3Controls.MOVE_LEFT, keys: ["a"]},
            {name: HW3Controls.MOVE_RIGHT, keys: ["d"]},
            {name: HW3Controls.JUMP, keys: ["w","space"]},
            {name: HW3Controls.SWITCH, keys: ["s"]},
            {name: HW3Controls.ATTACK, keys: ["x"]},
            {name: HW3Controls.PAUSE, keys: ["escape"]},
            {name: HW3Controls.MENU, keys: ["space"]},
            {name: HW3Controls.GRAPPLE, keys: ["right_click"]},
            {name: HW3Controls.PEEK, keys: ["e"]},
            {name: HW3Controls.DASH, keys: ["shift"]},
            {name: HW3Controls.INVINCIBLE, keys: ["i"]},
            {name: HW3Controls.LEVEL1, keys: ["1"]},
            {name: HW3Controls.LEVEL2, keys: ["2"]},
            {name: HW3Controls.LEVEL3, keys: ["3"]},
            {name: HW3Controls.LEVEL4, keys: ["4"]},
            {name: HW3Controls.LEVEL5, keys: ["5"]},
            {name: HW3Controls.LEVEL6, keys: ["6"]},
            {name: "CHANGE_FRAME", keys: ["f"]},
            {name: HW3Controls.GETPOS, keys: ["p"]},
            {name: HW3Controls.TELEPORT, keys: ["o"]}
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});
})();