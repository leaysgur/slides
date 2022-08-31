import { exec } from "node:child_process"; 

const target  = process.argv[2];
const isWatch = process.argv[3] ? 'watch' : '';

if (target === undefined) {
  console.log('  Usage:');
  console.log('    node ./scripts/cleaver.mjs <targetDir>');
  console.log('    node ./scripts/cleaver.mjs <targetDir> <isWatch>');
  console.log('');

  process.exit(0);
}

if (isWatch) {
  console.log('watching changes...');
  exec(`open ./docs/${target}/index.html`);
  exec(`open ./docs/${target}/index.md`);
}

exec(`npx cleaver ${isWatch} ./docs/${target}/index.md --output ./docs/${target}/index.html`, (err, stdout, stderr) => {
  if (err || stderr) {
    console.error(err || stderr);
    process.exit(1);
  }

  stdout && console.log(stdout);

  console.log('done!');
  console.log('');

  process.exit(0);
});
