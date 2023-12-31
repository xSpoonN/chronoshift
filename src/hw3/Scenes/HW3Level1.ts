import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./HW3Level";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import HW4Level2 from "./HW3Level2";
import { HW3Events } from "../HW3Events";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Level2 from "./HW3Level2";
import Level3 from "./HW3Level3";
import Level4 from "./HW3Level4";
import Level5 from "./HW3Level5";
import Level6 from "./HW3Level6";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import Color from "../../Wolfie2D/Utils/Color";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";

export default class Level1 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(32, 608);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Tepster.json";

    public static readonly ENEMY_SPRITE_KEY = "ENEMY_SPRITE_KEY";
    public static readonly ENEMY_SPRITE_PATH = "hw4_assets/spritesheets/Enemy.json";

    public static readonly BOSS_SPAWN = new Vec2(100, 3480);
    public static readonly BOSS_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly BOSS_SPRITE_PATH = "hw4_assets/spritesheets/Tepster.json";

    public static readonly TILEMAP_KEY = "LEVEL1";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/L1.json";
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

        this.tilemapKey = Level1.TILEMAP_KEY;
        this.tilemapScale = Level1.TILEMAP_SCALE;
        this.destructibleLayerKey = Level1.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = Level1.WALLS_LAYER_KEY;
        this.deathLayerKey = Level1.DEATH_LAYER_KEY;

        this.playerSpriteKey = Level1.PLAYER_SPRITE_KEY;
        this.playerSpawn = Level1.PLAYER_SPAWN;

        this.bossSpriteKey = Level1.BOSS_SPRITE_KEY;
        this.bossSpawn = Level1.BOSS_SPAWN;
        this.boss_in_present = false;
        this.final_boss = false;

        // Music and sound
        this.levelMusicKey = Level1.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;
        this.dashAudioKey = Level1.DASH_AUDIO_KEY;
        this.tileDestroyedAudioKey = Level1.TILE_DESTROYED_KEY;
        this.damagedAudioKey = Level1.DAMAGED_AUDIO_KEY;
        this.deadgeAudioKey = Level1.DEADGE_AUDIO_KEY;
        this.enemyKillAudioKey = Level1.ENEMY_KILL_AUDIO_KEY;
        this.bossKillAudioKey = Level1.BOSS_KILL_AUDIO_KEY;
        this.enemyShootAudioKey1 = Level1.ENEMY_SHOOT_AUDIO1_KEY;
        this.enemyShootAudioKey2 = Level1.ENEMY_SHOOT_AUDIO2_KEY;
        this.enemyShootAudioKey3 = Level1.ENEMY_SHOOT_AUDIO3_KEY;
        this.switchErrAudioKey = Level1.SWITCH_ERR_KEY;

        this.levelEndPosition = new Vec2(36, 620).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(0, 0).mult(this.tilemapScale);
        this.levelEnd2Position = new Vec2(36, 1740).mult(this.tilemapScale);
        this.levelEnd2HalfSize = new Vec2(0, 0).mult(this.tilemapScale);
        this.pastPosition = new Vec2(688, 1584).mult(this.tilemapScale);
    }

    public loadScene(): void {
        this.viewport.setCurrentZoom(0);
        this.load.tilemap(this.tilemapKey, Level1.TILEMAP_PATH);
        this.load.spritesheet(this.playerSpriteKey, Level1.PLAYER_SPRITE_PATH);
        this.load.spritesheet(this.bossSpriteKey, Level1.BOSS_SPRITE_PATH);
        this.load.spritesheet(Level1.ENEMY_SPRITE_KEY, Level1.ENEMY_SPRITE_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level1.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, Level1.JUMP_AUDIO_PATH);
        this.load.audio(this.dashAudioKey, Level1.DASH_AUDIO_PATH);
        this.load.audio(this.tileDestroyedAudioKey, Level1.TILE_DESTROYED_PATH);
        this.load.audio(this.damagedAudioKey, Level1.DAMAGED_AUDIO_PATH);
        this.load.audio(this.deadgeAudioKey, Level1.DEADGE_AUDIO_PATH);
        this.load.audio(this.enemyKillAudioKey, Level1.ENEMY_KILL_AUDIO_PATH);
        this.load.audio(this.enemyShootAudioKey1, Level1.ENEMY_SHOOT_AUDIO1_PATH);
        this.load.audio(this.enemyShootAudioKey2, Level1.ENEMY_SHOOT_AUDIO2_PATH);
        this.load.audio(this.enemyShootAudioKey3, Level1.ENEMY_SHOOT_AUDIO3_PATH);
        this.load.audio(this.bossKillAudioKey, Level1.BOSS_KILL_AUDIO_PATH);
        this.load.audio(this.switchErrAudioKey, Level1.SWITCH_ERR_PATH);

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

    public initializeTilemap(): void {
        super.initializeTilemap();

        const tutorialMoveTrigger = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(100, 620), size: new Vec2(200, 100) });
        tutorialMoveTrigger.addPhysics(undefined, undefined, false, true);
        tutorialMoveTrigger.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_MOVE", null);
        tutorialMoveTrigger.color = new Color(255, 0, 255, 0);

        const tutorialJumpTrigger = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(420, 620), size: new Vec2(150, 100) });
        tutorialJumpTrigger.addPhysics(undefined, undefined, false, true);
        tutorialJumpTrigger.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_JUMP", null);
        tutorialJumpTrigger.color = new Color(255, 0, 255, 0);

        const tutorialDashTrigger = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(700, 620), size: new Vec2(200, 100) });
        tutorialDashTrigger.addPhysics(undefined, undefined, false, true);
        tutorialDashTrigger.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_DASH", null);
        tutorialDashTrigger.color = new Color(255, 0, 255, 0);

        const tutorialSwitchTrigger = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(1050, 620), size: new Vec2(200, 100) });
        tutorialSwitchTrigger.addPhysics(undefined, undefined, false, true);
        tutorialSwitchTrigger.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_SWITCH", null);
        tutorialSwitchTrigger.color = new Color(255, 0, 255, 0);

        const tutorialPeekTrigger = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(1250, 2860), size: new Vec2(200, 100) });
        tutorialPeekTrigger.addPhysics(undefined, undefined, false, true);
        tutorialPeekTrigger.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_PEEK", null);
        tutorialPeekTrigger.color = new Color(255, 0, 255, 0);

        const tutorialSwitch2 = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(1550, 2860), size: new Vec2(200, 100) });
        tutorialSwitch2.addPhysics(undefined, undefined, false, true);
        tutorialSwitch2.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_SWITCH2", null);
        tutorialSwitch2.color = new Color(255, 0, 255, 0);

        const tutorialFallTrigger = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(1600, 620), size: new Vec2(200, 100) });
        tutorialFallTrigger.addPhysics(undefined, undefined, false, true);
        tutorialFallTrigger.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_FALL", null);
        tutorialFallTrigger.color = new Color(255, 0, 255, 0);

        const tutorialGrappleTrigger = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(1650, 1350), size: new Vec2(200, 100) });
        tutorialGrappleTrigger.addPhysics(undefined, undefined, false, true);
        tutorialGrappleTrigger.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_GRAPPLE", null);
        tutorialGrappleTrigger.color = new Color(255, 0, 255, 0);

        const tutorialPuzzleTrigger = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(450, 1260), size: new Vec2(200, 100) });
        tutorialPuzzleTrigger.addPhysics(undefined, undefined, false, true);
        tutorialPuzzleTrigger.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_PUZZLE", null);
        tutorialPuzzleTrigger.color = new Color(255, 0, 255, 0);

        const tutorialZoomTrigger = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(820, 1260), size: new Vec2(200, 100) });
        tutorialZoomTrigger.addPhysics(undefined, undefined, false, true);
        tutorialZoomTrigger.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_ZOOM", null);
        tutorialZoomTrigger.color = new Color(255, 0, 255, 0);

        const tutorialShootTrigger = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(240, 3480), size: new Vec2(200, 100) });
        tutorialShootTrigger.addPhysics(undefined, undefined, false, true);
        tutorialShootTrigger.setTrigger(HW3PhysicsGroups.PLAYER, "TUTORIAL_SHOOT", null);
        tutorialShootTrigger.color = new Color(255, 0, 255, 0);
    }

    protected subscribeToEvents(): void {
        super.subscribeToEvents();
        this.receiver.subscribe("TUTORIAL_MOVE");
        this.receiver.subscribe("TUTORIAL_JUMP");
        this.receiver.subscribe("TUTORIAL_DASH");
        this.receiver.subscribe("TUTORIAL_SWITCH");
        this.receiver.subscribe("TUTORIAL_PEEK");
        this.receiver.subscribe("TUTORIAL_SWITCH2");
        this.receiver.subscribe("TUTORIAL_FALL");
        this.receiver.subscribe("TUTORIAL_GRAPPLE");
        this.receiver.subscribe("TUTORIAL_PUZZLE");
        this.receiver.subscribe("TUTORIAL_ZOOM");
        this.receiver.subscribe("TUTORIAL_SHOOT");
    }

    public unloadScene(): void {
        //super.completedLevel(1);
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: Level1.LEVEL_MUSIC_KEY});
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
        this.nextLevel = Level2;
        this.currentLevel = Level1;
        this.level = 1;

        this.receiver.subscribe(HW3Events.LEVEL_CHANGE);

        // 2 body guards for boss
        super.addNewEnemy(Level1.ENEMY_SPRITE_KEY, this.bossSpawn.clone().add(new Vec2(50, 0)), false);
        super.addNewEnemy(Level1.ENEMY_SPRITE_KEY, this.bossSpawn.clone().add(new Vec2(70, 0)), false);
    }

    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(0, 0, 2752, 4096);
    }

    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        switch(event.type) {
            case HW3Events.LEVEL_CHANGE: {
                switch (event.data.get("level")) {
                    case "2": {
                        console.log("CHEAT: Changing to Level 2");
                        this.sceneManager.changeToScene(Level2);
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
                break;
            }
            case "TUTORIAL_MOVE": {
                this.tutorialText.text = "Press A and D to move left and right";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
            case "TUTORIAL_JUMP": {
                this.tutorialText.text = "Press W or Space to jump";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
            case "TUTORIAL_DASH": {
                this.tutorialText.text = "Dash in mid-air with SHIFT+A or SHIFT+D";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
            case "TUTORIAL_SWITCH": {
                this.tutorialText.text = "Press S to SWITCH between past & present";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
            case "TUTORIAL_PEEK": {
                this.tutorialText.text = "Hold E to PEEK into the other dimension";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
            case "TUTORIAL_SWITCH2": {
                this.tutorialText.text = "Press S to go back to the present";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
            case "TUTORIAL_FALL": {
                this.tutorialText.text = "There's no fall damage, jump on down!";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
            case "TUTORIAL_GRAPPLE": {
                this.tutorialText.text = "RIGHT CLICK to GRAPPLE!";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
            case "TUTORIAL_PUZZLE": {
                this.tutorialText.text = "GRAPPLE then SWITCH quickly!";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
            case "TUTORIAL_ZOOM": {
                this.tutorialText.text = "Use Scroll Wheel to Zoom In/Out!";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
            case "TUTORIAL_SHOOT": {
                this.tutorialText.text = "Left Click to Shoot!";
                if (this.tutorialText.backgroundColor.a == 0) {
                    this.tutorialText.tweens.play("fadeIn");
                }
                setTimeout(() => {
                    this.tutorialText?.tweens?.play("fadeOut");
                }, 100)
                break;
            }
        }
    }

}