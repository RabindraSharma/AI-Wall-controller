var form = document.querySelector('#recognition-form'), inputs = document
        .querySelector('#send'), sent = document
        .querySelector('#sent'), micoff = document
        .querySelector('#off'), micon = document
        .querySelector('#on'), element = document
        .querySelector('#recognition-element');

    micon.classList.add('d-none');
    micoff.addEventListener('click', function(e) {
      e.preventDefault();
      element.start();
      micoff.classList.add('d-none');
      micon.classList.remove('d-none');

    });
    micon.addEventListener('click', function(e) {
      e.preventDefault();
      element.stop();
      micoff.classList.remove('d-none');
      micon.classList.add('d-none');

    });
    sent.addEventListener(
            'click',
            function(e) {
              e.preventDefault();
              if(inputs.value !=''){
                
                  var originData = inputs.value;
                  var options = originData.replace(/ /g,',').split(',');
                  let option = options[0];
                
                
                  $('.wall-body')
                  .append(
                      '<div class="row no-gutters d-10">'
                          + '<div class="col-md-3 offset-md-9">'
                          + getRandomClientImage('/static/avatars/')
                          + '<div class="chat-bubble chat-bubble-blue chat-bubble--right float-right">'
                                + inputs.value
                          + '</div>'
                          + '</div>'
                          + '</div>');
                          autoScrollBottom(); 
                          element.stop(); 
                          micoff.classList.remove('d-none');
                          micon.classList.add('d-none');
                          $("#send").val('');
          
                          switch(option){
                            case 'SHARESOURCEONLAYOUT':
                              getCommands(originData,'Shared of source layout');
                              loadAgentMessage('Shared Source Layout');
                              break;
                            case 'SHOWALARM':
                              getCommands(originData,'Show Alarm loaded successful');
                              loadAgentMessage('Alarm shown');
                              break;  
                            case 'REMOVEALARM':
                              getCommands(originData,'Alarm removed successfully!');
                              loadAgentMessage('Alarm Removed');
                              break; 
                            default:
                                loadAgentMessage('Please provide valid command like: <br>SHOWALARM,SHARESOURCELAYOUT and REMOVEALARM');  
                              break;
                          }
                          
                } 
              
    });
function sendData(event){
  if(event.keyCode === 13){
    event.preventDefault();
    if(inputs.value !=''){
      var originData = inputs.value;
        var options = originData.replace(/ /g,',').split(',');
        let option = options[0];
        
        $('.wall-body')
        .append(
            '<div class="row no-gutters d-10">'
                + '<div class="col-md-3 offset-md-9">'
                + getRandomClientImage('/static/avatars/')
                + '<div class="chat-bubble chat-bubble-blue chat-bubble--right float-right">'
                      + inputs.value
                + '</div>'
                + '</div>'
                + '</div>');
                autoScrollBottom(); 
                element.stop(); 
                micoff.classList.remove('d-none');
                micon.classList.add('d-none');
                $("#send").val('');

                switch(option){
                  case 'SHARESOURCEONLAYOUT':
                    getCommands(originData,'Shared of source layout');
                    loadAgentMessage('Shared Source Layout');
                    break;
                  case 'SHOWALARM':
                    getCommands(originData,'Show Alarm loaded successful');
                    loadAgentMessage('Alarm shown');
                    break;  
                  case 'REMOVEALARM':
                    getCommands(originData,'Alarm removed successfully!');
                    loadAgentMessage('Alarm Removed');
                    break; 
                  default:
                      loadAgentMessage('Please provide valid command like: <br>load,show alarm,remove alarm');  
                    break;
                }
                
      } 
              
    }
}
        
    element.addEventListener('result', function(e) {
        inputs.value = e.detail.result;
        if(inputs.value.match('click')){
          $('.wall-body')
        .append(
            '<div class="row no-gutters d-10">'
                + '<div class="col-md-3 offset-md-9">'
                + getRandomClientImage('/static/avatars/')
                + '<div class="chat-bubble chat-bubble-blue chat-bubble--right float-right">'
                      + inputs.value
                + '</div>'
                + '</div>'
                + '</div>');
                autoScrollBottom(); 
                element.stop(); 
                micoff.classList.remove('d-none');
                micon.classList.add('d-none');
                $("#send").val('');
        }
         
      });
    
    
