//var host='https://localhost:8469';
var host='';
$(document).ready(function(){
    intrusion();
});

/*-----------------------Open Dialog Box start----------------------*/
$('#addNewIntrusionSource').click(function(){
    var dialogs=$('#intrusion-source-dialog').dialog({
        resizable: false,
        height: 500,
        width: 900,
        modal: true,

        /*---------------------Add data from dialog box start----------------------*/
        buttons: {
            "Add Intrusion Source": function () {
                var name = $('#name').val();
                var url = $('#urls').val();
                var speed = $('#speeds').val();
                var framepersecond = $('#framepersecond').val();
                var playsound = $('#playsound').val();
                if(name ==null || name==''){
                    $('#nerror').html(IntrusionNameError).css('color','red');
                    $('#name').focus();
                    return false;
                }else if(url ==null || url==''){
                    $('#nerror').html('');
                    $('#urlerror').html(IntrusionUrlError).css('color','red');
                    $('#urls').focus();
                    return false;
                }else if(speed ==null){
                    $('#urlerror').html('');
                    $('#speederror').html(IntrusionSpeedError).css('color','red');
                    $('#speeds').focus();
                    return false;
                }else if(framepersecond ==null || framepersecond==''){
                    $('#speederror').html('');
                    $('#frameerror').html(IntrusionFrameError).css('color','red');
                    $('#framepersecond').focus();
                    return false;
                }else if(playsound ==null){
                    $('#frameerror').html('');
                    $('#sounderror').html(IntrusionPlaySoundError).css('color','red');
                    $('#playsound').focus();
                    return false;
                }else{
                    $('#sounderror').html('');
                    var data = {"name":name,"url":url,"speed":speed,"framepersecond":framepersecond,"playsound":playsound};
                    $.ajax({
                        type: "POST",
                        data:JSON.stringify(data),
                        url:host+'/app/intrusion/source/create',
                        contentType: "application/json",
                        success: function(data)
                        {
                            alert("Your record has been successfully created!");
                            window.location.reload();
                            intrusion();
                            $('#intrusion-source-dialog').dialog('close');
    
                        },
                        error: function(jqXHR, textStatus, errorThrown)
                        {
                            console.log('error while post');
                        }
                    });
                }
                
                
            },

            /*---------------------------Close the dialog on click cancel button start--------------------*/
            Cancel: function() {
                $( this ).dialog( "close" );
            }

            /*---------------------------Close the dialog on click cancel button end--------------------*/
        }
        /*---------------------Add data from dialog box end----------------------*/
    });
});
/*-----------------------Open Dialog Box end----------------------*/

/*---------------------Call the List start-----------------------*/
function intrusion(){
    $.ajax({
        url:host+'/app/intrusion/source/list',
        type: "GET",
        contentType: "application/json",
        success:function (data) {
            var robj = JSON.parse(data);
            $( "#intrusion-source-table tbody tr" ).each( function(){
                this.parentNode.removeChild( this );
            });
            for(var sn in robj){
                var sname = robj[sn].name;
                var surl = robj[sn].url;
                var sspeed = robj[sn].speed;
                var sframe = robj[sn].framepersecond;
                var sraise_alarm = robj[sn].playsound;

                $("#intrusion-source-table tbody").append('<tr>'+
                    '<td id="IntrusionSourceName">'+sname+'</td>'+
                    '<td id="url">'+surl+'</td>'+
                    '<td id="speed">'+sspeed+'</td>'+
                    '<td id="frame">'+sframe+'</td>'+
                    '<td id="raise_alarm">'+sraise_alarm+'</td>'+
                    '<td>'+
                    '<button class="btn btn-sm btn-primary" onclick="editIntrusionSource(this)">'+'Edit'+'</button> '+
                    '<button class="btn btn-sm btn-danger" onclick="deleteIntrusionSource(this)">'+'Delete'+'</button>'+
                    '</td>'+
                    '</tr>');
            }
            /*alert(sname +" "+ surl);*/
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error while post');
            alert(textStatus);
        }
    });

}
/*---------------------Call the List end-----------------------*/

/*---------------------Update Intrusion Source start------------------*/
function editIntrusionSource(td) {
      var _rows = $(td).parents("tr");
    var cols = _rows.children("td");
    var sname =$("#edit-name").val($(cols[0]).text());
    $("#edit-name").attr("disabled","disabled");
    var surl =$("#edit-url").val($(cols[1]).text());
    var sspeed =$("#edit-speed").val($(cols[2]).text());
    var sframepersecond =$("#edit-framepersecond").val($(cols[3]).text());
    var splaysounds = $("#edit-playsounds").val($(cols[4]).text());

    var editDialogs=$('#edit-intrusion-source-dialog').dialog({
        resizable: false,
        height: 500,
        width: 900,
        modal: true,
        /*---------------------Get Update data start----------------------*/
        buttons: {
            "Update Intrusion Source": function () {
                var name = $('#edit-name').val();
                var url = $('#edit-url').val();
                var speed = $('#edit-speed').val();
                var framepersecond = $('#edit-framepersecond').val();
                var playsound = $('#edit-playsound').val();

                var data = {"name":name,"url":url,"speed":speed,"framepersecond":framepersecond,"playsound":playsound};
                $.ajax({
                    type: "POST",
                    data:JSON.stringify(data),
                    url:host+'/app/intrusion/source/create',
                    contentType: "application/json",
                    success: function(data)
                    {
                        alert("Your record has been successfully updated!");
                        intrusion();
                        $("#edit-intrusion-source-dialog").dialog("close");
                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.log('error while post');
                    }
                });
            },
            /*---------------------------Close the dialog on click cancel button start--------------------*/
            Cancel: function() {
                $( this ).dialog( "close" );
            }
            /*---------------------------Close the dialog on click cancel button end--------------------*/
        }
        /*---------------------Get and Update data end----------------------*/
    });
}
/*---------------------Update Intrusion Source end------------------*/

/*---------------------Delete Intrusion Source start------------------*/

function deleteIntrusionSource(td){
    if(confirm('Are You sure to delete this record?'))
    {
        var rows =td.parentElement.parentElement;
        var dname=$.trim($(rows).find("#IntrusionSourceName").text());
        $.ajax({
            type: "GET",
            url:host+'/app/intrusion/source/'+dname+'/delete',
            contentType: "application/json",

            success: function(data) {
                alert('Your record has been deleted!');
                intrusion();
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                console.log('error while post');
                alert(textStatus);
            }

        });

    }
}
/*---------------------Delete Intrusion Source end------------------*/