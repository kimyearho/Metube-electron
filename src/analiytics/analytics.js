const { ipcMain } = require("electron");
const Analytics = require("electron-google-analytics");
const analytics = new Analytics.default("UA-128591940-1");
const uuidV4 = require("uuid/v4");
const uuid = uuidV4();

module.exports = function(app) {
  // app start
  ipcMain.on("event:appStart", function(e, args) {
    return analytics
      .screen(`Metube`, `${app.getVersion()}`, "None", "None", "main", uuid)
      .then(response => {
        return response;
      })
      .catch(err => {
        return err;
      });
  });
};
