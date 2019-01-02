var ipc         = require("electron").ipcRenderer;
var EmitMessage = require("electron").remote.app.emit;

function SendMessage(func, data = null){
  EmitMessage("message", {
    "function": func,
    "data"    : JSON.stringify(data)
  });
}

$("#testing").click(function(){
  SendMessage("Testing", {"yolo": "swag"});
});

$("#testing2").click(function(){
  SendMessage("sdjkfhdf", {"qqqqqqqq": "wwwwwwww"});
});

ipc.on("message", (event, msg) => {
  var func = msg.function;
  var data = msg.data;
  console.log(func);
  console.log(data);
});
