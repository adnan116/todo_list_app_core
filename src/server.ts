import appFactory from "./app";
import { appPort } from "./configs/app.config";

(async function () {
  const app = await appFactory();
  app.listen(appPort, () =>
    console.log(`[SERVER STATUS] Listening on port ${appPort}`)
  );
})();
