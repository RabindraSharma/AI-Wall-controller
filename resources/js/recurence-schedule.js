

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

function populateLayouts(){
	var valarr = getLayouts();
	$("#layout option").each(function() {
	    $(this).remove();
	});
	$("#daily-layouts option").each(function() {
	    $(this).remove();
	});
	$("#weekly-layouts option").each(function() {
	    $(this).remove();
	});
	$("#monthly-layouts option").each(function() {
	    $(this).remove();
	});
	$("#minutes-layouts option").each(function() {
	    $(this).remove();
	});
	$("#hourly-layouts option").each(function() {
	    $(this).remove();
	});
	$("#yearly-layouts option").each(function() {
	    $(this).remove();
	});
	for(var index in valarr){
		var layout = valarr[index];
		$("#layout").append('<option value="'+layout+'">'+layout+'</br>'+'</option>');
		$("#daily-layouts").append('<option value="'+layout+'">'+layout+'</br>'+'</option>');
		$("#weekly-layouts").append('<option value="'+layout+'">'+layout+'</br>'+'</option>');
		$("#monthly-layouts").append('<option value="'+layout+'">'+layout+'</br>'+'</option>');
		$("#minutes-layouts").append('<option value="'+layout+'">'+layout+'</br>'+'</option>');
		$("#hourly-layouts").append('<option value="'+layout+'">'+layout+'</br>'+'</option>');
		$("#yearly-layouts").append('<option value="'+layout+'">'+layout+'</br>'+'</option>');
	}
	MinuteTable();
	HoursTable();
	DailyTable();
	WeekTable();
	MonthTable();
	YearTable();
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

$(document).ready(function(){
	populate();
	$("#misdt").datetimepicker();
	$("#miedt").datetimepicker();
	$("#hsdt").datetimepicker();
	$("#hedt").datetimepicker();
	$("#dsdt").datetimepicker();
	$("#dedt").datetimepicker();
	$("#wsdt").datetimepicker();
	$("#wedt").datetimepicker();
	$("#mtsdt").datetimepicker();
	$("#mtedt").datetimepicker();
	$("#ysdt").datetimepicker();
	$("#yedt").datetimepicker();

	$('#display').on('change', function() {
		$('#types').show();
		populateLayouts();
	}	
	);
	MinuteTable();
	HoursTable();
	DailyTable();
	WeekTable();
	MonthTable();
	YearTable();
	$('#types').hide();
	$('#minute-edit-table').hide();
	$('#hour-edit-table').hide();
	$('#daily-edit-table').hide();
	$('#weekly-edit-table').hide();
	$('#monthly-edit-table').hide();
	$('#yearly-edit-table').hide();
	

$('input[type="radio"]').click(function(){
var inputValue = $(this).attr("value");
if(inputValue==='Minutes' || inputValue==='Hourly' || inputValue==='Daily' || inputValue==='Weekly' || inputValue==='Monthly' || inputValue==='Yearly')
{
	var targetBox = $("." +inputValue);
	$('.box').not(targetBox).hide();
	$(targetBox).show();
}
});

/*-------------Minutes Schedule Setting-------------------------------------------*/

	$('#minutes').click(function(){
		$('#minutes-schedule').attr('disabled',false);
		$(".fonrm-inline").trigger("reset");
		$("#minutes-dialog").dialog({
			resizable:false,
			width:600,
			height:350,
			modal:true,
			buttons:[
			{
				text:"Add Schedule",
				click:function(){
					var object = getDisplayZoneArray();
					var mdisplay=object["display"];
					var mzone=object["zone"];
					var mlayouts=$('#minutes-layouts').val();
					var mschedule=$('#minutes-schedule').val();
					var mStartDate=$('#misdt').val();
						var mnsd=new Date(mStartDate);
						var mnsdr=mnsd.getTime();
					var mEndDate=$('#miedt').val();
						var mned=new Date(mEndDate);
						var mnedr=mned.getTime();
					var mminute=$('#eminutes').val();
					var data={"displayName":mdisplay, "zonecoordinatename":mzone, 
							"displayLayoutSchedule":{"scheduleName":mschedule,"sStartDateTime":mnsdr, 
							"sEndDateTime":mnedr,"IsSchedulerRunning":"false",
							"layoutScheduleConfigurations": [{"sequenceNumber":"1", 
							"layoutName":mlayouts,"cronstore":{"isCronExpressionMinute":"true", "minute":mminute}}]}};
					
					$.ajax({
					type: "POST",
					data:JSON.stringify(data),
					url: produrl+'/app/gui/'+mdisplay+'/'+mzone+'/schedule/'+mschedule+'/create',
					contentType: "application/json",
					success: function(data) 
					{	
						alert("Your Schedule has been Created!");
						$('#minutes-dialog').dialog('close');
						MinuteTable();
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
					$('#minutes-dialog').dialog('close');
					
				}
			}
			]
			
		});
	});
		
/*-------------Hourly Schedule Setting-------------------------------------------*/

	$('#hourly').on('click',function(){
		$('#hourly-schedule').attr('disabled',false);
		$(".fonrm-inline").trigger("reset");
		$('#hour-edit-table').show();
		$("#hourly-dialog").dialog({
			resizable:false,
			width:600,
			height:400,
			buttons:[
			{
				text:"Add Schedule",
				click:function(){
					var object  = getDisplayZoneArray();
					var hdisplay=object["display"];
					var hzone=object["zone"];
					
					var hlyouts=$("#hourly-layouts").val();
					var hschedule=$("#hourly-schedule").val();
					var otsdt=$("#hsdt").val();
						var notsdt=new Date(otsdt);
						var onsdt=notsdt.getTime();
					var otedt=$("#hedt").val();
						var notedt=new Date(otedt);
						var onedt=notedt.getTime();
						
					$('#hourly-table tr td').find('input[id="ehourly"]').each(function(){
						if($(this).is(":checked"))
						{	
								var hhours=$('#evhourly').val();
								var data={"displayName":hdisplay, "zonecoordinatename":hzone, 
								"displayLayoutSchedule":{"scheduleName":hschedule,"sStartDateTime":onsdt,
								"sEndDateTime":onedt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":hlyouts,
								"cronstore":{"isCronExpressionEveryHour":"true", "hour":hhours}}]}};
							
							$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+hdisplay+'/'+hzone+'/schedule/'+hschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
									
									alert("Your Schedule has been Created!");
									$('#hourly-dialog').dialog('close');
									HoursTable();
							},
							error: function(jqXHR, textStatus, errorThrown) 
							{
							console.log('error while post');
				
							}
						});
							
						}
						
					});
					
					$('#hourly-table tr td').find('input[id="startat"]').each(function(){
						if($(this).is(":checked"))
						{	
							var hours=$('#hours').val();
							var hminute=$('#minute').val();
							var data={"displayName":hdisplay, "zonecoordinatename":hzone, 
									"displayLayoutSchedule":{"scheduleName":hschedule,"sStartDateTime":onsdt,
									"sEndDateTime":onedt,"IsSchedulerRunning":"false",
									"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":hlyouts,
									"cronstore":{"isCronExpressionHourStartsAt":"true", "hour":hours,"minute":hminute}}]}};
						
						
						$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+hdisplay+'/'+hzone+'/schedule/'+hschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
									alert("Your Schedule has been Created!");
									$('#hourly-dialog').dialog('close');
									HoursTable();
							},
							error: function(jqXHR, textStatus, errorThrown) 
							{
							console.log('error while post');
				
							}
						});
						}
					});
					
					
				}
			},
			{
				text:"Close",
				click:function(){
					$('#hourly-dialog').dialog('close');
				}
			},
			]
			
		});
	});
	
		
/*------------Daily Schedule Setting---------------------------------------------------*/

	$('#daily').on('click',function(){
		$('#daily-schedule').attr('disabled',false);
		$(".fonrm-inline").trigger("reset");	
		$("#daily-dialog").dialog({
			resizable:false,
			width:600,
			height:400,
			buttons:[
			{
				text:"Add Schedule",
				click:function(){
					var object  = getDisplayZoneArray();
					var ddisplay=object["display"];
					var dzone=object["zone"];
					var dlayouts=$('#daily-layouts').val();
					var dschedule=$('#daily-schedule').val();
						
					var dsdt=$('#dsdt').val();
						var dnsdt=new Date(dsdt);
						var ndsdt=dnsdt.getTime();
						
					var dedt=$('#dedt').val();
						var dnedt=new Date(dedt);
						var ndedt=dnedt.getTime();
						
					$('#daily-table tr td').find('input[id="edaily"]').each(function(){
						if($(this).is(":checked"))
						{		
								var days=$('#ddays').val();
								var dhour=$('#dhours').val();
								var dminute=$('#dminutes').val();
								
								var data={"displayName":ddisplay, "zonecoordinatename":dzone, 
								"displayLayoutSchedule":{"scheduleName":dschedule,"sStartDateTime":ndsdt,
								"sEndDateTime":ndedt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":dlayouts,
								"cronstore":{"isCronExpressionDailyEveryDay":"true", 
								"day":days,"hour":dhour,"minute":dminute}}]}};
								
								$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+ddisplay+'/'+dzone+'/schedule/'+dschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
								alert("Your Schedule has been Created!");
								$('#daily-dialog').dialog('close');
								DailyTable();
									
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
								alert(textStatus);
				
								}
							});
							
						}
						
					});
					
					$('#daily-table tr td').find('input[id="evwday"]').each(function(){
						if($(this).is(":checked"))
						{
							
								var dehours=$('#dhours').val();
								var deminute=$('#dminutes').val();
								var object = getDisplayZoneArray();
								var display=object["display"];
								var zone=object["zone"];
								
								var schedule=$('#daily-schedule').val();
								var data={"displayName":display, "zonecoordinatename":zone, 
								"displayLayoutSchedule":{"scheduleName":schedule,"sStartDateTime":ndsdt,
								"sEndDateTime":ndedt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":dlayouts,
								"cronstore":{"isCronExpressionDailyEveryWeekDay":"true", "hour":dehours,"minute":deminute}}]}};
								
							$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+display+'/'+zone+'/schedule/'+schedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
									alert("Your Schedule has been Created!");
									$('#daily-dialog').dialog('close');
									DailyTable();
									
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
				
								}
							});
						}
						
					});
					
				}
			},
			{
				text:"Close",
				click:function(){
					$('#daily-dialog').dialog('close');
				}
			},
			]
		});
		
	});

/*---------------Weekly Schedule Setting-------------------------------------------*/

	$('#weekly').on('click',function(){
		$('#weekly-schedule').attr('disabled',false);
		$(".fonrm-inline").trigger("reset");	
		$('#weekly-edit-table').show();
		$("#weekly-dialog").dialog({
			resizable:false,
			width:600,
			height:480,
			buttons:[
			{
				text:"Add Schedule",
				click:function(){
					var object  = getDisplayZoneArray();
					var wdisplay=object["display"];
					var wzone=object["zone"];
					
					var wlayouts=$('#weekly-layouts').val();
					var wschedule=$('#weekly-schedule').val();
					
					var wsdt=$('#wsdt').val();
						var nsdt=new Date(wsdt);
						var wnsdt=nsdt.getTime();
						
					var wedt=$('#wedt').val();
						var nedt=new Date(wedt);
						var wnedt=nedt.getTime();
					var weeks=[];
					var j = 0;
					$('#weekly-table tr td').find('input[type="checkbox"]').each(function(i){
						
						if($(this).is(":checked") && $(this).val()!="")
						{	
							weeks[j++]=$(this).val();
						}
					});
					var whours=$('#whours').val();
					var wminutes=$('#wminutes').val();

					var data={"displayName":wdisplay, "zonecoordinatename":wzone, 
						"displayLayoutSchedule":{"scheduleName":wschedule,"sStartDateTime":wnsdt,
						"sEndDateTime":wnedt,"IsSchedulerRunning":"false",
						"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":wlayouts,
						"cronstore":{"isCronExpressionWeekly":"true","days":weeks, "hour":whours,"minute":wminutes}}]}};
					
						
							$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+wdisplay+'/'+wzone+'/schedule/'+wschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
									alert("Your Schedule has been Created!");
									$('#weekly-dialog').dialog('close');
									WeekTable();
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
					$('#weekly-dialog').dialog('close');
				}
			},
			]
		});
	});
	
/*-----------------------------Monthly Schedule Setting-----------------------------------------------------*/


	$('#monthly').on('click',function(){
		$('#monthly-schedule').attr('disabled',false);
		$(".fonrm-inline").trigger("reset");	
			$('#monthly-edit-table').show();
		$("#monthly-dialog").dialog({
			
			width:950,
			height:475,
			buttons:[
			{
				text:"Add Schedule",
				click:function(){
					var object  = getDisplayZoneArray();
					var mtdisplay=object["display"];
					var mtzone=object["zone"];
					
					var mtlayouts=$('#monthly-layouts').val();
					var mtschedule=$('#monthly-schedule').val();
					
					var mtsdt=$('#mtsdt').val();
						var mtndt=new Date(mtsdt);
						var mthsdt=mtndt.getTime();
					
					var mtedt=$('#mtedt').val();
						var mtnedt=new Date(mtedt);
						var mthedt=mtnedt.getTime();
					
					$('#monthly-table tr td').find('input[id="monthlynum"]').each(function(){
						
						if($(this).is(":checked"))
						{
							
							var mtdaysnum=$('#mtdaysinput').val();
							var mtmonthnum=$('#mtmonth').val();
							var mthours=$('#mthours').val();
							var mtminute=$('#mtminute').val();
							
							
							data={"displayName":mtdisplay, "zonecoordinatename":mtzone, 
								"displayLayoutSchedule":{"scheduleName":mtschedule,"sStartDateTime":mthsdt,
								"sEndDateTime":mthedt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":mtlayouts,
								"cronstore":{"isCronExpressionMonthlyByDayMonth":"true", "numericday":mtdaysnum,
								"numericmonth":mtmonthnum,"hour":mthours,"minute":mtminute}}]}};
								
								
								$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+mtdisplay+'/'+mtzone+'/schedule/'+mtschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
									alert("Your Schedule has been Created!");
									$('#monthly-dialog').dialog('close');
									MonthTable();
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
				
								}
						});
						}
						
					});
						
					
					
					
					$('#monthly-table tr td').find('input[id="mtthe"]').each(function(){
						
						if($(this).is(":checked"))
						{
							
							
							var mtdayson=$('#mtdayson').val();
							var mtdaysname=$('#mtdaysname').val();
							var mtofmonth=$('#mtofmonth').val();
							
							var mthour=$('#mthours').val();
							var mtminutes=$('#mtminute').val();
							
							data={"displayName":mtdisplay, "zonecoordinatename":mtzone, 
								"displayLayoutSchedule":{"scheduleName":mtschedule,"sStartDateTime":mthsdt,
								"sEndDateTime":mthedt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":mtlayouts,
								"cronstore":{"isCronExpressionMonthlyByTheCustom":"true", "roman":mtdayson,
								"day":mtdaysname, "numericmonth":mtofmonth,"hour":mthour,"minute":mtminutes}}]}};
								
								
								
								
								$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+mtdisplay+'/'+mtzone+'/schedule/'+mtschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
										alert("Your Schedule has been Created!");
										$('#monthly-dialog').dialog('close');
										MonthTable();
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
				
								}
						});

						}
					});
					
					
				}
			},
			{
				text:"Close",
				click:function(){
					$('#monthly-dialog').dialog('close');
				}
			},
			]
		});
	});


/*-----------------------------Yearly Schedule Setting-----------------------------------------------------*/


	$('#yearly').on('click',function(){
		$('#yearly-schedule').attr('disabled',false);
		$(".fonrm-inline").trigger("reset");	
		$("#yearly-dialog").dialog({
			resizable:false,
			width:600,
			height:500,
			buttons:[
			{
				text:"Add Schedule",
				click:function(){
					var object  = getDisplayZoneArray();
					var ydisplay=object["display"];
					var yzone=object["zone"];
					
					var ylayouts=$('#yearly-layouts').val();
					var yschedule=$('#yearly-schedule').val();
					
					var ysdt=$('#ysdt').val();
						var yndt=new Date(ysdt);
						var ynsdt=yndt.getTime();
						
					var yedt=$('#yedt').val();
						var yndts=new Date(yedt);
						var ynedt=yndts.getTime();
					
					
					$('#yearly-table tr td').find('input[id="eyear"]').each(function(){
						
						if($(this).is(":checked"))
						{
							alert('every yearly month and days');
							var ymonths=$('#yearly-month').val();
							var ydays=$('#yearly-days').val();
							var yhours=$('#yhours').val();
							var yminute=$('#yminute').val();
							
							 data={"displayName":ydisplay, "zonecoordinatename":yzone, 
								"displayLayoutSchedule":{"scheduleName":yschedule,"sStartDateTime":ynsdt,
								"sEndDateTime":ynedt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":ylayouts,
								"cronstore":{"isCronExpressionYearlyByDayMonth":"true", "day":ydays,
								"month":ymonths,"hour":yhours,"minute":yminute}}]}};
								
								
								
								$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+ydisplay+'/'+yzone+'/schedule/'+yschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	alert("Your Schedule has been Created!");
								$('#yearly-dialog').dialog('close');
								YearTable();
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
				
								}
						});
						}
					});
					
					
					
					$('#yearly-table tr td').find('input[id="eday"]').each(function(){
						
						if($(this).is(":checked"))
						{
							alert('The yearly start time');
							var ydayson=$('#yearly-dayson').val();
							var ydaysname=$('#yearly-daysname').val();
							var yofmonth=$('#yearly-ofmonth').val();
							var yrhours=$('#yhours').val();
							var yrminutes=$('#yminute').val();
							
							data={"displayName":ydisplay, "zonecoordinatename":yzone, 
								"displayLayoutSchedule":{"scheduleName":yschedule,"sStartDateTime":ynsdt,
								"sEndDateTime":ynedt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":ylayouts,
								"cronstore":{"isCronExpressionYearlyByTheCustom":"true", "roman":ydayson, 
								"day":ydaysname,"month":yofmonth,"hour":yrhours,"minute":yrminutes}}]}};
								
								
								
								$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+ydisplay+'/'+yzone+'/schedule/'+yschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
										alert("Your Schedule has been Created!");
										$('#yearly-dialog').dialog('close');
										YearTable();
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
				
								}
						});
							
						}
					});
					
				}
			},
			{
				text:"Close",
				click:function(){
					$('#yearly-dialog').dialog('close');
				}
			},
			]
		});
	});


/*-----------------------------Populating all schedules display, zone and layouts for every recurrence schedule types!-----------------------------------------------------*/

	function populate(){
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

	}

});


/*-------------------fetching the data from server side of recurence-schedule records---------------------------*/
function MinuteTable()
	{
	
			$.ajax({
			url: produrl+'/app/gui/users/schedules/list',
			 "headers": {
              "accept": "application/json",
              "Access-Control-Allow-Origin":"*",
              "Authorization" : "Basic " + window.btoa(sessionStorage.getItem('token'))
			},
	        
	        type: "GET",
			crossDomain: true,
			dataType: "json",
	        success: function(data) {
	        	$( "#minutes-edit-table tbody tr" ).each( function(){
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
									var schedulename=ly[j].scheduleName;
									var start=ly[j].sStartDateTime;
									var startdate='';
									var enddate='';
									
									if (typeof start !== 'undefined')
										startdate=formatDate(new Date(parseInt(start,10)), 'yyyy/MM/dd HH:mm');
									var end=ly[j].sEndDateTime;
									if (typeof end !== 'undefined')
										enddate=formatDate(new Date(parseInt(end,10)), 'yyyy/MM/dd HH:mm');
									var lsc=ly[j].layoutScheduleConfigurations;
									
										for(var k in lsc)
									{
										var layout=lsc[k].layoutName;
										var crons=lsc[k].cronstore;
										if (typeof crons !== 'undefined'){
											var mminutes=crons.minute;
											if(crons.isCronExpressionMinute==='true'){
											$('#minutes-edit-table tbody').append('<tr>'+
											'<td id="display" style="display:none;">'+display+'</td>'+
											'<td id="zone" style="display:none;">'+zone+'</td>'+
											'<td>'+layout+'</td>'+
											'<td id="schedule">'+schedulename+'</td>'+
											'<td>'+startdate+'</td>'+
											'<td>'+enddate+'</td>'+
											'<td>'+mminutes+'</td>'+
											'<td>'+
											'<button class="btn btn-primary" onclick="minutesEdit(this)">'+
												'<img src="resources/images/edit.png"/>'+
											'</button> '+
											'<button class="btn btn-danger" onclick="minutesDelete(this);"> '+
											' <img src="resources/images/delete-icon.png"/>'+
											'</button>'+
											'</td>'+
											'</tr>');
											}
										}
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
	
function HoursTable()
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
	        	$( "#hours-edit-table tbody tr" ).each( function(){
	        		  this.parentNode.removeChild( this ); 
	        	});
	        	var hours=JSON.stringify(data);
				var hours1=JSON.parse(hours);
				
				for(var i in hours1)
				{		var lsds=hours1[i].layoutSchedules;
						var display=hours1[i].displayId;
						var zone=hours1[i].zonecoordinatename;
						var object  = getDisplayZoneArray();
						var ndisplay=object["display"];
						var nzones=object["zone"];
						if(display===ndisplay && zone===nzones){
							for(var j in lsds)
							{
									var hschedulename=lsds[j].scheduleName;
									var hstart=lsds[j].sStartDateTime;
									var hend=lsds[j].sEndDateTime;
									var startdate='';
									var enddate='';
									if (typeof hstart !== 'undefined')
										startdate=formatDate(new Date(parseInt(hstart,10)), 'yyyy/MM/dd HH:mm');
									if (typeof hend !== 'undefined')
										enddate=formatDate(new Date(parseInt(hend,10)), 'yyyy/MM/dd HH:mm');
							
									var lscs=lsds[j].layoutScheduleConfigurations;
										for(var k in lscs)
									{
										var hlayout=lscs[k].layoutName;
										var crons=lscs[k].cronstore;
										if (typeof crons !== 'undefined'){
											var hcron=crons.hour;
											var sthcron=crons.hour;
											var hminute=crons.minute;
						
											if(crons.isCronExpressionEveryHour==='true'){
											var description = 'Every '+	hcron + ' hour(s)';
											$('#hours-edit-table tbody').append('<tr>'+
											'<td id="display" style="display:none;">'+display+'</td>'+
											'<td id="zone" style="display:none;">'+zone+'</td>'+
											'<td >'+hlayout+'</td>'+
											'<td id="schedule">'+hschedulename+'</td>'+
											'<td>'+startdate+'</td>'+
											'<td>'+enddate+'</td>'+
											'<td id="ehour">'+description+'</td>'+
											'<td>'+
												'<button class="btn btn-primary" onclick="hoursEdit(this)">'+
													'<img src="resources/images/edit.png"/>'+
												'</button> '+
												'<button class="btn btn-danger" onclick="hoursDelete(this);"> '+
													' <img src="resources/images/delete-icon.png"/>'+
												'</button>'+
											'</td>'+
										'</tr>');
											}else if(crons.isCronExpressionHourStartsAt==='true')
											{
												var description = 'Starts at '+	sthcron + ' ' + hminute;	
												$('#hours-edit-table tbody').append('<tr>'+
											'<td id="display" style="display:none;">'+display+'</td>'+
											'<td id="zone" style="display:none;">'+zone+'</td>'+
											'<td >'+hlayout+'</td>'+
											'<td id="schedule">'+hschedulename+'</td>'+
											'<td>'+startdate+'</td>'+
											'<td>'+enddate+'</td>'+
											'<td id="ehour">'+description+'</td>'+
											'<td>'+
												'<button class="btn btn-primary" onclick="hoursEdit(this)">'+
													'<img src="resources/images/edit.png"/>'+
												'</button> '+
												'<button class="btn btn-danger" onclick="hoursDelete(this);"> '+
													' <img src="resources/images/delete-icon.png"/>'+
												'</button>'+
											'</td>'+
										'</tr>');
											}
										}
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

function DailyTable()
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
	        	$( "#dailys-edit-table tbody tr" ).each( function(){
	        		  this.parentNode.removeChild( this ); 
	        	});
	        	var dailys=JSON.stringify(data);
				var dailys1=JSON.parse(dailys);
				for(var i in dailys1)
				{		var dlyt=dailys1[i].layoutSchedules;
						var ddisplay=dailys1[i].displayId;
						var dzone=dailys1[i].zonecoordinatename;
						var object  = getDisplayZoneArray();
						var ndisplay=object["display"];
						var nzones=object["zone"];
						if(ddisplay===ndisplay && dzone===nzones){
							for(var j in dlyt)
							{
									var dschedulename=dlyt[j].scheduleName;
									var dstart=dlyt[j].sStartDateTime;
									
									var dend=dlyt[j].sEndDateTime;
									var startdate='';
									var enddate='';
									
									if (typeof dstart !== 'undefined')
										startdate=formatDate(new Date(parseInt(dstart,10)), 'yyyy/MM/dd HH:mm');
									if (typeof dend !== 'undefined')
										enddate=formatDate(new Date(parseInt(dend,10)), 'yyyy/MM/dd HH:mm');
							
									var dlsc=dlyt[j].layoutScheduleConfigurations;
									
										for(var k in dlsc)
									{
										var dlayout=dlsc[k].layoutName;
										var crons=dlsc[k].cronstore;
										
										if (typeof crons !== 'undefined'){
											var day=crons.day;
											var hour=crons.hour;
											var minut=crons.minute;
										
											if(crons.isCronExpressionDailyEveryDay==='true'){
												var description = ' Every '+ day +' days' + ' start at ' + hour + ' ' + minut;
											$('#dailys-edit-table tbody').append('<tr>'+
											'<td id="display" style="display:none;">'+ddisplay+'</td>'+
											'<td id="zone" style="display:none;">'+dzone+'</td>'+
											'<td>'+dlayout+'</td>'+
											'<td id="schedule">'+dschedulename+'</td>'+
											'<td>'+startdate+'</td>'+
											'<td>'+enddate+'</td>'+
											'<td>'+description+'</td>'+
											'<td>'+
											'<button class="btn btn-primary" onclick="dailyEdit(this)">'+
												'<img src="resources/images/edit.png"/>'+
											'</button> '+
											'<button class="btn btn-danger" onclick="dailyDelete(this);"> '+
											' <img src="resources/images/delete-icon.png"/>'+
											'</button>'+
											'</td>'+
											'</tr>');
												
											}else if(crons.isCronExpressionDailyEveryWeekDay==='true'){
												var description = ' Starts at '+ hour + ' ' + minut;
											$('#dailys-edit-table tbody').append('<tr>'+
											'<td id="display" style="display:none;">'+ddisplay+'</td>'+
											'<td id="zone" style="display:none;">'+dzone+'</td>'+
											'<td>'+dlayout+'</td>'+
											'<td id="schedule">'+dschedulename+'</td>'+
											'<td>'+startdate+'</td>'+
											'<td>'+enddate+'</td>'+
											'<td>'+description+'</td>'+
											'<td>'+
											'<button class="btn btn-primary" onclick="dailyEdit(this)">'+
												'<img src="resources/images/edit.png"/>'+
											'</button> '+
											'<button class="btn btn-danger" onclick="dailyDelete(this);"> '+
											' <img src="resources/images/delete-icon.png"/>'+
											'</button>'+
											'</td>'+
											'</tr>');
												
											}
										}
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

function WeekTable()
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
	        	$( "#weeks-edit-table tbody tr" ).each( function(){
	        		  this.parentNode.removeChild( this ); 
	        	});
				var weekly=JSON.stringify(data);
				var weekly1=JSON.parse(weekly);
				for(var i in weekly1)
				{		var wlyt=weekly1[i].layoutSchedules;
						var wdisplay=weekly1[i].displayId;
						var wzone=weekly1[i].zonecoordinatename;
						
						var object  = getDisplayZoneArray();
						var ndisplay=object["display"];
						var nzones=object["zone"];
						if(wdisplay===ndisplay && wzone===nzones){
							for(var j in wlyt)
							{
									var wschedulename=wlyt[j].scheduleName;
									var wstart=wlyt[j].sStartDateTime;
									var wend=wlyt[j].sEndDateTime;
									var startdate='';
									var enddate='';
									
									if (typeof wstart !== 'undefined')
										startdate=formatDate(new Date(parseInt(wstart,10)), 'yyyy/MM/dd HH:mm');
									if (typeof wend !== 'undefined')
										enddate=formatDate(new Date(parseInt(wend,10)), 'yyyy/MM/dd HH:mm');
							
									var wlsc=wlyt[j].layoutScheduleConfigurations;
									
										for(var k in wlsc)
									{
										var wlayout=wlsc[k].layoutName;
										var crons=wlsc[k].cronstore;
										if (typeof crons !== 'undefined'){
											var wdays=crons.days;
											var whour=crons.hour;
											var wminute=crons.minute;
												if(crons.isCronExpressionWeekly==='true'){
													var description = ' Starts at '+ whour + ' '+wminute ;
												$('#weeks-edit-table tbody').append('<tr>'+
												'<td id="display" style="display:none;">'+wdisplay+'</td>'+
												'<td id="zone" style="display:none;">'+wzone+'</td>'+
												'<td>'+wlayout+'</td>'+
												'<td id="schedule">'+wschedulename+'</td>'+
												'<td>'+startdate+'</td>'+
												'<td>'+enddate+'</td>'+
												'<td>'+wdays+'</td>'+
												'<td>'+description+'</td>'+
												'<td>'+
												'<button class="btn btn-primary" onclick="weeklyEdit(this)">'+
													'<img src="resources/images/edit.png"/>'+
												'</button> '+
												'<button class="btn btn-danger" onclick="weeklyDelete(this);"> '+
												' <img src="resources/images/delete-icon.png"/>'+
												'</button>'+
												'</td>'+
												'</tr>');
											}
										}
										
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

function MonthTable()
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
	        	$( "#months-edit-table tbody tr" ).each( function(){
	        		  this.parentNode.removeChild( this ); 
	        	});
				var months=JSON.stringify(data);
				var months1=JSON.parse(months);
				for(var i in months1)
				{		var mthlyt=months1[i].layoutSchedules;
						var mthdisplay=months1[i].displayId;
						var mthzone=months1[i].zonecoordinatename;
						
						var object  = getDisplayZoneArray();
						var ndisplay=object["display"];
						var nzones=object["zone"];
						if(mthdisplay===ndisplay && mthzone===nzones){
							for(var j in mthlyt)
							{
									var mthschedulename=mthlyt[j].scheduleName;
									var mthstart=mthlyt[j].sStartDateTime;
									var mthend=mthlyt[j].sEndDateTime;
									var startdate='';
									var enddate='';
									
									if (typeof mthstart !== 'undefined')
										startdate=formatDate(new Date(parseInt(mthstart,10)), 'yyyy/MM/dd HH:mm');
									if (typeof mthend !== 'undefined')
										enddate=formatDate(new Date(parseInt(mthend,10)), 'yyyy/MM/dd HH:mm');
									
									var mthlsc=mthlyt[j].layoutScheduleConfigurations;
									
										for(var k in mthlsc)
									{
										var mtlayout=mthlsc[k].layoutName;
										
										var crons=mthlsc[k].cronstore;
										if (typeof crons !== 'undefined'){
											var mthhour=crons.hour;
											var minuts=crons.minute;
											var mtnday=crons.numericday;
											var mtnmonth=crons.numericmonth;
											var mtroman=crons.roman;
											var mtdaysname=crons.day;
											if(crons.isCronExpressionMonthlyByDayMonth==='true')
											{
												var description = ' Day ' + mtnday + ' of every ' + mtnmonth + ' months ' + 'start at ' + mthhour + ' ' + minuts;
											$('#months-edit-table tbody').append('<tr>'+
												'<td id="display" style="display:none;">'+mthdisplay+'</td>'+
												'<td id="zone" style="display:none;">'+mthzone+'</td>'+
												'<td>'+mtlayout+'</td>'+
												'<td id="schedule">'+mthschedulename+'</td>'+
												'<td>'+startdate+'</td>'+
												'<td>'+enddate+'</td>'+
												'<td>'+description+'</td>'+
												'<td>'+
												'<button class="btn btn-primary" onclick="monthlyEdit(this)">'+
													'<img src="resources/images/edit.png"/>'+
												'</button> '+
												'<button class="btn btn-danger" onclick="monthlyDelete(this);"> '+
													' <img src="resources/images/delete-icon.png"/>'+
												'</button>'+
												'</td>'+
												'</tr>');
											}else if(crons.isCronExpressionMonthlyByTheCustom==='true'){
													var description = ' The ' + mtroman + ' ' + mtdaysname + ' of every ' + mtnmonth + ' months ' + 'start at ' + mthhour + ' ' + minuts;
												$('#months-edit-table tbody').append('<tr>'+
												'<td id="display" style="display:none;">'+mthdisplay+'</td>'+
												'<td id="zone" style="display:none;">'+mthzone+'</td>'+
												'<td>'+mtlayout+'</td>'+
												'<td id="schedule">'+mthschedulename+'</td>'+
												'<td>'+startdate+'</td>'+
												'<td>'+enddate+'</td>'+
												'<td>'+description+'</td>'+
												'<td>'+
												'<button class="btn btn-primary" onclick="monthlyEdit(this)">'+
													'<img src="resources/images/edit.png"/>'+
												'</button> '+
												'<button class="btn btn-danger" onclick="monthlyDelete(this);"> '+
													' <img src="resources/images/delete-icon.png"/>'+
												'</button>'+
												'</td>'+
												'</tr>');
											}
										}
										
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

function YearTable()
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
	        	$( "#years-edit-table tbody tr" ).each( function(){
	        		  this.parentNode.removeChild( this ); 
	        	});
	        	var years=JSON.stringify(data);
				var years1=JSON.parse(years);
				for(var i in years1)
				{		var ylyt=years1[i].layoutSchedules;
						var ydisplay=years1[i].displayId;
						var yzone=years1[i].zonecoordinatename;
						var object  = getDisplayZoneArray();
						var ndisplay=object["display"];
						var nzones=object["zone"];
						if(ydisplay===ndisplay && yzone===nzones){
							for(var j in ylyt)
							{
									var yschedulename=ylyt[j].scheduleName;
									var ystart=ylyt[j].sStartDateTime;
									var yend=ylyt[j].sEndDateTime;
									var startdate='';
									var enddate='';
									
									if (typeof ystart !== 'undefined')
										startdate=formatDate(new Date(parseInt(ystart,10)), 'yyyy/MM/dd HH:mm');
									if (typeof yend !== 'undefined')
										enddate=formatDate(new Date(parseInt(yend,10)), 'yyyy/MM/dd HH:mm');
							
									var ylsc=ylyt[j].layoutScheduleConfigurations;
									
										for(var k in ylsc)
									{
										var ylayout=ylsc[k].layoutName;
										var crons=ylsc[k].cronstore;
										if (typeof crons !== 'undefined'){
											var yhour=crons.hour;
											var ymint=crons.minute;
											var yday=crons.day;
											var ymonth=crons.month;
											var yroman=crons.roman;
												if(crons.isCronExpressionYearlyByDayMonth==='true')
												{
													var description = ' Every ' + ymonth + ' ' + yday + ' days ' + ' Start at ' + yhour + ' ' + ymint;
												$('#years-edit-table tbody').append('<tr>'+
												'<td id="display" style="display:none;">'+ydisplay+'</td>'+
												'<td id="zone" style="display:none;">'+yzone+'</td>'+
												'<td>'+ylayout+'</td>'+
												'<td id="schedule">'+yschedulename+'</td>'+
												'<td>'+startdate+'</td>'+
												'<td>'+enddate+'</td>'+
												'<td>'+description+'</td>'+
												'<td>'+
												'<button class="btn btn-primary" onclick="yearlyEdit(this)">'+
													'<img src="resources/images/edit.png"/>'+
												'</button> '+
												'<button class="btn btn-danger" onclick="yearlyDelete(this);"> '+
												' <img src="resources/images/delete-icon.png"/>'+
												'</button>'+
												'</td>'+
												'</tr>');
												}else if(crons.isCronExpressionYearlyByTheCustom==='true')
												{
													var description = ' The ' + yroman + ' ' + yday + ' of ' + ymonth + ' Start at ' + yhour + ' '+ ymint;
												$('#years-edit-table tbody').append('<tr>'+
												'<td id="display" style="display:none;">'+ydisplay+'</td>'+
												'<td id="zone" style="display:none;">'+yzone+'</td>'+
												'<td>'+ylayout+'</td>'+
												'<td id="schedule">'+yschedulename+'</td>'+
												'<td>'+startdate+'</td>'+
												'<td>'+enddate+'</td>'+
												'<td>'+description+'</td>'+
												'<td>'+
												'<button class="btn btn-primary" onclick="yearlyEdit(this)">'+
													'<img src="resources/images/edit.png"/>'+
												'</button> '+
												'<button class="btn btn-danger" onclick="yearlyDelete(this);"> '+
												' <img src="resources/images/delete-icon.png"/>'+
												'</button>'+
												'</td>'+
												'</tr>');
												}	
										}
																				
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


/*--------------------------Updating portion started here!----------------------------------------*/


function minutesEdit(td){
			//jQuery('#datetimepicker4').datetimepicker('show');
			/*$('#misdt').click(function(){
				  $('#misdt').datetimepicker();
				});
			$('#miedt').click(function(){
				  $('#miedt').datetimepicker(); 
				});*/
			//$("#misdt").datetimepicker();
			//$("#miedt").datetimepicker();
			var _rows=$(td).parents('tr');
			var cols=_rows.children('td');
			var display=$(cols[0]).text();
			var zone=$(cols[1]).text();
			var layout=$("#minutes-layouts").val($(cols[2]).text());
			var schedule=$("#minutes-schedule").val($(cols[3]).text());
			var scdn=schedule.val();		
			$('#minutes-schedule').attr('disabled','disabled');
			
			$('#misdt').val($(cols[4]).text());
			$('#miedt').val($(cols[5]).text());	
			$("#eminutes").val($(cols[6]).text());
				
			
		$('#minutes-dialog').dialog({
				height:400,
				width:500,
				modal:true,
			buttons:[
			{
				text:"Update Schedule",
				click:function(){
					var layouts=$("#minutes-layouts").val();
					
					var msdt=$('#misdt').val();
						var mnsdt=new Date(msdt);
						var emsdt=mnsdt.getTime();
					var medt=$('#miedt').val();
						var mnedt=new Date(medt);
						var emedt=mnedt.getTime();
						
					var minutes=$("#eminutes").val();
			
					var data={"displayName":display, "zonecoordinatename":zone, 
							"displayLayoutSchedule":{"scheduleName":scdn,"sStartDateTime":emsdt, 
							"sEndDateTime":emedt,"IsSchedulerRunning":"false",
							"layoutScheduleConfigurations": [{"sequenceNumber":"1", 
							"layoutName":layouts,"cronstore":{"isCronExpressionMinute":"true", "minute":minutes}}]}};
							
							
							$.ajax({
							type: "POST",
							data:JSON.stringify(data),
							url: produrl+'/app/gui/'+display+'/'+zone+'/schedule/'+scdn+'/create',
							contentType: "application/json",
							success: function(data) 
							{	
							alert("Schedule has been updated!");
							//$('#non-recurence-table tbody').html('');
							//populate();
							$('#minutes-dialog').dialog('close');
							MinuteTable();
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

function hoursEdit(td){
			var _rows=$(td).parents('tr');
			var cols=_rows.children('td');
			var ndsp=$(cols[0]).text();
			var nzn=$(cols[1]).text();
					
				var nhlyt=$('#hourly-layouts').val($(cols[2]).text());
				var nsch=$('#hourly-schedule').val($(cols[3]).text());
				var nhsch=nsch.val();
					$('#hourly-schedule').attr('disabled','disabled');
					var description = $(cols[6]).text();
					if(description.indexOf('Every') !== -1){
						
						$('#ehourly').prop('checked',true);
						
						var stringArray = description.split(/\b(\s)/);
						var nhrs=$('#evhourly').val(stringArray[2]);
						
					}
					
					if(description.indexOf('Starts at') !== -1){
						$('#startat').prop('checked',true);
						var stringArray = description.split(/\b(\s)/);
						var nhrss=$('#hours').val(stringArray[4]);
						var nmin=$('#minute').val(stringArray[6]);
					}
					$('#hsdt').val($(cols[4]).text());
					$('#hedt').val($(cols[5]).text());
				
			$('#hourly-dialog').dialog({
				height:400,
				width:500,
				modal:true,
			buttons:[
			{
				text:"Update Schedule",
				click:function(){
						
						var nlyts=$('#hourly-layouts').val();
						var hndate=$('#hsdt').val();
							var hnsdate=new Date(hndate);
							var hnsdt=hnsdate.getTime();
						var hnedate=$('#hedt').val();
							var hnedates=new Date(hnedate);
							var hnedt=hnedates.getTime();
						$('#hourly-table tr td').find('input[id="ehourly"]').each(function(){
						if($(this).is(":checked"))
						{		
								var nhhrs=$('#evhourly').val();
								var data={"displayName":ndsp, "zonecoordinatename":nzn, 
								"displayLayoutSchedule":{"scheduleName":nhsch,"sStartDateTime":hnsdt,
								"sEndDateTime":hnedt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":nlyts,
								"cronstore":{"isCronExpressionEveryHour":"true", "hour":nhhrs}}]}};
							
							$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+ndsp+'/'+nzn+'/schedule/'+nhsch+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
									
									alert("Your Schedule has been Created!");
									$('#hourly-dialog').dialog('close');
									HoursTable();
							},
							error: function(jqXHR, textStatus, errorThrown) 
							{
							console.log('error while post');
				
							}
						});
							
						}
						
					});
					
					$('#hourly-table tr td').find('input[id="startat"]').each(function(){
						if($(this).is(":checked"))
						{	
							var nhours=$('#hours').val();
							
							var nminute=$('#minute').val();
							
							var data={"displayName":ndsp, "zonecoordinatename":nzn, 
									"displayLayoutSchedule":{"scheduleName":nhsch,"sStartDateTime":hnsdt,
									"sEndDateTime":hnedt,"IsSchedulerRunning":"false",
									"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":nlyts,
									"cronstore":{"isCronExpressionHourStartsAt":"true", "hour":nhours,"minute":nminute}}]}};
						
						
						$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+ndsp+'/'+nzn+'/schedule/'+nhsch+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
									alert("Your Schedule has been Created!");
									$('#hourly-dialog').dialog('close');
									HoursTable();
							},
							error: function(jqXHR, textStatus, errorThrown) 
							{
							console.log('error while post');
				
							}
						});
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
function dailyEdit(td){
		/*$("#dsdt").datetimepicker();
		$("#dedt").datetimepicker();*/
		var _rows=$(td).parents('tr');
		var cols=_rows.children('td');
		var dadisplay=$(cols[0]).text();
		var dazon=$(cols[1]).text();
		
		var dalayt=$('#daily-layouts').val($(cols[2]).text());
		var daschedule=$('#daily-schedule').val($(cols[3]).text());
			var ndaschedule=daschedule.val();
		$('#daily-schedule').attr('disabled','disabled');
		
			var description = $(cols[6]).text();
					if(description.indexOf('Every') !== -1){
						
						$('#edaily').prop('checked',true);
						
						var stringArray = description.split(/\b(\s)/);
						var days=$('#ddays').val(stringArray[2]);
						var dhrs=$('#dhours').val(stringArray[10]);
						var dmin=$('#dminutes').val(stringArray[12]);
						
					}
					
					if(description.indexOf('Starts at') !== -1){
						$('#evwday').prop('checked',true);
						var stringArray = description.split(/\b(\s)/);
						var dhrs=$('#dhours').val(stringArray[4]);
						var dmin=$('#dminutes').val(stringArray[6]);
					}
					
					
					var ddates=$('#dsdt').val($(cols[4]).text());
					var ddtes=ddates.val();
						
					var ddate=$('#dedt').val($(cols[5]).text());
					var dsdate=ddate.val();
						
			
		
	$('#daily-dialog').dialog({
			height:420,
			width:500,
			modal:true,
			buttons:[
			{
				text:"Update Schedule",
				click:function(){
					
					
					var dalayouts=$('#daily-layouts').val();
					var dsdate=$('#dsdt').val();
						var dndate=new Date(dsdate);
						var ndate=dndate.getTime();
					var dedate=$('#dedt').val();
						var dnedate=new Date(dedate);
						var nedate=dnedate.getTime();
						
					$('#daily-table tr td').find('input[id="edaily"]').each(function(){
						if($(this).is(":checked"))
						{		
								var daays=$('#ddays').val();
								var dahour=$('#dhours').val();
								var daminute=$('#dminutes').val();
								
								var data={"displayName":dadisplay, "zonecoordinatename":dazon, 
								"displayLayoutSchedule":{"scheduleName":ndaschedule,"sStartDateTime":ndate,
								"sEndDateTime":nedate,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":dalayouts,
								"cronstore":{"isCronExpressionDailyEveryDay":"true", 
								"day":daays,"hour":dahour,"minute":daminute}}]}};
								
								$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+dadisplay+'/'+dazon+'/schedule/'+ndaschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	alert("Your Schedule has been Created!");
								$('#daily-dialog').dialog('close');
								DailyTable();
									
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
								alert(textStatus);
				
								}
							});
							
						}
						
					});
					
					
					$('#daily-table tr td').find('input[id="evwday"]').each(function(){
						if($(this).is(":checked"))
						{
							
								var daehours=$('#dhours').val();
								var daeminute=$('#dminutes').val();
								var data={"displayName":dadisplay, "zonecoordinatename":dazon, 
								"displayLayoutSchedule":{"scheduleName":ndaschedule,"sStartDateTime":ndate,
								"sEndDateTime":nedate,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":dalayouts,
								"cronstore":{"isCronExpressionDailyEveryWeekDay":"true", "hour":daehours,"minute":daeminute}}]}};
								
							$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+dadisplay+'/'+dazon+'/schedule/'+ndaschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
									alert("Your Schedule has been Created!");
									$('#daily-dialog').dialog('close');
									DailyTable();
									
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
				
								}
							});
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
	
function weeklyEdit(td){
		/*$('#wsdt').datetimepicker();
		$('#wedt').datetimepicker();*/
		var _rows=$(td).parents('tr');
		var cols=_rows.children('td');
		var wwdisplay=$(cols[0]).text();
		var wwzon=$(cols[1]).text();
		
		var wlayouts=$('#weekly-layouts').val($(cols[2]).text());
		var wschedule=$('#weekly-schedule').val($(cols[3]).text());
			var wwschedule=wschedule.val();
			
		$('#weekly-schedule').attr('disabled','disabled');
		
		var description =$(cols[6]).text();
		
		var stringArray = description.split(',');
			
			for(weeks in stringArray){
				
				if(stringArray[weeks]!=""){
					var weekname = '#'+stringArray[weeks];
					
						$(weekname).prop('checked',true).trigger('change');
						var hour=$('#whours').val($(cols[7]).text());
					}
			}	
				var descp = $(cols[7]).text();
				if(descp.indexOf('Starts at') !== -1){
						var stringArray = descp.split(/\b(\s)/);
						var dhrs=$('#whours').val(stringArray[4]);
						var dmin=$('#wminutes').val(stringArray[6]);
					}
					var ddates=$('#wsdt').val($(cols[4]).text());
					var ddtes=ddates.val();
						
					var ddate=$('#wedt').val($(cols[5]).text());
					var dsdate=ddate.val();
		
		
		
		
		
		$('#weekly-dialog').dialog({
			height:500,
			width:600,
			modal:true,
			buttons:[
			{
				text:"Update Schedule",
				click:function(){
					
					var wwlayouts=$('#weekly-layouts').val();
					var wwsdt=$('#wsdt').val();
						var wnsdt=new Date(wwsdt);
						var wwnsdt=wnsdt.getTime();
						
					var wwedt=$('#wedt').val();
						var wnedt=new Date(wwedt);
						var wwnedt=wnedt.getTime();
					var wweeks=[];
					var j = 0;
					$('#weekly-table tr td').find('input[type="checkbox"]').each(function(i){
						
						if($(this).is(":checked") && $(this).val()!="")
						{	
							wweeks[j++]=$(this).val();
							
						}
					});
					var wwhours=$('#whours').val();
					var wwminutes=$('#wminutes').val();
					
					var data={"displayName":wwdisplay, "zonecoordinatename":wwzon, 
						"displayLayoutSchedule":{"scheduleName":wwschedule,"sStartDateTime":wwnsdt,
						"sEndDateTime":wwnedt,"IsSchedulerRunning":"false",
						"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":wwlayouts,
						"cronstore":{"isCronExpressionWeekly":"true","days":wweeks, "hour":wwhours,"minute":wwminutes}}]}};
						
						$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+wwdisplay+'/'+wwzon+'/schedule/'+wwschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
									alert("Your Schedule has been updated!");
									$('#weekly-dialog').dialog('close');
									WeekTable();
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
	
function monthlyEdit(td){
		/*$('#mtsdt').datetimepicker();
		$('#mtedt').datetimepicker();*/
		var _rows=$(td).parents('tr');
		var cols=_rows.children('td');
		
		var mthdisplay=$(cols[0]).text();
		var mthzon=$(cols[1]).text();
		
		var mthlayouts=$('#monthly-layouts').val($(cols[2]).text());
		var mthschedule=$('#monthly-schedule').val($(cols[3]).text());
			var mthhschedule=mthschedule.val();
			$('#monthly-schedule').attr('disabled','disabled');
				var description = $(cols[6]).text();
				if(description.indexOf('Day') !== -1){
						
						$('#monthlynum').prop('checked',true);
						var stringArray = description.split(/\b(\s)/);
						var days=$('#mtdaysinput').val(stringArray[2]);
						var mtmonth=$('#mtmonth').val(stringArray[8]);
						var mthours=$('#mthours').val(stringArray[16]);
						var mtminute=$('#mtminute').val(stringArray[18]);
						
					}
				if(description.indexOf('The') !== -1){
						
						$('#mtthe').prop('checked',true);
						var stringArray = description.split(/\b(\s)/);
						var mtdayson=$('#mtdayson').val(stringArray[2]);
						var mtdaysname=$('#mtdaysname').val(stringArray[4]);
						var mtofmonth=$('#mtofmonth').val(stringArray[10]);
						var mthours=$('#mthours').val(stringArray[18]);
						var mtminute=$('#mtminute').val(stringArray[20]);
						
					}
				var ddates=$('#mtsdt').val($(cols[4]).text());
						
				var ddate=$('#mtedt').val($(cols[5]).text());
		
		$('#monthly-dialog').dialog({
			height:500,
			width:1000,
			modal:true,
			buttons:[
			{
				text:"Update Schedule",
				click:function(){
					
					var mthllayouts=$('#monthly-layouts').val();
					var mtsdate=$('#mtsdt').val();
						var mtnsdt=new Date(mtsdate);
						var mtsndt=mtnsdt.getTime();
					var mtedate=$('#mtedt').val();
						var mtnedt=new Date(mtedate);
						var mtendt=mtnedt.getTime();
					
					
					$('#monthly-table tr td').find('input[id="monthlynum"]').each(function(){
						
						if($(this).is(":checked"))
						{
							
							var mthdaysnum=$('#mtdaysinput').val();
							var mthmonthnum=$('#mtmonth').val();
							var mthhours=$('#mthours').val();
							var mthminute=$('#mtminute').val();
							
							
							data={"displayName":mthdisplay, "zonecoordinatename":mthzon, 
								"displayLayoutSchedule":{"scheduleName":mthhschedule,"sStartDateTime":mtsndt,
								"sEndDateTime":mtendt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":mthllayouts,
								"cronstore":{"isCronExpressionMonthlyByDayMonth":"true", "numericday":mthdaysnum,
								"numericmonth":mthmonthnum,"hour":mthhours,"minute":mthminute}}]}};
								
								
								$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+mthdisplay+'/'+mthzon+'/schedule/'+mthhschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
									alert("Your Schedule has been updated!");
									$('#monthly-dialog').dialog('close');
									MonthTable();
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
				
								}
						});
						}
						
					});
					
					$('#monthly-table tr td').find('input[id="mtthe"]').each(function(){
						if($(this).is(":checked"))
						{
							var mthdayson=$('#mtdayson').val();
							var mthdaysname=$('#mtdaysname').val();
							var mthofmonth=$('#mtofmonth').val();
							
							var mthhour=$('#mthours').val();
							var mthminutes=$('#mtminute').val();
							
							data={"displayName":mthdisplay, "zonecoordinatename":mthzon, 
								"displayLayoutSchedule":{"scheduleName":mthhschedule,"sStartDateTime":mtsndt,
								"sEndDateTime":mtendt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":mthllayouts,
								"cronstore":{"isCronExpressionMonthlyByTheCustom":"true", "roman":mthdayson,
								"day":mthdaysname, "numericmonth":mthofmonth,"hour":mthhour,"minute":mthminutes}}]}};
								
								
								$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+mthdisplay+'/'+mthzon+'/schedule/'+mthhschedule+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
										alert("Your Schedule has been updated!");
										$('#monthly-dialog').dialog('close');
										MonthTable();
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
				
								}
						});

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
	
function yearlyEdit(td){
		/*$('#ysdt').datetimepicker();
		$('#yedt').datetimepicker();*/
		
		var _rows=$(td).parents('tr');
		var cols=_rows.children('td');
		
		var yydisplay=$(cols[0]).text();
		var yyzon=$(cols[1]).text();
		
		var yylayouts=$('#yearly-layouts').val($(cols[2]).text());
		var yyschedule=$('#yearly-schedule').val($(cols[3]).text());
			var yschedules=yyschedule.val();
			$('#yearly-schedule').attr('disabled','disabled');
			
			var description = $(cols[6]).text();
				if(description.indexOf('Every') !== -1){
						$('#eyear').prop('checked',true);
						var stringArray = description.split(/\b(\s)/);
						var days=$('#yearly-month').val(stringArray[2]);
						var ydays=$('#yearly-days').val(stringArray[4]);
						var yhours=$('#yhours').val(stringArray[12]);
						var yminute=$('#yminute').val(stringArray[14]);
						
					}
				if(description.indexOf('The') !== -1){
						
						$('#eday').prop('checked',true);
						var stringArray = description.split(/\b(\s)/);
						var ydon=$('#yearly-dayson').val(stringArray[2]);
						var ydaysname=$('#yearly-daysname').val(stringArray[4]);
						var yofmonth=$('#yearly-ofmonth').val(stringArray[8]);
						var yhour=$('#yhours').val(stringArray[14]);
						var yminut=$('#yminute').val(stringArray[16]);
						
					}
			var ddates=$('#ysdt').val($(cols[4]).text());
				var ydtes=ddates.val();
						
			var ddate=$('#yedt').val($(cols[5]).text());
				var ysdate=ddate.val();
		
		$('#yearly-dialog').dialog({
			height:500,
			width:1000,
			modal:true,
			buttons:[
			{
				text:"Update Schedule",
				click:function(){
					
					var yrlayouts=$('#yearly-layouts').val();
						var ysdate=$('#ysdt').val();
							var ynsdt=new Date(ysdate);
							var ysnsdt=ynsdt.getTime();
						var yedate=$('#yedt').val();
							var ynedt=new Date(yedate);
							var ysnedt=ynedt.getTime();
						$('#yearly-table tr td').find('input[id="eyear"]').each(function(){
						
						if($(this).is(":checked"))
						{
							
							var yrmonths=$('#yearly-month').val();
							
							var yrdays=$('#yearly-days').val();
							
							var yrhours=$('#yhours').val();
							
							var yrminute=$('#yminute').val();
							
							
							 data={"displayName":yydisplay, "zonecoordinatename":yyzon, 
								"displayLayoutSchedule":{"scheduleName":yschedules,"sStartDateTime":ysnsdt,
								"sEndDateTime":ysnedt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":yrlayouts,
								"cronstore":{"isCronExpressionYearlyByDayMonth":"true", "day":yrdays,
								"month":yrmonths,"hour":yrhours,"minute":yrminute}}]}};
								
								$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+yydisplay+'/'+yyzon+'/schedule/'+yschedules+'/create',
								contentType: "application/json",
								success: function(data) 
								{	alert("Your Schedule has been Created!");
								$('#yearly-dialog').dialog('close');
									YearTable();
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
				
								}
						});
						}
					});
					$('#yearly-table tr td').find('input[id="eday"]').each(function(){
						
						if($(this).is(":checked"))
						{
							
							var yrdayson=$('#yearly-dayson').val();
							var yrdaysname=$('#yearly-daysname').val();
							var yrofmonth=$('#yearly-ofmonth').val();
							var yrshours=$('#yhours').val();
							var yrsminutes=$('#yminute').val();
							
							data={"displayName":yydisplay, "zonecoordinatename":yyzon, 
								"displayLayoutSchedule":{"scheduleName":yschedules,"sStartDateTime":ysnsdt,
								"sEndDateTime":ysnedt,"IsSchedulerRunning":"false",
								"layoutScheduleConfigurations": [{"sequenceNumber":"1", "layoutName":yrlayouts,
								"cronstore":{"isCronExpressionYearlyByTheCustom":"true", "roman":yrdayson, 
								"day":yrdaysname,"month":yrofmonth,"hour":yrshours,"minute":yrsminutes}}]}};
								
								$.ajax({
								type: "POST",
								data:JSON.stringify(data),
								url: produrl+'/app/gui/'+yydisplay+'/'+yyzon+'/schedule/'+yschedules+'/create',
								contentType: "application/json",
								success: function(data) 
								{	
										alert("Your Schedule has been Created!");
										$('#yearly-dialog').dialog('close');
										YearTable();
								},
								error: function(jqXHR, textStatus, errorThrown) 
								{
								console.log('error while post');
				
								}
						});
							
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
	
/*-----------------The end---------------------------------------------------------------------------*/
	
/*------------------------------Deleting functions are codded here!-------------------------------*/

function minutesDelete(td){
	if(confirm('Are You sure to delete this record?'))
		{
        var rows =td.parentElement.parentElement;
		var display=$.trim($(rows).find("#display").text());
		var zone=$.trim($(rows).find('#zone').text());
		var schedule=$.trim($(rows).find('#schedule').text());
		$.ajax({
			contentType: "application/json",
			type: "GET",
			url: produrl+'/app/gui/'+display+'/'+zone+'/schedule/'+schedule+'/delete',
			success: function(data) {
					alert('Your record has been deleted!');
					MinuteTable();
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log('error while post');
				alert(textStatus);
			}
			}); 
		}
	}
	
function hoursDelete(td){
		
		if(confirm('Are You sure to delete this record?'))
		{
        var rows =td.parentElement.parentElement;
        
		var display=$.trim($(rows).find("#display").text());
		var zone=$.trim($(rows).find('#zone').text());
		var schedule=$.trim($(rows).find('#schedule').text());
		$.ajax({
			contentType: "application/json",
			type: "GET",
			url: produrl+'/app/gui/'+display+'/'+zone+'/schedule/'+schedule+'/delete',
			success: function(data) {
					alert('Your record has been deleted!');
					HoursTable();
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log('error while post');
				alert(textStatus);
			}
					
			}); 
		}
		
	}
function dailyDelete(td){
		
		if(confirm('Are You sure to delete this record?'))
		{
			
		
        var rows =td.parentElement.parentElement;
        
		var display=$.trim($(rows).find("#display").text());
		var zone=$.trim($(rows).find('#zone').text());
		var schedule=$.trim($(rows).find('#schedule').text());
		$.ajax({
			contentType: "application/json",
			type: "GET",
			url: produrl+'/app/gui/'+display+'/'+zone+'/schedule/'+schedule+'/delete',
			success: function(data) {
					alert('Your record has been deleted!');
					DailyTable();
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log('error while post');
				alert(textStatus);
			}
					
			}); 
		}
	}
	
function weeklyDelete(td){
		
		if(confirm('Are You sure to delete this record?'))
		{
			
		
        var rows =td.parentElement.parentElement;
        
		var display=$.trim($(rows).find("#display").text());
		var zone=$.trim($(rows).find('#zone').text());
		var schedule=$.trim($(rows).find('#schedule').text());
		$.ajax({
			contentType: "application/json",
			type: "GET",
			url: produrl+'/app/gui/'+display+'/'+zone+'/schedule/'+schedule+'/delete',
			success: function(data) {
					alert('Your record has been deleted!');
					WeekTable();
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log('error while post');
				alert(textStatus);
			}
					
			}); 
		}
	}
	
function monthlyDelete(td){
		if(confirm('Are You sure to delete this record?'))
		{
			
		
        var rows =td.parentElement.parentElement;
        
		var display=$.trim($(rows).find("#display").text());
		var zone=$.trim($(rows).find('#zone').text());
		var schedule=$.trim($(rows).find('#schedule').text());
		$.ajax({
			contentType: "application/json",
			type: "GET",
			url: produrl+'/app/gui/'+display+'/'+zone+'/schedule/'+schedule+'/delete',
			success: function(data) {
					alert('Your record has been deleted!');
					MonthTable();
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log('error while post');
				alert(textStatus);
			}
					
			}); 
		}
	}
	
function yearlyDelete(td){
		
		if(confirm('Are You sure to delete this record?'))
		{
			
		
        var rows =td.parentElement.parentElement;
        
		var display=$.trim($(rows).find("#display").text());
		var zone=$.trim($(rows).find('#zone').text());
		var schedule=$.trim($(rows).find('#schedule').text());
		$.ajax({
			contentType: "application/json",
			type: "GET",
			url: produrl+'/app/gui/'+display+'/'+zone+'/schedule/'+schedule+'/delete',
			success: function(data) {
					alert('Your record has been deleted!');
					YearTable();
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log('error while post');
				alert(textStatus);
			}
					
			}); 
		}
	}
/*----------------------------End here----------------------------------------------------------------*/
	
	
	
	
	
	