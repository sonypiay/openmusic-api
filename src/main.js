import Application from './application/Application.js';
import Plugins from "./plugins/Plugins.js";

const app = new Application();

// register plugins
await app.register(Plugins);

// run application
await app.run();