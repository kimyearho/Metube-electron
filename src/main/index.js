import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { exec } from "child_process";
import log from "electron-log";
import { autoUpdater } from "electron-updater";

import jwt from "jsonwebtoken"
import fs from "fs";
import ytdl from "ytdl-core";

// ipc youtube auto play enable
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

let player;
let mainWindow;
let willQuitApp = false;
const playerPath = "http://sharepod.kr";
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
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

// Create Main Window
function createWindow() {
  log.info("================ >>> APP START");

  mainWindow = new BrowserWindow({
    width: 368,
    height: 612,
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

  if (process.env.NODE_ENV !== "production")
    mainWindow.webContents.openDevTools();

  // Main Window on Ready
  mainWindow.webContents.on("did-finish-load", () => {
    if (player) return;
    player = new BrowserWindow({
      width: 420,
      height: 280,
      title: "Metube Video Player"
    });
    player.setMenu(null);
    player.loadURL(playerPath);
    player.on("close", e => {
      if (!willQuitApp) {
        dialog.showErrorBox(
          "Oops! 🤕",
          "Sorry, player window cannot be closed. You can only minimize it or Setting in hide option"
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

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("restore", e => {
    e.preventDefault();
    mainWindow.show();
  });

  /**
   * IPC EVENT
   */
  require("./ipc")(mainWindow, player);

  /**
   * Google Analytics
   */
  require("../analiytics/analytics")(app);
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

// Setting - Player Hide / Show
ipcMain.on("isPlayer", (e, args) => {
  if (args) {
    player.hide();
  } else {
    player.show();
  }
});

ipcMain.on("testdownload", (e, args) => {
  const modalPath = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080/#/download'
    : `file://${__dirname}/index.html#download`
  let win = new BrowserWindow({ width: 368, height: 400, webPreferences: {webSecurity: false} })
  win.on('close', function () { win = null })
  win.loadURL(modalPath)
});

ipcMain.on("videoDownload", (event, args) => {
  let title = regExp_test(args.title);
  console.log(title + ' / ' + args.quality)

  let sample = 'audio' + args.index

  let filename = args.path + "/" + sample + ".mp4";
  const video = ytdl(args.url, { quality: args.quality, filter: 'audioonly' });
  video.on('end', () => {
    const outputData = {
      index: args.index,
      progress: 'end',
      videoId: args.videoId
    };
    mainWindow.webContents.send("download-end", outputData);
  })

  video.pipe(fs.createWriteStream(filename));
});


function regExp_test(title){
  //함수를 호출하여 특수문자 검증 시작.
  let regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s*]/gi;
  let t = ''
  if(regExp.test(title)){
     t = title.replace(regExp, ".");
  } else {
    t = title
  }
  return t;
}


// ===================================== APP UPDATED ===================================== //

if (process.env.NODE_ENV === "production") {
  appUpdate();
}

function appUpdate() {
  // 프로덕션 상태라면 최신 업데이트 요청을 앱 시작 시 요청함.
  autoUpdater.checkForUpdates();

  // 1시간 간격으로 최신 업데이트 조회
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 3600000);

  // 업데이트할 내용이 없음
  autoUpdater.on("update-not-available", () => {
    log.info(">>> No Updates, Current version is up-to-date.");
  });

  // 업데이트가 있으므로 사용자에게 알림.
  // 1.6.6 버전부터 강제 업데이트로 변경 됨.
  autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Restart"],
      title: "Application Update",
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail:
        "The update has been verified. Click the `Restart` button to update"
    };

    dialog.showMessageBox(dialogOpts, response => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });

  // 업데이트 오류
  autoUpdater.on("error", message => {
    log.info(">>> 애플리케이션을 업데이트하는 도중 오류가 발생하였습니다.");
    log.info(message);
  });
}
