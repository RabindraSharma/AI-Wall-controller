function init()
  {
   if (!window.WebSocket) {
     alert("WebSocket not supported by this browser");
     setInterval(function(){  refreshdisplays() }, 5000);
   }else{
      createWebSocket();
   }
  
  }

  function createWebSocket()
  {
  var host = window.location.hostname;
  var wsUri = "wss://"+host+":8469/events/";  
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
  console.log( "CONNECTED");
  var scope = angular.element(document.getElementById('bodycontainer')).scope();
  initVideoEffects(scope.token,scope.getAudioLicense());
 
  }

  function onClose(evt)
  {
    console.log("DISCONNECTED");
    var r = confirm("Connection time out. Refresh the page!");
    if (r == true){
      window.location.reload();
    }
  }

  function onMessage(evt)
  {
    console.log('Message : ' + evt.data);
    refreshdisplays();
  }
  
  function refreshdisplays(){
    console.log( "Refresh Displays.");
    var scope = angular.element(document.getElementById('bodycontainer')).scope();
    scope.loadDisplays();
    $('#mainRow').empty();
    initVideoEffects(scope.token,scope.getAudioLicense());
  
  }

  function onError(evt)
  {
    console.log('Error data : ' + evt.data);
  }

  function doSend(message)
  {
    console.log("SENT: " + message);
    websocket.send(message);
  }
    window.addEventListener("load", init, false);