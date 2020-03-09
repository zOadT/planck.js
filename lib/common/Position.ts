/*
 * Copyright (c) 2016-2018 Ali Shakiba http://shakiba.me/planck.js
 * Copyright (c) 2006-2011 Erin Catto  http://www.box2d.org
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

import Vec2 from './Vec2';
import Rot from './Rot';
import type Transform from './Transform';

export default class Position {
  /**
   * location
   */
  public c: Vec2 = Vec2.zero();
  /**
   * angle
   */
  public a: f64 = 0;

  public getTransform(xf: Transform, p: Vec2): Transform {
    xf.q.set(this.a);
    xf.p.set(Vec2.sub(this.c, Rot.mulVec2(xf.q, p)));
    return xf;
  }
}
