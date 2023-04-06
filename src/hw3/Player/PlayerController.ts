import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import Jump from "./PlayerStates/Jump";
import Walk from "./PlayerStates/Walk";

import PlayerWeapon from "./PlayerWeapon";
import PlayerGrapple from "./PlayerGrapple";
import Input from "../../Wolfie2D/Input/Input";
import Receiver from "../../Wolfie2D/Events/Receiver";

import { HW3Controls } from "../HW3Controls";
import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW3Events } from "../HW3Events";
import Dead from "./PlayerStates/Dead";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";

// TODO play your heros animations

/**
 * Animation keys for the player spritesheet
 */
export const PlayerAnimations = {
    IDLE: "IDLE",
    WALK: "WALK",
    JUMP: "JUMP",
    TAKING_DAMAGE: "TAKING_DAMAGE",
    DYING: "DYING",
    DEATH: "DEAD",
} as const

/**
 * Tween animations the player can player.
 */
export const PlayerTweens = {
    FLIP: "FLIP",
    FLIPL: "FLIPL",
    FLIPR: "FLIPR",
    DEATH: "DEATH"
} as const

/**
 * Keys for the states the PlayerController can be in.
 */
export const PlayerStates = {
    IDLE: "IDLE",
    WALK: "WALK",
	JUMP: "JUMP",
    FALL: "FALL",
    DEAD: "DEAD",
} as const

/**
 * The controller that controls the player.
 */
export default class PlayerController extends StateMachineAI {
    public readonly MAX_SPEED: number = 200;
    public readonly MIN_SPEED: number = 100;

    /** Health and max health for the player */
    protected _health: number;
    protected _maxHealth: number;

    /** The players game node */
    protected owner: HW3AnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;
    // protected cannon: Sprite;
    protected weapon: PlayerWeapon;
    protected grapple: PlayerGrapple;
    protected grapple_last_used: number;
    protected grapple_cooldown: number = 1000;
    protected grapple_enabled: boolean = true;

    protected receiver: Receiver;

    
    public initializeAI(owner: HW3AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.weapon = options.weaponSystem;
        this.grapple = options.grappleSystem;
        this.grapple_last_used = 0;
        this.owner.setGroup(HW3PhysicsGroups.PLAYER);

        this.receiver = new Receiver();
        this.receiver.subscribe(HW3Events.GRAPPLE_HIT);

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = 400;
        this.velocity = Vec2.ZERO;

        this.health = 5
        this.maxHealth = 5;

        // Add the different states the player can be in to the PlayerController 
		this.addState(PlayerStates.IDLE, new Idle(this, this.owner));
		this.addState(PlayerStates.WALK, new Walk(this, this.owner));
        this.addState(PlayerStates.JUMP, new Jump(this, this.owner));
        this.addState(PlayerStates.FALL, new Fall(this, this.owner));
        this.addState(PlayerStates.DEAD, new Dead(this, this.owner));
        
        // Start the player in the Idle state
        this.initialize(PlayerStates.IDLE);
    }

    handleEvent(event: GameEvent): void {
        switch (event.type) {
            case HW3Events.GRAPPLE_HIT: {
                console.log("Grapple!");
                //if (this.owner.onGround || this.velocity.y < 0) this.velocity.y = 0;
                this.velocity.mult(Vec2.ZERO);
                this.velocity.add(event.data.get('velocity'));
                /* if (this.owner.onGround || this.velocity.y < 0) this.velocity = event.data.get('velocity');
                else {
                    this.velocity.x += event.data.get('velocity').x;
                    this.velocity.y += event.data.get('velocity').y*2;
                } */
                /* this.changeState(PlayerStates.IDLE); */
                /* this.owner.move(event.data.get('velocity')); */
                break;
            }
            default: {
                console.log("DEFAULT");
            }
        }
    }

    /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		direction.x = (Input.isPressed(HW3Controls.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(HW3Controls.MOVE_RIGHT) ? 1 : 0);
		direction.y = (Input.isJustPressed(HW3Controls.JUMP) ? -1 : 0);
		return direction;
    }
    /** 
     * Gets the direction of the mouse from the player's position as a Vec2
     */
    public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    public update(deltaT: number): void {
		super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        // If the player hits the attack button and the weapon system isn't running, restart the system and fire!
        if ((Input.isPressed(HW3Controls.ATTACK)/*  || Input.isMouseJustPressed(0) */) && !this.weapon.isSystemRunning()) {
            // Start the particle system at the player's current position
            this.weapon.startSystem(500, 0, this.owner.position);
            if (this.faceDir.x < 0) this.owner.animation.play("ATTACKING_LEFT", false, undefined);
            else this.owner.animation.play("ATTACKING_RIGHT", false, undefined);
            this.owner.animation.queue("IDLE", false, undefined);
        }

        // Detect right-click and handle with grapple firing
        if (this.grapple_enabled && Input.isMouseJustPressed(2) && !this.grapple.isSystemRunning()) {
            if (!this.grapple_last_used || (Date.now() - this.grapple_last_used) > this.grapple_cooldown) {
                this.grapple_last_used = Date.now();
                this.grapple.setDir(Input.getGlobalMousePosition());
                this.grapple.startSystem(500, 0, this.owner.position);
                if (this.faceDir.x < 0) this.owner.animation.play("ATTACKING_LEFT", false, undefined);
                else this.owner.animation.play("ATTACKING_RIGHT", false, undefined);
                this.owner.animation.queue("IDLE", false, undefined);
            } else console.log("CD!");
        }

	}

    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public get maxHealth(): number { return this._maxHealth; }
    public set maxHealth(maxHealth: number) { 
        this._maxHealth = maxHealth; 
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
    }

    public get health(): number { return this._health; }
    public set health(health: number) { 
        this._health = MathUtils.clamp(health, 0, this.maxHealth);
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
        /* this.owner.animation.play("TAKING_DAMAGE");
        this.owner.animation.queue("IDLE", false, undefined); */
        // If the health hit 0, change the state of the player
        if (this.health === 0) { 
            this.changeState(PlayerStates.DEAD); 
            this.emitter.fireEvent("DYING");
        }
    }
}