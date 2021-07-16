var layoutoptions = new Map(); 
//var produrl = 'https://localhost:8469';
var produrl = '';
function getLayouts(){
	var layouts = layoutoptions.get(getSelectedDisplayZone());
	var valarr = layouts.toString().split(',');
	return valarr;
}

function getSelectedDisplayZone(){
	return $('#display').children("option:selected").val();
}

function validateDisplayZoneLayout(){
	if ($('#display').children("option:selected").val() === ''){
		alert("Please select display(zone).");
	    return false;
	}
	return true;
}


function getDisplayZoneArray(){
	var value =  $('#display').children("option:selected").val();
	var index = value.toString().indexOf('(');
	var display = value.toString().substring(0,index);
	var zone = value.toString().substring(index+1,value.toString().length-1);
	return {
        "display": display,
        "zone": zone
    };
}

function getLayoutControl(selectedvalue){
	var valarr = getLayouts();
	var select = '<select id="layout" class="form-control">';
	for(var index in valarr){
		if(valarr[index]===selectedvalue){
			select = select + '<option value="'+valarr[index]+'" selected>'+valarr[index]+'</br>'+'</option>';
		}else{
			select = select + '<option value="'+valarr[index]+'">'+valarr[index]+'</br>'+'</option>';
		}
	}
	select = select + '</select>';
	return select;
}

$(function(){
	$( "#startDateTime" ).datetimepicker();
	$( "#endDateTime" ).datetimepicker();
	$( "#editstartDateTime" ).datetimepicker();
	$( "#editendDateTime" ).datetimepicker();
	

$('#display').on('change', function() {
	populate();
}	
);


/*-------------Non Recurence Schedule-----------------*/
$('#non-recurence-schedule').button().click(function(){
	if(!validateDisplayZoneLayout()){
		return;
	}
	$( "#sequencetable tbody tr" ).each( function(){
		  this.parentNode.removeChild( this ); 
	});
$('#non-recurence-dialog').dialog({					
width:600,
height:400,
buttons:[
{
	text:"Add Sequence",
	click:function(){
		var viewtime=$("#viewtime").val();
		$('#seqtable').append(
		'<tr>'+
		'<td>'+'<input type="text" id="sequence"/></td>'+
		'<td>'+getLayoutControl('')+
		'</td>'+
		'<td><input type="text" id="view" value='+viewtime+'></input></td>'+
		'<td>'+'<input type="checkbox" name="action"/>'+'</td>'+
		'</tr>');
	}
},
{
	
	text:"Delete Rows",
	click:function(td){
		if(confirm("Are you sure to delete this record?"))
		{
			$("table tbody").find('input[name="action"]').each(function(){
				if($(this).is(":checked"))
				{
					 $(this).parent().parent().remove();
				}
			});
		}
	}
},
{
	text:"Save and close",
	click:function(){
		var object  = getDisplayZoneArray();
		var ndisplay=object["display"];
		var nzones=object["zone"];
		var nlayout=$("#layout").val();
		var nscheduleName=$("#schedule-name").val();
		var nstartDate=$("#startDateTime").val();
		var newdate=new Date(nstartDate);
		var nstart=newdate.getTime();
		var nendDate=$("#endDateTime").val();
		var nnewdate=new Date(nendDate);
		var nend=nnewdate.getTime();
		var array = [];
		$('#sequencetable tbody tr').each(function () {
			var obj = {};
			obj["sequenceNumber"]=$(this).find('#sequence').val();
			obj["layoutName"]=$(this).find('#layout').children("option:selected").val();
			obj["viewTime"]=$(this).find('#view').val();
			array.push(obj);
		});
		 
		 var data={"displayName":ndisplay, "zonecoordinatename":nzones,
					"displayLayoutSchedule":{"scheduleName":nscheduleName,
					"sStartDateTime":nstart, "sEndDateTime":nend,
					"IsSchedulerRunning":new Boolean(false),
					"layoutScheduleConfigurations": array
					}
				};
		 
		    //alert(JSON.stringify(data));
			var rdata=JSON.stringify(data);
			var obj=JSON.parse(rdata);
			var displays=obj.displayName;
			var zones=obj.zonecoordinatename;
			var schnames=obj.displayLayoutSchedule.scheduleName;
		$.ajax({
			type: "POST",
			data:JSON.stringify(data),
			url: produrl+'/app/gui/'+ndisplay+'/'+nzones+'/schedule/'+nscheduleName+'/create',
			contentType: "application/json",
			success: function(data) 
				{	
					alert("Your Schedule has been Created!");
					$( "#sequencetable tbody tr" ).each( function(){
		        		  this.parentNode.removeChild( this ); 
		        	});
					$('#non-recurence-table tbody').html('');
					$('#non-recurence-dialog').dialog('close');
					populate();
				},
				error: function(jqXHR, textStatus, errorThrown) 
				{
				console.log('error while post');
				}
		});
	}
}
]
});
});
});

/*-------------------fetching the data from server side of non-recurence-schedule records---------------------------*/
			$.ajax({
			url: produrl+'/app/gui/web/schedules/displays/list',
			 "headers": {
              "accept": "application/json",
              "Access-Control-Allow-Origin":"*"
			},
	        type: "GET",
			crossDomain: true,
			dataType: "json",
	        success: function(data) {
                var obj=JSON.parse(data.result);
				var userpc=obj[0].display;
				var objs=obj[0].zoneCoordinateWebs;
				for(var di in obj){
					for(var zi in obj[di].zoneCoordinateWebs){
						var view = obj[di].display+"("+obj[di].zoneCoordinateWebs[zi].name+")";
						$("#display").append('<option value="'+view+'">'+view+'</br>'+'</option>');	
						var layoutsarray = [];
						var index = 0;
						for(layoutindex in obj[di].zoneCoordinateWebs[zi].layouts){
							layoutsarray[index++] = obj[di].zoneCoordinateWebs[zi].layouts[layoutindex].name;
						}
						layoutoptions.set(view,layoutsarray);
					}
				}
				
				
				
			},
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('error while get');
				}
			});
    /*--------------------------End here---------------------------------------------------------------------------- */
	
	
	/*-------------------fetching the data from server side of non-recurence-schedule records---------------------------*/
	function populate()
	{
			$.ajax({
			url: produrl+'/app/gui/users/schedules/list  ',
			 "headers": {
              "accept": "application/json",
              "Access-Control-Allow-Origin":"*",
			  "Authorization" : "Basic " + window.btoa(sessionStorage.getItem('token'))
			},
	        
	        type: "GET",
			crossDomain: true,
			dataType: "json",
			
	        success: function(data) {
	        	$( "#non-recurence-table tbody tr" ).each( function(){
	        		  this.parentNode.removeChild( this ); 
	        	});
				var obj=JSON.stringify(data);
				var obj22=JSON.parse(obj);
				for(var i in obj22)
				{		var ly=obj22[i].layoutSchedules;
						var display=obj22[i].displayId;
						var zone=obj22[i].zonecoordinatename;
						var object  = getDisplayZoneArray();
						var ndisplay=object["display"];
						var nzones=object["zone"];
						if(display===ndisplay && zone===nzones){
							for(var j in ly)
							{		
									var lay=ly[j].scheduleName;
									var start=ly[j].sStartDateTime;
									var end=ly[j].sEndDateTime;
									var startdate='';
									var enddate='';
									if (typeof start !== 'undefined')
										startdate=formatDate(new Date(parseInt(start,10)), 'yyyy/MM/dd HH:mm');
									if (typeof end !== 'undefined')
										enddate=formatDate(new Date(parseInt(end,10)), 'yyyy/MM/dd HH:mm');
									var vtm = ly[j].layoutScheduleConfigurations[0].viewTime;
							if (typeof vtm !== 'undefined'){	
								var description = '[';
								for(var i=0;i<ly[j].layoutScheduleConfigurations.length;i++){
									description = description+ '{'+ly[j].layoutScheduleConfigurations[i].sequenceNumber+',';
									description = description+ ly[j].layoutScheduleConfigurations[i].layoutName+',';
									description = description+ ly[j].layoutScheduleConfigurations[i].viewTime+'}';
								}
								description = description+ ']';
							$('#non-recurence-table tbody').append('<tr>'+
							'<td id="display" style="display:none;">'+display+'</td>'+
							'<td id="zone" style="display:none">'+zone+'</td>'+
							'<td id="schedule">'+lay+'</td>'+
							'<td id="starttime">'+startdate+'</td>'+
							'<td id="endtime">'+enddate+'</td>'+
							'<td id="description">'+description+'</td>'+
							'<td>'+
								'<button class="btn btn-primary" onclick="noneRecuurencEdit(this)">'+
									'<img src="resources/images/edit.png"/>'+
								'</button> '+
								'<button class="btn btn-danger" onclick="deleteSchedule(this);"> '+
									' <img src="resources/images/delete-icon.png"/>'+
								'</button>'+
							'</td>'+
							'</tr>');
							}
							}
						}
						
					
				}
			},
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('error while get');
				}
			});
	}
    /*--------------------------End here---------------------------------------------------------------------------- */
			
			
	function deleteSchedule(td){
		if(confirm('Are You sure to delete this record?'))
		{
        var rows =td.parentElement.parentElement;
        var display=$.trim($(rows).find("#display").text());
		var zone=$.trim($(rows).find("#zone").text());
		var schedule=$.trim($(rows).find("#schedule").text());

		$.ajax({
			contentType: "application/json",
			type: "GET",
			url: produrl+'/app/gui/'+display+'/'+zone+'/schedule/'+schedule+'/delete',
			success: function(data) {
					alert('Your record has been deleted!');
					populate();
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log('error while post');
				alert(textStatus);
			}
					
			}); 
		}
	}
	
	function noneRecuurencEdit(td){
					if(!validateDisplayZoneLayout()){
						return;
					}
					var _row = $(td).parents("tr");
					var cols =_row.children("td");
					var object  = getDisplayZoneArray();
					var display=object["display"];
					var zone=object["zone"];
					var layt=$("#editlayout").val($(cols[6]).text());
					var schedule=$("#edit-schedulename").val($(cols[2]).text());
					var scdn=schedule.val();
					$('#edit-schedulename').attr('disabled','disabled');
					var stime=$("#editstartDateTime").val($(cols[3]).text());
					var etime=$("#editendDateTime").val($(cols[4]).text());
					var description = $(cols[5]).text();
					var found = [],          // an array to collect the strings that are found
				    rxp = /{([^}]+)}/g,
				    curMatch;
					while( curMatch = rxp.exec( description ) ) {
					    found.push( curMatch[1] );
					}
					var vtime = 60;
					if(found.length>0){
						var valarr = found[0].split(',');
						vtime = valarr[2];
					}
				
					for(var k=0;k<found.length;k++){
						var valarrdata = found[k].split(',');
						var valarr = getLayouts();
						$('#editseqtable').append(
								'<tr>'+
								'<td>'+'<input type="text" id="sequence" value='+valarrdata[0]+'></input></td>'+
								'<td>'+ getLayoutControl(valarrdata[1])+
								'</td>'+
								'<td><input type="text" id="view" value='+valarrdata[2]+'></input></td>'+
								'<td>'+'<input type="checkbox" name="action"/>'+'</td>'+
								'</tr>');	
					}
					
		$('#non-recurence-edit-dialog').dialog({
			width:600,
			height:400,
			modal:true,
			buttons:[
	{
	text:"Add Sequence",
	click:function(){
		$('#editseqtable').append(
		'<tr>'+
		'<td>'+'<input type="text" id="sequence"/></td>'+
		'<td>'+getLayoutControl('')+
		'</td>'+
		'<td><input type="text" id="view" value='+vtime+'></input></td>'+
		'<td>'+'<input type="checkbox" name="action"/>'+'</td>'+
		'</tr>');
		}
	},         
			{
				text:"Update Schedule",
				click:function(){
					var sdt=$('#editstartDateTime').val();
						var nssdt=new Date(sdt);
						var vnsdt=nssdt.getTime();
						
					var edt=$('#editendDateTime').val();
						var nedt=new Date(edt);
						var vnedt=nedt.getTime();
					
					var array = [];
					$('#editsequencetable tbody tr').each(function () {
						var obj = {};
						obj["sequenceNumber"]=$(this).find('#sequence').val();
						obj["layoutName"]=$(this).find('#layout').children("option:selected").val();
						obj["viewTime"]=$(this).find('#view').val();
						array.push(obj);
					});
					 
					
					var data={"displayName":display, "zonecoordinatename":zone,
					"displayLayoutSchedule":{"scheduleName":scdn,
					"sStartDateTime":vnsdt, "sEndDateTime":vnedt,
					"IsSchedulerRunning":"false",
					"layoutScheduleConfigurations":array
					}};
					
					$.ajax({
					type: "POST",
					data:JSON.stringify(data),
					url: produrl+'/app/gui/'+display+'/'+zone+'/schedule/'+scdn+'/create',
					contentType: "application/json",
					success: function(data) 
					{	
					alert("Schedule has been updated!");
					$('#non-recurence-table tbody').html('');
						$( "#editsequencetable tbody tr" ).each( function(){
			        		  this.parentNode.removeChild( this ); 
			        	});
						$('#non-recurence-edit-dialog').dialog('close');
						populate();
					},
					error: function(jqXHR, textStatus, errorThrown) 
					{
					console.log('error while post');
				
					}
					});
				
					
				}
			},
			{
				text:"Close",
				click:function(){
					$(this).dialog('close');
					
				}
			}
			]
		});
		
}

