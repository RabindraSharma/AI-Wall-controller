var agentnum;
var clientnum;
const random_img_agent_array = ['avatar1.gif','avatar2.gif','avatar3.gif'];
const random_img_client_array=['avatar4.gif','avatar5.gif','avatar6.gif'];
$(document).ready(function(){
	agentnum = Math.floor(Math.random() * random_img_agent_array.length);
	clientnum = Math.floor(Math.random() * random_img_client_array.length);
    $("#sidebar").click(function(){
        if($("#sidebarLeft").toggle()){
            $('#main').toggleClass('col-md-12');
        }
        
    });
	$('.popup').hide();
	setTimeout(function(){
		$('.popup').show('down');
	},3000);
	
	$('.close').click(function(){
		$('.popup').hide();
    });
    
    $('#cancel').on('click',function(){
		$("#sidebarLeft").toggle();
	});
	
    
});

function getRandomAgentImage(imgpath){
imgpath = imgpath || '/static/avatars/';
var img =random_img_agent_array[agentnum];
console.log("agent "+imgpath+img);	
var imgStr ='<figure>'+
                '<img src="'+imgpath+img+'" alt="avatar" class="avatar ml-1  rounded float-left">'+
                '<figcaption class="font-weight-italic asistant">wall-assistant</figcaption>'+
            '</figure>';
    
return imgStr;
}

function getRandomClientImage(imgpath){
    imgpath = imgpath || '/static/avatars/';
    var img =random_img_client_array[clientnum];
    console.log("client "+imgpath+img);
    var imgStrc = '<figure class="fig">'+
                        '<img src="'+imgpath+img+'" alt="avatar" class="avatar-right mr-1 rounded  float-right">'+
                        '<figcaption class="fig-cap-right font-weight-italic float-right">you</figcaption>'+
                   ' </figure>';
    return imgStrc;    
}