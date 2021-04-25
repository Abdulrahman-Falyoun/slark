import * as path from "path";

// This will resolve the path from the root directory of the OS to main file (server.js)
let mainModule = process['mainModule'];
const rootDir = mainModule === undefined ? '' : mainModule.filename;
/**
 *
 * @type {string}
 */
console.log('path: ', path);
export default path.dirname(rootDir);


