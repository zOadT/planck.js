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

import * as common from '../util/common';
import Vec2 from './Vec2';
import { isFinite, assert } from './Math';

// TODO merge with Transform

export default class Rot {

  public s: f64;
  public c: f64;

  /**
   * Initialize from an angle in radians.
   */
  constructor(angle?: f64 | Rot) {
    // if (!(this instanceof Rot)) {
    //   return new Rot(angle);
    // }
    if (typeof angle === 'number') {
      this.setAngle(angle);
    } else if (typeof angle === 'object') {
        this.set(angle);
    } else {
      this.setIdentity();
    }
  }

  public neo(angle: f64): Rot {
    var obj = Object.create(Rot.prototype);
    obj.setAngle(angle);
    return obj;
  };

  public static clone(rot: Rot): Rot {
    _ASSERT && Rot.assert(rot);
    var obj = Object.create(Rot.prototype);
    obj.s = rot.s;
    obj.c = rot.c;
    return obj;
  };

  public static identity(): Rot {
    var obj = Object.create(Rot.prototype);
    obj.s = 0.0;
    obj.c = 1.0;
    return obj;
  }

  public static isValid(o: Rot | null): boolean {
    return !!o && isFinite(o.s) && isFinite(o.c);
  }

  public static assert(o: any): asserts o is Rot {
    if (!_ASSERT) return;
    if (!Rot.isValid(o)) {
      _DEBUG && common.debug(o);
      throw new Error('Invalid Rot!');
    }
  }

  /**
   * Set to the identity rotation.
   */
  public setIdentity(): void {
    this.s = 0.0;
    this.c = 1.0;
  }

  public set(rot: Rot): void;
  public set(angle: f64): void;
  public set(angle: Rot | f64): void {
    if (typeof angle === 'object') {
      _ASSERT && Rot.assert(angle);
      this.s = angle.s;
      this.c = angle.c;

    } else {
      _ASSERT && assert(angle);
      // TODO_ERIN optimize
      this.s = Math.sin(angle);
      this.c = Math.cos(angle);
    }
  }

  /**
   * Set using an angle in radians.
   */
  public setAngle(angle: f64): void {
    _ASSERT && assert(angle);
    // TODO_ERIN optimize
    this.s = Math.sin(angle);
    this.c = Math.cos(angle);
  }

  /**
   * Get the angle in radians.
   */
  public getAngle(): f64 {
    return Math.atan2(this.s, this.c);
  }

  /**
   * Get the x-axis.
   */
  public getXAxis(): Vec2 {
    return Vec2.neo(this.c, this.s);
  }

  /**
   * Get the u-axis.
   */
  public getYAxis(): Vec2 {
    return Vec2.neo(-this.s, this.c);
  }

  /**
   * Multiply two rotations: q * r
   * 
   * @returns Rot
   */
  public static mul(rot: Rot, m: Rot): Rot;
  /**
   * Rotate a vector
   * 
   * @returns Vec2
   */
  public static mul(rot: Rot, m: Vec2): Vec2;
  public static mul(rot: Rot, m: Rot | Vec2): Rot | Vec2 {
    // _ASSERT && Rot.assert(rot);
    if ('c' in m && 's' in m) {
      _ASSERT && Rot.assert(m);
      // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
      // [qs qc] [rs rc] [qs*rc+qc*rs -qs*rs+qc*rc]
      // s = qs * rc + qc * rs
      // c = qc * rc - qs * rs
      var qr = Rot.identity();
      qr.s = rot.s * m.c + rot.c * m.s;
      qr.c = rot.c * m.c - rot.s * m.s;
      return qr;

    } else {
      _ASSERT && Vec2.assert(m);
      return Vec2.neo(rot.c * m.x - rot.s * m.y, rot.s * m.x + rot.c * m.y);
    }
  }

  public static mulRot(rot: Rot, m: Rot): Rot {
    _ASSERT && Rot.assert(rot);
    _ASSERT && Rot.assert(m);
    // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
    // [qs qc] [rs rc] [qs*rc+qc*rs -qs*rs+qc*rc]
    // s = qs * rc + qc * rs
    // c = qc * rc - qs * rs
    var qr = Rot.identity();
    qr.s = rot.s * m.c + rot.c * m.s;
    qr.c = rot.c * m.c - rot.s * m.s;
    return qr;
  }

  public static mulVec2(rot: Rot, m: Vec2): Vec2 {
    _ASSERT && Rot.assert(rot);
    _ASSERT && Vec2.assert(m);
    return Vec2.neo(rot.c * m.x - rot.s * m.y, rot.s * m.x + rot.c * m.y);
  }

  public static mulSub(rot: Rot, v: Vec2, w: Vec2): Vec2 {
    var x = rot.c * (v.x - w.x) - rot.s * (v.y - w.y);
    var y = rot.s * (v.x - w.x) + rot.c * (v.y - w.y);
    return Vec2.neo(x, y);
  }

  /**
   * Transpose multiply two rotations: qT * r
   * 
   * @returns Rot
   */
  public static mulT(rot: Rot, m: Rot): Rot;
  /**
   * Inverse rotate a vector
   * 
   * @returns Vec2
   */
  public static mulT(rot: Rot, m: Vec2): Vec2;
  public static mulT(rot: Rot, m: Rot | Vec2): Rot | Vec2 {
    if ('c' in m && 's' in m) {
      _ASSERT && Rot.assert(m);
      // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
      // [-qs qc] [rs rc] [-qs*rc+qc*rs qs*rs+qc*rc]
      // s = qc * rs - qs * rc
      // c = qc * rc + qs * rs
      var qr = Rot.identity();
      qr.s = rot.c * m.s - rot.s * m.c;
      qr.c = rot.c * m.c + rot.s * m.s;
      return qr;

    } else {
      _ASSERT && Vec2.assert(m);
      return Vec2.neo(rot.c * m.x + rot.s * m.y, -rot.s * m.x + rot.c * m.y);
    }
  }

  public static mulTRot(rot: Rot, m: Rot): Rot {
    _ASSERT && Rot.assert(m);
    // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
    // [-qs qc] [rs rc] [-qs*rc+qc*rs qs*rs+qc*rc]
    // s = qc * rs - qs * rc
    // c = qc * rc + qs * rs
    var qr = Rot.identity();
    qr.s = rot.c * m.s - rot.s * m.c;
    qr.c = rot.c * m.c + rot.s * m.s;
    return qr;
  }

  public static mulTVec2(rot: Rot, m: Vec2): Vec2 {
    _ASSERT && Vec2.assert(m);
    return Vec2.neo(rot.c * m.x + rot.s * m.y, -rot.s * m.x + rot.c * m.y);
  }

}
