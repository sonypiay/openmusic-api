import Application from './application/Application.js';
import Plugins from "./plugins/Plugins.js";
import TokenMiddleware from "./middleware/TokenMiddleware.js";
import Inert from "@hapi/inert";

const app = new Application();

app.scheme('TokenMiddleware', TokenMiddleware);
app.strategy('token', 'TokenMiddleware');

// register plugins
await app.register(Inert);
await app.register(Plugins);

// run application
await app.run();