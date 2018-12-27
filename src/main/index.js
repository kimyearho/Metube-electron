import { app, BrowserWindow, ipcMain, globalShortcut, shell } from "electron";
import { googleLogin, getOauth2Client } from "../auth/auth";
import { exec } from "child_process";
import request from "request";

// const playerPath = "http://sharepod.kr";
const playerPath = "http://localhost:7070";

// https connect true
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let player;
let mainWindow;
let popupWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

if (process.env.NODE_ENV != "development") {
  let shouldQuit = app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  if (shouldQuit) {
    app.quit();
  }
}

// Create Main Window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 368,
    height: 612,
    title: "MeTube",
    resizable: false,
    frame: false,
    maximizable: false,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false
    }
  });

  mainWindow.setMenu(null);
  mainWindow.loadURL(winURL);

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Main Window on Ready
  mainWindow.webContents.on("did-finish-load", () => {
    if (player) return;
    player = new BrowserWindow({
      width: 420,
      height: 280,
      title: "Player"
    });
    player.setMenu(null);
    player.loadURL(playerPath);
    player.on("close", e => {
      if (mainWindow) {
        e.preventDefault();
      }
    });
  });

  mainWindow.on("close", e => {
    if (process.platform != "darwin") {
      exec("taskkill /f /im MeTube.exe");
    } else {
      mainWindow.hide();
    }
  });
}

// App start
app.on("ready", () => {
  // local player server
  if (process.env.NODE_ENV != "production") {
    exec(".\\node_modules\\.bin\\http-server ./player -p 7070");
  }
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("browser-window-created", (e, window) => {
  window.setMenu(null);
});

// Google Auth Youtube API Get AccessToken
ipcMain.on("main:googleAuth", () => {
  console.log("Google Youtube Oauth2.0 Start");
  googleLogin(mainWindow).then(code => {
    getOauth2Client()
      .getToken(code)
      .then(res => {
        if (res.tokens.access_token) {
          let requestURL = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${
            res.tokens.access_token
          }`;
          request.get(requestURL, (error, response, body) => {
            if (response.statusCode === 200) {
              mainWindow.webContents.send("render:googleAuth", {
                resultCode: 200,
                resultMsg: "success",
                body: body
              });
            }
          });
        } else {
          mainWindow.webContents.send("render:googleAuth", {
            resultCode: -1,
            resultMsg: "error"
          });
        }
      });
  });
});

ipcMain.on("event:social", (e, args) => {
  popupWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  console.log(args);
  popupWindow.loadURL(args.socialUrl);
  popupWindow.on("close", e => {
    popupWindow.hide();
    popupWindow = null;
  });
});

// Window Close
ipcMain.on("button:close", () => {
  if (process.platform !== "darwin") {
    exec("taskkill /f /im MeTube.exe");
    app.quit();
  }
});

// Window minimal
ipcMain.on("button:minimize", () => {
  mainWindow.minimize();
});

// Youtube Watch
ipcMain.on("button:watchYoutubePopup", (e, url) => {
  popupWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    title: "MeTube - Watch Youtube"
  });
  popupWindow.loadURL(url);
  popupWindow.on("close", e => {
    popupWindow.hide();
    popupWindow = null;
  });
});

// Setting - AlwaysStop
ipcMain.on("option:alwaystop", (e, args) => {
  if (args) {
    mainWindow.setAlwaysOnTop(true);
  } else {
    mainWindow.setAlwaysOnTop(false);
  }
});

// Setting - Player Hide / Show
ipcMain.on("isPlayer", (e, args) => {
  if (args) {
    player.hide();
  } else {
    player.show();
  }
});

// Setting - New Releases Download
ipcMain.on("showGit", (e, args) => {
  shell.openExternal("https://github.com/kimyearho/MeTube/releases");
});

// Window to Player Events
ipcMain.on("win2Player", (e, args) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("main -> " + args);
    }
    player.webContents.send("win2Player", args);
  } catch (err) {
    /* window already closed */
  }
});

// Player to Window Events
ipcMain.on("player2Win", (e, args) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("sub -> " + args);
    }
    mainWindow.webContents.send("player2Win", args);
  } catch (err) {
    /* window already closed */
  }
});

require("../analiytics/analytics")(app);
