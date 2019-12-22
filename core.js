#!/usr/bin/env node
const fs = require('fs');
const {execSync} = require('child_process');

// read packages dependcies from your package.json
const getPackagesInfo = (target = 'dependencies') => {
  try {
    const packages = JSON.parse(fs.readFileSync('./package.json'));
    const dependencies  = packages[target];
    const dependenciesInfo = [];
    Object.keys(dependencies).forEach(name => {
      const version = dependencies[name];
      if (version && version.startsWith('^')) {
        dependenciesInfo.push({
          name,
          version: version.slice(1),
        });
      } else {
        dependenciesInfo.push({
          name,
          version,
        })
      }
    });
    return dependenciesInfo;
  } catch(e) {
    console.error(e);
  }
}
const getNpmInfo = (depsInfo = []) => {
  const pkgInfo = depsInfo.map((pkg) => `${pkg.name}@${pkg.version}`);
  const info = [];
  try {
    pkgInfo.map(pkg => {
      const command = `npm view ${pkg} --json > temp.json`;
      execSync(command);
      const  result = JSON.parse( fs.readFileSync('temp.json'));
      const { name, homepage, repository, license, version, dist: { tarball } } = result;
      info.push({
        name,
        source: repository && (repository.url.startsWith('git+') ? repository.url.split('+')[1] : repository.url),
        homepage,
        license,
        version,
        tarball
      });
    });
  } catch(e) {
    console.error(e);
  } finally {
    fs.unlink('temp.json', (error) => {
      if (error) console.error('err: ', error)
    })
  }
  return info;
}

exports.getNpmInfo = getNpmInfo;
exports.getPackagesInfo = getPackagesInfo;

