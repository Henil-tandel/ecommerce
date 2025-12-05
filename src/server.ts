import { Server } from 'socket.io';
import { createServer } from 'http';
import config from './config/config';
import * as ServerUtils from './lib/server.utils';
import * as DBUtils from './lib/db.utils';
import AppUtils from './lib/app.utils';
import initializeSocket from './lib/sockets.server';
import { updatePriceJob } from './lib/priceUpdater.utils';
let io: Server;

void (async () => {
  // Connect Database
  await DBUtils.connect();

  await AppUtils.init();

  // Setup App

  // Connect Server
  ServerUtils.createServer()
    .then((app) => {
      // Start the server
      const PORT = config.PORT;
      const httpServer = createServer(app);
      io = new Server(httpServer,{ cors: { origin: '*' }})
      initializeSocket(io);
      updatePriceJob();
      httpServer.listen(PORT);
      console.log(`Server is running on port ${PORT}`);
    })
    .catch((err) => {
      console.log(err);
    });
})();

export { io };