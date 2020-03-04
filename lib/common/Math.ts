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

export const EPSILON = 1e-9; // TODO

/**
 * This function is used to ensure that a floating point number is not a NaN or
 * infinity.
 */
export function isFinite(x: number): boolean {
  return (typeof x === 'number') && isFinite(x) && !isNaN(x);
}

export function assert(x: any): asserts x is number {
  if (!_ASSERT) return;
  if (!isFinite(x)) {
    _DEBUG && common.debug(x);
    throw new Error('Invalid Number!');
  }
}

/**
 * TODO: This is a approximate yet fast inverse square-root.
 */
export function invSqrt(x: number): number {
  // TODO
  return 1 / Math.sqrt(x);
}

/**
 * Next Largest Power of 2 Given a binary integer value x, the next largest
 * power of 2 can be computed by a SWAR algorithm that recursively "folds" the
 * upper bits into the lower bits. This process yields a bit vector with the
 * same most significant 1 as x, but all 1's below it. Adding 1 to that value
 * yields the next largest power of 2. For a 32-bit value:
 */
export function nextPowerOfTwo(x: number): number {
  // TODO
  x |= (x >> 1);
  x |= (x >> 2);
  x |= (x >> 4);
  x |= (x >> 8);
  x |= (x >> 16);
  return x + 1;
}

export function isPowerOfTwo(x: number): boolean {
  return x > 0 && (x & (x - 1)) == 0;
}

export function mod(num: number, min: number, max: number): number;
export function mod(num: number, max: number): number;
export function mod(num: number): number;
export function mod(num: number, min?: number, max?: number): number {//TODO
  if (typeof min === 'undefined') {
    max = 1, min = 0;
  } else if (typeof max === 'undefined') {
    max = min, min = 0;
  }
  if (max > min) {
    num = (num - min) % (max - min);
    return num + (num < 0 ? max : min);
  } else {
    num = (num - max) % (min - max);
    return num + (num <= 0 ? min : max);
  }
};

export function clamp(num: number, min: number, max: number): number {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
};

export function random(min: number, max: number): number;
export function random(max: number): number;
export function random(): number;
export function random(min?: number, max?: number): number {
  if (typeof min === 'undefined') {
    max = 1;
    min = 0;
  } else if (typeof max === 'undefined') {
    max = min;
    min = 0;
  }
  return min == max ? min : Math.random() * (max - min) + min;
};
