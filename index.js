'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

/**
 * Loads the assets and includes from the silverstripe template file
 * @param  {String} content
 * @return {String}
 */
exports['default'] = loader;

var _fs = require('fs');

var _path = require('path');

var _loaderUtils = require('loader-utils');

var TEMPLATE_BASE = _path.join('./', 'templates', 'Includes');

var IGNORE_REGEXP = /\s|\(|\)|'|"/igm;
var ASSET_REGEXP = /<%\sAsset\(([^<%\n\r]*)\)(?=\s%>)/igm;
var INCLUDE_REGEXP = /<%\sinclude\s([^<%\n\r]*)(?=\s%>)/igm;

/**
 * Recursively traverses the root directory until the template file is found
 * @param  {String} root
 * @param  {String} template
 * @return {String}
 */
function traverse(root, template) {

  var files = _fs.readdirSync(root);
  for (var i = 0; i < files.length; i++) {
    var current = _path.join(root, files[i]);
    var stat = _fs.statSync(current);

    if (stat.isFile() && _path.basename(current, '.ss') === template) {
      return current;
    }

    if (stat.isDirectory()) {
      var directory = traverse(current, template);
      if (directory) return directory;
    }
  }

  return null;
}

/**
 * Resolves the path from the includes directory by assuming flat
 * directory structure
 * @param  {String} path
 * @param  {String} includeDir
 * @param  {String} name
 * @return {String}
 */
function resolve(context, _x, name) {
  var includeDir = arguments[1] === undefined ? null : arguments[1];

  var root = includeDir || TEMPLATE_BASE;
  var walk = traverse(root, name);

  if (root && walk) {
    return _path.relative(context, walk);
  }

  return null;
}

/**
 * Returns the group that matches the path from the include tag
 * @param  {String} include
 * @param  {Regex} pattern
 * @return {String[]}
 */
function path(include, pattern) {
  var groups = [],
      group = null;
  while (group = pattern.exec(include)) groups.push(group[1]);
  return groups;
}

/**
 * Extracts all the paths that have been included in the template and returns
 * an array of the resolved paths
 * @param  {String} content
 * @param  {String} context
 * @param  {String} includeDir
 * @return {String[]}
 */
function extract(content, context, includeDir) {
  return path(content, INCLUDE_REGEXP).map(function (name) {
    return name.replace(IGNORE_REGEXP, '');
  }).map(resolve.bind(null, context, includeDir)).filter(function (item) {
    return item !== null;
  }).concat(path(content, ASSET_REGEXP).map(function (name) {
    return _path.join(name.replace(IGNORE_REGEXP, ''));
  }));
}

/**
 * Returns the requirements made from the includes extracted from he template
 * @param  {String} content
 * @param  {String} context
 * @param  {String} includeDir
 * @return {String}
 */
function make(content, context, includeDir) {
  return extract(content, context, includeDir).reduce(function (prefix, path) {
    return [prefix, 'require(\'', _loaderUtils.urlToRequest(path), '\');\n'].join('');
  }, '');
}
function loader(content) {
  this.cacheable();

  var _parseQuery = _loaderUtils.parseQuery(this.query);

  var includeDir = _parseQuery.includeDir;

  var context = this.context || this.options && this.options.context;
  return make(content, context, includeDir);
}

module.exports = exports['default'];
