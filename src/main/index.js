import { app, BrowserWindow, ipcMain, dialog, shell } from "electron"
import { googleLogin, getOauth2Client } from "../auth/auth"
import { exec } from "child_process"
import request from "request"
import fs from "fs"
import path from "path"

let player
let mainWindow
let popupWindow
let willQuitApp = false
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

const deleteChromeCache = function () {
  var chromeCacheDir = path.join(app.getPath('userData'), 'Cache');
  if (fs.existsSync(chromeCacheDir)) {
    var files = fs.readdirSync(chromeCacheDir);
    for (var i = 0; i < files.length; i++) {
      var filename = path.join(chromeCacheDir, files[i]);
      if (fs.existsSync(filename)) {
        try {
          fs.unlinkSync(filename);
        }
        catch (e) {
          console.log(e);
        }
      }
    }
  }
};

deleteChromeCache()

if (process.env.NODE_ENV !== "development") {
  let shouldQuit = app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
  if (shouldQuit) {
    app.quit()
  }
}

if (process.platform === "darwin") {
  app.dock.hide()
}

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let playerPath
if (process.env.NODE_ENV !== "production") {
  if (process.platform !== "darwin") {
    // windows
    // playerPath = "http://localhost:7070"
    playerPath = "http://sharepod.kr"
  } else {
    // other
    playerPath = "http://sharepod.kr"
  }
} else {
  playerPath = "http://sharepod.kr"
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
  })

  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)

  if (process.env.NODE_ENV !== "production") {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })

  // Main Window on Ready
  mainWindow.webContents.on("did-finish-load", () => {
    if (player) return
    player = new BrowserWindow({
      width: 420,
      height: 280,
      title: "Player"
    })
    player.setMenu(null)
    player.loadURL(playerPath)
    player.on("close", e => {
      if (!willQuitApp) {
        dialog.showErrorBox(
          "Oops! 🤕",
          "Sorry, player window cannot be closed. You can only minimize it."
        )
        e.preventDefault()
      }
    })
  })

  mainWindow.on("close", e => {
    if (willQuitApp) {
      // the user tried to quit the app
      player = null
      mainWindow = null
    } else {
      // the user only tried to close the win
      if (process.platform !== "darwin") {
        exec("taskkill /f /im MeTube.exe")
      } else {
        e.preventDefault()
        mainWindow.hide()
      }
    }
  })

  mainWindow.on("restore", e => {
    e.preventDefault()
    mainWindow.show()
  })
}

app.on("activate", () => {
  mainWindow.show()
})
app.on("before-quit", () => {
  willQuitApp = true
})
// App start
app.on("ready", () => {
  // local player server
  if (process.env.NODE_ENV !== "production") {
    if (process.platform !== "darwin") {
      exec(".\\node_modules\\.bin\\http-server ./player -p 7070")
    }
  }
  createWindow()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// Google Auth Youtube API Get AccessToken
ipcMain.on("main:googleAuth", () => {
  console.log("Google Youtube Oauth2.0 Start")
  googleLogin(mainWindow).then(code => {
    getOauth2Client()
      .getToken(code)
      .then(res => {
        if (res.tokens.access_token) {
          let requestURL = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${
            res.tokens.access_token
            }`
          request.get(requestURL, (error, response, body) => {
            if (response.statusCode === 200) {
              mainWindow.webContents.send("render:googleAuth", {
                resultCode: 200,
                resultMsg: "success",
                body: body
              })
            }
          })
        } else {
          mainWindow.webContents.send("render:googleAuth", {
            resultCode: -1,
            resultMsg: "error"
          })
        }
      })
  })
})

ipcMain.on("event:social", (e, args) => {
  popupWindow = new BrowserWindow({
    width: 800,
    height: 600
  })
  console.log(args)
  popupWindow.loadURL(args.socialUrl)
  popupWindow.on("close", e => {
    popupWindow.hide()
    popupWindow = null
  })
})

// Window Close
ipcMain.on("button:close", () => {
  if (process.platform !== "darwin") {
    exec("taskkill /f /im MeTube.exe")
    app.quit()
  } else {
    app.quit()
  }
})

// Window minimal
ipcMain.on("button:minimize", () => {
  mainWindow.minimize()
})

// Youtube Watch
ipcMain.on("button:watchYoutubePopup", (e, url) => {
  popupWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    title: "MeTube - Watch Youtube"
  })
  popupWindow.loadURL(url)
  popupWindow.on("close", e => {
    popupWindow.hide()
    popupWindow = null
  })
})

// Setting - AlwaysStop
ipcMain.on("option:alwaystop", (e, args) => {
  if (args) {
    mainWindow.setAlwaysOnTop(true)
  } else {
    mainWindow.setAlwaysOnTop(false)
  }
})

// Setting - Player Hide / Show
ipcMain.on("isPlayer", (e, args) => {
  if (args) {
    player.hide()
  } else {
    player.show()
  }
})

// Setting - New Releases Download
ipcMain.on("showGit", (e, args) => {
  shell.openExternal("https://github.com/kimyearho/MeTube/releases")
})

// Window to Player Events
ipcMain.on("win2Player", (e, args) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("main -> " + args)
    }
    player.webContents.send("win2Player", args)
  } catch (err) {
    /* window already closed */
  }
})

// Player to Window Events
ipcMain.on("player2Win", (e, args) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("sub -> " + args)
    }
    mainWindow.webContents.send("player2Win", args)
  } catch (err) {
    /* window already closed */
  }
})

require("../analiytics/analytics")(app)
