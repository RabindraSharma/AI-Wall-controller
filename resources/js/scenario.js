//var produrl = 'http://localhost:8069';
var produrl = '';
$(function(){
	scenerio();
	$.ajax({
			url:produrl+'/app/gui/web/schedules/displays/list',
			 "headers":header, 
	        type: "GET",
			crossDomain: true,
			dataType: "json",
			
			 success: function(data) {
	                var obj=JSON.parse(data.result);
					var userpc=obj[0].display;
					var objs=obj[0].zoneCoordinateWebs;
					
					for(var di in obj){
						
						for(var zi in obj[di].zoneCoordinateWebs){
							var display = obj[di].display;
							var zone = obj[di].zoneCoordinateWebs[zi].name;
							var dispzone = obj[di].display+"("+obj[di].zoneCoordinateWebs[zi].name+")";
							var selectname = obj[di].display+"_"+obj[di].zoneCoordinateWebs[zi].name;
							var orgselect = selectname.replace(/\s+/g, '_');
							
							$("#display tr").append('<td>'+
							'<div id="block" class="'+dispzone+'">'+dispzone+'<br>'+
							'<div>'+
							'<select id="'+orgselect+'" class="form-control layout">'+
							'<option value="">'+'--Select Layout--'+'</option>'+
							'</select>'+
							'</div>'+
							'</div>'+
							'</td>');	
							
							var layoutsarray = [];
							var index = 0;
							for(layoutindex in obj[di].zoneCoordinateWebs[zi].layouts){
								layoutsarray[index++] = obj[di].zoneCoordinateWebs[zi].layouts[layoutindex].name;
									var s1=layoutsarray.pop(selectname);	
									var s2=s1.split(/\b(\s)/);
									
									$("#"+orgselect).append('<option value="'+s1+'">'+s1+'</option>');
							}
						}
					}
				},
		        error: function(jqXHR, textStatus, errorThrown) {
		            console.log('error while get');
					}
			});	
});

$('#addDialog').click(function(){
	var data;
	var name;
	var disp;
	var zon;
	var larr=[];
	var layouts;
	$(".layout").change(function(){
	var vl=$(this).closest('#display tr td #block').attr('class');
	var display = vl.replace(")","").split("(");
	disp =display[0];
	zon =display[1];
	layouts=$(this).val();
	var array ={"display":disp,"zone":zon,"layout":layouts};
	larr.push(array);
	});
	$("#name").attr("disabled",false);
	$("#name:text").val(""); 
	$(".form-control layout").val($("#select option:first").val());
	
var dialogs=$('#scenerio-dialog').dialog({
resizable: false,
height:400,
width: 900,
modal: true,
buttons: {
"Add Scenerio": function() {
	name =$("#name").val();
	var layoutsarray=JSON.stringify(larr);
	var rdata=JSON.parse(layoutsarray);
	
	data={"name":name, "layouts":rdata};
	if(name ==''){
		$('#nerror').html(ScenarioName).css('color','red');
		$('#name').focus();
		return false;
	}else if(rdata ==''){
		$('#nerror').html('');
		$('#lerror').html(ScenarioLayout).css('color','red');
		$('.layout').focus();
		return false;
	}else{
		$('#lerror').html('');
		$.ajax({
			type: "POST",
			data:JSON.stringify(data),
			url:produrl+'/app/gui/scenerio/saveupdate',
			contentType: "application/json",
			success: function(data) 
				{	
					alert("Your Scenerio has been Created!");
					$('#scenerio-table tbody').html('');
					scenerio();
					$('#scenerio-dialog').dialog('close');
				},
				error: function(jqXHR, textStatus, errorThrown) 
				{
				console.log('error while post');
				
				}
			});
	}
	

	
},

Cancel: function() {
$( this ).dialog( "close" );

}
}
});
});

function editScenerio(td){

	var data;
	var name;
	var disp;
	var zon;
	var larr=[];
	var layouts;
	$(".layout").change(function(){
	var vl=$(this).closest('#display tr td #block').attr('class');
	var display = vl.replace(")","").split("(");
	disp =display[0];
	zon =display[1];
	layouts=$(this).val();
	var array ={"display":disp,"zone":zon,"layout":layouts};
	larr.push(array);
	});
	var _rows = $(td).parents("tr");
	var cols = _rows.children("td");
	var sname =$("#name").val($(cols[0]).text());
	$("#name").attr("disabled","disabled");

	var description = $(cols[1]).text();

	var descsplitcoma = description.split(",");

	for (var index = 0; index < descsplitcoma.length; index++) 
	{
	var element = descsplitcoma[index];
	var data =element.replace(/[{}]/g,',').split(',');
	var lay = data[1];
	var ssdata = data[0].replace(/[s()]/g,'');
	var odata = ssdata.replace(/\s+/g, '_').substring(0,ssdata.length-1);
	
		$("#"+odata).val(lay);
	}
	
var dialogs=$('#scenerio-dialog').dialog({
resizable: false,
height:400,
width: 900,
modal: true,
buttons: {
"Update Scenerio": function(){
	
	var disply;
	var zone1;
	var lyrr=[];
	var layouts;
	$('.layout option:selected').each(function(){
		
		var dz=$(this).closest('#display tr td #block').attr('class');
		var disp1 = dz.replace(")","").split("(");
		disply=disp1[0];
		zone1=disp1[1];
		layouts=$(this).val();
		var array ={"display":disply,"zone":zone1,"layout":layouts};
		lyrr.push(array);
	});
	var name =$("#name").val();
	var result=JSON.stringify(lyrr);
	var rdata=JSON.parse(result);
	data={"name":name, "layouts":rdata};
	if(name ==''){
		$('#nerror').html(ScenarioName).css('color','red');
		$('#name').focus();
		return false;
	}else if(rdata ==''){
		$('#nerror').html('');
		$('#lerror').html(ScenarioLayout).css('color','red');
		$('.layout').focus();
		return false;
	}else{
		$.ajax({
			type: "POST",
			data:JSON.stringify(data),
			url:produrl+'/app/gui/scenerio/saveupdate',
			contentType: "application/json",
			success: function(data) 
				{	
					alert("Your Scenerio has been Updated!");
					scenerio();
					$('#scenerio-dialog').dialog('close');
				},
				error: function(jqXHR, textStatus, errorThrown) 
				{
				console.log('error while post');
				
				}
			});
	}

},

Cancel: function() {
$( this ).dialog( "close" );

}
}
});
	
	
/*var _rows = $(td).parents("tr");
var cols = _rows.children("td");
var sname =$("#name").val($(cols[0]).text());
$("#name").attr("disabled","disabled");

var description = $(cols[1]).text();

var descsplitcoma = description.split(",");

for (var index = 0; index < descsplitcoma.length; index++) 
{
var element = descsplitcoma[index];
var descsplitspace = element.split(" ");
var zone = descsplitspace[1].substring(1, (descsplitspace[1].length-1));
var layout = descsplitspace[2].substring(1, (descsplitspace[2].length-1));
var selectname = descsplitspace[0]+"_"+zone;
	$('#'+selectname).val(layout);
}*/
}

function loadScenerio(td){
var rows =td.parentElement.parentElement;
var scenerioName =$.trim($(rows).find("#loadScenerio").text());

$.ajax({
contentType: "application/json",
type: "GET",
data:JSON.stringify(scenerioName),
url:produrl+'/app/gui/scenerio/'+scenerioName+'/load',
success: function(data) 
	{	
		alert("Your Scenerio has been Loaded successfully!");
		
			scenerio();
			
		
	},
	error: function(jqXHR, textStatus, errorThrown) 
	{
	console.log('error while post');
	
	}
});
}


function deleteScenerio(td){
if(confirm('Are You sure to delete this record?'))
{

var rows =td.parentElement.parentElement;
var dname=$.trim($(rows).find("#displayName").text());
var zname=$.trim($(rows).find("#zoneName").text());
var name=$.trim($(rows).find("#scenerioName").text());
var layout=$.trim($(rows).find("#scenerioLayout").text());

$.ajax({
contentType: "application/json",
type: "POST",
url:produrl+'/app/gui/scenerio/'+name+'/delete',
success: function(data) {
		alert('Your record has been deleted!');
		scenerio();
},
error: function(jqXHR, textStatus, errorThrown)
{
	console.log('error while post');
	alert(textStatus);
}
		
}); 

}
}

function scenerio(){

$.ajax({
url:produrl+'/app/gui/scenerio/list ',
"headers": header,
type: "GET",
crossDomain: true,
dataType: "json",

success: function(data) 
	{	
		var obj =JSON.stringify(data);
		var robj = JSON.parse(obj);
		var nobj = robj.result;
		$( "#scenerio-table tbody tr" ).each( function(){
			  this.parentNode.removeChild( this ); 
		});
		
			for(var sn in nobj)
			{
				var sname =nobj[sn].name;
				var lyts = nobj[sn].layouts;
				var layouts=JSON.stringify(lyts);
				var lyt = JSON.parse(layouts);
				var descript = '';
				for(var ln in lyt)
				{
					var display = lyt[ln].display; 
					var zone = lyt[ln].zone;
					var layout = lyt[ln].layout;
					descript = descript + display +' ('+zone+') {'+layout+'}' + ",";
				}
					descript = descript.substring(0, descript.length-1);
					$("#scenerio-table tbody").append('<tr>'+
					'<td id="scenerioName">'+
					'<button class="btn btn-info btn-md" id="loadScenerio" onclick="loadScenerio(this)" >'+sname+
					'<img src="resources/images/load.png" class="pull-right"/>'+
					'</button>'+
					'</td>'+
					'<td id="description">'+descript+'</td>'+
					'<td>'+
						'<button class="btn btn-sm btn-primary" onclick="editScenerio(this)" >'+'Edit'+'</button> '+
						'<button class="btn btn-sm btn-danger" onclick="deleteScenerio(this)">'+'Delete'+'</button>'+
					'</td>'+
					'</tr>');
			}
				
	},
	error: function(jqXHR, textStatus, errorThrown) 
	{
	console.log('error while post');
	alert(textStatus);
	}
});
}	
	