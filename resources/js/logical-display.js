var unitsArray = [];
var resol =0;
var pro;
const proLicence ='/app/gui/enterprise/license/status';
const message='You need enterprise license to use this feature.';
$(document).ready(function(){
	getLicenceStatus();
    listOfLogicalDisplay();
    initLogicDisplay();
});

function initLogicDisplay(){
    $('#createLogicDisplay').click(function(){
        if(pro){
           openDialog();
           resetForm();
        }else{
            licenceStatusMessage(message);
        }
        
    });
}

function openDialog(){
    
    $('#dialog').dialog({
        width:550,
        height:300,
        modal:true,
        resize:false,
        title:'Create Logical Display',
        autoClose:false,
        buttons:{
            'Add Display':function(){
               // $("#add-display").empty();
                addNewRow();
            },
            'Delete Rows':function(){
                deleteRows();
               
                
            },
            'Save and Close':function(){
                let name = $('#ld-name').val();
                if(name ==''){
                    $('#ld-name').focus().css('border-color','red');
                    $('#name').html('Name filed required').css('color','red');
                }else{
                    unitsArray =[];
                    $('#add-display tr').each(function(){
                        var rows = $(this).find('input.drow').val();
                        var column = $(this).find('input.dcolumn').val();
                        var resol = $(this).find('input.dresolution').val();
                        var host = $(this).find('input.dhost').val();
                        var rspan = $(this).find('input.drspan').val();
                        var cspan = $(this).find('input.dcspan').val();
                        
                        //alert('rows >'+rspan+ ' colspan >'+cspan)
                        dataArray ={
                            'row':rows,
                            'column':column,
                            'resolution':resol,
                            'host':host,
                            'rowspan':rspan,
                            'columnspan':cspan
                        };
                        
                        unitsArray.push(dataArray);
                    });
                    createDisplay(name,unitsArray);
                }
                
            }
        }
    });
    
}
let rows;
function addNewRow(){
    rows = "<tr>"+
        "<td>"+
            "<input type='text' id='drow' class='drow'  placeholder='rows' style='width:75px;'>"+
        "</td>"+
        "<td>"+
            "<input type='text' id='dcolumn' class='dcolumn' placeholder='column' style='width:75px;'>"+
        "</td>"+
        "<td>"+
            "<input type='text' id='dresolution' class='dresolution' placeholder='enter resolution' style='width:75px;'>"+
        "</td>"+
        "<td>"+
            "<input text='text' id='dhost' class='dhost' placeholder='host' style='width:75px;'>"+
        "</td>"+
        "<td>"+
            "<input type='text' id='drspan' class='drspan' placeholder='rowspan' style='width:75px;'>"+
        "</td>"+
        "<td>"+
            "<input text='text' id='dcspan' class='dcspan' placeholder='colspan' style='width:75px;'>"+
        "</td>"+
        
        "<td>"+
            "<span id='identify' class='btn btn-sm btn-primary' onclick='identifyRows(this);'>Identify"+"</span>"+
        "</td>"+
        "<td>"+
            "<input type='checkbox' id='check'>"+
        "</td>"+
    "</tr>";

    rows = rows;
    resol++;
    $("#add-display").append(rows);
    $('#ld-resolution').val(resol);
}

function listOfLogicalDisplay(){
    $('#logical-row').empty();
    $.ajax({
        url:'app/deskbar/logicaldisplay/list',
        type:'GET',
        'headers': {
            "accept": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic YWRtaW46V2VMY29tZQ=="
        },
        crossDomain: true,
        dataType: "json",
        beforeSend:function(){
            $('#loader').removeClass('hidden');
        },
        success:function(res){
            var dname='';
            var unitdata = "";
            
            for(var i=0; i<res.length; i++){
                dname = res[i].name;
                var unts = res[i].units;
               
                    $('#logical-row').append(
                        "<div class='row'>"+
                            "<div class='col-md-12 p-2'>"+
                                "<div class='card'>"+
                                    "<h6 class='card-header'>"+
                                        "<a data-toggle='collapse' href='#collapse-"+dname+"' aria-expanded='true' aria-controls='collapse-example' id='heading-"+dname+"' class='d-block'>"+
                                            "<i class='fa fa-chevron-down pull-right'></i>"+
                                        "</a>"+
                                        "<i title='Click on this icon to edit the "+dname+"' name="+dname+" data="+JSON.stringify(unts)+" class='fa fa-pencil pull-right pr-4' onclick='editDisplay(this);'></i>"+
                                        "<i title='Click on this icon to delete the "+dname+"' class='fa fa-trash pull-right pr-4' name='"+dname+"' onclick='deleteDispaly(this);'></i>"+
                                        dname+
                                    "</h6>"+
                                    "<div id='collapse-"+dname+"' class='collapse show' aria-labelledby='heading-"+dname+"'>"+
                                        "<div class='card-body'>"+
                                        "<table class='table table-bordered'>"+
                                            "<tbody id='viewTable"+dname+"'>"+"</tbody>"+
                                        "</table>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                        "</div>");
                
                 
                 var prevrow;  
                
                    if(dname){
                        unitdata='';
                	 for (j = 0; j < unts.length; j++) {
                       
                         if(prevrow!=unts[j].row){
                            
                        	 if(j!=0){
                        		 unitdata +="</tr>";
                        	 }
                        	 unitdata +="<tr>";
                         }
                         unitdata +="<td class='text-center rectangle'  colspan='"+unts[j].columnspan+"' rowspan='"+unts[j].rowspan+"'>"+unts[j].host+' ['+unts[j].resolution+']'+"</td>";
                         prevrow = unts[j].row;
                         if(j==unts.length-1){
                        	 unitdata +="</tr>";
                         }
                         
                    }
                    $('#viewTable'+dname).append(unitdata);
                }
              
                   
                }    
               
        
        
        },
        complete:function(){
            setInterval(function(){
                $('#loader').addClass('hidden');
            },3000);
            
        },
        error:function(error,status){
            alert(status);
        }
    });
}
var dataArray;
function createDisplay(dname,unitsArray){
    var data = {'name':dname,'units':unitsArray};
    
    $.ajax({
        url:'app/deskbar/logicaldisplay/add',
        "headers": {
            "accept": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic YWRtaW46V2VMY29tZQ=="
        },
        type:'POST',
        data:JSON.stringify(data),
        contentType:'application/json',
        success:function(res){
            $('#dialog').dialog('close');
            listOfLogicalDisplay();
            Fnon.Hint.Success(res.result, {
                callback:function(){
                }
              });
        },
        error:function(){
            listOfLogicalDisplay();
            Fnon.Hint.Danger(res.result, {
                callback:function(){
                }
              });
        }
    });
}

function identifyRows(td){
    var _rows = $(td).parents('tr');
    var _cols = _rows.children('td');
    var cols1 = $(_cols[3]).find('input');
    Fnon.Hint.Info('Identified host :'+$(cols1).val()+'', {
        callback:function(){
        }
      });
}



function deleteRows(){
    var checkbox = $('input[type="checkbox"]:checkbox:checked');
    if($(checkbox).length >0){
        Fnon.Hint.Success(''+checkbox.length+' rows deleted!', {
            callback:function(){
                resol-=checkbox.length;
                $(checkbox).closest("tr").remove();
                $('#ld-resolution').val(resol);
            }
    
          });
    }else{
        Fnon.Hint.Info('No rows selected', {
            callback:function(){
            }
          });
    }
   
    
}

function deleteDispaly(td){
    let disname = $(td).attr('name');
    if(pro){
        if(confirm("Are you sure to delete this dispaly "+disname+"")){
            deletePost(disname);
        }
    }else{
        licenceStatusMessage(message);
    }
    
}

function deletePost(name){
    $.ajax({
        url:'app/deskbar/logicaldisplay/'+name+'/remove',
        "headers": {
            "accept": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic YWRtaW46V2VMY29tZQ=="
        },
        type:'POST',
        contentType:'application/json',
        success:function(res){
            
            listOfLogicalDisplay();
            Fnon.Hint.Success('Display deleted!', {
                callback:function(){
                }
              });
        },
        error:function(){
            listOfLogicalDisplay();
            Fnon.Hint.Success(res.result, {
                callback:function(){
                }
              });
        }
    });
}

function editDisplay(td){
    var data = $(td).attr('data');
    if(pro){
        $('#ld-name').val($(td).attr('name')).prop('disabled',true);
        var parsedData = JSON.parse(data);
        let rows='';
        resol ='';
        $("#add-display").empty();
        for(rd of parsedData){
    
            rows = "<tr>"+
            "<td>"+
                "<input type='text' value="+rd.row+" id='drow' class='drow'  placeholder='rows' style='width:75px;'>"+
            "</td>"+
            "<td>"+
                "<input type='text' value="+rd.column+" id='dcolumn' class='dcolumn' placeholder='column' style='width:75px;'>"+
            "</td>"+
            "<td>"+
                "<input type='text' value="+rd.resolution+" id='dresolution' class='dresolution' placeholder='enter resolution' style='width:75px;'>"+
            "</td>"+
            "<td>"+
                "<input text='text' value="+rd.host+" id='dhost' class='dhost' placeholder='host' style='width:75px;'>"+
            "</td>"+
            "<td>"+
                "<input type='text' value="+rd.rowspan+" id='drspan' class='drspan' placeholder='rowspan' style='width:75px;'>"+
            "</td>"+
            "<td>"+
                "<input text='text' value="+rd.columnspan+" id='dcspan' class='dcspan' placeholder='colspan' style='width:75px;'>"+
            "</td>"+
            
            "<td>"+
                "<span id='didentify' class='btn btn-sm btn-primary' onclick='identifyRows(this);'>Identify"+"</span>"+
            "</td>"+
            "<td>"+
                "<input type='checkbox' id='check'>"+
            "</td>"+
        "</tr>";
    
        rows = rows;
        resol++;
        $("#add-display").append(rows);
        $('#ld-resolution').val(resol).prop('disabled',true);
        }
         openDialog();
    }else{
        licenceStatusMessage(message);
    }
    
}

function resetForm(){
    resol ='';
    $('#ld-name').val('').prop('disabled',false);
    $('#ld-resolution').val(resol).prop('disabled',true);
    $("#add-display").empty();
}


function getLicenceStatus(){
    $.ajax({
        url:proLicence,
        type:'GET',
        success:function(res){
            pro = res;
        },
        error:function(error,status){

        }
    });

}

function licenceStatusMessage(message){
    Fnon.Hint.Danger(message,{
        callback:function(){
        }
    })
}