export { Vec3Pool };

import { Vec3 } from "../math/Vec3.js";
import { Pool } from "./Pool.js";

/**
 * @class Vec3Pool
 * @constructor
 * @extends Pool
 */
function Vec3Pool() {
  Pool.call(this);
  this.type = Vec3;
}
Vec3Pool.prototype = new Pool();

/**
 * Construct a vector
 * @method constructObject
 * @return {Vec3}
 */
Vec3Pool.prototype.constructObject = function () {
  return new Vec3();
};
