const exec = require('child_process').exec;
const target  = process.argv[2];
const isWatch = process.argv[3] ? 'watch' : '';

if (target === undefined) {
  console.log('  Usage:');
  console.log('    npm run md2html <targetDir>');
  console.log('    npm run md2html <targetDir> [,<isWatch>]');
  console.log('');

  process.exit(0);
}

if (isWatch) {
  console.log('watching changes...');
}

exec(`$(npm bin)/cleaver ${isWatch} ./${target}/index.md --output ./${target}/index.html`, (err, stdout, stderr) => {
  if (err || stderr) {
    console.error(err || stderr);
    process.exit(1);
  }

  console.log(stdout);

  console.log('done!');
  console.log('');

  process.exit(0);
});
