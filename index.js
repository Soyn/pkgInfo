#!/usr/bin/env node
const fs = require('fs');
const { getNpmInfo, getPackagesInfo } = require('./core')
const program = require('commander');

program.version('0.0.1');

program
  .option('-d --devDependencies', 'output your devDependencies packages info')
  .option('--json', 'output json format')
  .option('--md', 'output md format')

program.parse(process.argv);
/**
 * Generates a Markdown table
 * @param {string[]} headers
 * @param {string[][]} body
 */
function generateMDTable(headers, body) {
  const tableHeaders = [
    headers.join(' | '),
    headers.map(() => ' --- ').join(' | '),
  ];

  const tablebody = body.map(r => '|' + r.join(' | ') + '|');
  return tableHeaders.join('\n') + '\n' + tablebody.join('\n');
}
const generateNPMPackageMDTable = (npmPkgInfo) => {
  const headers = ['Name', 'Source', 'HomePage', 'License', 'Download From', 'Modified', 'Version', 'Modified Version'];
  const tableBody = npmPkgInfo.map(info => {
    return [info.name, info.source, info.homepage, info.license, info.tarball, 'No', info.version, 'N/A'];
  });
  const output = generateMDTable(headers, tableBody);
  fs.writeFileSync('result.md', output)
}
fs.stat('./package.json', (err, stat) => {
  if (err == null) {
    const options = program.opts();
    const format = options.json || options.md || 'json';
    let target = 'dependencies'
    if (options.devDependencies) {
      target = 'devDependencies';
    }
    const depsInfo = getPackagesInfo(target);
    const npmInfo = getNpmInfo(depsInfo);
    if (options.md) {
      generateNPMPackageMDTable(npmInfo);
    } else {
      fs.writeFile('result.json', JSON.stringify(npmInfo, null, 2));
    }
  } else if (err.code === 'ENOENT') {
    console.error('package.json is not exsit.');
  } else {
    console.err('unknown error: ', err.code);
  }
});