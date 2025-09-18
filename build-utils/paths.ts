import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const projectRootPath = path.resolve(dirname, '..');
export const corePackageRootPath = path.resolve(projectRootPath, 'packages/core');