const { app, ipcMain, shell } = require("electron");
const { googleLogin, getOauth2Client } = require("../auth/auth");
const { exec } = require("child_process");
const log = require("electron-log");
const request = require("request");

module.exports = function(mainWindow, player) {
  ipcMain.on("main:googleAuth", () => {
    log.info("Google Youtube Oauth2.0 Start");
    googleLogin(mainWindow).then(code => {
      getOauth2Client()
        .getToken(code)
        .then(res => {
          if (res.tokens.access_token) {
            let requestURL = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${
              res.tokens.access_token
            }`;
            request.get(requestURL, (error, response, body) => {
              console.log(body)
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

  ipcMain.on("button:donate", (e, url) => {
    shell.openExternal(url);
  })

  // Youtube Watch
  ipcMain.on("button:watchYoutubePopup", (e, url) => {
    shell.openExternal(url);
  });

  // Setting - AlwaysStop
  ipcMain.on("option:alwaystop", (e, args) => {
    if (args) {
      mainWindow.setAlwaysOnTop(true);
    } else {
      mainWindow.setAlwaysOnTop(false);
    }
  });

};
