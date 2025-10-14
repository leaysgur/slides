import { exec } from "node:child_process"; 

const [,,target, ...flags] = process.argv;
const isWatch = flags.includes("-w");
const isConfig = flags.includes("-c");

let args = [];

if (target === undefined) {
  console.log('  Usage:');
  console.log('    node ./scripts/marp.mjs <targetDir>');
  console.log('    node ./scripts/marp.mjs <targetDir> -w -c');
  console.log('');

  process.exit(0);
}

args.push("--input-dir", target);

if (isWatch) {
  console.log('watching changes...');
  console.log(`Open http://localhost:8080`);
  // exec(`open ${target}/index.md`);
  args.push("--server");
}

if (isConfig) {
  console.log(`Using custom .marprc`);
  args.push("--config", `${target}/.marprc`);
}

exec(`npx @marp-team/marp-cli@latest --yes ${args.join(" ")}`, (err, stdout, stderr) => {
  if (err || stderr) {
    console.error(err || stderr);
    process.exit(1);
  }

  stdout && console.log(stdout);

  console.log('done!');
  console.log('');

  process.exit(0);
});
