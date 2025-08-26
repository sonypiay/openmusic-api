import { existsSync } from "node:fs";

const args = process.argv.slice(2);
const filenameArgs = args.find(arg => arg.startsWith('--filename='));
const maxRetryArgs = args.find(arg => arg.startsWith('--max-retry='));
const retryDelayArgs = args.find(arg => arg.startsWith('--retry-delay='));

if( ! filenameArgs ) {
    console.error('Invalid arguments, use --filename=');
    process.exit(1);
}

const filename = `./${filenameArgs.split('=')[1]}.js`;
const maxRetry = maxRetryArgs ? parseInt(maxRetryArgs.split('=')[1]) : 3;
const retryDelay = retryDelayArgs ? parseInt(retryDelayArgs.split('=')[1]) : 1000;

if( ! existsSync(`./src/listeners/${filename}`) ) {
    console.error(`File ${filename} not found`);
    process.exit(1);
}

const module = await import("./EmailListener.js");
const className = new module.default;
className.maxRetry = maxRetry;
className.retryDelay = retryDelay;

await className.handle();