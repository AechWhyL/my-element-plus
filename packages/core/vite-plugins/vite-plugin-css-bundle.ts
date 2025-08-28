import type { Plugin } from "vite";
import chalk from "chalk";
import path from "path";

type VitePluginCssBundleOptions = {
  include?: string[];
  exclude?: string[];
  outputFileName?: string;
  name?: string;
};

export default function vitePluginCssBundle(options: VitePluginCssBundleOptions={
  name: "css-bundle.css",
  include: [],
  exclude: [],
}): Plugin {
  const pluginNameSpace = "vite-plugin:css-bundle";
  const { name, outputFileName, include, exclude } = options;
  const logPrefix = `${chalk.cyan("[vite-plugin:css-bundle]")}`;
  let cssBundleRefId: string | null = null;
  let cssBundleFileName: string | null = null;
  let includeCssFiles: string[] = [];
  let logger = console
  return {
    name: pluginNameSpace,
    apply: "build",

    generateBundle: {
      handler(options, bundle, isWrite) {
        try {
          logger.info(`${logPrefix} ${chalk.green("start collecting CSS files...")}`);

          let cssBundle = "";
          let cssFileCount = 0;

          Object.values(bundle).forEach((item) => {
            if (item.type === "asset" && /[\.css$]/.test(item.fileName)) {
              cssFileCount++;
              includeCssFiles.push(item.fileName);

              // debug级别输出文件详情
              this.debug(
                `${logPrefix} ${chalk.gray(`founded: ${item.fileName}`)}`
              );

              cssBundle += `/* ===== original path: ${item.fileName} ===== */\n`;
              cssBundle += item.source;
              cssBundle += "\n\n";
            }
          });

          // info级别输出收集结果
          logger.info(
            `${logPrefix} ${chalk.green(
              `CSS files founded: ${cssFileCount} files`
            )}`
          );

          if (cssFileCount > 0) {
            logger.info(
              `${logPrefix} ${chalk.green(
                `start putting CSS files into bundle...`
              )}`
            );

            cssBundleRefId = this.emitFile({
              type: "asset",
              name,
              fileName: outputFileName,
              source: cssBundle,
            });
          } else {
            logger.warn(`${logPrefix} ${chalk.yellow(`no CSS files founded`)}`);
          }
        } catch (e) {
          logger.error(`${logPrefix} ${chalk.red(`CSS bundle failed`)}`);
        }
      },
      order: "post",
    },

    writeBundle: {
      handler(outputOptions) {
        if (cssBundleRefId) {
          cssBundleFileName =  path.resolve(outputOptions.dir || "", this.getFileName(cssBundleRefId));
        }
      },
      order: "post",
    },

    closeBundle: {
      handler() {
        if (includeCssFiles.length > 0) {
          logger.info(
            `${logPrefix} ${chalk.green(`CSS Bundle build completed`)}`
          );

          logger.info(`${logPrefix} ${chalk.green(`output file:`)} ${chalk.cyan(cssBundleFileName)}`);

          // debug级别输出详细文件列表
          this.debug(`${logPrefix} ${chalk.gray(`include files:`)}`);
          includeCssFiles.forEach((file, index) => {
            this.debug(`${index + 1}. ${file}`);
          });
        } else {
          logger.warn(`${logPrefix} ${chalk.yellow(`no CSS files founded`)}`);
        }
      },
      order: "post",
    },
  };
}
