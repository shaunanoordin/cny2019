/*  
AvO Adventure Game
==================

(Shaun A. Noordin || shaunanoordin.com || 20160517)
********************************************************************************
 */

import { AvO } from "./avo/index.js";
import { CNY2019 } from "./cny2019/index.js";
 
/*  Initialisations
 */
//==============================================================================
var app;
window.onload = function() {
  window.app = new AvO(new CNY2019());
};
//==============================================================================
