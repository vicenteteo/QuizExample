const fs = require('fs');
const exec = require('child_process').exec;
const buildDir = __dirname + '/build';


if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
  fs.mkdirSync(buildDir + '/public'); 
  fs.mkdirSync(buildDir + '/public/components'); 
  fs.mkdirSync(buildDir + '/public/components/guest'); 
  fs.mkdirSync(buildDir + '/public/components/bar-chart'); 
}

fs.createReadStream('./package.json').pipe(fs.createWriteStream('./build/package.json'));
fs.createReadStream('./public/index.html').pipe(fs.createWriteStream('./build/public/index.html'));
fs.createReadStream('./public/components/guest/modalQuiz.css').pipe(fs.createWriteStream('./build/public/components/guest/modalQuiz.css'));
fs.createReadStream('./public/components/bar-chart/chart.css').pipe(fs.createWriteStream('./build/public/components/bar-chart/chart.css'));

exec('npm install --production', {
  cwd: __dirname + '/build',
}, function (error, stdout, stderr) {
  if (error) {
    console.log(stderr);
  }

  console.log(stdout);

  exec('babel ./ --out-dir build --ignore ./node_modules,build', {
    cwd: __dirname
  }, function (error, stdout, stderr) {
    if (error) {
      console.log(stderr);
    }

    console.log('Build finished!!!');
  });

});
