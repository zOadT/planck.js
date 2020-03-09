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
import { EPSILON, isFinite, assert, invSqrt } from './Math';

export default class Vec2 {

  public x: f64;
  public y: f64;

  constructor(x: f64, y: f64);
  constructor(v: Vec2);
  constructor();
  constructor(x?: Vec2 | f64, y: f64 = 0) {
    // if (!(this instanceof Vec2)) {
    //   return new Vec2(x, y);
    // }
    if (typeof x === 'undefined') {
      this.x = 0;
      this.y = 0;
    } else if (typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
    _ASSERT && Vec2.assert(this);
  }

  private _serialize(): { x: f64, y: f64 } {
    return {
      x: this.x,
      y: this.y
    };
  };

  private static _deserialize(data: { x: f64, y: f64 }): Vec2 {
    var obj = Object.create(Vec2.prototype);
    obj.x = data.x;
    obj.y = data.y;
    return obj;
  };

  public static zero(): Vec2 {
    var obj = Object.create(Vec2.prototype);
    obj.x = 0;
    obj.y = 0;
    return obj;
  };

  public static neo(x: f64, y: f64): Vec2 {
    var obj = Object.create(Vec2.prototype);
    obj.x = x;
    obj.y = y;
    return obj;
  };

  public static clone(v: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    return Vec2.neo(v.x, v.y);
  };

  public toString(): string {
    return JSON.stringify(this);
  };

  /**
   * Does this vector contain finite coordinates?
   */
  public static isValid(v: Vec2 | null): boolean {
    return !!v && isFinite(v.x) && isFinite(v.y);
  }

  public static assert(o: any): asserts o is Vec2 {
    if (!_ASSERT) return;
    if (!Vec2.isValid(o)) {
      _DEBUG && common.debug(o);
      throw new Error('Invalid Vec2!');
    }
  }

  public clone(): Vec2 {
    return Vec2.clone(this);
  }

  /**
   * Set this vector to all zeros.
   * 
   * @returns this
   */
  public setZero(): this {
    this.x = 0.0;
    this.y = 0.0;
    return this;
  }

  /**
   * Set this vector to some specified coordinates.
   * 
   * @returns this
   */
  public set(v: Vec2): this;
  public set(x: f64, y: f64): this;
  public set(x: Vec2 | f64, y: f64 = 0): this {
    if (typeof x === 'object') {
      _ASSERT && Vec2.assert(x);
      this.x = x.x;
      this.y = x.y;
    } else {
      _ASSERT && assert(x);
      _ASSERT && assert(y);
      this.x = x;
      this.y = y;
    }
    return this;
  }

  // /**
  //  * @deprecated Use setCombine or setMul
  //  */
  // public wSet(a, v, b, w) {
  //   if (typeof b !== 'undefined' || typeof w !== 'undefined') {
  //     return this.setCombine(a, v, b, w);
  //   } else {
  //     return this.setMul(a, v);
  //   }
  // }

  /**
   * Set linear combination of v and w: `a * v + b * w`
   */
  public setCombine(a: f64, v: Vec2, b: f64, w: Vec2): this {
    _ASSERT && assert(a);
    _ASSERT && Vec2.assert(v);
    _ASSERT && assert(b);
    _ASSERT && Vec2.assert(w);
    var x = a * v.x + b * w.x;
    var y = a * v.y + b * w.y;

    // `this` may be `w`
    this.x = x;
    this.y = y;
    return this;
  }

  public setMul(a: f64, v: Vec2): this {
    _ASSERT && assert(a);
    _ASSERT && Vec2.assert(v);
    var x = a * v.x;
    var y = a * v.y;

    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Add a vector to this vector.
   * 
   * @returns this
   */
  public add(w: Vec2): this {
    _ASSERT && Vec2.assert(w);
    this.x += w.x;
    this.y += w.y;
    return this;
  }

  // /**
  //  * @deprecated Use addCombine or addMul
  //  */
  // public wAdd(a, v, b, w) {
  //   if (typeof b !== 'undefined' || typeof w !== 'undefined') {
  //     return this.addCombine(a, v, b, w);
  //   } else {
  //     return this.addMul(a, v);
  //   }
  // }

  /**
   * Add linear combination of v and w: `a * v + b * w`
   */
  public addCombine(a: f64, v: Vec2, b: f64, w: Vec2): this {
    _ASSERT && assert(a);
    _ASSERT && Vec2.assert(v);
    _ASSERT && assert(b);
    _ASSERT && Vec2.assert(w);

    var x = a * v.x + b * w.x;
    var y = a * v.y + b * w.y;

    // `this` may be `w`
    this.x += x;
    this.y += y;
    return this;
  }

  public addMul(a: f64, v: Vec2): this {
    _ASSERT && assert(a);
    _ASSERT && Vec2.assert(v);
    var x = a * v.x;
    var y = a * v.y;

    this.x += x;
    this.y += y;
    return this;
  }

  // /**
  //  * @deprecated Use subCombine or subMul
  //  */
  // public wSub(a, v, b, w) {
  //   if (typeof b !== 'undefined' || typeof w !== 'undefined') {
  //     return this.subCombine(a, v, b, w);
  //   } else {
  //     return this.subMul(a, v);
  //   }
  // }

  /**
   * Subtract linear combination of v and w: `a * v + b * w`
   */
  public subCombine(a: f64, v: Vec2, b: f64, w: Vec2): this {
    _ASSERT && assert(a);
    _ASSERT && Vec2.assert(v);
    _ASSERT && assert(b);
    _ASSERT && Vec2.assert(w);
    var x = a * v.x + b * w.x;
    var y = a * v.y + b * w.y;

    // `this` may be `w`
    this.x -= x;
    this.y -= y;
    return this;
  }

  public subMul(a: f64, v: Vec2): this {
    _ASSERT && assert(a);
    _ASSERT && Vec2.assert(v);
    var x = a * v.x;
    var y = a * v.y;

    this.x -= x;
    this.y -= y;
    return this;
  }

  /**
   * Subtract a vector from this vector
   * 
   * @returns this
   */
  public sub(w: Vec2): this {
    _ASSERT && Vec2.assert(w);
    this.x -= w.x;
    this.y -= w.y;
    return this;
  }

  /**
   * Multiply this vector by a scalar.
   * 
   * @returns this
   */
  public mul(m: f64): this {
    _ASSERT && assert(m);
    this.x *= m;
    this.y *= m;
    return this;
  }

  /**
   * Get the length of this vector (the norm).
   * 
   * For performance, use this instead of lengthSquared (if possible).
   */
  public length(): f64 {
    return Vec2.lengthOf(this);
  }

  /**
   * Get the length squared.
   */
  public lengthSquared(): f64 {
    return Vec2.lengthSquared(this);
  }

  /**
   * Convert this vector into a unit vector.
   * 
   * @returns old length
   */
  public normalize(): f64 {
    var length = this.length();
    if (length < EPSILON) {
      return 0.0;
    }
    var invLength = 1.0 / length;
    this.x *= invLength;
    this.y *= invLength;
    return length;
  }

  /**
   * Get the length of this vector (the norm).
   *
   * For performance, use this instead of lengthSquared (if possible).
   */
  public static lengthOf(v: Vec2): f64 {
    _ASSERT && Vec2.assert(v);
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  /**
   * Get the length squared.
   */
  public static lengthSquared(v: Vec2): f64 {
    _ASSERT && Vec2.assert(v);
    return v.x * v.x + v.y * v.y;
  }

  public static distance(v: Vec2, w: Vec2): f64 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    var dx = v.x - w.x, dy = v.y - w.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public static distanceSquared(v: Vec2, w: Vec2): f64 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    var dx = v.x - w.x, dy = v.y - w.y;
    return dx * dx + dy * dy;
  }

  public static areEqual(v: Vec2, w: Vec2): boolean {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return v == w || typeof w === 'object' && w !== null && v.x === w.x && v.y === w.y;
  }

  /**
   * Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
   */
  public static skew(v: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    return Vec2.neo(-v.y, v.x);
  }

  /**
   * Perform the dot product on two vectors.
   */
  public static dot(v: Vec2, w: Vec2): f64 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return v.x * w.x + v.y * w.y;
  }

  /**
   * Perform the cross product on two vectors. In 2D this produces a scalar.
   */
  public static cross(v: Vec2, w: Vec2): f64;
  /**
   * Perform the cross product on a vector and a scalar. In 2D this produces a
   * vector.
   */
  public static cross(v: Vec2, w: f64): Vec2;
  /**
   * Perform the cross product on a vector and a scalar. In 2D this produces a
   * vector.
   */
  public static cross(v: f64, w: Vec2): Vec2;
  public static cross(v: any, w: Vec2 | f64): Vec2 | f64 {
    if (typeof w === 'number') {
      _ASSERT && Vec2.assert(v);
      _ASSERT && assert(w);
      return Vec2.neo(w * v.y, -w * v.x);

    } else if (typeof v === 'number') {
      _ASSERT && assert(v);
      _ASSERT && Vec2.assert(w);
      return Vec2.neo(-v * w.y, v * w.x);

    } else {
      _ASSERT && Vec2.assert(v);
      _ASSERT && Vec2.assert(w);
      return v.x * w.y - v.y * w.x
    }
  }

   /**
   * Returns `a + (v x w)`
   */
  public static addCross(a: Vec2, v: Vec2, w: f64): Vec2;
  /**
   * Returns `a + (v x w)`
   */
  public static addCross(a: Vec2, v: f64, w: Vec2): Vec2;
  public static addCross(a: Vec2, v: any, w: Vec2 | f64): Vec2 {
    if (typeof w === 'number') {
      _ASSERT && Vec2.assert(v);
      _ASSERT && assert(w);
      return Vec2.neo(w * v.y + a.x, -w * v.x + a.y);

    } else {
      _ASSERT && assert(v);
      _ASSERT && Vec2.assert(w);
      return Vec2.neo(-v * w.y + a.x, v * w.x + a.y);
    }

    _ASSERT && common.assert(false);
  }

  public static add(v: Vec2, w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(v.x + w.x, v.y + w.y);
  }

  // /**
  //  * @deprecated Use combine
  //  */
  // public static wAdd(a, v, b, w) {
  //   if (typeof b !== 'undefined' || typeof w !== 'undefined') {
  //     return Vec2.combine(a, v, b, w);
  //   } else {
  //     return Vec2.mul(a, v);
  //   }
  // }

  public static combine(a: f64, v: Vec2, b: f64, w: Vec2): Vec2 {
    return Vec2.zero().setCombine(a, v, b, w);
  }

  public static sub(v: Vec2, w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(v.x - w.x, v.y - w.y);
  }

  public static mul(a: Vec2, b: f64): Vec2;
  public static mul(a: f64, b: Vec2): Vec2;
  public static mul(a: Vec2 | f64, b: any): Vec2 {
    if (typeof a === 'object') {
      _ASSERT && Vec2.assert(a);
      _ASSERT && assert(b);
      return Vec2.neo(a.x * b, a.y * b);

    } else {
      _ASSERT && assert(a);
      _ASSERT && Vec2.assert(b);
      return Vec2.neo(a * b.x, a * b.y);
    }
  }

  public neg(): this {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  public static neg(v: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    return Vec2.neo(-v.x, -v.y);
  }

  public static abs(v: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    return Vec2.neo(Math.abs(v.x), Math.abs(v.y));
  }

  public static mid(v: Vec2, w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo((v.x + w.x) * 0.5, (v.y + w.y) * 0.5);
  }

  public static upper(v: Vec2, w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(Math.max(v.x, w.x), Math.max(v.y, w.y));
  }

  public static lower(v: Vec2, w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(Math.min(v.x, w.x), Math.min(v.y, w.y));
  }

  public clamp(max: f64): this {
    var lengthSqr = this.x * this.x + this.y * this.y;
    if (lengthSqr > max * max) {
      var invLength = invSqrt(lengthSqr);
      this.x *= invLength * max;
      this.y *= invLength * max;
    }
    return this;
  }

  public static clamp(v: Vec2, max: f64): Vec2 {
    v = Vec2.neo(v.x, v.y);
    v.clamp(max);
    return v;
  }

  /**
   * @experimental
   */
  public static scaleFn(x: f64, y: f64): (v: Vec2) => Vec2 {
    return function (v) {
      return Vec2.neo(v.x * x, v.y * y);
    };
  }

  /**
   * @experimental
   */
  public static translateFn(x: f64, y: f64): (v: Vec2) => Vec2 {
    return function (v) {
      return Vec2.neo(v.x + x, v.y + y);
    };
  }

}