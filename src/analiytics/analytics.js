const { ipcMain } = require("electron");
const Analytics = require("electron-google-analytics");
const analytics = new Analytics.default("[[ KEY ID HERE ]]");
const uuidV4 = require("uuid/v4");
const uuid = uuidV4();

module.exports = function(app) {
  // app start
  ipcMain.on("event:appStart", function(e, args) {
    return analytics
      .screen("SharePod", `${app.getVersion()}`, "", "", "main", uuid)
      .then(response => {
        return response;
      })
      .catch(err => {
        return err;
      });
  });
};
