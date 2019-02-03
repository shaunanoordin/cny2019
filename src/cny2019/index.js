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
    this.init = this.init.bind(this);

  }
  
  init() {
    const avo = this.avo;
    
    //Config
    //--------------------------------
    avo.config.debugMode = false;
    //--------------------------------
        
    //Images
    //--------------------------------
    avo.assets.images.rooster = new ImageAsset("assets/cny2019/rooster.png");
    avo.assets.images.fireworks = new ImageAsset("assets/cny2019/fireworks.png");
    avo.assets.images.background = new ImageAsset("assets/cny2019/city-background.png");
    avo.assets.images.comicIntro1 = new ImageAsset("assets/cny2019/comic-intro-1.png");
    avo.assets.images.comicIntro2 = new ImageAsset("assets/cny2019/comic-intro-2.png");
    avo.assets.images.comicIntro3 = new ImageAsset("assets/cny2019/comic-intro-3.png");
    avo.assets.images.comicIntro4 = new ImageAsset("assets/cny2019/comic-intro-4.png");
    avo.assets.images.comicIntro5 = new ImageAsset("assets/cny2019/comic-intro-5.png");
    avo.assets.images.comicWin1 = new ImageAsset("assets/cny2019/comic-win-1.png");
    avo.assets.images.comicWin2 = new ImageAsset("assets/cny2019/comic-win-2.png");
    avo.assets.images.comicWin3 = new ImageAsset("assets/cny2019/comic-win-3.png");
    avo.assets.images.comicLose = new ImageAsset("assets/cny2019/comic-lose.png");
    //--------------------------------

    //Animations
    //--------------------------------
    const STEPS_PER_SECOND = AVO.FRAMES_PER_SECOND / 10;
    this.animationSets = {
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
    for (let animationTitle in this.animationSets) {
      let animationSet = this.animationSets[animationTitle];
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
    
    console.log('action');
    
    if (avo.state === AVO.STATE_ACTION) {
      
    }
  }
  
  playIntroComic() {
    const avo = this.avo;
    
    avo.comicStrip = new ComicStrip(
      "introcomic",
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
    
    console.log('x')
    
    //Data
    //--------------------------------
    avo.actors = [];
    avo.store = {
      distance: 0,
      tick: 0,
      TICK_MAX: AVO.FRAMES_PER_SECOND * 2,
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
    avo.actors.push(avo.playerActor);
    //--------------------------------
  }
}
