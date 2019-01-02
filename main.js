// var {app, BrowserWindow} = require("electron");
var {app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, clipboard, shell, dialog} = require("electron");
var path = require("path");
var url  = require("url");
var $    = require("jquery");

// Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected
var win;

// This method will be called when Electron has finished initialization and is ready to create browser windows. Some APIs can only be used after this event occurs
app.on("ready", () => {
  // Create the browser window and load the index.html of the app
  win = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: true}});
  win.loadURL(url.format({
    "pathname": path.join(__dirname, "index.html"),
    "protocol": "file:",
    "slashes" : true
  }));

  // win.webContents.openDevTools(); // Open DevTools

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element.
    win = null;
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
  if(process.platform !== "darwin")
    app.quit();
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
  if(win === null)
    createWindow();
})

////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages received from the client
app.on("message", (msg) => {
  try{
    eval(`${msg.function}(${msg.data});`);
  }catch(err){
    console.log(`ERROR: The function "${msg.function}" doesn't exist`);
  }
});

function Testing(data){
  console.log("============= TESTING =============");
  console.log(data);
  console.log(data.yolo);
  SendMessage("HelloWorld", data);
}

function SendMessage(func, data = null){
  win.webContents.send("message", {
    "function": func,
    "data"    : data
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////

var server = require("dgram").createSocket("udp4").bind(9000);

server.on("message", (message) => {
  var data = JSON.parse(message.toString("utf-8"));
  console.log(data);
  var packet = JSON.stringify(data);
  var message = Buffer.from(packet);
  server.send(message, 0, message.length, 9001, "localhost");
  server.send(message, 0, message.length, 9002, "localhost");
});

server.on("listening", () => {
  console.log(`Listening on port ${server.address().port}`);
});
