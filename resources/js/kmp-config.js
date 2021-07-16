$(document).ready(function(){
    initKmpConfig();
    kmpConfigList();
});
function initKmpConfig(){
    displayList();
   $('#define').click(function(){
     resetform();
        $('.dialog').dialog({
            modal:true,
            resize:false,
            title:'Define Row & Column',
            buttons:{
                Save:function(){
                    $(this).dialog('close');
                    let rows = $('#row').val();
                    let columns = $('#column').val();
                    createTable(rows,columns,'');
                },
                Cancel:function(){
                    resetform();
                    $(this).dialog('close');
                }
            }
        });
   });

}
let displayArray =['admin DESKTOP-JT4FMAE','admin LAPTOP-AC65O4NB'];
function displayList(){
    var str ='';
    $.ajax({
        url:listdisplays,
        type:'GET',
        headers:header,
        success:function(res){
            // var result = res.result;
            // var scope = JSON.parse(result);
            // for(display of scope){
            //    str +='<div class="col-1 p-1 whiteBox">'+
            //             '<div class="displaybox bg-custom text-white text-size" draggable="true">'+display.id+
            //             '</div>'+
            //         '</div>'
            // }
            for(i=0; i<displayArray.length;i++){
                str +='<div class="col-1 p-1 whiteBox">'+
                '<div class="displaybox bg-custom text-white text-size" draggable="true">'+displayArray[i]+
                '</div>'+
            '</div>'
            }
            $('.dsquare').append(str);
            dragged();
        },
        error:function(eror,status){

        }
    });
    
}

function resetform(){
    $('#row').val('');
    $('#column').val('');
}

function createTable (rows,columns,itemArray,server){
   
    var table;
    var it=0;
        for(var r=1; r<=rows; r++){
            table+='<tr>'
            for(var c=1; c<=columns;c++){
                    table+='<td class="rectangle containerBox" row='+r+' column='+c+'>'+
                    '<input type="checkbox" class="float-right checkbox" id="check'+c+'">'+
                    '<div class="displaybox bg-custom text-white text-size" draggable="true">'+itemArray[it]+
                    '</div>'  
                '</td>' 
                it++;
            }
           
            table+='</tr>';
           
        }
        
        $('.table').append(table);
        
        dragged();
        const row = parseInt(rows);
        const col = parseInt(columns);
        const rowCol = row * col;
        var i=0;
        $('tbody>tr').each(function(){
            var $td = $(this).find('td');
            $($td).each(function(){
               if(server){
                $('.checkbox').attr('checked', true);
                $("#save").attr('disabled',false);
                $("#save").removeClass('btn-light');
                $("#save").addClass('btn-primary');
               }

            $(this).find('input[type="checkbox"]').click(function() {
                if ($(this).is(':checked')){
                    $('.checkbox').attr('checked', true);
                    $("#save").attr('disabled',false);
                    $("#save").removeClass('btn-light');
                    $("#save").addClass('btn-primary');
                } else {
                    $('.checkbox').attr('checked', false);
                    $("#save").attr('disabled',true);
                    $("#save").addClass('btn-light');
                   
                }
            });
            
            });
        });
        

}

function dragged(){
    const displayId = document.getElementsByClassName('displaybox');
    const containerbox = document.getElementsByClassName('containerBox');
    var dragedItem = null;
    for(var did of displayId){
        did.addEventListener('dragstart',function(e){
            setInterval(()=>{
                dragedItem = this;
            },0);
        });
        did.addEventListener('dragend',function(e){
            e.preventDefault();
            dragedItem = null;
        });
    }
    

    for(containerboxes of containerbox){
        containerboxes.addEventListener('dragover',function(e){
            e.preventDefault();
        });
        containerboxes.addEventListener('dragenter',function(e){
            e.preventDefault();
        });
        containerboxes.addEventListener('dragleave',function(e){
           e.preventDefault();
        });
        containerboxes.addEventListener('drop',function(e){
            this.append(dragedItem);
        });
       
        $(containerboxes).bind('contextmenu',function(e){
            $(".contextMenu").offset({left:e.pageX, top:e.pageY});
            $('.contextMenu').css('display','block');
            e.preventDefault();
            
        });
        $(document).bind('click',function(e){
            $('.contextMenu').css('display','none');
        });
    }
    $('.remove').click(function(e){
       e.preventDefault();
       alert($('.displaybox').text());
    });
    
}
var maxRowArray =[];
var maxColArray =[];
var itemArray = [];
var serverArray =[];
function kmpConfigList(){
    var server;
    $.ajax({
        url:'/app/kmm/config/fetch',
        type:'GET',
        headers:header,
        contentType:'application/json',
        success:function(res){
            let result = res.views;
            for(vw of result){
               let rc = vw.rowColumn;
               let item = vw.item;
                server = vw.isServer;
               let rw = rc.row;
               let col = rc.column;
              
               itemArray.push(item);
               maxRowArray.push(rw);
               maxColArray.push(col);
           
            }
            
            let maxrow = Math.max(...maxRowArray);
            let maxcol = Math.max(...maxColArray);
            createTable(maxrow,maxcol,itemArray,server);
        
        },
        error:function(){

        }
    });
}


var configArray=[];
$('#save').click(function(){
    $('tbody>tr').each(function(){
        var $td = $(this).find('td');
        $($td).each(function(){
            var content = $(this).text();
            var row = $(this).attr('row');
            var col = $(this).attr('column');
            var isChecked = $(this).find('input[type="checkbox"]').is(':checked');
            var config ={"rowColumn":{"row":row, "column":col},"item":content,"isServer":isChecked};
            configArray.push(config);
        })
    });
    var data ={'views':configArray};
    console.log(JSON.stringify(data));
    $.ajax({
        url:'/app/kmm/data/config/KMM_CONFIG/process',
        headers:header,
        type:'POST',
        contentType:'application/json',
        data:JSON.stringify(data),
        success:function(res){
            Fnon.Hint.Success('KMP configured!', {
                callback:function(){
                }
              });
        },
        error:function(error,status){
            Fnon.Hint.Danger(status, {
                callback:function(){
                }
              });
        }
    });
});

$('#Restart').click(function(){
    $('tbody>tr').each(function(){
        var $td = $(this).find('td');
        $($td).each(function(){
            var content = $(this).text();
            var row = $(this).attr('row');
            var col = $(this).attr('column');
            var isChecked = $(this).find('input[type="checkbox"]').is(':checked');
            var config ={"rowColumn":{"row":row, "column":col},"item":content,"isServer":isChecked};
            configArray.push(config);
        })
    });
    var data ={'views':configArray};
    console.log(JSON.stringify(data));
    $.ajax({
        url:'/app/kmm/data/config/KMM_CONFIG/process',
        headers:header,
        type:'POST',
        contentType:'application/json',
        data:JSON.stringify(data),
        success:function(res){
            Fnon.Hint.Success('Restart!', {
                callback:function(){
                }
              });
        },
        error:function(error,status){
            Fnon.Hint.Danger(status, {
                callback:function(){
                }
              });
        }
    });
});



