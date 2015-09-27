
import sinon from 'sinon';
import {expect} from 'chai';
import {resolve} from 'path';
import webpack from 'webpack';
import {describe, it} from 'mocha';

const query = '?includeDir=' +  resolve(__dirname, './target/templates/Includes');
const loader = resolve(__dirname, '../index.js');
const templateA = resolve(__dirname, './target/templates/Page.ss');
const templateB = resolve(__dirname, './target/templates/Layout/Bar.ss');
const output = {
  filename: 'bundle.js',
  libraryTarget: 'commonjs2',
  path: __dirname + '/__tmp__'
};

describe('SilverstripeTemplateLoader', () => {

  it('Loads the template with its dependencies', done => {
    webpack(
      {output, entry: `${loader}${query}!${templateA}`},
      (err, stats) => {
        const dependencies = stats.compilation.fileDependencies;
        expect(dependencies).to.have.length(3);
        done();
      });
  });

  it('Loads a template to any subdirectory', done => {
    webpack(
      {output, entry: `${loader}${query}!${templateB}`},
      (err, stats) => {
        const dependencies = stats.compilation.fileDependencies;
        expect(dependencies).to.have.length(3);
        done();
      });
  });


});
