import React from "react";
import createApp from "./App";
import plugins from "./plugins";

const run = async () => {
  const app = createApp({ plugins });

  await app.init();

  app.render(document.getElementById("root"));
};

run()
  .then(() => {})
  .catch(() => {});
