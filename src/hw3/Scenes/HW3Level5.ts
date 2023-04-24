import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level from "./HW3Level";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import { HW3Events } from "../HW3Events";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Level1 from "./HW3Level1";
import Level2 from "./HW3Level2";
import Level3 from "./HW3Level3";
import Level4 from "./HW3Level4";
import Level6 from "./HW3Level6";

/**
 * The second level
 */
export default class Level5 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(32, 608);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Tepster.json";

    public static readonly TILEMAP_KEY = "LEVEL5";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/L5.json";
    public static readonly TILEMAP_SCALE = new Vec2(2, 2);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Main";
    public static readonly DEATH_LAYER_KEY = "Death";
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/ice.mp3";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "hw4_assets/sounds/jump.wav";
    
    public static readonly DAMAGED_AUDIO_KEY = "PLAYER_DAMAGED";
    public static readonly DAMAGED_AUDIO_PATH = "hw4_assets/sounds/takedamage.mp3";

    public static readonly DEADGE_AUDIO_KEY = "PLAYER_DEADGE";
    public static readonly DEADGE_AUDIO_PATH = "hw4_assets/sounds/deadge.mp3";

    public static readonly TILE_DESTROYED_KEY = "TILE_DESTROYED";
    public static readonly TILE_DESTROYED_PATH = "hw4_assets/sounds/switch.wav";

    public static readonly LEVEL_END = new AABB(new Vec2(928, 3632), new Vec2(24, 16));

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level5.TILEMAP_KEY;
        this.tilemapScale = Level5.TILEMAP_SCALE;
        this.destructibleLayerKey = Level5.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = Level5.WALLS_LAYER_KEY;
        this.deathLayerKey = Level5.DEATH_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level5.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level5.PLAYER_SPAWN;

        // Music and sound
        this.levelMusicKey = Level5.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level5.JUMP_AUDIO_KEY;
        this.tileDestroyedAudioKey = Level5.TILE_DESTROYED_KEY;
        this.damagedAudioKey = Level5.DAMAGED_AUDIO_KEY;
        this.deadgeAudioKey = Level5.DEADGE_AUDIO_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(54, 132).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 32).mult(this.tilemapScale);
        this.pastPosition = new Vec2(688, 1584).mult(this.tilemapScale);
    }

    /**
     * Load in our resources for level 1
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level5.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level5.PLAYER_SPRITE_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level5.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, Level5.JUMP_AUDIO_PATH);
        this.load.audio(this.tileDestroyedAudioKey, Level5.TILE_DESTROYED_PATH);
        this.load.audio(this.damagedAudioKey, Level5.DAMAGED_AUDIO_PATH);
        this.load.audio(this.deadgeAudioKey, Level5.DEADGE_AUDIO_PATH);

        //this.load.audio("GRAPPLE_0", "hw4_assets/sounds/grapple_0.mp3");
        //this.load.audio("GRAPPLE_1", "hw4_assets/sounds/grapple_1.mp3");
        //this.load.audio("GRAPPLE_2", "hw4_assets/sounds/grapple_2.mp3");
        this.load.audio("ZIP_0", "hw4_assets/sounds/zip1.mp3");
        this.load.audio("ZIP_1", "hw4_assets/sounds/zip2.mp3");
        this.load.audio("PSHH", "hw4_assets/sounds/pshh.mp3");
        this.load.audio("SWITCH_1", "hw4_assets/sounds/switch1.wav");
        this.load.audio("SWITCH_2", "hw4_assets/sounds/switch2.wav");
        //this.load.audio("WIN", "hw4_assets/sounds/imsosorry.mp3");
    }

    /**
     * Unload resources for level 2
     */
    public unloadScene(): void {
        // TODO decide which resources to keep/cull 
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: Level5.LEVEL_MUSIC_KEY});
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.tileDestroyedAudioKey);
        this.load.keepAudio(this.damagedAudioKey);
        this.load.keepAudio(this.deadgeAudioKey);
        this.load.keepSpritesheet(this.playerSpriteKey);
    }

    public startScene(): void {
        super.startScene();
        // Set the next level to be Level2
        this.nextLevel = Level6;
        
        this.receiver.subscribe(HW3Events.LEVEL_CHANGE);
    }

    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up 
     * when I was making the tilemap for the first level is what it boils down to.
     * 
     * - Peter
     */
    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(0, 0, 2752, 4096);
    }

    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        if(event.type == HW3Events.LEVEL_CHANGE) {
            switch(event.data.get("level")) {
                case "1": {
                    console.log("CHEAT: Changing to Level 1");
                    this.sceneManager.changeToScene(Level1);
                }
                case "2": {
                    console.log("CHEAT: Changing to Level 2");
                    this.sceneManager.changeToScene(Level2);
                }
                case "3": {
                    console.log("CHEAT: Changing to Level 3");
                    this.sceneManager.changeToScene(Level3);
                }
                case "4": {
                    console.log("CHEAT: Changing to Level 4");
                    this.sceneManager.changeToScene(Level4);
                }
                case "6": {
                    console.log("CHEAT: Changing to Level 6");
                    this.sceneManager.changeToScene(Level6);
                }
            }
        }
    }

}