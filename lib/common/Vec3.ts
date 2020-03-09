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
import { isFinite } from './Math';

export default class Vec3 {
  
  public x: f64;
  public y: f64;
  public z: f64;

  constructor(x: f64, y: f64, z: f64);
  constructor(v: Vec3);
  constructor();
  constructor(x?: Vec3 | f64, y: f64 = 0, z: f64 = 0) {
    // if (!(this instanceof Vec3)) {
    //   return new Vec3(x, y, z);
    // }
    if (typeof x === 'undefined') {
      this.x = 0, this.y = 0, this.z = 0;
    } else if (typeof x === 'object') {
      this.x = x.x, this.y = x.y, this.z = x.z;
    } else {
      this.x = x, this.y = y, this.z = z;
    }
    _ASSERT && Vec3.assert(this);
  }

  public _serialize(): { x: f64, y: f64, z: f64 } {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  };

  public _deserialize(data: { x: f64, y: f64, z: f64 }): Vec3 {
    var obj = Object.create(Vec3.prototype);
    obj.x = data.x;
    obj.y = data.y;
    obj.z = data.z;
    return obj;
  }

  public static neo(x: f64, y: f64, z: f64) {
    var obj = Object.create(Vec3.prototype);
    obj.x = x;
    obj.y = y;
    obj.z = z;
    return obj;
  }

  public static clone(v: Vec3): Vec3 {
    _ASSERT && Vec3.assert(v);
    return Vec3.neo(v.x, v.y, v.z);
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  /**
   * Does this vector contain finite coordinates?
   */
  public static isValid(v: Vec3 | null): boolean {
    return !!v && isFinite(v.x) && isFinite(v.y) && isFinite(v.z);
  }

  public static assert(o: any): asserts o is Vec3 {
    if (!_ASSERT) return;
    if (!Vec3.isValid(o)) {
      _DEBUG && common.debug(o);
      throw new Error('Invalid Vec3!');
    }
  }

  public setZero(): this {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    return this;
  }

  public set(x: f64, y: f64, z: f64): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  public add(w: Vec3): this {
    this.x += w.x;
    this.y += w.y;
    this.z += w.z;
    return this;
  }

  public sub(w: Vec3): this {
    this.x -= w.x;
    this.y -= w.y;
    this.z -= w.z;
    return this;
  }

  public mul(m: f64): this {
    this.x *= m;
    this.y *= m;
    this.z *= m;
    return this;
  }

  public static areEqual(v: Vec3 | null, w: Vec3 | null): boolean {
    _ASSERT && Vec3.assert(v);
    _ASSERT && Vec3.assert(w);
    return v == w ||
      typeof v === 'object' && v !== null &&
      typeof w === 'object' && w !== null &&
      v.x === w.x && v.y === w.y && v.z === w.z;
  }

  /**
   * Perform the dot product on two vectors.
   */
  public static dot(v: Vec3, w: Vec3): f64 {
    return v.x * w.x + v.y * w.y + v.z * w.z;
  }

  /**
   * Perform the cross product on two vectors. In 2D this produces a scalar.
   */
  public static cross(v: Vec3, w: Vec3): Vec3 {
    return new Vec3(
      v.y * w.z - v.z * w.y,
      v.z * w.x - v.x * w.z,
      v.x * w.y - v.y * w.x
    );
  }

  public static add(v: Vec3, w: Vec3): Vec3 {
    return new Vec3(v.x + w.x, v.y + w.y, v.z + w.z);
  }

  public static sub(v: Vec3, w: Vec3): Vec3 {
    return new Vec3(v.x - w.x, v.y - w.y, v.z - w.z);
  }

  public static mul(v: Vec3, m: f64): Vec3 {
    return new Vec3(m * v.x, m * v.y, m * v.z);
  }

  public neg(): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  public static neg(v: Vec3): Vec3 {
    return new Vec3(-v.x, -v.y, -v.z);
  }

}
