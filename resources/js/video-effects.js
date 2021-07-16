const
GRIDWIDTH = 960;
const
GRIDHEIGHT = 540;
var zoomValues =100;
var staticArray = [];
var tableRowsArray = [];
var sourceListArray = [];
var rowsArray =[];
var colsArray =[];
var appl1=null;
var disp1=null;
var lay1 =null;
var zon1=null;
var type1=null;
var pro;
var authtoken;
var isAudioLicense;
var listsources = '/app/gui/users/sources/list';
const proLicence = '/app/gui/pro/license/status';
const message='You need pro license to use this feature.';
const asistent = 'Hi, How may i help you ?';

function initVideoEffects(token,audioLicense){
  
    getLicenceStatus();
    authtoken=window.btoa(token);
    $('.wall-body').empty();
    isAudioLicense=audioLicense;
    hideSlider(token);
    getDisplays();
    getSourceList();
    videoWallAssistant();
    loadAgentMessage(asistent);
   

    $('#TilesModal').on('hidden.bs.modal', function () {
        ornamentReset();
});

$('#file').click(function(){
    Metro.dialog.create({
        title:'Upload files',
        content:'<form id="file-upload" method="post" action="#" enctype="multipart/form-data">'+
        '<label>Select BackUp File:<input type="file" name="file" id="fileload" class="form-control" /></label>'+
        '</form>',
        closeButton:true,
        actions:[
            {
                caption: "Upload",
                cls: "js-dialog-close",
                onclick: function(){
                   
                    var form= $('#file-upload')[0];
                    var data = new FormData(form);
                    $.ajax({
                        type:"post",
                        url: '/app/restore',
                        enctype:'multipart/form-data',
                        data:data,
                        processData:false,
                        contentType:false,
                        cache:false,
                        timeout:6000000,
                        success:function(data){
                            infoAlert("The restore file successfully uploaded!",'success');
                        },
                        error:function(e){
                            console.log('Error:',e);
                            infoAlert("Oops, Something went wrong.",'alert');
                        }
                    });
                }
            },
            {
                caption: "Close",
                cls: "js-dialog-close",
                onclick: function(){
                    $(this).hide();
                }
            }
        ]
    })
});
}


function getDisplays() {
    $.ajax({
        url: listdisplays,
        "headers": {
            "accept": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic"+authtoken
        },
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            var originalData = response.result;
            var scope = JSON.parse(originalData);
            
            mapedLayout(scope);
        },
        error: function (error, sts) {
           
        }
    });
}


function mapedLayout(scope) {
    var displayId;
   
    for (var display of scope) {
         displayId = display.id;
        
         var uniquedisplayId = displayId.replace(/ /g,"-");
         var  rowString = '<div class="row bg-white p-2">'+
        '<div class="col-md-2 col-sm-6">'+
        '<div class="d-flex-block">'+
            '<img src="resources/images/wall.jpg" alt="" class="src">'+
               '<div id="display" class="text-muted">'+uniquedisplayId+'</div>'+
               '<a  class="screen" value="'+displayId+'"><img src="resources/images/record.png"/>ScreenShot & Recordings</a>'+
               '<br/>'+
            '<a class="audio" value="'+displayId+'"><img src="resources/images/audio.png"/>Audio Manager</a>'+
        '</div>'+
   '</div>'+
   '<div class="col-md-10 col-sm-10 col-xs-10 col-lg-10 col-xl-10">'+
       '<div container class="container source-'+uniquedisplayId+'"></div>'+
   '</div>'+
   '</div>';
   
   $('#mainRow').append(rowString);
   
        for (var zone of display.zones) {
            for (var zonecoordinate of zone.zonecoordinates) {
                var zonname = zonecoordinate.name;
                
                var zonID = zonname.replace(/ /g,'-');
               
                var row = '<div class="row original border">' +
                    '<div class="col-md-2 col-lg-2 col-sm-4 bg-light p-2">' +

                    '<div class="zone-box bg-white p-1 text-justify-content text-info m-0 text-mutted" id="'+zonID+ '">' +displayId+ '(' + zonecoordinate.name + ')' + '</div>' +
                    '</div>' +
                    '<div class="col-md-10 zero col-lg-10 col-sm-8 bg-light">' +
                    '<div class="container" id="layoutMain">' +
                        '<div class="row" id="'+uniquedisplayId+'-layoutRow-'+zonID+'">'+
                        '</div>'+
                       '<div data-role="accordion" data-one-frame="false" data-show-active="true">'+
                            '<div class="frame">'+
                                '<div class="heading d-block border-bottom">'+zonecoordinate.name+'</div>'+
                                    '<div class="content">'+
                                        '<div class="row p-2 layout" id="layout'+uniquedisplayId+zonID +'">' +
                                        '</div>' +
                                    '</div>'+
                                '</div>'+  
                            '</div>' +
                        '</div>' +
                    '</div>';
                $('.source-'+uniquedisplayId).append(row);
                for (var layout of zonecoordinate.layouts) {
                    var layoutname = layout.name;
                   
                    var key = uniquedisplayId+zonecoordinate.name+layoutname;
                   
                   
                    var rows = layout.rows;
                    var cols = layout.columns;
                    var newString ;
                    if(layout.active){
                       
                    newString = '<ul>'+
                        '<li>'+
                        '<div class="w-100 load">'+
                            /*'<input type="checkbox" placeholder="'+layoutname+'" checked class="btns btn btn-sm text-dark bactive  btn-load" id='+uniquedisplayId+' value='+zonecoordinate.name+' data='+layout.name+' data-role="popover" data-popover-text="['+layout.name+']" data-popover-position="bottom"></input>'+*/
                           ' <label class="switch"  title="['+layout.name+']">'+
                                '<input type="checkbox" checked class="bactive" id="'+displayId+'" value="'+zonecoordinate.name+'" data="'+layout.name+'"/>'+
                            '<span class="slider round bg-dark text-center p-1 text-white border border-white">'+layoutname+'</span>'+
                                '<span class="absolute-no"></span>'+
                          '</label>'+
                        '</div>'
                         '</li>'+
                         '</ul>';
                         
                    }else{
                       
                    newString = '<ul>'+
                        '<li>'+
                            '<div class="w-100">'+
                            /*'<input type="checkbox" class="btns btn text-white  not-active  btn-load" id='+uniquedisplayId+' value='+zonecoordinate.name+' data='+layout.name+' data-role="popover" data-popover-text="['+layout.name+']" data-popover-position="bottom"/>'+*/
                            ' <label class="switch"  title="['+layout.name+']">'+
                            '<input type="checkbox" class="not-active" id="'+displayId+'" value="'+zonecoordinate.name+'" data="'+layout.name+'"/>'+
                            '<span class="slider bg-white round text-center p-1 text-dark border border-dark">'+layoutname+'</span>'+
                            '<span class="absolute-no"></span>'+
                          '</label>'+
                            '</div>'+
                        '</li>'+
                        '</ul>';
                    }
                   
                    $('#'+uniquedisplayId+'-layoutRow-'+zonID).append(newString);
                   if(cols == -1 && rows == -1){
                       
                       getNotilesLayout(layout,zonname,displayId,layoutname);
                   }else{
                        var map = new Map();
                    var references = layout.references;
                    for (var reference of references) {
                        var sourcename = reference.source.name;
                       
                        var sourceType = reference.source.type;
                        var applabel = reference.applicationLabel;
                        var location = reference.applicationLabel.location;
                        var size = reference.applicationLabel.size;
                        var x = applabel.rectanglePoint.x;
                        var y = applabel.rectanglePoint.y;
                       
                        var data = {
                            'zone': zonname,
                            'applabel': applabel,
                            'location':location,
                            'layoutname':layoutname,
                            'size':size,
                            'id':displayId,
                            'type':sourceType,
                            'sourcename': sourcename,
                            'x': x,
                            'y': y,
                            'rows': rows,
                            'columns': cols
                        };
                        if (zonname) {
                            if (map.has(key)) {
                                map.get(key).push(data);
                            } else {
                                var arr = [data];
                                map.set(key, arr);
                            }
                        }
                    }
                    //
                    for (let key of map.keys()) {
                        var s = 0;
                        var data = map.get(key);
                        var cID = key.replace(/ /g,'-');
                        var zn = data[0].zone;
                        var znID = zn.replace(/ /g,'-');
                        var uniquedisplayId = data[0].id.replace(/ /g,"-");
                        $('#layout'+uniquedisplayId+znID).append(
                            '<div class="container-box m-1" id="box'+cID+'" name="' +zn+ '">' +
                            '<div class="text-justify-content text-info border newlayout p-2" id="layout">' + data[0].layoutname +
                            '</div>' +
                            '</div>'
                        );
                        var svg = d3.select('#box'+cID)
                        .append('svg').attrs({x: 10, y :10, width: GRIDWIDTH/2+15, height: GRIDHEIGHT/2+15,style:'padding:2px; margin:2px;'});    
                       
                        for (var i = 0; i < data.length; i++) {
                        createTilesDiv(svg, data[i]);
                        }
                       
                    }
                   
                }
              }
            }
           
           
        }
       
    }
    $('.screen').click(function(){
        var dID = $(this).attr('value');
        
        redirect(dID);
        });
        $('.audio').click(function(){
            var dID = $(this).attr('value');
            openAudioManager(dID);
        });

    $('.bactive').click(function(){
               
        const dId = $(this).attr('id');
        const zName =$(this).attr('value');
        const lName = $(this).attr('data');
       
        if(typeof dId !='undefined' && typeof zName !='undefined' && typeof lName !='undefined'){
            loadlayout(dId,zName,lName);
        }
    });
    $('.not-active').click(function(){    
        const dId = $(this).attr('id');
        const zName =$(this).attr('value');
        const lName = $(this).attr('data');
       
        if(typeof dId !='undefined' && typeof zName !='undefined' && typeof lName !='undefined'){
           loadlayout(dId,zName,lName);
        }
    });
}

           

function createTilesDiv(svg, data){
   
var videostrings = '';
   var lx = 0;
   var ly = 0;
   var sc = '';
   var aplabel='';
   var location ='';
   var size ='';
   var rowsCols ='';
   var colspan =0;
   var rowspan =0;
   var colgridwidth =  GRIDWIDTH/data.columns;
   var rowgridheight =  GRIDHEIGHT/data.rows;
    lx = data.applabel.rectanglePoint.x/colgridwidth;
    ly = data.applabel.rectanglePoint.y/rowgridheight;
    var drawx = data.applabel.location.x/2;
    var drawy = data.applabel.location.y/2;
    var drawwidth =data.applabel.size.width/2;
    var drawheight = data.applabel.size.height/2;
    sc = data.sourcename;
   
    var zn = data.zone;
    var  aplabel1 = data.applabel;
    applabel = JSON.stringify(aplabel1);
    var loc = data.location;
    location ='"location":'+JSON.stringify(loc);
    var siz = data.size;
    size ='"size":'+JSON.stringify(siz);
    var stype = data.type;
    colspan = data.colspan;
    rowspan = data.rowspan;
    var types = data.type;
   
    lx = lx + 1;
    ly = ly + 1;
    var rws = data.rows;
    var cls = data.columns;
    var rows =lx;
    var cols = ly;
    rowsCols = rows+'x'+cols;
    var id = data.id;
    var g = svg.append('g');
    var  rect =g.append('rect')
   .style("stroke-width", 1)
   .attrs({ x: drawx+2, y: drawy+2, width:drawwidth, height: drawheight, fill: 'white', stroke:'black',id:lx+","+ly, value:rowsCols,data:applabel+','+location+','+size,zone:zn,source:sc,layout:data.layoutname});
   
   var textdrawx = drawx+4;
   var textdrawy = drawy+20;

    switch(types){
        case 'Web':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);
        g.append('image')
        .attr('xlink:href','/resources/images/icons/web-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15);
       
        if(pro){
            g.append('text')
            .attr('width',16)
            .attr('height',16)
            .attr('x',textdrawx+100)
            .attr('y',textdrawy+75)
            .attr('zone',zn)
            .attr('id',id)
            .attr('layout',data.layoutname)
            .attr('source',sc)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout');
           
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
           
            });
        }
            break;
        case 'Video':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/video-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        
        if(pro){
        g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
         
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
           
        });
        }
            break;
        case 'Vnc':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/vnc-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');

        if(pro){
            g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
            
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;
        case 'Ticker':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/Ticker.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
            
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;
        case 'Rdp':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/rdp.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
        g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
          
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
           
        });
        }
            break;
        case 'Application':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/application-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
        g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
         
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;
        case 'Instrusion_Video':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/instrusion-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
            .attr('width',16)
            .attr('height',16)
            .attr('x',textdrawx+100)
            .attr('y',textdrawy+75)
            .attr('zone',zn)
            .attr('id',id)
            .attr('layout',data.layoutname)
            .attr('source',sc)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout');
                
                    if(confirm("Are sure want to display the "+source+" to full screen update")){
                        setFullScreen(id,zone,layout,source);
                    }
                
            });
        }
            break;  
        case 'Tour_Video':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/tour-video.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            
        g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
            
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;            
        case 'RssFeed':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/rssfeed.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
           
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
           
        });
        }
            break;
        case 'DigitalBoard':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/pad.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
            .attr('width',16)
            .attr('height',16)
            .attr('x',textdrawx+100)
            .attr('y',textdrawy+75)
            .attr('zone',zn)
            .attr('id',id)
            .attr('layout',data.layoutname)
            .attr('source',sc)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout');
              
                    if(confirm("Are sure want to display the "+source+" to full screen update")){
                        setFullScreen(id,zone,layout,source);
                    }
               
            });
        }
            break;
        case 'Canvas':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/canvas.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
      
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;      
        case 'ImageStore':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/imagestore.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            
        g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
       
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;        
        case 'VideoStore':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/videostore.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
        
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;    
        case 'HtmlTemplate':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/htmltemplate.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
            .attr('width',16)
            .attr('height',16)
            .attr('x',textdrawx+100)
            .attr('y',textdrawy+75)
            .attr('zone',zn)
            .attr('id',id)
            .attr('layout',data.layoutname)
            .attr('source',sc)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout');
            
                    if(confirm("Are sure want to display the "+source+" to full screen update")){
                        setFullScreen(id,zone,layout,source);
                    }
                
            });
        }
            break;
        case 'Digital Vnc':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/video-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
    
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
             break;  
        case 'Instant Share':
        g.append("text")
        .attr('x',textdrawx)
        .attr('y',textdrawy)
        .attr('font-size',10)
        .text(sc);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/video-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',textdrawx)
        .attr('y',textdrawy-15)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
        .attr('width',16)
        .attr('height',16)
        .attr('x',textdrawx+100)
        .attr('y',textdrawy+75)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout');
       
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
           
        });
        }
            break;                              
        default :
            infoAlert('No such source found!','alert');          
            break;

   }
   if(pro){
    if(types ==='Web'){
        g.append('text')
        .attr('x',drawx+14)
        .attr('y',drawy+30)
        .attr('font-size',12)
        .attr('data',applabel+','+location+','+size)
        .attr('value',rowsCols)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .text("o").on('click',function() {
         const orignalAppLabel = $(this).attr('data');
         const zone = $(this).attr('zone');
         const id = $(this).attr('id');
         const source = $(this).attr('source');
         const layout = $(this).attr('layout');
         const types = 'tiles';
         $('#indicateTable tbody tr').each(function(){
            $(this).remove();
         });
      
            openSetingsDailog(id,orignalAppLabel,zone,layout,source,types);
        
        });
    
        g.append('text')
        .attr('x',drawx+24)
        .attr('y',drawy+30)
        .attr('font-size',12)
        .attr('data',applabel+','+location+','+size)
        .attr('value',rowsCols)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .text("e").on('click',function() {
         var zone = $(this).attr('zone');
         var id = $(this).attr('id');
         var updateRowsCols = $(this).attr('value');
         var layout = $(this).attr('layout');
        
            tilesSourceUpdate(sourceListArray,updateRowsCols,zone,layout,id);
         
        });
    
        g.append('text')
        .attr('x',drawx+36)
        .attr('y',drawy+30)
        .attr('font-size',12)
        .attr('data',applabel+','+location+','+size)
        .attr('value',rowsCols)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .text("z").on('click',function() {
            
               var zone = $(this).attr('zone');
               var id = $(this).attr('id');
               var cords = $(this).attr('value');
               var source = $(this).attr('source');
               var layout = $(this).attr('layout');
          
                zoomLayout(id,zone,layout,cords,source);
              
        });
    
       }
       if(types ==='Video'){
        g.append('text')
        .attr('x',drawx+4)
        .attr('y',drawy+30)
        .attr('font-size',12)
        .attr('data',applabel+','+location+','+size)
        .attr('value',rowsCols)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .text("v").on('click',function() {
         
           var orignalAppLabel = $(this).attr('data');
           var zone = $(this).attr('zone');
           var id = $(this).attr('id');
           var source = $(this).attr('source');
           var layout = $(this).attr('layout');
           var types = 'tiles';
    
            getVideoEffectList(id,orignalAppLabel,zone,layout,source,types);
          
        });
       
        g.append('text')
        .attr('x',drawx+14)
        .attr('y',drawy+30)
        .attr('font-size',12)
        .attr('data',applabel+','+location+','+size)
        .attr('value',rowsCols)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .text("o").on('click',function() {
         const orignalAppLabel = $(this).attr('data');
         const zone = $(this).attr('zone');
         const id = $(this).attr('id');
         const source = $(this).attr('source');
         const rc = $(this).attr('value');
         const layout = $(this).attr('layout');
         const types = 'tiles';
         $('#indicateTable tbody tr').each(function(){
            $(this).remove();
         });
        
            openSetingsDailog(id,orignalAppLabel,zone,layout,source,types);
        
        });
    
        g.append('text')
        .attr('x',drawx+24)
        .attr('y',drawy+30)
        .attr('font-size',12)
        .attr('data',applabel+','+location+','+size)
        .attr('value',rowsCols)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .text("e").on('click',function() {
         var zone = $(this).attr('zone');
         var id = $(this).attr('id');
         var updateRowsCols = $(this).attr('value');
         var layout = $(this).attr('layout');
        
             tilesSourceUpdate(sourceListArray,updateRowsCols,zone,layout,id);
           
         
        });
    
        g.append('text')
        .attr('x',drawx+36)
        .attr('y',drawy+30)
        .attr('font-size',12)
        .attr('data',applabel+','+location+','+size)
        .attr('value',rowsCols)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .text("z").on('click',function() {
            
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var cords = $(this).attr('value');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout');
              
                    zoomVideoLayout(id,zone,layout,cords,source);
                
        });
    
       }else{
        g.append('text')
        .attr('x',drawx+14)
        .attr('y',drawy+30)
        .attr('data',applabel+','+location+','+size)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('font-size',12)
        .text("o").on('click',function() {
         const orignalAppLabel = $(this).attr('data');
         const zone = $(this).attr('zone');
         const id = $(this).attr('id');
         const source = $(this).attr('source');
         const layout = $(this).attr('layout');
         const types = 'tiles';
         $('#indicateTable tbody tr').each(function(){
            $(this).remove();
        });
      
                openSetingsDailog(id,orignalAppLabel,zone,layout,source,types);
            
        });
    
        g.append('text')
        .attr('x',drawx+24)
        .attr('y',drawy+30)
        .attr('data',applabel+','+location+','+size)
        .attr('value',rowsCols)
        .attr('zone',zn)
        .attr('id',id)
        .attr('layout',data.layoutname)
        .attr('source',sc)
        .attr('font-size',12)
        .text("e").on('click',function() {
            var updateRowsCols = $(this).attr('value');
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var layout = $(this).attr('layout');
       
                tilesSourceUpdate(sourceListArray,updateRowsCols,zone,layout,id);
            
        });
        
       }
   }
   
}

function getCoordinates(x,y,colspan,rowspan){
    var ordinates = [];
    for(var k=0 ;k < rowspan; k++){
        var yordinate = y+k;
        for(var j=0 ;j < colspan; j++){
            var xordinate = x+j;
            ordinates.push(xordinate+","+yordinate);
             
            }
    }
    return ordinates;
}

var ornament;
$('#cnfg').click(function(){
    $('#TilesModal').hide();
   
   const heights = $('#heights').val();
   const forg = $('#forgroundV').val();
   const backg = $('#backgroundV').val();
   var sourceN,displayCheck,borderCheck,blinkCheck;
   if($('#accept').is(':checked')){
       sourceN = true;
   }else{
       sourceN = false;
   }

   if($('#displaycheck').is(':checked')){
       displayCheck = true;
   }else{
       displayCheck = false;
   }

   if($('#displayBorder').is(':checked')){
       borderCheck = true;
   }else{
       borderCheck = false;
   }

   if($('#blink').is(':checked')){
       blinkCheck = true;
   
   }else{
       blinkCheck = false;
   }
   const blinkingTime = $('#duration').val();
   
  if(type1 ==='tiles'){
    const result =  appl1.split('}},',2);
    const locationsize =  result[1].split('},',2);
    const altervalue = locationsize[0]+'}';
    const locationvalue = altervalue.split(":{",2);
    const sizevalue = locationsize[1].split(":{",2);
    let tilesData ={"referenceapplicationlabel": JSON.parse(result[0]+'}}'),"location": JSON.parse('{'+locationvalue[1]), "size" : JSON.parse('{'+ sizevalue[1]),
   'ornament':{'foregroundcolor':forg,'backgroundcolor':backg,'isdisplayornament':displayCheck,'istoshowsourcename':sourceN,'displayfullborder':borderCheck,'isblink':blinkCheck,'blinkingtime':blinkingTime,'heightpercentage':heights,
   'staticornaments':staticArray}};
    console.log(JSON.stringify(tilesData))
   $.ajax({
       url:'/app/gui/'+disp1+'/'+zon1+'/'+lay1+'/source/design/update',
       "headers": {
           "accept": "application/json",
           "Access-Control-Allow-Origin": "*",
           "Authorization": "Basic"+authtoken
       },
       type:'POST',
       data:JSON.stringify(tilesData),
       contentType:'application/json',
       success:function(response){
            
           $('#TilesModal').modal('hide');
           infoAlert("<p>Ornament have been successfully configured!</p>", "success");
           loadlayout(disp1,zon1,lay1);
       },
       error:function(ers , status){
          infoAlert(status,'alert');
       }
   });
  }
  //alert(disp+' '+zon+' '+lay);
  if(type1 ==='notyles'){
     
   var jsonobj = JSON.parse(appl1);
   var text = jsonobj.text;
   const notylesData = {"rectangle":{"source":jsonobj.source,"text":text,
   "rectangle":{"x":parseInt(jsonobj.rectangle.x),"y":parseInt(jsonobj.rectangle.y),"width":parseInt(jsonobj.rectangle.width),"height":parseInt(jsonobj.rectangle.height)}},
   'ornament':{'foregroundcolor':forg,'backgroundcolor':backg,'isdisplayornament':displayCheck,'istoshowsourcename':sourceN,'displayfullborder':borderCheck,'isblink':blinkCheck,'blinkingtime':blinkingTime,'heightpercentage':heights,
   'staticornaments':staticArray}};
   console.log(JSON.stringify(notylesData));
  //alert(disp1)
   $.ajax({
       url:'/app/gui/'+disp1+'/'+zon1+'/'+lay1+'/source/design/update',
       "headers": {
           "accept": "application/json",
           "Access-Control-Allow-Origin": "*",
           "Authorization": "Basic"+authtoken
       },
       type:'POST',
       data:JSON.stringify(notylesData),
       contentType:'application/json',
       success:function(response){
           $('#TilesModal').modal('hide');
           infoAlert("<p>Ornament have been successfully configured!</p>", "success");
           loadlayout(disp1,zon1,lay1);
       },
       error:function(error , status){
          infoAlert(status,'alert');
          
       }
   });

  }
 
});

function openSetingsDailog(disp,appl,zon, lay, src,type) {
    appl1 = appl;
    disp1 = disp;
    lay1 = lay;
    zon1 = zon;
    type1 = type;
   
     getOrnamentslist(src,lay,appl);
     staticArray = [];
     $('#sourceName').html(src);
     $('#displayName').html(disp);
     
     $('#indicator').click(function(evt){
        resetForm();
        $('#Indicators').modal({
            refresh:true
        });
        $('.forground').val('#ffffff');
        evt.preventDefault();
     });
     $('#date').hide();
     $('#html').hide();
     $('#logo').hide();
     $('#type').change(function(){
        if($(this).val()=='logo'){
            $('#logo').show();
            $('#date').hide();
            $('#html').hide();
        }
        if($(this).val()=='date'){
            $('#date').show();
            $('#html').hide();
            $('#logo').hide();
        }
        if($(this).val()=='html'){
            $('#html').show();
            $('#date').hide();
            $('#logo').hide();
        }
    });
     $('#saveInd').click(function(evt){
        evt.preventDefault();
        const indForg = $('.forground').val();
        const indBackg = $('.background').val();
        const indType = $('#type').val();
        const indPath = $('#path').val();
        const indDateFormat = $('#date-format').val();
        const indHtmlString = $('#html-string').val();
        if($(this).text()=='Save'){
       
        if(indType ==''){
            $('#intype').html('Please select indicators type');
            $('#path').focus();
            return false;
        }else{
            $('#intype').html('');
        }        
       
        if(indType == 'logo'){
            ornament = {
                "type":indType,
                "bgcolor":indBackg,
                "fgcolor":indForg,
                "logopath":indPath,
                };
        }else if(indType == 'date'){
            ornament = {
                "type":indType,
                "bgcolor":indBackg,
                "fgcolor":indForg,
                "dateformat":indDateFormat,
                };
        }else if(indType == 'html'){
            ornament = {
                "type":indType,
                "bgcolor":indBackg,
                "fgcolor":indForg,
                "htmlstring":indHtmlString,
                };
        }
       
        var checkeddata = JSON.stringify(ornament).split(splitComma);
        var found = false;
        for(var value of staticArray){
            var newdata = JSON.stringify(value).split(splitComma);
             if(newdata[3] == checkeddata[3]){
                 found = true;
                infoAlert("<p>Data already exist!</p>", "alert");
                break;
            }
        }
        if(!found){
            staticArray.push(ornament);
            infoAlert("<p>Indicator added successfully!</p>", "success");
            $('#Indicators').modal('hide');
        }
       
        resetForm();
       
        populateTable(staticArray);
        //$('#Indicators').modal('hide');
   
        }else{
            if(indType ==''){
                $('#intype').html('Please select indicators type');
                $('#path').focus();
            }else{
                $('#intype').html('');
            }
           
            if(indType == 'logo'){
                ornament = {
                    "type":indType,
                    "bgcolor":indBackg,
                    "fgcolor":indForg,
                    "logopath":indPath,
                    };
            }else if(indType == 'date'){
                ornament = {
                    "type":indType,
                    "bgcolor":indBackg,
                    "fgcolor":indForg,
                    "dateformat":indDateFormat,
                    };
            }else if(indType == 'html'){
                ornament = {
                    "type":indType,
                    "bgcolor":indBackg,
                    "fgcolor":indForg,
                    "htmlstring":indHtmlString,
                    };
            }
            var editOrnament ;
           for(var value of tableRowsArray){
                editOrnament = value;
           }
           
            updateIndicator(staticArray,editOrnament,ornament);
            resetForm();
            $('#Indicators').modal('hide');
       
        }
       
     });
}

var splitComma = ',';
function updateIndicator(staticArray ,tableArray, updatedstatic){
    var updateFound = false;
    var tableString = JSON.stringify(tableArray).split(splitComma);
    for(var i=0; i<staticArray.length;i++){
        var staticstring = JSON.stringify(staticArray[i]);
        var staticstringarray = staticstring.split(splitComma);
        if(staticstringarray[3]==tableString[3]){
            updateFound = true;
            staticArray.splice(i,-1);
            staticArray[i] = updatedstatic;
            infoAlert("<p>Indicator updated successfully!</p>", "success");
            resetForm();
            populateTable(staticArray);
            $('#saveInd').text('Save');
            $('#type').attr('disabled',false);
            break;
        }
    }

    if(!updateFound){
        staticArray.push(updatedstatic);
    }
   
}

function populateTable(indData){
    resetForm();
    $('#indicateTable tbody tr').empty();
    var rowstr ='';
    for(var i=0; i<indData.length;i++){
        var type = indData[i].type;
        var fgcolor = indData[i].fgcolor;
        var bgcolor = indData[i].bgcolor;
        var logopath = indData[i].logopath;
        if(typeof logopath ==='undefined'){
            logopath = '';
        }
        var datefmt = indData[i].dateformat;
        if(typeof datefmt ==='undefined'){
            datefmt = '';
        }
        var htmlstr = indData[i].htmlstring;
       
        if(typeof htmlstr ==='undefined'){
            htmlstr = '';
        }
       
       
        rowstr +="<tr>"+
                    "<td>"+type+"</td>"+
                    "<td>"+fgcolor+"</td>"+
                    "<td>"+bgcolor+"</td>"+
                    "<td>"+logopath+"</td>"+
                    "<td>"+datefmt+"</td>"+
                    "<td>"+
                        "<textarea  rows='1' cols='6'>"+htmlstr+"</textarea>"+
                    "</td>"+
                    "<td class='btn-group'>"+
                        "<span class='btn btn-sm m-1 btn-primary fa fa-edit' onclick='editIndicate(this);'>"+"</span>"+
                        "<span class='btn btn-sm m-1 btn-danger fa fa-trash ml-1 justify-content-center' onclick='deleteIndicate(this);'>"+"</span>"+
                    "</td>"+
                "</tr>";
             
               
               
    }
     
    $('#indicateTable  tbody').append(rowstr);
   
   
}

function resetForm(){
        $('.forground').val('');
        $('.background').val('');
        $('#type').val('');
        $('#path').val('');
        $('#dateFormat').val('');
        $('#html').val('');

        $('#date').hide();
        $('#html').hide();
        $('#logo').hide();
}

function editIndicate(td){
    $('#Indicators').modal('show');
    $('#saveInd').text('Update');
   
    resetForm();
    var _rows = $(td).parents('tr');
    var _cols = _rows.children('td');
        $('#type').val($(_cols[0]).text()).attr('disabled',true);
        $('.forground').val($(_cols[1]).text());
        $('.background').val($(_cols[2]).text());
        $('#path').val($(_cols[3]).text());
        $('#date-format').val($(_cols[4]).text());
        $('#html-string').val($(_cols[5]).text());

        var type = $(_cols[0]).text();
        var forg = $(_cols[1]).text();
        var backg = $(_cols[2]).text();
        var path = $(_cols[3]).text();
        var date = $(_cols[4]).text();
        var html = $(_cols[5]).text();

        if(type == 'logo'){
            $('#logo').show();
            ornament = {
                "type":type,
                "bgcolor":backg,
                "fgcolor":forg,
                "logopath":path,
                };
        }else if(type == 'date'){
            $('#date').show();
            ornament = {
                "type":type,
                "bgcolor":backg,
                "fgcolor":forg,
                "dateformat":date,
                };
        }else if(type == 'html'){
            $('#html').show();
            ornament = {
                "type":type,
                "bgcolor":backg,
                "fgcolor":forg,
                "htmlstring":html,
                };
        }
        tableRowsArray.push(ornament);
}



function deleteIndicate(del){
    var _row = $(del).parents('tr');
    var cols = _row.children('td');
   
    if(confirm("Are you sure to delete this ornament ?")){
        var type = $(cols[0]).text();
        var forg = $(cols[1]).text();
        var backg = $(cols[2]).text();
        var path = $(cols[3]).text();
        var date = $(cols[4]).text();
        var html = $(cols[5]).text();

       
        if(type == 'logo'){

            ornament = {
                "type":type,
                "bgcolor":backg,
                "fgcolor":forg,
                "logopath":path,
                };
        }else if(type == 'date'){
            ornament = {
                "type":type,
                "bgcolor":backg,
                "fgcolor":forg,
                "dateformat":date,
                };
        }else if(type == 'html'){
            ornament = {
                "type":type,
                "bgcolor":backg,
                "fgcolor":forg,
                "htmlstring":html,
                };
        }
        var updateString = JSON.stringify(ornament).split(splitComma);
   
    for(var i=0; i<staticArray.length;i++){
        var staticstring = JSON.stringify(staticArray[i]);
        var staticstringarray = staticstring.split(splitComma);
       
        if(staticstringarray[3]==updateString[3]){
            updateFound = true;
            staticArray.splice(i,1);
           
            populateTable(staticArray);
            infoAlert("<p>Ornament have been successfully deleted!</p>", "alert");
            break;
        }
        ornamentReset();
        resetForm();
        $(_row).remove();
       
    }
   
       
    }
   
}




function getVideoEffectList(vdspId,vappl,vzon ,vlyout,source,type){
   
    $.ajax({
        url: listdisplays,
        "headers": {
            "accept": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic"+authtoken
        },
        type:'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success:function(response){
            var results = response.result;
           var newscope = JSON.parse(results);
            for(var display of newscope){
                for(var zone of display.zones){
                    for(var zonecordinate of zone.zonecoordinates){
                        for(var layout of zonecordinate.layouts){
                           var lyname = layout.name;
                           if(lyname == vlyout){
                            for(var ref of layout.references){
                                var sourceN = ref.source.name;
                               
                                if(sourceN == source){
                                   
                                    var videEffects = ref.videoeffects;
                                    if(typeof videEffects ==='undefined'){
                                        openVideoEffectsDialog(bright,contrast,hue,satrn,rotation,croppGmF,vappl,vdspId,vzon,vlyout,type);
                                    }else{
                                        var bright = videEffects.brightness;
                                        var contrast = videEffects.contrast;
                                        var hue = videEffects.hue;
                                        var satrn  = videEffects.saturation;
                                        var rotation = videEffects.rotation;
                                        var croppGmF = videEffects.cropGeometryFormat;
                                    openVideoEffectsDialog(bright,contrast,hue,satrn,rotation,croppGmF,vappl,vdspId,vzon,vlyout,type);
                                    }
                                    break;
                                }
                              }
                           
                           }
                         
                        }
                    }
                }
            }
        },
        error:function(ers , status){
            alert(status);
        }
    });
}

function openVideoEffectsDialog(brightnessData,contrastData,hueData,saturationData,rotationData,croppGmFData,applData,dispid,zone,lyout,type){
   
    if(typeof brightnessData === 'undefined'){
        brightnessData = -1;
    }
    if( typeof contrastData ==='undefined'){
        contrastData = -1;
    }
    if( typeof hueData ==='undefined'){
        hueData = 0;
    }
   
    if( typeof saturationData ==='undefined'){
        saturationData = -1;
    }
    if(typeof rotationData ==='undefined'){
        rotationData = 0;
    }
   
        var cWidth;
        var cHeight;
        var cx;
        var cy;


    if(typeof croppGmFData ==='undefined'){
        cWidth = 0;
        cHeight = 0;
        cx = 0;
        cy = 0;
    }else{
        var replaceData = croppGmFData.replace(/[/x+/]/g,',');
        var splitData = replaceData.split(splitComma);
         cWidth = splitData[0];
         cHeight = splitData[1];
         cx = splitData[2];
         cy = splitData[3];
       
       
    }
   
   
    Metro.dialog.create({
        title:'Video Effects Settings',
        content:"<div class='container' id='videoSettings'>"+
            "<div class='row border'>"+
                "<div class='col-md-10'>"+
                    "<label>Brightness"+"</label>"+
                    "<input type='range' id='brightness' min='-1' max='2' step='1' value='"+brightnessData+"' class='form-control d-100'>"+
                    '<span class="ml-3 float-left " data-toggle="tooltip" data-placement="bottom" title="Default">D</span>'+
                    '<span class="ml-3 pl-19 float-left" data-toggle="tooltip" data-placement="bottom" title="Low">0</span>'+
                    '<span class="ml-3 pl-19 float-left" data-toggle="tooltip" data-placement="bottom" title="Middle">1</span>'+
                    '<span class="mr-4 float-right" data-toggle="tooltip" data-placement="bottom" title="High">2</span>'+
                "</div>"+
                "<div class='col-md-2'>"+
                    "<label>"+"Apply</label>"+
                    "<i class='btn btn-info btn-md fa fa fa-arrow-right'>"+"</i>"+
                "</div>"+
            "</div>"+
            "<div class='row border'>"+
                "<div class='col-md-10'>"+
                    "<label>Contrast"+"</label>"+
                    "<input type='range' id='contrast' min='-1' max='2' step='1' value='"+contrastData+"' class='form-control d-100'>"+
                    '<span class="ml-3 float-left " data-toggle="tooltip" data-placement="bottom" title="Default">D</span>'+
                    '<span class="ml-3 pl-19 float-left" data-toggle="tooltip" data-placement="bottom" title="Low">0</span>'+
                    '<span class="ml-3 pl-19 float-left" data-toggle="tooltip" data-placement="bottom" title="Middle">1</span>'+
                    '<span class="mr-4 float-right" data-toggle="tooltip" data-placement="bottom" title="High">2</span>'+

                "</div>"+
                "<div class='col-md-2'>"+
                    "<label>"+"Apply</label>"+
                    "<i class='btn btn-info btn-md  fa fa-arrow-right'>"+"</i>"+
                "</div>"+
            "</div>"+
            "<div class='row border'>"+
                "<div class='col-md-10'>"+
                    "<label>Hue"+"</label>"+
                    "<input type='range' id='hue' min='0' max='360' step='36' value='"+hueData+"' class='form-control d-100'>"+
                    '<span class="ml-3 pl-1">0</span>'+
                    '<span class="ml-3 pl-2">1</span>'+
                    '<span class="ml-3 pl-2">2</span>'+
                    '<span class="ml-3 pl-2">3</span>'+
                    '<span class="ml-3 pl-2">4</span>'+
                    '<span class="ml-3 pl-2">5</span>'+
                    '<span class="ml-3 pl-2">6</span>'+
                    '<span class="ml-3 pl-2">7</span>'+
                    '<span class="ml-3 pl-2">8</span>'+
                    '<span class="ml-3 pl-2">9</span>'+
                    '<span class="ml-3 pl-2">10</span>'+
                "</div>"+
                "<div class='col-md-2'>"+
                    "<label>"+"Apply</label>"+
                    "<i class='btn btn-info btn-md fa fa fa-arrow-right'>"+"</i>"+
                "</div>"+
            "</div>"+
            "<div class='row border'>"+
                "<div class='col-md-10'>"+
                    "<label>Saturation"+"</label>"+
                    "<input type='range' id='saturation' min='-1' max='2' step='1' value='"+saturationData+"' class='form-control d-100'>"+
                    '<span class="ml-3 float-left " data-toggle="tooltip" data-placement="bottom" title="Default">D</span>'+
                    '<span class="ml-3 pl-19 float-left" data-toggle="tooltip" data-placement="bottom" title="Low">0</span>'+
                    '<span class="ml-3 pl-19 float-left" data-toggle="tooltip" data-placement="bottom" title="Middle">1</span>'+
                    '<span class="mr-4 float-right" data-toggle="tooltip" data-placement="bottom" title="High">2</span>'+

                "</div>"+
                "<div class='col-md-2'>"+
                    "<label>"+"Apply</label>"+
                    "<i class='btn btn-info btn-md fa fa fa-arrow-right'>"+"</i>"+
                "</div>"+
            "</div>"+
            "<div class='row border'>"+
                "<div class='col-md-10'>"+
                    "<h6>Rotation"+"</h6>"+
                    "<label>Angle<input type='number' id='rotation' value='"+rotationData+"' class='form-control d-100'></label>"+
                "</div>"+
                "<div class='col-md-2'>"+
                    "<label>"+"Apply</label><br/><br/>"+
                    "<i class='btn btn-info btn-md fa fa fa-arrow-right'>"+"</i>"+
                "</div>"+
            "</div>"+
            "<div class='row border'>"+
                "<div class='col-md-10 input-group'>"+
                    "<h6>Cropping"+"</h6>"+
                    "<label>Width<input type='number' id='width' min='0' value='"+cWidth+"' class='form-control w-75 '></label>"+
                    "<label>Height<input type='number' id='height' min='0' value='"+cHeight+"' class='form-control w-75 '></label>"+
                    "<label>X<input type='number'  id='x' min='0' value='"+cx+"' class='form-control w-75 '></label>"+
                    "<label>Y<input type='number' id='y' min='0' value='"+cy+"' class='form-control w-75 '></label>"+
                "</div>"+
                "<div class='col-md-2'>"+
                    "<label>"+"Apply</label><br/><br/>"+
                    "<i class='btn btn-info btn-md fa fa fa-arrow-right'>"+"</i>"+
                "</div>"+
            "</div>"+
        "</div>",
        closeButton:true,
        actions: [
            {
                caption: "Close",
                cls: "js-dialog-close",
                onclick: function(){
                    $(this).hide();
                }
            }
        ]
    });

    $('#videoSettings').find('div.row').each(function(index){
        var $row = $(this);
        $($row).find('div.col-md-2>i').click(function(){
                var effectData;
                var brightness = $('#brightness').val();
                var contrast = $('#contrast').val();
                var hue = $('#hue').val();
                var saturation = $('#saturation').val();
                var rotation = $('#rotation').val();
                var width = $('#width').val();
                var height = $('#height').val();
                var x = $('#x').val();
                var y = $('#y').val();
           
                if(brightness ==-1 ){
                    brightness = "null";
                } if(contrast ==-1){
                    contrast = 'null';
                } if(hue ==0){
                    hue = 'null';
                }if(saturation ==-1){
                    saturation = 'null';
                }if(rotation ==0){
                    rotation = 'null';
                }
                var cropped;
                if(width ==0 && height==0 && x==0 && y==0){
                   
                    cropped = 'null';
                }else{
                    cropped = width+'x'+height+'+'+x+'+'+y;
                }
               
                 
                if(index ==0){
                    var msg  = "The brightness has been configured!";
                    var alertT = 'success';
                    if(brightness ==-1){
                        brightness = 'null';
                        effectData = {
                            'brightness':brightness,
                            'contrast':parseInt(contrast),
                            'hue':parseInt(hue),
                            'saturation':parseInt(saturation),
                            'roatation':parseInt(rotation),
                            'cropGeometryFormat':cropped
                        }
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }else{
                       
                        effectData = {
                            'brightness':parseInt(brightness),
                            'contrast':parseInt(contrast),
                            'hue':parseInt(hue),
                            'saturation':parseInt(saturation),
                            'roatation':parseInt(rotation),
                            'cropGeometryFormat':cropped
                        }
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }
               
                }
                if(index ==1){
                    msg  = "The contrast has been configured!";
                    alertT = 'success';
                    if(contrast ==-1){
                        contrast = 'null';
                        effectData ={
                            'brightness':parseInt(brightness),
                            'contrast':contrast,
                            'hue':parseInt(hue),
                            'saturation':parseInt(saturation),
                            'rotation':parseInt(rotation),
                            'cropGeometryFormat':cropped
                        }
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }else{
                        effectData ={
                            'brightness':parseInt(brightness),
                            'contrast':parseInt(contrast),
                            'hue':parseInt(hue),
                            'saturation':parseInt(saturation),
                            'rotation':parseInt(rotation),
                            'cropGeometryFormat':cropped
                         }
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }
                }
                if(index ==2){
                    var msg  = "The Hue has been configured!";
                    var alertT = 'success';
                    if(hue ==-1){
                        hue = 'null';
                        effectData ={
                            'brightness':parseInt(brightness),
                            'contrast':parseInt(contrast),
                            'hue':hue,
                            'saturation':parseInt(saturation),
                            'roatation':parseInt(rotation),
                            'cropGeometryFormat':cropped
                        }
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }else{
                        effectData ={
                            'brightness':parseInt(brightness),
                            'contrast':parseInt(contrast),
                            'hue':parseInt(hue),
                            'saturation':parseInt(saturation),
                            'rotation':parseInt(rotation),
                            'cropGeometryFormat':cropped
                         }
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }
                }

                if(index ==3){
                    var msg  = "The Saturation has been configured!";
                    var alertT = 'success';
                    if(saturation ==-1){
                        saturation = 'null';
                        effectData ={
                            'brightness':parseInt(brightness),
                            'contrast':parseInt(contrast),
                            'hue':parseInt(hue),
                            'saturation':saturation,
                            'rotation':parseInt(rotation),
                            'cropGeometryFormat':cropped
                        }
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }else{
                        effectData ={
                            'brightness':parseInt(brightness),
                            'contrast':parseInt(contrast),
                            'hue':parseInt(hue),
                            'saturation':parseInt(saturation),
                            'rotation':parseInt(rotation),
                            'cropGeometryFormat':cropped
                         }
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }
                }

                if(index ==4){
                    var msg  = "The Rotation has been configured!";
                    var alertT = 'success';
                    if(rotation ==0){
                        rotation = 'null';
                        effectData ={
                            'brightness':parseInt(brightness),
                            'contrast':parseInt(contrast),
                            'hue':parseInt(hue),
                            'saturation':parseInt(saturation),
                            'rotation':rotation,
                            'cropGeometryFormat':cropped
                        }
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }else{
                        effectData ={
                            'brightness':parseInt(brightness),
                            'contrast':parseInt(contrast),
                            'hue':parseInt(hue),
                            'saturation':parseInt(saturation),
                            'rotation':parseInt(rotation),
                            'cropGeometryFormat':cropped
                         }
                       
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }
                }

                if(index ==5){
                    var msg  = "The croppGeometryFormat has been configured!";
                    var alertT = 'success';
                    if(cropped =='null'){
                        cropped = 'null';
                        effectData ={
                            'brightness':parseInt(brightness),
                            'contrast':parseInt(contrast),
                            'hue':parseInt(hue),
                            'saturation':parseInt(saturation),
                            'rotation':rotation,
                            'cropGeometryFormat':cropped
                        }
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }else{
                        effectData ={
                            'brightness':parseInt(brightness),
                            'contrast':parseInt(contrast),
                            'hue':parseInt(hue),
                            'saturation':parseInt(saturation),
                            'rotation':parseInt(rotation),
                            'cropGeometryFormat':cropped
                         }
                       
                        setVideoEffects(dispid,applData,zone,lyout,effectData,msg,alertT,type);
                    }
                }
        });
           
    });
}

function setVideoEffects(dispID,vappl,zone,layout,videData,message,alertType,type){
       
        if(type ==='notyles'){
            var jsonobj = JSON.parse(vappl);
           
            var data =  {"referenceapplicationlabel":{},"rectangle":{"source":jsonobj.source,
            "rectangle":{"x":jsonobj.rectangle.x,"y":jsonobj.rectangle.y,"width":jsonobj.rectangle.width,"height":jsonobj.rectangle.height},"text":jsonobj.text},'videoeffects':videData};
           
        $.ajax({
            url:'/app/gui/'+dispID+'/'+zone+'/'+layout+'/source/video/effects/update ',
            method:'POST',
            data:JSON.stringify(data),
            contentType:'application/json',
            success: function(response){
                infoAlert(message,alertType);
            },
            error: function(error,errormsg){
                infoAlert(message,alertType);  
            }
        });
        }
        if(type ==='tiles'){
        var result =  vappl.split('}},',2);
        
        var locationsize =  result[1].split('},',2);
        var altervalue = locationsize[0]+'}';
        var locationvalue = altervalue.split(":{",2);
        var sizevalue = locationsize[1].split(":{",2);
         var data ={"referenceapplicationlabel": JSON.parse(result[0]+'}}'),"location": JSON.parse('{'+locationvalue[1]), "size" : JSON.parse('{'+ sizevalue[1]),
        'videoeffects':videData};
        $.ajax({
            url:'/app/gui/'+dispID+'/'+zone+'/'+layout+'/source/video/effects/update ',
            method:'POST',
            data:JSON.stringify(data),
            contentType:'application/json',
            success: function(response){
                infoAlert(message,alertType);
               
            },
            error: function(error,errormsg){
               infoAlert("Something went wrong, please try again!",'alert');
            }
        });
        }
}

function infoAlert(message,type){
    Metro.dialog.create({
        content:message,
        closeButton:true,
        overlayColor:'#000000'
    });
}




function getOrnamentslist(source,lyout,appl){
   
    $.ajax({
        url:listdisplays,
        "headers": {
            "accept": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic"+authtoken
        },
        type:'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success:function(response){
            var results = response.result;
           var newscope = JSON.parse(results);
            for(var display of newscope){
                for(var zone of display.zones){
                   
                    for(var zonecordinate of zone.zonecoordinates){
                        for(var layout of zonecordinate.layouts){
                           var lyname = layout.name;
                           var rows = layout.rows;
                           var cols = layout.columns;
                           if(rows ==-1 && cols ==-1){
                                //ornamentReset();
                               noTilesOrnamentList(layout,source,lyout,appl);
                           }else{
                           
                            if(lyname == lyout){
                                //ornamentReset();
                                $('#TilesModal').modal({refresh:true});
                                for(var ref of layout.references){
                                    var sourceN = ref.applicationLabel.sourceName;
                                    var location = ref.applicationLabel.location;
                                    var siz = ref.applicationLabel.size;
                                    var appLabel = JSON.stringify(ref.applicationLabel);
                                    appLabel +=', "location:"'+JSON.stringify(location)+','+'"size:"'+JSON.stringify(siz);
                                    var splits = appl.split(splitComma);
                                   
                                    var xv = splits[1];
                                    var xy = splits[2];
                                    var x = xv.slice(16);
                                    var y = xy.slice(4,-1);
                                   
                                    if(location.x==x && location.y ==y){
                                       
                                    if(sourceN == source){
                                     
                                        var ornmt = ref.ornament;
                                        if(typeof ornmt !=='undefined'){
                                            const fground = ornmt.foregroundcolor;
                                            const bground = ornmt.backgroundcolor;
                                            $('#forgroundV').val(fground);
                                            $('#backgroundV').val(bground);
                                            var isDisplay = ornmt.isdisplayornament;
                                            var isshowSource = ornmt.istoshowsourcename;
                                            var displayborder = ornmt.displayfullborder;
                                            var isBlink = ornmt.isblink;
                                            var isBlinkTime = ornmt.blinkingtime;
                                            var isHeightsPer = ornmt.heightpercentage;
                                            var staticornaments = ornmt.staticornaments;
                                           
                                            if(isDisplay == true){
                                               
                                                $('#displaycheck').prop('checked',true);
                                                $('#heights').val(isHeightsPer);
                                            }
                                            if(isshowSource == true){
                                                $('#accept').prop('checked',true);
                                            }
                                            if(displayborder == true){
                                                $('#displayBorder').prop('checked',true);
                                            }
                                            if(isBlink == true){
                                                $('#blink').prop('checked',true);
                                                $('#duration').val(isBlinkTime);
                                            }
                                           
   
                                            for(var static of staticornaments){
                                                staticArray.push(static);
                                               populateTable(staticArray);
                                            }
                                           
                                        }
                                        break;
                                    }
                                }
                                  }
                                   
                               }
                             
                           }
                     
                        }
                    }
                }
            }
        },
        error:function(ers , status){
            alert(status);
        }
    });
}


function getNotilesLayout(layout,zones,displayid,lytname){
var uniquedisplayId = displayid.replace(/ /g,"-");
        var layoutNs = layout.name;
        var layoutN = layoutNs.replace(/ /g,'-');
        var ntZone = zones.replace(/ /g,'-');
        $('#layout'+uniquedisplayId+ntZone).append(
            '<div class="container-box m-1" id="box'+uniquedisplayId+layoutN+ '" name="' +zones+ '">' +
            '<div class="text-justify-content text-info border newlayout p-2" id="layout">' +layoutNs+
            '</div>'+
            '</div>'
        );

       
        var svg = d3.select('#box'+uniquedisplayId+layoutN)  
        //.append('svg')
        //.attrs({ width: GRIDWIDTH/2, height: GRIDHEIGHT/2,style:'padding:2px;fit-content:auto;'});
        .append('svg').attrs({x: 8, y :8, width: GRIDWIDTH/2+15, height: GRIDHEIGHT/2+15,style:'padding:2px; margin:2px;'});  
       
        for(var reference of layout.references){
            var sourceType = reference.source;
            var sourceN = sourceType.name;
            var types = sourceType.type;
           
            var rectangle = reference.rectangle;
            var text = rectangle.text;
            var replaceData = text.replace(/[/(/)]/g,',');
            var splitData = replaceData.split(splitComma);
           
            const oXvalue = rectangle.x;
            const oYvalue = rectangle.y;
            const oWvalue = rectangle.width;
            const oHvalue = rectangle.height;

            var rectAppl = '{"source":"'+sourceN+'","rectangle":{"x":'+oXvalue+',"y":'+oYvalue+',"width":'+oWvalue+',"height":'+oHvalue+'},"text":"'+text+'"}';
           
            const xValue = splitData[1]/2;
            const yValue = splitData[2]/2;
            const wValue = splitData[3]/2;
            const hValue = splitData[4]/2;
           
            const updateValue =oXvalue+'x'+oYvalue+'x'+oWvalue+'x'+oHvalue;
           
            const resolValue = splitData[5];

            var resolReplace = resolValue.replace(/[x]/g,',');
            var resolSplit = resolReplace.split(splitComma);
            var resolXSplited = resolSplit[0].slice(3);
            const reslX = resolXSplited/4;
            const resolY = resolSplit[1]/4;
           
           
           var g = svg.append('g');
            g.append('rect')
           .attrs({ x: xValue+2, y: yValue+2, width:wValue, height: hValue, fill: 'white', stroke:'black',id:rectAppl, name:sourceN,value:updateValue});
          
    switch(types){
        case 'Web':
        g.append("text")
        .attr('x',xValue+4)
        .attr('y',yValue+20)
        .attr('font-size',10)
        .text(sourceN);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/web-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+4)
        .attr('y',yValue+4)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+50)
            .attr('y',yValue+50)
            .attr('zone',zones)
            .attr('id',displayid)
            .attr('layout',layoutN)
            .attr('source',sourceN)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout').replace(/[-]/g,' ');
                
                    if(confirm("Are sure want to display the "+source+" to full screen update")){
                        setFullScreen(id,zone,layout,source);
                    }
            });
        }   
        break;

        case 'Video':
        g.append("text")
        .attr('x',xValue+4)
        .attr('y',yValue+20)
        .attr('font-size',10)
        .text(sourceN);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/video-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+4)
        .attr('y',yValue+4)
        .attr('onclick','test()');
        if(pro){
            g.append('text')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+50)
        .attr('y',yValue+50)
        .attr('zone',zones)
        .attr('id',displayid)
        .attr('layout',layoutN)
        .attr('source',sourceN)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout').replace(/[-]/g,' ');
            
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;

        case 'Vnc':
        g.append("text")
        .attr('x',xValue+4)
        .attr('y',yValue+20)
        .attr('font-size',10)
        .text(sourceN);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/vnc-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+4)
        .attr('y',yValue+4)
        .attr('onclick','test()');
        if(pro){
            
        g.append('text')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+50)
        .attr('y',yValue+50)
        .attr('zone',zones)
        .attr('id',displayid)
        .attr('layout',layoutN)
        .attr('source',sourceN)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout').replace(/[-]/g,' ');
          
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
           
        });
        }
            break;

        case 'Ticker':
        g.append("text")
        .attr('x',xValue+4)
        .attr('y',yValue+20)
        .attr('font-size',10)
        .text(sourceN);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/Ticker.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+4)
        .attr('y',yValue+4)
        .attr('onclick','test()');

        if(pro){
            g.append('text')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+50)
        .attr('y',yValue+50)
        .attr('zone',zones)
        .attr('id',displayid)
        .attr('layout',layoutN)
        .attr('source',sourceN)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout').replace(/[-]/g,' ');
           
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;

        case 'Rdp':
        g.append("text")
        .attr('x',xValue+4)
        .attr('y',yValue+20)
        .attr('font-size',10)
        .text(sourceN);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/rdp.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+4)
        .attr('y',yValue+4)
        .attr('onclick','test()');
        if(pro){
            
        g.append('text')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+50)
        .attr('y',yValue+50)
        .attr('zone',zones)
        .attr('id',displayid)
        .attr('layout',layoutN)
        .attr('source',sourceN)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout').replace(/[-]/g,' ');
        
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;

        case 'Application':
        g.append("text")
        .attr('x',xValue+4)
        .attr('y',yValue+20)
        .attr('font-size',10)
        .text(sourceN);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/application-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+4)
        .attr('y',yValue+4)
        .attr('onclick','test()');

        if(pro){
            g.append('text')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+50)
            .attr('y',yValue+50)
            .attr('zone',zones)
            .attr('id',displayid)
            .attr('layout',layoutN)
            .attr('source',sourceN)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout').replace(/[-]/g,' ');
        
                    if(confirm("Are sure want to display the "+source+" to full screen update")){
                        setFullScreen(id,zone,layout,source);
                    }
                
            });
        }
            break;

        case 'Instrusion_Video':
        g.append("text")
        .attr('x',xValue+4)
        .attr('y',yValue+20)
        .attr('font-size',10)
        .text(sourceN);

        g.append('image')
        .attr('xlink:href','/resources/images/icons/instrusion-source.png')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+4)
        .attr('y',yValue+4)
        .attr('onclick','test()');

        if(pro){
            g.append('text')
        .attr('width',10)
        .attr('height',10)
        .attr('x',xValue+50)
        .attr('y',yValue+50)
        .attr('zone',zones)
        .attr('id',displayid)
        .attr('layout',layoutN)
        .attr('source',sourceN)
        .attr('class','text-danger')
        .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout').replace(/[-]/g,' ');
      
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
        }
            break;  
        case 'Tour_Video':
            g.append("text")
            .attr('x',xValue+4)
            .attr('y',yValue+20)
            .attr('font-size',10)
            .text(sourceN);
           
            g.append('image')
            .attr('xlink:href','/resources/images/icons/tour-video.png')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+4)
            .attr('y',yValue+4)
            .attr('onclick','test()');

            if(pro){
                g.append('text')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+50)
            .attr('y',yValue+50)
            .attr('zone',zones)
            .attr('id',displayid)
            .attr('layout',layoutN)
            .attr('source',sourceN)
            .attr('class','text-danger')
            .text('f')
        .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout').replace(/[-]/g,' ');
      
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
           
        });
            }
                break;

            case 'RssFeed':
            g.append("text")
            .attr('x',xValue+4)
            .attr('y',yValue+20)
            .attr('font-size',10)
            .text(sourceN);

            g.append('image')
            .attr('xlink:href','/resources/images/icons/rssfeed.png')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+4)
            .attr('y',yValue+4)
            .attr('onclick','test()');

            if(pro){
                g.append('text')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+50)
            .attr('y',yValue+50)
            .attr('zone',zones)
            .attr('id',displayid)
            .attr('layout',layoutN)
            .attr('source',sourceN)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout').replace(/[-]/g,' ');
        
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
            }
                break;

            case 'DigitalBoard':
            g.append("text")
            .attr('x',xValue+4)
            .attr('y',yValue+20)
            .attr('font-size',10)
            .text(sourceN);

            g.append('image')
            .attr('xlink:href','/resources/images/icons/pad.png')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+4)
            .attr('y',yValue+4)
            .attr('onclick','test()');

            if(pro){
                g.append('text')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+50)
            .attr('y',yValue+50)
            .attr('zone',zones)
            .attr('id',displayid)
            .attr('layout',layoutN)
            .attr('source',sourceN)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout').replace(/[-]/g,' ');
     
                    if(confirm("Are sure want to display the "+source+" to full screen update")){
                        setFullScreen(id,zone,layout,source);
                    }
                
            });
            }
                break;

            case 'Canvas':
            g.append("text")
            .attr('x',xValue+4)
            .attr('y',yValue+20)
            .attr('font-size',10)
            .text(sourceN);

            g.append('image')
            .attr('xlink:href','/resources/images/icons/canvas.png')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+4)
            .attr('y',yValue+4)
            .attr('onclick','test()');

            if(pro){
            g.append('text')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+50)
            .attr('y',yValue+50)
            .attr('zone',zones)
            .attr('id',displayid)
            .attr('layout',layoutN)
            .attr('source',sourceN)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout').replace(/[-]/g,' ');
   
                    if(confirm("Are sure want to display the "+source+" to full screen update")){
                        setFullScreen(id,zone,layout,source);
                    }
                
            });
            }
                break;

            case 'ImageStore':
            g.append("text")
            .attr('x',xValue+4)
            .attr('y',yValue+20)
            .attr('font-size',10)
            .text(sourceN);

            g.append('image')
            .attr('xlink:href','/resources/images/icons/imagestore.png')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+4)
            .attr('y',yValue+4)
            .attr('onclick','test()');
            if(pro){
                g.append('text')
                .attr('width',10)
                .attr('height',10)
                .attr('x',xValue+50)
                .attr('y',yValue+50)
                .attr('zone',zones)
                .attr('id',displayid)
                .attr('layout',layoutN)
                .attr('source',sourceN)
                .attr('class','text-danger')
                .text('f')
                .on('click',function(){
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout').replace(/[-]/g,' ');
     
                    if(confirm("Are sure want to display the "+source+" to full screen update")){
                        setFullScreen(id,zone,layout,source);
                    }
                
            });
            }
            
                break;

            case 'VideoStore':
            g.append("text")
            .attr('x',xValue+4)
            .attr('y',yValue+20)
            .attr('font-size',10)
            .text(sourceN);

            g.append('image')
            .attr('xlink:href','/resources/images/icons/videostore.png')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+4)
            .attr('y',yValue+4)
            .attr('onclick','test()');
            if(pro){
                g.append('text')
                .attr('width',10)
                .attr('height',10)
                .attr('x',xValue+50)
                .attr('y',yValue+50)
                .attr('zone',zones)
                .attr('id',displayid)
                .attr('layout',layoutN)
                .attr('source',sourceN)
                .attr('class','text-danger')
                .text('f')
                .on('click',function(){
                var zone = $(this).attr('zone');
                var id = $(this).attr('id');
                var source = $(this).attr('source');
                var layout = $(this).attr('layout').replace(/[-]/g,' ');
      
                    if(confirm("Are sure want to display the "+source+" to full screen update")){
                        setFullScreen(id,zone,layout,source);
                    }
                
            });
            }
         
                break;

            case 'HtmlTemplate':
            g.append("text")
            .attr('x',xValue+4)
            .attr('y',yValue+20)
            .attr('font-size',10)
            .text(sourceN);

            g.append('image')
            .attr('xlink:href','/resources/images/icons/htmltemplate.png')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+4)
            .attr('y',yValue+4)
            .attr('onclick','test()');
            if(pro){
             g.append('text')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+50)
            .attr('y',yValue+50)
            .attr('zone',zones)
            .attr('id',displayid)
            .attr('layout',layoutN)
            .attr('source',sourceN)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout').replace(/[-]/g,' ');
           
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
        });
            }
            
                break;

            case 'Digital Vnc':
            g.append("text")
            .attr('x',xValue+4)
            .attr('y',yValue+20)
            .attr('font-size',10)
            .text(sourceN);

            g.append('image')
            .attr('xlink:href','/resources/images/icons/video-source.png')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+4)
            .attr('y',yValue+4)
            .attr('onclick','test()');
            if(pro){
                g.append('text')
                .attr('width',10)
                .attr('height',10)
                .attr('x',xValue+50)
                .attr('y',yValue+50)
                .attr('zone',zones)
                .attr('id',displayid)
                .attr('layout',layoutN)
                .attr('source',sourceN)
                .attr('class','text-danger')
                .text('f')
                .on('click',function(){
                    var zone = $(this).attr('zone');
                    var id = $(this).attr('id');
                    var source = $(this).attr('source');
                    var layout = $(this).attr('layout').replace(/[-]/g,' ');
                   
                        if(confirm("Are sure want to display the "+source+" to full screen update")){
                            setFullScreen(id,zone,layout,source);
                        }
                    
                });
            }
            
                break;

            case 'Instant Share':
            g.append("text")
            .attr('x',xValue+4)
            .attr('y',yValue+20)
            .attr('font-size',10)
            .text(sourceN);

            g.append('image')
            .attr('xlink:href','/resources/images/icons/video-source.png')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+4)
            .attr('y',yValue+4)
            .attr('onclick','test()');

            if(pro){
            g.append('text')
            .attr('width',10)
            .attr('height',10)
            .attr('x',xValue+50)
            .attr('y',yValue+50)
            .attr('zone',zones)
            .attr('id',displayid)
            .attr('layout',layoutN)
            .attr('source',sourceN)
            .attr('class','text-danger')
            .text('f')
            .on('click',function(){
            var zone = $(this).attr('zone');
            var id = $(this).attr('id');
            var source = $(this).attr('source');
            var layout = $(this).attr('layout').replace(/[-]/g,' ');
           
                if(confirm("Are sure want to display the "+source+" to full screen update")){
                    setFullScreen(id,zone,layout,source);
                }
            
            });
            }
                break;
            default:
                infoAlert('No found such source!','alert');
            break;                  
        }
    if(pro){
        if(types ==='Web'){
            g.append('text')
            .attr('x',xValue+14)
            .attr('y',yValue+30)
            .attr('font-size',12)
            .attr('data',rectAppl)
            .attr('id',displayid)
            .attr('value',updateValue)
            .attr('layout',layoutNs)
            .attr('source',sourceN)
            .text("o").on('click',function() {
               
                 var appl = $(this).attr('data');
                 var id = $(this).attr('id');
                 var layout = $(this).attr('layout');
                 var source = $(this).attr('source');
                 var types = 'notyles';
                 $('#indicateTable tbody tr').each(function(){
                    $(this).remove();
                 });
                    openSetingsDailog(id,appl,zones,layout,source,types);
             });
 
           
            g.append('text')
            .attr('x',xValue+24)
            .attr('y',yValue+30)
            .attr('font-size',12)
            .attr('id',rectAppl)
            .attr('value',updateValue)
            .attr('source',sourceN)
            .text("e").on('click',function() {
                 var updateData = $(this).attr('value');
                 
                    noTilesSourceUpdate(sourceListArray,updateData,zones,layoutNs,displayid);
             });  

             g.append('text')
            .attr('x',xValue+36)
            .attr('y',yValue+30)
            .attr('font-size',12)
            .attr('id',displayid)
            .attr('layout',layoutN)
            .attr('zone',zones)
            .attr('data',updateValue)
            .attr('source',sourceN)
            .text("z").on('click',function() {
                 var id = $(this).attr('id');
                 var zone = $(this).attr('zone');
                 var layout = $(this).attr('layout').replace(/[-]/g,' ');
                 var cords = $(this).attr('data');
                 var source = $(this).attr('source');
                 
                    zoomLayout(id,zone,layout,cords,source);
                 
             });  
 
           
           }
            
           if(types ==='Video'){
            g.append('text')
            .attr('x',xValue+4)
            .attr('y',yValue+30)
            .attr('id',rectAppl)
            .attr('value',updateValue)
            .attr('source',sourceN)
            .attr('font-size',12)
            .text("v").on('click',function() {
               var appl = $(this).attr('id');
               var source = $(this).attr('source');
               var types = 'notyles';
               
                getVideoEffectList(displayid,appl,zones,layoutNs,source,types);
               
            });

            g.append('text')
            .attr('x',xValue+14)
            .attr('y',yValue+30)
            .attr('font-size',12)
            .attr('data',rectAppl)
            .attr('id',displayid)
            .attr('value',updateValue)
            .attr('layout',layoutNs)
            .attr('source',sourceN)
            .text("o").on('click',function() {
               
                 var appl = $(this).attr('data');
                 var id = $(this).attr('id');
                 var layout = $(this).attr('layout');
                 var source = $(this).attr('source');
                 var types = 'notyles';
                 $('#indicateTable tbody tr').each(function(){
                    $(this).remove();
                 });
                 
                    openSetingsDailog(id,appl,zones,layout,source,types);
             });
 
           
            g.append('text')
            .attr('x',xValue+24)
            .attr('y',yValue+30)
            .attr('font-size',12)
            .attr('id',rectAppl)
            .attr('value',updateValue)
            .attr('source',sourceN)
            .text("e").on('click',function() {
                 var updateData = $(this).attr('value');
                
                    noTilesSourceUpdate(sourceListArray,updateData,zones,layoutNs,displayid);
                 
             });  
 
             g.append('text')
            .attr('x',xValue+36)
            .attr('y',yValue+30)
            .attr('font-size',12)
            .attr('id',displayid)
            .attr('layout',layoutN)
            .attr('zone',zones)
            .attr('data',updateValue)
            .attr('source',sourceN)
            .text("z").on('click',function() {
                 var id = $(this).attr('id');
                 var zone = $(this).attr('zone');
                 var layout = $(this).attr('layout').replace(/[-]/g,' ');
                
                 var cords = $(this).attr('data');
                 var source = $(this).attr('source');
             
                    zoomVideoLayout(id,zone,layout,cords,source);
                 
             });  
           
           }else{
            g.append('text')
            .attr('x',xValue+14)
            .attr('y',yValue+30)
            .attr('font-size',12)
            .attr('data',rectAppl)
            .attr('id',displayid)
            .attr('layout',layoutNs)
            .attr('value',updateValue)
            .attr('source',sourceN)
            .text("o").on('click',function() {
                 var appl = $(this).attr('data');
                 var id = $(this).attr('id');
                 var layout = $(this).attr('layout');
                 var source = $(this).attr('source');
                 var types = 'notyles';
                 $('#indicateTable tbody tr').each(function(){
                        $(this).remove();
                 });
                 
                 
                    openSetingsDailog(id,appl,zones,layout,source,types);
                 
             });
 
           
            g.append('text')
            .attr('x',xValue+24)
            .attr('y',yValue+30)
            .attr('font-size',12)
            .attr('id',rectAppl)
            .attr('value',updateValue)
            .attr('source',sourceN)
            .text("e").on('click',function() {
                 var updateData = $(this).attr('value');
                    noTilesSourceUpdate(sourceListArray,updateData,zones,layoutNs,displayid);
             });  
 
           }
    }
       
                     
    }
   
}

function noTilesOrnamentList(layout,sorc,lyout,appl){
   
    var layoutname = layout.name;
    if(layoutname == lyout){
        for(var ref of layout.references){
            var sources = ref.source;
            var sourcesN = sources.name;
           
           var rectangle = ref.rectangle;
           var text = rectangle.text;
           var replaceData = text.replace(/[/(/)]/g,',');
           var splitData = replaceData.split(splitComma);

           const oXvalue = rectangle.x;
           const oYvalue = rectangle.y;
           const oWvalue = rectangle.width;
           const oHvalue = rectangle.height;

           /*var rectAppl = '"rectangle":{"source":'+sourcesN+',"rectangle":{"x":'+oXvalue+',"y":'+oYvalue+',"width":'+oWvalue+',"height":'+oHvalue+'}},"location":{"x":'+oXvalue+',"y":'+oYvalue+'},"size":{"width":'+oWvalue+',"height":'+oHvalue+'}';
           /* var xv = splits[1];
            var xy = splits[2];
            var x = xv.slice(16);
            var y = xy.slice(4,-1);
           */
          $('#TilesModal').modal({refresh:true});
           
            if(sourcesN == sorc){
                var ornmt = ref.ornament;
               
               
                if(typeof ornmt !=='undefined'){
                   
                    var fground = ornmt.foregroundcolor;
                    var bground = ornmt.backgroundcolor;
                   
                    $('#forgroundV').val(fground);
                    $('#backgroundV').val(bground);
                    var isDisplay = ornmt.isdisplayornament;
                    var isshowSource = ornmt.istoshowsourcename;
                    var displayborder = ornmt.displayfullborder;
                    var isBlink = ornmt.isblink;
                    var isBlinkTime = ornmt.blinkingtime;
                    var isHeightsPer = ornmt.heightpercentage;
                    var staticornaments = ornmt.staticornaments;
                    //alert(fground+" "+bground+" "+isDisplay+" "+isshowSource+" "+displayborder+" "+isBlink+" "+isBlinkTime+" "+isHeightsPer);
                    if(isDisplay == true){
                        $('#displaycheck').prop('checked',true);
                        $('#heights').val(isHeightsPer);
                    }
                    if(isshowSource == true){
                        $('#accept').prop('checked',true);
                    }
                    if(displayborder == true){
                        $('#displayBorder').prop('checked',true);
                    }
                    if(isBlink == true){
                        $('#blink').prop('checked',true);
                        $('#duration').val(isBlinkTime);
                    }
                   
                    for(var static of staticornaments){
                        staticArray.push(static);
                       
                       populateTable(staticArray);
                    }
                }
                break;
            }
           
          }
           
       }
}

function noTilesSourceUpdate(sourceList,textData,zone,layout,displayid){
    
    var sourcelists='';
    for(var i=0; i<sourceList.length; i++){
        var sourcelist = sourceList[i];
        sourcelists += "<option value='"+sourcelist+"'>"+sourcelist+"</option>";
    }
    Metro.dialog.create({
        title:'Source Updates to Notiles',
        content:"<div class='container' id='sourceSettings'>"+
                    "<div class='row'>"+
                        "<label for='sourcelist'>Source List:"+"</label>"+
                        "<select id='noTilesSourceList' class='form-control'>"+
                            "<option value='' selected disabled>Select Source List"+"</option>"+
                            sourcelists+
                        "</select>"+
                    "</div>"+
                "</div>",
        closeButton:true,
        actions: [
            {
                caption: "Submit",
                    cls: "js-dialog-close",
                    onclick: function(){
                        $(this).hide();
                        var sourcelistname = $('#noTilesSourceList').val();
                        $.ajax({
                            url:'/app/gui/'+displayid+'/'+zone+'/'+layout+'/'+textData+'/'+sourcelistname+'/update',
                            method:'POST',
                            contentType:'application/json',
                            success: function(response){
                                infoAlert('No tile source have been updated successfully!','success');
                               
                            },
                            error: function(error,errormsg){
                               infoAlert("Something went worng, please try again!",'alert');
                            }
                        });
                    }
                },
           
            {
                caption: "Close",
                cls: "js-dialog-close",
                onclick: function(){
                    $(this).hide();
                }
               
            }
           
        ]
    });
}

function tilesSourceUpdate(sourceList, textData,zone,layout,displayid){
    var sourcelists='';
    for(var i=0; i<sourceList.length; i++){
        var sourcelist = sourceList[i];
        sourcelists += "<option value='"+sourcelist+"'>"+sourcelist+"</option>";
    }
    Metro.dialog.create({
        title:'Source Updates to Tiles',
        content:"<div class='container' id='sourceSettings'>"+
                    "<div class='row'>"+
                        "<label for='sourcelist'>Source List:"+"</label>"+
                        "<select id='tilesSourceList' class='form-control'>"+
                            "<option value='' selected disabled> Select Source List"+"</option>"+
                            sourcelists+
                        "</select>"+
                    "</div>"+
                "</div>",
        closeButton:true,
        actions: [
                {
                caption: "Submit",
                cls: "js-dialog-close",
                onclick: function(){
                    $(this).hide();
                    var sourcelistname = $('#tilesSourceList').val();
                    $.ajax({
                        url:'/app/gui/'+displayid+'/'+zone+'/'+layout+'/'+textData+'/'+sourcelistname+'/update',
                        method:'POST',
                        contentType:'application/json',
                        success: function(response){
                            infoAlert("Tile source have been updated.",'success');
                        },
                        error: function(error,errormsg){
                           infoAlert("Something went worng, please try again!",'alert');
                        }
                    });
                }
            },
            {
                caption: "Close",
                cls: "js-dialog-close",
                onclick: function(){
                    $(this).hide();
            }
        }
        ]
    });
}

function getSourceList(){
    $.ajax({
        url:listsources,
        "headers": {
            "accept": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic"+authtoken
        },
        type:'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success:function(response){
       
        var sources = response.result.split(',');
            sourceListArray =[];
            for(var source of sources){
            source = source.replaceAll('[', '');
            source = source.replaceAll(']', '');
            source = source.replaceAll('\"', '');
               
                sourceListArray.push(source);
            }
        },
        error:function(ers , status){
            alert(status);
        }
    });
}

function loadlayout(displayid,zone, layoutname){
var str = '/app/gui/'
+ displayid+'/'+zone+'/layout/'
+ layoutname + '/load';

    $.ajax({
        url:str,
        "headers": {
            "accept": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic"+authtoken
        },
        type:'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success:function(response){
        	console.log("successfully loaded " + layoutname+ " on display " + displayid);
        },
        error:function(ers , status){
           
        }
    });
}

function redirect(displayid) {
var host = displayid.split(/[ ]+/)[1];
window.open('http://'+host+':8070/', '_blank');
}

function openAudioManager(displayid) {
var host = displayid.split(/[ ]+/)[1];
window.open('https://'+host+':8998', '_blank');
//window.open('http://'+host+':8999/html/audio.html', '_blank');
}

function ornamentReset(){
    $("#form1").trigger("reset");
    $('#displaycheck').attr('checked',false);
    $('#heights').val('5');
    $('#forgroundV').attr('value','#ffffff');
    $('#backgroundV').attr('value','#000000');
    $('#accept').attr('checked',false);
    $('#displayBorder').attr('checked',false);
    $('#blink').attr('checked',false);
    $('#duration').val('10');

}

function hideSlider(token){
    var splitToken = token.replace(/[:]/g,',').split(',');
    var splitObject = splitToken[0];

    if(splitObject =='admin'){
        $('#slider').show();
    }else{
        $('#slider').hide();
    }
}

function setFullScreen(id,zone,layout,source){
   
    $.ajax({
        url:'/app/gui/'+id+'/'+zone+'/'+layout+'/'+source+'/update',
        type:'POST',
        contentType:'application/json',
        crossDomain:false,
        success:function(){
            Fnon.Hint.Success('Full Screen Updated!', {
                callback:function(){
                }
              });
        },
        error:function(){
            Fnon.Hint.Danger('Oops!, Something went wrong.', {
                callback:function(){
                }
              });
        }
    });
    
}

function zoomLayout(id,zone,layout,cords,source){
    
    Metro.dialog.create({
        title:'Zoom out to web layout',
        content:"<div class='row'>"+
            "<div class='col-md-3'>"+
                "<span class='btn btn-sm btn-light fa fa-minus decrease' onclick='decreaseOrder()'></span>"+
            "</div>"+
            "<div class='col-md-6'>"+
                "<span class='text-center pl-6 zoomValues'>"+zoomValues+"</span>"+"<span> %</span>"+
            "</div>"+
            "<div class='col-md-3'>"+    
            "<span class='btn btn-sm btn-light fa fa-plus increase' onclick='increaseOrder()'></span>"+
            "</div>"+
        "</div>",
        closeButton:true,
        actions: [
            {
                caption: "Apply",
                    cls: "js-dialog-close",
                    onclick: function(){
                        $(this).hide();
                      var  zoomValue = $('.zoomValues').text();
                       applyToZoom(id,zone,layout,cords,source,zoomValue);
                    }
                },
           
            {
                caption: "Close",
                cls: "js-dialog-close",
                onclick: function(){
                    $(this).hide();
                }
               
            }
           
        ]
    });
}

function zoomVideoLayout(id,zone,layout,cords,source){
    
    Metro.dialog.create({
        title:'Zoom out video layout',
        content:"<div class='row'>"+
            "<div class='col-md-3'>"+
                "<span class='btn btn-sm btn-light fa fa-minus descending' onclick='descendingOrder()'></span>"+
            "</div>"+
            "<div class='col-md-6'>"+
                "<span class='text-center pl-6 zoomValues' data="+videoData[1]+">"+zoomValues+"</span>"+"<span> %</span>"+
            "</div>"+
            "<div class='col-md-3'>"+    
            "<span class='btn btn-sm btn-light fa fa-plus ascending' onclick='ascendingOrder()'></span>"+
            "</div>"+
        "</div>",
        closeButton:true,
        actions: [
            {
                caption: "Apply",
                    cls: "js-dialog-close",
                    onclick: function(){
                        $(this).hide();
                      var  zoomValue = $('.zoomValues').attr('data');
                       applyToZoom(id,zone,layout,cords,source,zoomValue);
                    }
                },
           
            {
                caption: "Close",
                cls: "js-dialog-close",
                onclick: function(){
                    $(this).hide();
                }
               
            }
           
        ]
    });
}

var staticZoomData =[100,110,125,150,175,200,25,250,300,33,400,50,500,67,75,80,90];
var videoStaticZoomData = [50,100,150,200,250,300];
var videoData = [.5,1,1.5,2,2.5,3];
var zoomVideoData = videoStaticZoomData.sort(function(a,b){
    return a-b;
});

var zoomData = staticZoomData.sort(function(a,b){
    return a-b;
});
var i=6;
var j=i;
function increaseOrder(){
  if(zoomValues){
      i++;
      j=i;
      if(zoomData[i] == 500){
        $('.zoomValues').text(zoomData[j]);
        
      }else{
            $('.zoomValues').text(zoomData[i]);
            
      }
     
  }  
  
}

function decreaseOrder(){
    if(zoomValues){
        j--;
        i=j;
        if(zoomData[j] == 25){
            $('.zoomValues').text(zoomData[j]);
            
        }else{
            $('.zoomValues').text(zoomData[j]);
           
        }
        
    }
}

var vi=1;
var vj=vi+1;
function ascendingOrder(){
  if(zoomValues){
      vi++;
      vj=vi;
      if(zoomVideoData[vi] == 300){
        $('.zoomValues').text(zoomVideoData[vi]);
        $('.zoomValues').attr('data',videoData[vi]);
        
      }else{
            $('.zoomValues').text(zoomVideoData[vi]);
            $('.zoomValues').attr('data',videoData[vi]);
           
      }
      
  }  
  
}

function descendingOrder(){
    if(zoomValues){
        vj--;
        vi=vj;
        if(zoomVideoData[vj] == 50){
            $('.zoomValues').text(zoomVideoData[vj]);
            $('.zoomValues').attr('data',videoData[vj]);
            
           
        }else{
            $('.zoomValues').text(zoomVideoData[vj]);
            $('.zoomValues').attr('data',videoData[vj]);
           
        }
        
    }
}

function applyToZoom(id,zone,layout,cords,source,zoomV){
    
    $.ajax({
        url:'/app/gui/'+id+'/'+zone+'/'+layout+'/'+cords+'/'+source+'/zoom/'+zoomV+'',
        type:'POST',
        contentType:'application/json',
        crossDomain:false,
        success:function(s,x){
            Fnon.Hint.Success('Zoomed Out!', {
                callback:function(){
                    location.reload();
                }
              });
        },
        error:function(){
            Fnon.Hint.Danger('Oops!, Something went wrong.', {
                callback:function(){
                }
              });
        }
    });
}

function videoWallAssistant(){
    
        $('.circle-dot').click(function(){
            $('.video-wall-chat').show();
            $('.circle-dot').hide();
        });
    
        $('.minimize').click(function(){
            $('.video-wall-chat').hide();
            $('.circle-dot').show();
        });
    
    
}

function checkVersion(message){
    Fnon.Hint.Danger(message, {
        callback:function(){
        }
      });
}

function getLicenceStatus(){
    $.ajax({
        url:proLicence,
        headers:header,
        type:'GET',
        success:function(res){
            pro = res;
            if(!pro){
                $('#slider').hide();
            }
        },
        error:function(error,status){

        }
    });
}

function loadAgentMessage (asistent){
    
    if(asistent !==asistent){
        $('.wall-body').append(
            '<div class="row">' + '<div class="d-flex d-flex-row ">'
                    + '<div class="chat-panel-left">'
                    + getRandomAgentImage('static/avatars/')
                    + '</div>'
                    + '<div class="chat-bubble chat-bubble--left  ">'
                    + '<div class="">' + asistent + '</div>'
                    + '</div>' + '</div>' + '</div>');
            autoScrollBottom();  
    }else{
        $('.wall-body').append(
            '<div class="row">' + '<div class="d-flex d-flex-row ">'
                    + '<div class="chat-panel-left">'
                    + getRandomAgentImage('static/avatars/')
                    + '</div>'
                    + '<div class="chat-bubble chat-bubble--left  ">'
                    + '<div class="">' + asistent + '</div>'
                    + '</div>' + '</div>' + '</div>');
            autoScrollBottom();  
    }
          
}

function autoScrollBottom() {
	var chat = $('.wall-body');
	chat.stop().animate({
		scrollTop : 1000000
	}, 800);
}



function getCommands(botdata,ms){
    $.ajax({
        url:'/app/gui/bot/commands',
        headers:header,
        type:'POST',
        data:botdata,
        contentType:'application/json',
        success:function(){
            Fnon.Hint.Success(ms, {
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
}


