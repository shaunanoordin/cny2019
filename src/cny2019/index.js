/*
CNY2019
============

Happy Chinese New Year!

(Shaun A. Noordin || shaunanoordin.com || 20190203)
********************************************************************************
 */

import * as AVO from  "../avo/constants.js";
import { Story } from "../avo/story.js";
import { ComicStrip } from "../avo/comic-strip.js";
import { Actor, Zone } from "../avo/entities.js";
import { Utility, ImageAsset } from "../avo/utility.js";
import { Physics } from "../avo/physics.js";

export class CNY2019 extends Story {
  constructor() {
    super();
  }
  
  init() {
    const avo = this.avo;
    
    //Config
    //--------------------------------
    avo.config.debugMode = true;
    //--------------------------------
        
    //Images
    //--------------------------------
    avo.assets.images.rooster = new ImageAsset("assets/cny2019/rooster.png");
    avo.assets.images.fireworks = new ImageAsset("assets/cny2019/fireworks.png");
    avo.assets.images.background = new ImageAsset("assets/cny2019/city-background.png");
    avo.assets.images.comicIntro1 = new ImageAsset("assets/cny2019/comic-intro-1.png");
    avo.assets.images.comicWin1 = new ImageAsset("assets/cny2019/comic-win-1.png");
    //--------------------------------

    //Animations
    //--------------------------------
    const STEPS_PER_SECOND = AVO.FRAMES_PER_SECOND / 10;
    avo.animationSets = {
      rooster: {
        rule: AVO.ANIMATION_RULE_BASIC,
        tileWidth: 128,
        tileHeight: 128,
        tileOffsetX: -32,
        tileOffsetY: 0,
        actions: {
          idle: {
            loop: true,
            steps: [
              { col: 0, row: 0, duration: STEPS_PER_SECOND * 1 },
              { col: 0, row: 1, duration: STEPS_PER_SECOND * 1 },
              { col: 0, row: 2, duration: STEPS_PER_SECOND * 1 },
              { col: 0, row: 1, duration: STEPS_PER_SECOND * 1 },
            ],
          },
          walk: {
            loop: true,
            steps: [
              { col: 0, row: 0, duration: STEPS_PER_SECOND * 1 },
              { col: 0, row: 1, duration: STEPS_PER_SECOND * 1 },
              { col: 0, row: 2, duration: STEPS_PER_SECOND * 1 },
              { col: 0, row: 1, duration: STEPS_PER_SECOND * 1 },
            ],
          },
        },
      },
      fireworks: {
        rule: AVO.ANIMATION_RULE_DIRECTIONAL,
        tileWidth: 64,
        tileHeight: 64,
        tileOffsetX: 0,
        tileOffsetY: 0,
        actions: {
          idle: {
            loop: true,
            steps: [
              { col: 0, row: 0, duration: STEPS_PER_SECOND * 1 },
              { col: 0, row: 1, duration: STEPS_PER_SECOND * 1 },
              { col: 0, row: 2, duration: STEPS_PER_SECOND * 1 },
              { col: 0, row: 1, duration: STEPS_PER_SECOND * 1 },
            ],
          },
        },
      },
    };

    //Process Animations; expand steps to many frames per steps.
    for (let animationTitle in avo.animationSets) {
      let animationSet = avo.animationSets[animationTitle];
      for (let animationName in animationSet.actions) {
        let animationAction = animationSet.actions[animationName];
        let newSteps = [];
        for (let step of animationAction.steps) {
          for (let i = 0; i < step.duration; i++) { newSteps.push(step); }
        }
        animationAction.steps = newSteps;
      }
    }
    //--------------------------------
    
    //Start!
    //--------------------------------
    if (!avo.config.debugMode) {
      avo.changeState(AVO.STATE_COMIC, this.playIntroComic.bind(this));
    } else {
      avo.changeState(AVO.STATE_ACTION, this.playRacingGame.bind(this));
    }
    //--------------------------------
  }
  
  run_start() {
    const avo = this.avo;
  }
  
  run_action() {
    const avo = this.avo;
    
    if (avo.state === AVO.STATE_ACTION) {
      this.runRacingGame();
    }
  }
  
  postPaint() {
    const avo = this.avo;
    
    if (avo.state === AVO.STATE_START) {
      this.paintStartInstructions();
    } else if (avo.state === AVO.STATE_ACTION) {
      this.paintRacingScore();
    } else if (avo.state === AVO.STATE_END) {
      this.paintEndScore();
    }
  }
  
  paintStartInstructions() {
    const avo = this.avo;
  }
  
  paintRacingScore() {
    const avo = this.avo;
    
    avo.context2d.font = AVO.DEFAULT_FONT;
    let x = 0, y = 0;
    const SHADOW_COLOUR = "#c44";
    const TEXT_COLOUR = "#eee";
    const SHADOW_DIST = 2;
    
    //Paint the time remaining, in seconds
    //--------------------------------
    avo.context2d.textBaseline = "top";
    avo.context2d.textAlign = "left";
    x = 32;
    y = 32;
    
    const t = (avo.store.TIME_MAX - avo.store.time) / AVO.FRAMES_PER_SECOND;
    let strSeconds = Math.floor(t) + "";
    while (strSeconds.length < 2) strSeconds = "0"+ strSeconds;
    
    const strTimeRemaining = strSeconds;
    
    avo.context2d.fillStyle = SHADOW_COLOUR;
    avo.context2d.fillText(strTimeRemaining, x + SHADOW_DIST, y + SHADOW_DIST);
    avo.context2d.fillStyle = TEXT_COLOUR;
    avo.context2d.fillText(strTimeRemaining, x, y);
    //--------------------------------
    
    //Paint the score
    //--------------------------------
    avo.context2d.textBaseline = "top";
    avo.context2d.textAlign = "right";
    x = avo.canvasWidth - 32;
    y = 32;
    
    avo.context2d.fillStyle = SHADOW_COLOUR;
    avo.context2d.fillText(avo.store.score, x + SHADOW_DIST, y + SHADOW_DIST);
    avo.context2d.fillStyle = TEXT_COLOUR;
    avo.context2d.fillText(avo.store.score, x, y);
    //--------------------------------
  }
  
  paintEndScore() {
    const avo = this.avo;
  }
  
  playIntroComic() {
    const avo = this.avo;
    
    avo.comicStrip = new ComicStrip(
      "introComic",
      [ avo.assets.images.comicIntro1 ],
      this.finishIntroComic.bind(this)
    );
  }
  
  finishIntroComic() {
    const avo = this.avo;
    avo.changeState(AVO.STATE_ACTION, this.playRacingGame.bind(this));
  }
  
  playRacingGame() {
    const avo = this.avo;
    
    //Data
    //--------------------------------
    avo.actors = [];
    avo.store = {
      score: 0,
      distance: 0,
      TARGET_DISTANCE: 1000,
      runningSpeed: 0,
      RUNNING_SPEED_MIN: 2,
      RUNNING_SPEED_MAX: 16,
      MIN_Y: 128,  //Portion of the screen that the player cannot go above
      MAX_Y: avo.canvasHeight - 128,  //Portion of the screen that the player cannot go above
      tick: 0,
      TICK_MAX: AVO.FRAMES_PER_SECOND * 2,
      time: 0,
      TIME_MAX: AVO.FRAMES_PER_SECOND * 10,
    };
    //--------------------------------

    //Player
    //--------------------------------
    const midX = avo.canvasWidth / 2, midY = avo.canvasHeight / 2;
    
    avo.playerActor = new Actor("player", midX / 2, midY, 64, AVO.SHAPE_CIRCLE);
    avo.playerActor.spritesheet = avo.assets.images.rooster;
    avo.playerActor.animationSet = avo.animationSets.rooster;
    avo.playerActor.attributes[AVO.ATTR.SPEED] = 8;
    avo.playerActor.rotation = AVO.ROTATION_EAST;
    avo.playerActor.shadowSize = 0;
    avo.actors.push(avo.playerActor);
    //--------------------------------
  }
  
  runRacingGame() {
    const avo = this.avo;
    
    //Player: keep in bounds of screen
    //--------------------------------
    if (avo.playerActor.x < 0) avo.playerActor.x = 0;
    if (avo.playerActor.y < avo.store.MIN_Y) avo.playerActor.y = avo.store.MIN_Y;
    if (avo.playerActor.x > avo.canvasWidth) avo.playerActor.x = avo.canvasWidth;
    if (avo.playerActor.y > avo.store.MAX_Y) avo.playerActor.y = avo.store.MAX_Y;
    //--------------------------------

    //Time and Space
    //--------------------------------
    avo.store.runningSpeed = Math.floor(
      (avo.playerActor.x / avo.canvasWidth) * 
      (avo.store.RUNNING_SPEED_MAX - avo.store.RUNNING_SPEED_MIN) +
      avo.store.RUNNING_SPEED_MIN
    );
    avo.store.time++;
    avo.store.distance += avo.store.runningSpeed;
    //--------------------------------

    //Win condition?
    //--------------------------------
    if (avo.store.time >= avo.store.TIME_MAX) {
      avo.changeState(AVO.STATE_COMIC, this.playWinComic.bind(this));
    }
    //--------------------------------
    
    //Run physics for non-player Actors.
    //--------------------------------
    avo.actors.map((actor) => {
      if (actor === avo.playerActor) return;

      //Everything scrolls past!
      actor.x -= avo.store.runningSpeed;

      //Check if something is colliding with the player.
      if (Physics.checkCollision(actor, avo.playerActor)) {
        if (!actor.attributes.hasBeenTouched) {
          actor.attributes.hasBeenTouched = true;
          actor.rotation = AVO.ROTATION_EAST;  //TMP
          avo.store.score++;
        }
      }
    });

    //Add new stuff.
    this.spawnRandomObject(avo.store.distance / avo.store.TARGET_DISTANCE * 100);

    //Clean up! If it's not the player or on the screen, get rid of it.
    avo.actors = avo.actors.filter((actor) => {
      return actor === avo.playerActor || actor.x >= 0;
    });
  }
  
  spawnRandomObject(distancePercent = 100) {
    const avo = this.avo;    
    if (Math.random() > 0.05) return;
    
    const x = avo.canvasWidth * 1.1;
    const y = avo.store.MIN_Y + Math.floor(Math.random() * (avo.store.MAX_Y - avo.store.MIN_Y));
    
    const actor = new Actor("coin", x, y, 32, AVO.SHAPE_CIRCLE);
    actor.solid = false;
    actor.spritesheet = avo.assets.images.fireworks;
    actor.animationSet = avo.animationSets.fireworks;
    actor.playAnimation("idle");
    actor.rotation = AVO.ROTATION_NORTH;
    //actor.attributes.value = 1;
    actor.attributes.hasBeenTouched = false;
    avo.actors.push(actor);
  }
  
  playWinComic() {
    const avo = this.avo;
    
    avo.comicStrip = new ComicStrip(
      "winComic",
      [ avo.assets.images.comicWin1 ],
      this.playIntroComic.bind(this)
    );
  }
}
