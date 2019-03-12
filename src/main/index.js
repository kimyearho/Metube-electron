import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import { googleLogin, getOauth2Client } from "../auth/auth";
import { exec } from "child_process";
import log from "electron-log";
import request from "request";
import { autoUpdater } from "electron-updater";

let player;
let mainWindow;
let popupWindow;
let willQuitApp = false;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

const gotTheLock = app.requestSingleInstanceLock();

if (process.platform === "darwin") {
  app.dock.hide();
}

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

let playerPath;
if (process.env.NODE_ENV !== "production") {
  if (process.platform !== "darwin") {
    // windows
    playerPath = "http://localhost:7070";
  } else {
    // other
    playerPath = "http://sharepod.kr";
  }
} else {
  playerPath = "http://sharepod.kr";
}

// Create Main Window
function createWindow() {
  log.info("================ >>> APP START");

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

  if (process.env.NODE_ENV !== "production") {
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
      if (!willQuitApp) {
        dialog.showErrorBox(
          "Oops! 🤕",
          "Sorry, player window cannot be closed. You can only minimize it."
        );
        e.preventDefault();
      }
    });
  });

  mainWindow.on("close", e => {
    if (willQuitApp) {
      // the user tried to quit the app
      player = null;
      mainWindow = null;
    } else {
      // the user only tried to close the win
      if (process.platform !== "darwin") {
        exec("taskkill /f /im MeTube.exe");
      } else {
        e.preventDefault();
        mainWindow.hide();
      }
    }
  });

  mainWindow.on("restore", e => {
    e.preventDefault();
    mainWindow.show();
  });
}

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // App start
  app.on("ready", () => {
    // local player server
    if (process.env.NODE_ENV !== "production") {
      if (process.platform !== "darwin") {
        exec(".\\node_modules\\.bin\\http-server ./player -p 7070");
      }
    }
    createWindow();
  });
}

app.on("activate", () => {
  mainWindow.show();
});
app.on("before-quit", () => {
  willQuitApp = true;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
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
  } else {
    app.quit();
  }
});

ipcMain.on("eventLogger", (e, args) => {
  if (args.value) {
    log.info(args.message, args.value);
  } else {
    log.info(args.message);
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

if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 10 * 3000);

  autoUpdater.on("update-not-available", () => {
    log.info(">>> No Updates, urrent version is up-to-date.");
    updater.enabled = true;
    updater = null;
  });

  autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Application Update",
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail: "Found updates, do you want update now?"
    };

    dialog.showMessageBox(dialogOpts, response => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on("error", message => {
    log.info(">>> 애플리케이션을 업데이트하는 도중 오류가 발생하였습니다.");
    log.info(message);
  });
}
