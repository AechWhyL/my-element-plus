import fs from "fs";
import path from "path";
import { corePackageRootPath } from "../build-utils/paths";
import consola from "consola";

const version = process.env.TAG_VERSION;

const corePackageJsonPath = path.resolve(corePackageRootPath, "package.json");

const main = () => {
  try {
    if (!version) {
      throw new Error("env var tagVersion is not set");
    }

    consola.info(`updating version to ${version} in ${corePackageJsonPath}`);

    const corePackageJson = JSON.parse(
      fs.readFileSync(corePackageJsonPath, "utf-8")
    );

    corePackageJson.version = version;
    
    fs.writeFileSync(
      corePackageJsonPath,
      JSON.stringify(corePackageJson, null, 2)
    );
    
    consola.success(`updated version to ${version} in ${corePackageJsonPath}`);
  } catch (error) {
    throw error;
  }
};

main();
