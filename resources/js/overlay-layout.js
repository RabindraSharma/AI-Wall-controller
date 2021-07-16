const GRIDWIDTH = 960;
const GRIDHEIGHT = 540;

function initVideoEffects(token,audioLicense){
    authtoken=window.btoa(token);
    isAudioLicense=audioLicense;
    getDisplays(authtoken);

    /*$.ajax({
        url:'https://localhost:8998/overlay/activelayout',
        "headers": {
            "accept": "application/json",
            "Access-Control-Allow-Origin":"*",
            "Authorization" : "Basic " + authtoken
          },
        type: "POST",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            var activeOrigine = response.result;
            console.log('success');
        },
        error: function (error, sts) {
           console.log('errr');
        }
    });*/
}

function getDisplays(authToken) {
	console.log(authToken);
    $.ajax({
        url: listdisplays,
        "headers":{
            "accept": "application/json",
            "Access-Control-Allow-Origin":"*",
            "Authorization" : "Basic " + authToken
          },
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            var originalData = response.result;
            var scope = JSON.parse(originalData);
            mapedLayout(scope,authToken);
        },
        error: function (error, sts) {
           
        }
    });
}

function mapedLayout(scope,authtoken) {
    $('.contentRow').empty();
    $('.mainRow').empty();
    let displayRow='';
    for (var display of scope) {
        var displayId = display.id;
        
        var uniquedisplayId = displayId.replace(/ /g,"-");
        displayRow = "<div class='row mainRow border'>"+
            "<div class='col-md-2 border-right bg-white p-2'>"+
                   "<div class='roundDisplay rounded'>"+displayId+"</div>"+
            "</div>"+
            "<div class='col-md-10 bg-light zonetoggle-"+uniquedisplayId+"' id='zonetoggle-"+uniquedisplayId+"'>"+
            "</div>"+
        "</div>"        
        $('#contentRow').append(displayRow);
        
        for(var zone of display.zones){
        
           for(var cord of zone.zonecoordinates){
                let zonName = cord.name; 
                var zonID = zonName.replace(/ /g, '-');
                var zoneRows = "<div class='row m-1 rounded'>"+
                                    '<div data-role="accordion" data-one-frame="false" data-show-active="true">'+
                                        '<div class="frame">'+
                                            '<div class="heading border-bottom">'+cord.name+'</div>'+
                                                '<div class="content bg-white">'+
                                                    '<div class="row pl-1 pr-1 layout" id="layout'+uniquedisplayId+zonID +'">'+
                                                '</div>' +
                                            '</div>'+
                                        '</div>'+  
                                    '</div>'+
                                '</div>' +
                            "</div>"
                $('#zonetoggle-'+uniquedisplayId).append(zoneRows);
        for(var layout of cord.layouts){
            let lName = layout.name;
            let layoutName ;
            var key = uniquedisplayId+cord.name+lName;
            //alert(layoutName);
            if(layout.active){
                layoutName = layout.name;
                
            }
            var map = new Map();
            var references = layout.references;
            var rows = layout.rows;
            var cols = layout.columns;
            var data;
            
            //comparedLayout(layoutName,authtoken,data);
            for (var reference of references) {
                var sourcename = reference.source.name;
                
                var sourceType = reference.source.type;
                var applabel = reference.applicationLabel;
                var location = reference.applicationLabel.location;
                var size = reference.applicationLabel.size;
                var x = applabel.rectanglePoint.x;
                var y = applabel.rectanglePoint.y;
                
                    data = {
                    'zone': zonName,
                    'applabel': applabel,
                    'location':location,
                    'layoutname':layoutName,
                    'size':size,
                    'id':displayId,
                    'type':sourceType,
                    'sourcename': sourcename,
                    'x': x,
                    'y': y,
                    'rows': rows,
                    'columns': cols
                };
                
                if (zonName) {
                    if (map.has(key)) {
                        map.get(key).push(data);
                    } else {
                        var arr = [data];
                        map.set(key, arr);
                    }
                }
                
            }
            
            for(let key of map.keys()){
                
                var s = 0;
                var data = map.get(key);
                var cID = key.replace(/ /g,'-');
                
                var zn = data[0].zone;
                let layName = data[0].layoutname;

        if(typeof layName !=="undefined"){
            var znID = zn.replace(/ /g,'-');
            var uniquedisplayId = data[0].id.replace(/ /g,"-");
            
            $('#layout'+uniquedisplayId+znID).append(
                '<div class="activeLayout">' +
                    '<div class="text-justify-content bg-dark rounded text-info border newlayout p-2" id="layout">' + layoutName +    
                    '</div>' +
                    '<div class="row m-1 " id="box'+cID+'" name="'+zn+'">'+'</div>'+
                '</div>'
            );

        for (var i = 0; i < data.length; i++) {
       
        let flexBox ="<div id='wPaint"+zn+data[i].sourcename+"' class=' col-md-4 m-0 col-sm-6 border text-black flexbox' style='width:100vw; height:82vh;'>"+
                               "<span class='right-text'>"+data[i].sourcename+"</span>"+
                                "<span id='apply"+zn+data[i].sourcename+"' name='"+data[i].sourcename+"' class='fa fa-arrow-right apply btn btn-white border' data='"+JSON.stringify(data)+"'></span>"+
                        "</div>"
                  
                $('#box'+cID).append(flexBox);
    
                $('#wPaint'+zn+data[i].sourcename).wPaint({
                    menuOffsetLeft:0,
                    menuOffsetTop:0,
                    menuOrientation:'vertical',
    
                    onShapeDown: createCallback('onShapeDown'),
                    onShapeUp: textCallback('onShapeUp')
                });
                let flag = false;
                let strokColor=[];
                let px,py;
                let width,height;
                let mode;
                function createCallback(cbName){
                    return function(e){
                    
                        //console.log(cbName,'X:'+e.clientX+' Y:'+e.clientY, this.options.fillStyle,this.options.strokeStyle,this.height,this.width);
                        px =e.pageX;
                        py =e.pageY;
                        width = this.width;
                        height = this.height;
                        mode = this.options.mode;
                        //console.log($(this.$textInput).text());
                        //console.log(txtString);
                        console.log(x+''+y);
                        var strokColor1 = hexToRgbA(this.options.strokeStyle,px,py);
                        strokColor.push(strokColor1);
                                     
                    }
                }  

                var textLine;
               
                function textCallback(cbName){
                    return function(e){

                        if(this.options.mode==='text'){
                            console.log(e.lines);
                            //console.log(lines);
                        }
                    }
                }

                $('#apply'+zn+data[i].sourcename).on('click', function(e){
                     let source = $(this).attr('name');
                   switch(mode){
                       case 'circle':
                           var circles = "{"+"circles"+":["+"{"+ "color"+":"+'{'+strokColor+'}, "x":"'+px+'","y":"'+py+'","fill":"true","radius":"75"}], "webframetotalwidth":"'+width+'", "webframetotalheight":"'+height+'"}';
                                apply(mode,circles,source);
                            break;
                       case 'rectangle':
                            var rectangles = "{"+"rectangles"+":["+"{"+ "color"+":"+'{'+strokColor+'}, "x":"'+px+'","y":"'+py+'","width":"'+width+'","height":"'+height+'","fill":"true"}], "webframetotalwidth":"'+width+'", "webframetotalheight":"'+height+'"}';
                            apply(mode,rectangles,source);
                            break;
                       case 'ellipse':
                           var ovals ="{"+"ovals"+":["+"{"+ "color"+":"+'{'+strokColor+'}, "x":"'+px+'","y":"'+py+'","width":"'+width+'","height":"'+height+'","fill":"true"}], "webframetotalwidth":"'+width+'", "webframetotalheight":"'+height+'"}';
                           apply(mode,ovals,source);
                           break;
                       case 'text':
                           var strings = $('.wPaint-text-input').text();
                        console.log(strings);
                           break;
                   }

                });
                
             }         
            }
         } 
        }
       }
      }    
    }
}

function hexToRgbA(hex,x,y){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        var rgba = 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
        var rgba1 = rgba.replace(/[rgba(/\ )]/g,'').split(',');
        

        var string1 ='"x":"'+x+'","y":"'+y+'","red":"'+rgba1[0]+'","green":"'+rgba1[1]+'","blue":"'+rgba1[2]+'","alpha":"'+rgba1[3]+'"';
        return string1;
    }
    throw new Error('Bad Hex');
}

function apply(modes,data,source){
    $.ajax({
        type:"post",
        url: 'https://localhost:8998/overlay/overlay?source='+source+'',
        data:data,
        processData:false,
        contentType:false,
        cache:false,
        timeout:6000000,
        success:function(data){
           
            Fnon.Hint.Success("The "+modes+" has been successfuly created!", {
                callback:function(){
                }
              });
        },
        error:function(e){
            Fnon.Hint.Danger("Oops, something  went wrong!", {
                callback:function(){
                }
              });
        }
    });
}

