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
import Level3 from "./HW3Level3";
import Level4 from "./HW3Level4";
import Level5 from "./HW3Level5";
import Level6 from "./HW3Level6";

export default class Level2 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(32, 608);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Tepster.json";

    public static readonly ENEMY_SPRITE_KEY = "ENEMY_SPRITE_KEY";
    public static readonly ENEMY_SPRITE_PATH = "hw4_assets/spritesheets/Enemy.json";

    public static readonly BOSS_SPAWN = new Vec2(1790, 3672);
    public static readonly BOSS_SPRITE_KEY = "BOSS_SPRITE_KEY";
    public static readonly BOSS_SPRITE_PATH = "hw4_assets/spritesheets/Tepster.json";

    public static readonly TILEMAP_KEY = "LEVEL2";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/L2.json";
    public static readonly TILEMAP_SCALE = new Vec2(2, 2);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Main";
    public static readonly DEATH_LAYER_KEY = "Death";
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/desert.mp3";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "hw4_assets/sounds/jump.wav";

    public static readonly DASH_AUDIO_KEY = "PLAYER_DASH";
    public static readonly DASH_AUDIO_PATH = "hw4_assets/sounds/dash.mp3";
    
    public static readonly DAMAGED_AUDIO_KEY = "PLAYER_DAMAGED";
    public static readonly DAMAGED_AUDIO_PATH = "hw4_assets/sounds/pdamage.wav";

    public static readonly DEADGE_AUDIO_KEY = "PLAYER_DEADGE";
    public static readonly DEADGE_AUDIO_PATH = "hw4_assets/sounds/deadge.mp3";

    public static readonly ENEMY_KILL_AUDIO_KEY = "ENEMY_KILL";
    public static readonly ENEMY_KILL_AUDIO_PATH = "hw4_assets/sounds/enemykill.mp3";

    public static readonly ENEMY_SHOOT_AUDIO1_KEY = "ENEMY_SHOOT1";
    public static readonly ENEMY_SHOOT_AUDIO1_PATH = "hw4_assets/sounds/shotgun.mp3";

    public static readonly ENEMY_SHOOT_AUDIO2_KEY = "ENEMY_SHOOT2";
    public static readonly ENEMY_SHOOT_AUDIO2_PATH = "hw4_assets/sounds/shotgun2.mp3";

    public static readonly ENEMY_SHOOT_AUDIO3_KEY = "ENEMY_SHOOT3";
    public static readonly ENEMY_SHOOT_AUDIO3_PATH = "hw4_assets/sounds/shotgun3.mp3";

    public static readonly BOSS_KILL_AUDIO_KEY = "BOSS_KILL";
    public static readonly BOSS_KILL_AUDIO_PATH = "hw4_assets/sounds/bosskill.mp3";

    public static readonly TILE_DESTROYED_KEY = "TILE_DESTROYED";
    public static readonly TILE_DESTROYED_PATH = "hw4_assets/sounds/switch.wav";
    
    public static readonly SWITCH_ERR_KEY = "SWITCH_ERR";
    public static readonly SWITCH_ERR_PATH = "hw4_assets/sounds/err.mp3";

    public static readonly LEVEL_END = new AABB(new Vec2(928, 3632), new Vec2(24, 16));

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        this.tilemapKey = Level2.TILEMAP_KEY;
        this.tilemapScale = Level2.TILEMAP_SCALE;
        this.destructibleLayerKey = Level2.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = Level2.WALLS_LAYER_KEY;
        this.deathLayerKey = Level2.DEATH_LAYER_KEY;

        this.playerSpriteKey = Level2.PLAYER_SPRITE_KEY;
        this.playerSpawn = Level2.PLAYER_SPAWN;

        this.bossSpriteKey = Level2.BOSS_SPRITE_KEY;
        this.bossSpawn = Level2.BOSS_SPAWN;
        this.boss_in_present = false;
        this.final_boss = false;

        this.levelMusicKey = Level2.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level2.JUMP_AUDIO_KEY;
        this.dashAudioKey = Level2.DASH_AUDIO_KEY;
        this.tileDestroyedAudioKey = Level2.TILE_DESTROYED_KEY;
        this.damagedAudioKey = Level2.DAMAGED_AUDIO_KEY;
        this.deadgeAudioKey = Level2.DEADGE_AUDIO_KEY;
        this.enemyKillAudioKey = Level2.ENEMY_KILL_AUDIO_KEY;
        this.bossKillAudioKey = Level2.BOSS_KILL_AUDIO_KEY;
        this.enemyShootAudioKey1 = Level2.ENEMY_SHOOT_AUDIO1_KEY;
        this.enemyShootAudioKey2 = Level2.ENEMY_SHOOT_AUDIO2_KEY;
        this.enemyShootAudioKey3 = Level2.ENEMY_SHOOT_AUDIO3_KEY;
        this.switchErrAudioKey = Level2.SWITCH_ERR_KEY;

        this.levelEndPosition = new Vec2(54, 132).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 32).mult(this.tilemapScale);
        this.levelEnd2Position = new Vec2(54, 132).mult(this.tilemapScale);
        this.levelEnd2HalfSize = new Vec2(32, 32).mult(this.tilemapScale);
        this.pastPosition = new Vec2(688, 1584).mult(this.tilemapScale);
    }

    public loadScene(): void {
        this.viewport.setCurrentZoom(0);
        this.load.tilemap(this.tilemapKey, Level2.TILEMAP_PATH);
        this.load.spritesheet(this.playerSpriteKey, Level2.PLAYER_SPRITE_PATH);
        this.load.spritesheet(this.bossSpriteKey, Level2.BOSS_SPRITE_PATH);
        this.load.spritesheet(Level2.ENEMY_SPRITE_KEY, Level2.ENEMY_SPRITE_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level2.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, Level2.JUMP_AUDIO_PATH);
        this.load.audio(this.dashAudioKey, Level1.DASH_AUDIO_PATH);
        this.load.audio(this.tileDestroyedAudioKey, Level2.TILE_DESTROYED_PATH);
        this.load.audio(this.damagedAudioKey, Level2.DAMAGED_AUDIO_PATH);
        this.load.audio(this.deadgeAudioKey, Level2.DEADGE_AUDIO_PATH);
        this.load.audio(this.enemyKillAudioKey, Level2.ENEMY_KILL_AUDIO_PATH);
        this.load.audio(this.enemyShootAudioKey1, Level2.ENEMY_SHOOT_AUDIO1_PATH);
        this.load.audio(this.enemyShootAudioKey2, Level2.ENEMY_SHOOT_AUDIO2_PATH);
        this.load.audio(this.enemyShootAudioKey3, Level2.ENEMY_SHOOT_AUDIO3_PATH);
        this.load.audio(this.bossKillAudioKey, Level2.BOSS_KILL_AUDIO_PATH);
        this.load.audio(this.switchErrAudioKey, Level2.SWITCH_ERR_PATH);

        this.load.image(HW3Level.healthFrameKey, HW3Level.healthFramePath);
        this.load.image(HW3Level.healthFrame2Key, HW3Level.healthFrame2Path);
        this.load.image(HW3Level.cswitchKey, HW3Level.cswitchPath);
        //this.load.audio("GRAPPLE_0", "hw4_assets/sounds/grapple_0.mp3");
        //this.load.audio("GRAPPLE_1", "hw4_assets/sounds/grapple_1.mp3");
        //this.load.audio("GRAPPLE_2", "hw4_assets/sounds/grapple_2.mp3");
        this.load.audio("ZIP_0", "hw4_assets/sounds/zip1.mp3");
        this.load.audio("ZIP_1", "hw4_assets/sounds/zip2.mp3");
        this.load.audio("PSHH", "hw4_assets/sounds/pshh.mp3");
        this.load.audio("SHOOT", "hw4_assets/sounds/gunshot.mp3");
        this.load.audio("SWITCH_1", "hw4_assets/sounds/switch1.wav");
        this.load.audio("SWITCH_2", "hw4_assets/sounds/switch2.wav");
        this.load.audio("PEEK", "hw4_assets/sounds/peek.mp3");
        this.load.audio("PDAMAGE2", "hw4_assets/sounds/pdamage2.wav");
        //this.load.audio("PDAMAGE", "hw4_assets/sounds/oof1.mp3");
        //this.load.audio("WIN", "hw4_assets/sounds/imsosorry.mp3");
    }

    public unloadScene(): void {
        //super.completedLevel(2);
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: Level2.LEVEL_MUSIC_KEY});
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.tileDestroyedAudioKey);
        this.load.keepAudio(this.damagedAudioKey);
        this.load.keepAudio(this.deadgeAudioKey);
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepAudio("ZIP_0");
        this.load.keepAudio("ZIP_1");
        this.load.keepAudio("PSHH");
        this.load.keepAudio("SWITCH_1");
        this.load.keepAudio("SWITCH_2");
        this.load.keepImage(HW3Level.healthFrameKey);
        this.load.keepImage(HW3Level.healthFrame2Key);
        this.load.keepImage(HW3Level.cswitchKey);
    }

    public startScene(): void {
        super.startScene();
        this.nextLevel = Level3;
        this.currentLevel = Level2;
        this.level = 2;
        
        this.receiver.subscribe(HW3Events.LEVEL_CHANGE);

        const presentPositions = [
            [450,590,100],[700,550,100],
            [1218,1065,50],[1617,1000,100],
            [1208, 712, 0], // on the way down
            [1448, 594, 20], // right of first hole
            [2477, 1071, 0], // left of second hole
            [2450, 1407, 100], // bottom of second hole
        ];
        const pastPositions = [
            [665,2800,100],
            [1000,2800,100],
            [1826,3298,100],
            [1304, 2856, 200], // on breaking ground
            [2351, 3295, 100], // left of second hole
            [2339, 3660, 0], [2391, 3660, 0], [2433, 3661, 0]
        ];

        for (const pos of presentPositions) {
            super.addNewEnemy(Level2.ENEMY_SPRITE_KEY, new Vec2(pos[0], pos[1]), true, pos[2]);
        }
        for (const pos of pastPositions) {
            super.addNewEnemy(Level2.ENEMY_SPRITE_KEY, new Vec2(pos[0], pos[1]), false, pos[2]);
        }
    }

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
                    break;
                }
                case "3": {
                    console.log("CHEAT: Changing to Level 3");
                    this.sceneManager.changeToScene(Level3);
                    break;
                }
                case "4": {
                    console.log("CHEAT: Changing to Level 4");
                    this.sceneManager.changeToScene(Level4);
                    break;
                }
                case "5": {
                    console.log("CHEAT: Changing to Level 5");
                    this.sceneManager.changeToScene(Level5);
                    break;
                }
                case "6": {
                    console.log("CHEAT: Changing to Level 6");
                    this.sceneManager.changeToScene(Level6);
                    break;
                }
            }
        }
    }

}