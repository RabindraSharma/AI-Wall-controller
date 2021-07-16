$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
   videoEffectList();
   actionPerformed();
});



function videoEffectList(){
    $.ajax({
        url:'/app/video/source/list',
        method:'get',
        contentType:'application/json',
        success: function(response){
            
            console.log(JSON.parse(response));
            var parsedString = JSON.parse(response);
            for(var i in parsedString){
                var source = parsedString[i].name; 
                var bright = parsedString[i].brightness;
                if(typeof bright =='undefined'){
                    bright =-1;
                }
                var contrast = parsedString[i].contrast;
                if(typeof contrast =='undefined'){
                    contrast =-1;
                }
                var hue =parsedString[i].hue;
                if(typeof hue =='undefined'){
                    hue =-1;
                }
                var saturation = parsedString[i].saturation;
                if(typeof saturation =='undefined'){
                    saturation =-1;
                }
                var rotation = parsedString[i].rotation;
                var cropgeometryFormat = parsedString[i].cropGeometryFormat;
                var vx;
                var vy;
                var vw;
                var vh;
                if(typeof cropgeometryFormat == 'undefined'){
                    vx = 0;
                    vy = 0;
                    vw = 0;
                    vh = 0;
                }else{
                    var originalv = cropgeometryFormat.replace(/[/+x/]/g,',');
                    var original = originalv.split(',');
                
                     vw = original[0];
                     vh = original[1];
                     vx = original[2];
                     vy = original[3];
                
                }
               
            var videoEString =videoEString+'<tr>'+
            '<td class="text-center w-sm-100 w-md-100 w-lg-100 w-xl-100 w-xxl-100">'+source+'</td>'+
            '<td>'+
                '<i class="float-right material-icons first"><img src="resources/images/applyv1.png"></i><br>'+
                '<input type="range" id="bright" min="-1" max="2" step="1" value="'+bright+'" class="w-sm-100 w-md-100 w-lg-100 w-xl-100 w-xxl-100">'+
                '<span class="ml-0" data-toggle="tooltip" data-placement="bottom" title="Default">D</span>'+
                '<span class="ml-3 pl-3" data-toggle="tooltip" data-placement="bottom" title="Low">0</span>'+
                '<span class="ml-3 pl-2 " data-toggle="tooltip" data-placement="bottom" title="Middle">1</span>'+
                '<span class="ml-3 pl-2" data-toggle="tooltip" data-placement="bottom" title="High">2</span>'+
            '</td>'+
            '<td>'+
                '<i class="float-right material-icons nth1"><img src="resources/images/applyv1.png"></i><br>'+
                '<input type="range" id="contrast" min="-1" max="2" step="1" value="'+contrast+'" class="w-sm-100 w-md-100 w-lg-100 w-xl-100 w-xxl-100">'+
                '<span class="ml-0" data-toggle="tooltip" data-placement="bottom" title="Default">D</span>'+
                '<span class="ml-3 pl-3" data-toggle="tooltip" data-placement="bottom" title="Low">0</span>'+
                '<span class="ml-3 pl-2 " data-toggle="tooltip" data-placement="bottom" title="Middle">1</span>'+
                '<span class="ml-3 pl-2" data-toggle="tooltip" data-placement="bottom" title="High">2</span>'+
            '</td>'+
            '<td>'+
                '<i class="float-right material-icons nth2"><img src="resources/images/applyv1.png"></i><br>'+
                '<input type="range" id="hue" min="0" max="360" step="36" value="'+hue+'" class="w-sm-100 w-md-100 w-lg-100 w-xl-100 w-xxl-100" style="width:100%;">'+
                '<span class="ml-1">0</span>'+
                '<span class="ml-2 pl-2">1</span>'+
                '<span class="ml-2 pl-2">2</span>'+
                '<span class="ml-2 pl-2">3</span>'+
                '<span class="ml-2 pl-2">4</span>'+
                '<span class="ml-2 pl-2">5</span>'+
                '<span class="ml-2 pl-2">6</span>'+
                '<span class="ml-2 pl-2">7</span>'+
                '<span class="ml-2 pl-2">8</span>'+
                '<span class="ml-2 pl-2">9</span>'+
                '<span class="ml-2">10</span>'+
            '</td>'+
            '<td>'+
                '<i class="float-right material-icons nth3"><img src="resources/images/applyv1.png"></i><br>'+
                '<input type="range" id="satauration" min="-1" max="2" step="1" value="'+saturation+'" class="w-sm-100 w-md-100 w-lg-100 w-xl-100 w-xxl-100">'+
                '<span class="ml-0" data-toggle="tooltip" data-placement="bottom" title="Default">D</span>'+
                '<span class="ml-3 pl-3" data-toggle="tooltip" data-placement="bottom" title="Low">0</span>'+
                '<span class="ml-3 pl-2 " data-toggle="tooltip" data-placement="bottom" title="Middle">1</span>'+
                '<span class="ml-3 pl-2" data-toggle="tooltip" data-placement="bottom" title="High">2</span>'+
            '</td>'+
            '<td>'+
                '<i class="float-right material-icons nth4"><img src="resources/images/applyv1.png"></i><br>'+
                'Angle <input type="number" id="rotation" value="'+rotation+'" min="0" max="360" class="w-sm-100 w-md-100 w-lg-100 w-xl-100 w-xxl-100">'+
            '</td>'+
            '<td>'+
                '<i class="float-right material-icons last"><img src="resources/images/applyv1.png"></i><br>'+
                '<div class="row p-1">'+
                '<div class="col-sm-12">'+
                    '<label class="w-25">X</label><input type="number" class="w-sm-75 w-md-75 w-lg-75 w-xl-75 w-xxl-75"  id="x" min="0" value="'+vx+'" placeholder="X">'+
                '</div>'+
                '<div class="col-sm-12">'+
                    '<label class="w-25">Y</label><input type="number" class="w-sm-75 w-md-75 w-lg-75 w-xl-75 w-xxl-75" id="y" min="0" value="'+vy+'" placeholder="Y">'+
                '</div>'+
                '<div class="col-sm-12">'+
                    '<label class="w-25">Width</label><input type="number" class="w-sm-75 w-md-75 w-lg-75 w-xl-75 w-xxl-75"  id="width" min="0" value="'+vw+'" placeholder="width">'+
                '</div>'+
                '<div class="col-sm-12">'+
                    '<label class="w-25">Height</label><input type="number" class="w-sm-75 w-md-75 w-lg-75 w-xl-75 w-xxl-75"  id="height" min="0" value="'+vh+'" placeholder="height">'+
                '</div>'+
               '</div>'+
            '</td>'+
            '</tr>';
            }
            
            $('#videoTbody').append(videoEString);
            actionPerformed();
        },
        error: function(error,errormsg){
            console.log(errormsg);

        }
    });
}
function actionPerformed(){
	
		$('#videoTable > tbody  > tr').each(function(){
	        var $this = $(this);
	        var sourceName = $($this).find('td:first').text();
	        var flags ='';
	       
	        $(this).find('i.first').on('click',function(){
	            flags = 'brightness';
	            var brightValue = $($this).find('td').children('input[id="bright"]').val();
	            if(brightValue==-1){
	                brightValue = 'null';
	                videoEffectUpdate(sourceName,flags,brightValue);
	            }else{
	                videoEffectUpdate(sourceName,flags,brightValue);
	            }
	            
	        });
	        $(this).find('i.nth1').on('click',function(){
	            flags = 'contrast';
	            var contrastValue = $($this).find('td').children('input[id="contrast"]').val();
	            if(contrastValue==-1){
	                contrastValue = 'null';
	                videoEffectUpdate(sourceName,flags,contrastValue);
	            }else{
	                videoEffectUpdate(sourceName,flags,contrastValue);
	            }
	        });
	        $(this).find('i.nth2').on('click',function(){
	            flags = 'hue';
	            var hueValue  = $($this).find('td').children('input[id="hue"]').val();
	            if(hueValue==-1){
	                hueValue = 'null';
	                videoEffectUpdate(sourceName,flags,hueValue);
	            }else{
	                videoEffectUpdate(sourceName,flags,hueValue);
	            }
	        });
	        $(this).find('i.nth3').on('click',function(){
	            flags = 'saturation';
	            var saturationValue = $($this).find('td').children('input[id="satauration"]').val();
	            if(saturationValue==-1){
	                saturationValue = 'null';
	                videoEffectUpdate(sourceName,flags,saturationValue);
	            }else{
	                videoEffectUpdate(sourceName,flags,saturationValue);
	            }
	        });
	        $(this).find('i.nth4').on('click',function(){
	            flags = 'rotation';
	            var rotationValue = $($this).find('td').children('input[id="rotation"]').val();
	            if(rotationValue==0){
	                rotationValue = 'null';
	                videoEffectUpdate(sourceName,flags,rotationValue);
	            }else{
	                videoEffectUpdate(sourceName,flags,rotationValue);
	            }

	        });
	        $(this).find('i.last').on('click',function(){
	            flags = 'cropgeometry';
	            var xValue = $($this).find('td').find('.col-sm-12').children('input[id="x"]').val();
	            var yValue = $($this).find('td').find('.col-sm-12').children('input[id="y"]').val();
	            var widthValue = $($this).find('td').find('.col-sm-12').children('input[id="width"]').val();
	            var heightValue = $($this).find('td').find('.col-sm-12').children('input[id="height"]').val();
	            var cropValue;
	            if(xValue==0 && yValue==0 && widthValue==0 && heightValue==0){
	                cropValue ='null';
	                videoEffectUpdate(sourceName,flags,cropValue);
	            }else{
	                cropValue = widthValue+'x'+heightValue+'+'+xValue+'+'+yValue;
	                videoEffectUpdate(sourceName,flags,cropValue);
	            }
	        });
	        
	    });	
}

function videoEffectUpdate(source,flags,flagsValue){
	confirmDialog("Are you sure to apply the settings?",source,flags,flagsValue);
}

function confirmDialog(message,source,flags,flagsValue) {
	  $('#alertDialog')
	    .dialog({
	      show: {effect: "bounce", duration: 3000}, 
	      hide: {effect: "fade", duration: 2000} ,	
	      modal: true,
	      title: 'Apply settings',
	      autoOpen: true,
	      height:180,
		  width:350,
	      resizable: false,
	      buttons: {
	        Yes: function() {
	          $(this).dialog("close");
	          var data;
	  	    if(flags==='brightness'){
	  	        data = {"name":source,"flag":flags, "brightness":flagsValue};
	  	    }else if(flags==='contrast'){
	  	        data = {"name":source,"flag":flags, "contrast":flagsValue};
	  	    }else if(flags==='hue'){
	  	        data = {"name":source,"flag":flags, "hue":flagsValue};
	  	    }else if(flags==='saturation'){
	  	        data = {"name":source,"flag":flags, "saturation":flagsValue};
	  	    }else if(flags==='rotation'){
	  	        data = {"name":source,"flag":flags, "rotation":flagsValue};
	  	    }else if(flags==='cropgeometry'){
	  	        data = {"name":source,"flag":flags, "cropgeometry":flagsValue};
	  	    }
	  	    $.ajax({
	  	        url:'app/video/effects/source/update',
	  	        method:'POST',
	  	        data:JSON.stringify(data),
	  	        contentType:'application/json',
	  	        success: function(response){
	  	            console.log(response);
	  	            //alert("Your settings are updated successfully! Please reload the layout to see the update changes..");
	  	          success();
	  	        },
	  	        error: function(error,errormsg){
	  	            console.log(errormsg);
	  	            alert("Error in updating settings "+errormsg);
	  	        }
	  	    });
	        },
	        No: function() {
	          $(this).dialog("close");
	        }
	      }
	    }).text(message);
	};
	
function success(){
	 $('#successDialog')
	    .dialog({
	      show: {effect: "bounce", duration: 3000}, 
	      hide: {effect: "fade", duration: 2000} ,	
	      modal: true,
	      title: 'Success',
	      autoOpen: true,
	      height:180,
		  width:800,
	      resizable: false,
	      buttons: {
	        Ok : function() {
	          $(this).dialog("close");
	         }
	      }
	    }).text("Your settings are updated successfully! Please reload the layout to see the update changes..");
}	