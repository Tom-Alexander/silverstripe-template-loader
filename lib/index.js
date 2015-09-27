import {readdirSync, statSync} from 'fs';
import {join, basename, dirname, relative} from 'path';
import {parseQuery, urlToRequest} from 'loader-utils';

const TEMPLATE_BASE = join('./', 'templates', 'Includes');

const IGNORE_REGEXP = /\s|\(|\)|'|"/igm;
const ASSET_REGEXP = /<%\sAsset\(([^<%\n\r]*)\)(?=\s%>)/igm;
const INCLUDE_REGEXP = /<%\sinclude\s([^<%\n\r]*)(?=\s%>)/igm;

/**
 * Recursively traverses the root directory until the template file is found
 * @param  {String} root
 * @param  {String} template
 * @return {String}
 */
function traverse(root, template) {

  const files = readdirSync(root);
  for(var i = 0; i < files.length; i++) {
    const current = join(root, files[i]);
    const stat = statSync(current);

    if(stat.isFile() && basename(current, '.ss') === template) {
      return current;
    }

    if(stat.isDirectory()) {
      var directory = traverse(current, template);
      if(directory) return directory;
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
function resolve(context, includeDir = null, name) {
  const root = includeDir || TEMPLATE_BASE;
  const walk = traverse(root, name);

  if(root && walk) {
    return relative(context, walk);
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
  let groups = [], group = null;
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
  return path(content, INCLUDE_REGEXP)
    .map(name => name.replace(IGNORE_REGEXP, ''))
    .map(resolve.bind(null, context, includeDir))
    .filter(item => item !== null)
    .concat(
      path(content, ASSET_REGEXP)
          .map(name => join(name.replace(IGNORE_REGEXP, '')))
      );
}

/**
 * Returns the requirements made from the includes extracted from he template
 * @param  {String} content
 * @param  {String} context
 * @param  {String} includeDir
 * @return {String}
 */
function make(content, context, includeDir) {
  return extract(content, context, includeDir)
    .reduce((prefix, path) => [prefix,
      'require(\'', urlToRequest(path), '\');\n'].join(''),
      ''
    )
}

/**
 * Loads the assets and includes from the silverstripe template file
 * @param  {String} content
 * @return {String}
 */
export default function loader(content) {
  this.cacheable();
	const {includeDir} = parseQuery(this.query);
  const context = this.context || (this.options && this.options.context);
  return make(content, context, includeDir);
}
