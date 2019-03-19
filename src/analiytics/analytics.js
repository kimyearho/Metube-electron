const ua = require('universal-analytics');

const { ipcMain } = require("electron")

const uuidV4 = require("uuid/v4")
const uuid = uuidV4()

let visitor = ua('UA-128591940-1', uuid);

module.exports = function(app) {
  // pageView
  ipcMain.on("pageView", function(e, args) {
    visitor.pageview(args.url).send();
  })

  // pageView
  ipcMain.on("eventView", function(e, args) {
    visitor.event(args.eventCategory, args.eventAction, args.eventLabel, 0).send()
  })
}
