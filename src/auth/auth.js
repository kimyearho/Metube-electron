import { BrowserWindow } from "electron";
import { google } from "googleapis";
import nodeUrl from "url";

const CLIENT_ID = "[[ CLIENT ID HERE ]]";
const CLIENT_SECRET = "[[ CLIENT SECRET HERE ]]";
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost"
);

const scopes = ["https://www.googleapis.com/auth/plus.me"];

export function googleLogin(mainWindow) {
  return new Promise((resolve, reject) => {
    const authURL = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "select_account",
      scope: scopes
    });

    const authWindow = new BrowserWindow({ width: 400, height: 580 });
    console.log(authURL);
    authWindow.setMenu(null);
    authWindow.loadURL(authURL);
    authWindow.show();

    authWindow.on("closed", () => {
      mainWindow.webContents.send("render:googleAuth", {
        resultCode: -1,
        resultMsg: "close"
      });
    });

    function onCallback(url) {
      var url_parts = nodeUrl.parse(url, true);
      var query = url_parts.query;
      var code = query.code;
      var error = query.error;

      if (error !== undefined) {
        reject(error);
        authWindow.removeAllListeners("closed");
        setImmediate(() => {
          authWindow.close();
        });
      } else if (code) {
        resolve(code);
        authWindow.removeAllListeners("closed");
        setImmediate(() => {
          authWindow.close();
        });
      }
    }

    authWindow.webContents.on("will-navigate", (event, url) => {
      onCallback(url);
    });

    authWindow.webContents.on(
      "did-get-redirect-request",
      (event, oldUrl, newUrl) => {
        onCallback(newUrl);
      }
    );
  });
}

export function getOauth2Client() {
  return oauth2Client;
}
