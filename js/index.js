var ipc         = require("electron").ipcRenderer;
var EmitMessage = require("electron").remote.app.emit;

function SendMessage(func, data = null){
  EmitMessage("message", {
    "f": func,
    "d": data
  });
}

ipc.on("message", (event, data) => {
  var f = data.f;
  var d = data.d;

  console.log(f);
  console.log(d);
});

$("#submit").click(function(){
  var text = $("#text").val();

  SendMessage("CreateRoom", {
    "text": text
  });
});
