import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const pkg = require('./package.json');

const from = `if (typeof require === "function") {
  try {
    graphlib = require("graphlib");
  } catch (e) {
    // continue regardless of error
  }
}`;
const to = `
    graphlib = require("graphlib");
`;
const from2 = `if (typeof require === "function") {
  try {
    lodash = {
      cloneDeep: require("lodash/cloneDeep"),
      constant: require("lodash/constant"),
      defaults: require("lodash/defaults"),
      each: require("lodash/each"),
      filter: require("lodash/filter"),
      find: require("lodash/find"),
      flatten: require("lodash/flatten"),
      forEach: require("lodash/forEach"),
      forIn: require("lodash/forIn"),
      has:  require("lodash/has"),
      isUndefined: require("lodash/isUndefined"),
      last: require("lodash/last"),
      map: require("lodash/map"),
      mapValues: require("lodash/mapValues"),
      max: require("lodash/max"),
      merge: require("lodash/merge"),
      min: require("lodash/min"),
      minBy: require("lodash/minBy"),
      now: require("lodash/now"),
      pick: require("lodash/pick"),
      range: require("lodash/range"),
      reduce: require("lodash/reduce"),
      sortBy: require("lodash/sortBy"),
      uniqueId: require("lodash/uniqueId"),
      values: require("lodash/values"),
      zipObject: require("lodash/zipObject"),
    };
  } catch (e) {
    // continue regardless of error
  }
}
`;
const to2 = `
  lodash = {
    cloneDeep: require("lodash/cloneDeep"),
    constant: require("lodash/constant"),
    defaults: require("lodash/defaults"),
    each: require("lodash/each"),
    filter: require("lodash/filter"),
    find: require("lodash/find"),
    flatten: require("lodash/flatten"),
    forEach: require("lodash/forEach"),
    forIn: require("lodash/forIn"),
    has:  require("lodash/has"),
    isUndefined: require("lodash/isUndefined"),
    last: require("lodash/last"),
    map: require("lodash/map"),
    mapValues: require("lodash/mapValues"),
    max: require("lodash/max"),
    merge: require("lodash/merge"),
    min: require("lodash/min"),
    minBy: require("lodash/minBy"),
    now: require("lodash/now"),
    pick: require("lodash/pick"),
    range: require("lodash/range"),
    reduce: require("lodash/reduce"),
    sortBy: require("lodash/sortBy"),
    uniqueId: require("lodash/uniqueId"),
    values: require("lodash/values"),
    zipObject: require("lodash/zipObject"),
  };
`;
const from3 = `if (typeof require === "function") {
  try {
    lodash = {
      clone: require("lodash/clone"),
      constant: require("lodash/constant"),
      each: require("lodash/each"),
      filter: require("lodash/filter"),
      has:  require("lodash/has"),
      isArray: require("lodash/isArray"),
      isEmpty: require("lodash/isEmpty"),
      isFunction: require("lodash/isFunction"),
      isUndefined: require("lodash/isUndefined"),
      keys: require("lodash/keys"),
      map: require("lodash/map"),
      reduce: require("lodash/reduce"),
      size: require("lodash/size"),
      transform: require("lodash/transform"),
      union: require("lodash/union"),
      values: require("lodash/values")
    };
  } catch (e) {
    // continue regardless of error
  }
}`;
const to3 = `
lodash = {
  clone: require("lodash/clone"),
  constant: require("lodash/constant"),
  each: require("lodash/each"),
  filter: require("lodash/filter"),
  has:  require("lodash/has"),
  isArray: require("lodash/isArray"),
  isEmpty: require("lodash/isEmpty"),
  isFunction: require("lodash/isFunction"),
  isUndefined: require("lodash/isUndefined"),
  keys: require("lodash/keys"),
  map: require("lodash/map"),
  reduce: require("lodash/reduce"),
  size: require("lodash/size"),
  transform: require("lodash/transform"),
  union: require("lodash/union"),
  values: require("lodash/values")
};
`;
export default {
  input: `src/index.ts`,
  output: { dir: 'dist', format: 'es', sourcemap: true },
  external: [
    ...Object.keys(pkg.dependencies).filter(key => !key.includes('cytoscape')),
    /lit/,
  ],
  plugins: [
    replace({
      [from]: to,
      [from2]: to2,
      [from3]: to3,
      delimiters: ['', ''],
    }),
    typescript(),
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['browser', 'module', 'main'],
    }),
    commonjs({}),
  ],
};
