/* eslint-disable no-var */
/**
 * Setup the global scope variables 
 * 
 * https://github.com/Microsoft/TypeScript/pull/29332
 */

import { App, BrowserWindow } from "electron";
import E131 from "./output/e131";

declare global {
  var e131: E131;
  var mainBrowserWindow: BrowserWindow;
  var app: App;
}
