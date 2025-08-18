import { withInstall } from "@hyl-fake-element-plus/utils";
import FunctionalMessage from "./Message";

export * from "./type";
export const HMessage = withInstall(FunctionalMessage, (app) => {
  app.config.globalProperties.$message = FunctionalMessage;
});
