var staticArray = [];
var tableRowsArray = [];
var header =  {
    "accept": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Authorization": "Basic YWRtaW46V2VMY29tZQ=="
};
$(document).ready(function(){
    getDisplays();
    $('.close').click(function(){
        window.location.reload();
        
    });
    $('[data-toggle="tooltip"]').tooltip();
});
function getDisplays() {
    $.ajax({
        url: '/app/gui/displays/list',
        "headers":header,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            var originalData = response.result;
            scope = JSON.parse(originalData);
            
            mapedLayout();
        },
        error: function (error, sts) {
            alert(sts);
        }
    });
}


function mapedLayout() {
    var displayId;
    var map = new Map();
    for (var display of scope) {
         displayId = display.id;
        $('#display').append(displayId);
        for (var zone of display.zones) {
            for (var zonecoordinate of zone.zonecoordinates) {
                var zonname = zonecoordinate.name;
                var row = '<div class="row original">' +
                    '<div class="col-md-2 col-lg-2 col-sm-4 bg-white p-2">' +
                    '<div class="zone-box bg-light p-1 text-justify-content text-info m-0 text-mutted" id="' + zonecoordinate.name + '">' + displayId + '(' + zonecoordinate.name + ')' + '</div>' +
                    '</div>' +
                    '<div class="col-md-10 col-lg-10 col-sm-8 bg-white">' +
                    '<div class="container">' +
                    '<div class="row layout" id="layout' + zonecoordinate.name + '">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $('.source-l').append(row);
                for (var layout of zonecoordinate.layouts) {
                    var layoutname = layout.name;
                    var rows = layout.rows;
                    var cols = layout.columns;
                    var references = layout.references;
                    for (var reference of references) {
                        var sourcename = reference.source.name;
                        var applabel = reference.applicationLabel;
                        var location = reference.applicationLabel.location;
                        var size = reference.applicationLabel.size;
                        var x = applabel.rectanglePoint.x;
                        var y = applabel.rectanglePoint.y;
                        var data = {
                            'zone': zonname,
                            'applabel': applabel,
                            'location':location,
                            'size':size,
                            'sourcename': sourcename,
                            'x': x,
                            'y': y,
                            'rows': rows,
                            'columns': cols
                        };
                        if (zonname) {
                            if (map.has(layoutname)) {
                                map.get(layoutname).push(data);
                            } else {
                                var arr = [data];
                                map.set(layoutname, arr);
                            }
                        }

                    }
                }

            }

        }
    }

    var uniquemap = new Map();
    for (let key of map.keys()) {
        var data = map.get(key);

        console.log("-key is -" + key);
        var xarray = [];
        var yarray = [];
        var xuniquearray = [];
        var yuniquearray = [];
        for (var i = 0; i < data.length; i++) {
            console.log("-x is -" + data[i].x);
            console.log("-y is -" + data[i].y);
            xarray.push(data[i].x);
            yarray.push(data[i].y);
        }

        xuniquearray = xarray.filter((item, i, ar) => ar.indexOf(item) === i);
        yuniquearray = yarray.filter((item, i, ar) => ar.indexOf(item) === i);
        xuniquearray = xuniquearray.sort(function (a, b) {
            return a - b;
        });
        yuniquearray = yuniquearray.sort(function (a, b) {
            return a - b;
        });

        var xdiff, ydiff;
        if (xuniquearray.length > 1) {
            xdiff = xuniquearray[1] - xuniquearray[0];
        } else {
            xdiff = xuniquearray[0];
        }
        if (yuniquearray.length > 1) {
            ydiff = yuniquearray[1] - yuniquearray[0];
        } else {
            ydiff = yuniquearray[0];
        }
        console.log("-xdiff is -" + xdiff);
        console.log("-ydiff is -" + ydiff);
        var dataarray = [];
        for (var i = 0; i < data.length; i++) {
            console.log("--" + data[i].sourcename);
            console.log("-data[i].x/xdiff-" + data[i].x / xdiff);
            console.log("-data[i].y/ydiff-" + data[i].y / ydiff);
            var updateddata = {
                'zone': data[i].zone,
                'applabel': data[i].applabel,
                'location':data[i].location,
                'size':data[i].size,
                'sourcename': data[i].sourcename,
                'x': data[i].x / xdiff,
                'y': data[i].y / ydiff,
                'rows': data[i].rows,
                'columns': data[i].cols
            };
            dataarray.push(updateddata);
        }
        uniquemap.set(key, dataarray);
    }

    var bid = $('.layout').attr('id');
    //alert(bid);
    var strings = '';
    var lx = 0;
    var ly = 0;
    var sc = '';
    var aplabel='';
    var location ='';
    var size ='';
    for (let key of uniquemap.keys()) {
        strings = '';
        var data = uniquemap.get(key);
        //console.log("layout-key is -"+key);
        console.log("layout-key is -" + key);
        var s =0;
        for (var i = 0; i < data.length; i++) {
            lx = data[i].x;
            ly = data[i].y;
            s++;
            sc = data[i].sourcename;
            zn = data[i].zone;
            var  aplabel1 = data[i].applabel;
            applabel = JSON.stringify(aplabel1);
            var loc = data[i].location;
            location ='"location":'+JSON.stringify(loc);
            var siz = data[i].size;
            size ='"size":'+JSON.stringify(siz);
           
            if (Object.is(lx, NaN)) {
                console.log("yes nan");
                lx = 0;
            }
            if (Object.is(ly, NaN)) {
                ly = 0;
            }
            lx = lx + 1;
            ly = ly + 1;
            
            strings +=
                '<div class="col-' + ly + ' row-' + lx + ' text-dark bg-white " data-role="tile" data-size="small" data-effect="hover-zoom-left">' +
                '<div class="slide-front d-flex  flex-justify-center flex-align-center p-4 ">' + sc +
                    '<p class="d-none appl" id="'+sc+s+'" name="'+sc+'">'+applabel+','+location+','+size+'</p>'+
                '</div>' +
                '</div>'

        }

        $('#layout' + zn).append(
            '<div class="container-box m-1" id="box' + key + '" name="' +zn+ '">' +
            '<div class="text-justify-content text-info border newlayout p-2" id="layout">' + key + 
            '</div>' +
            '<div class="tiles-grid p-2 m-2">' +
            strings +
            '</div>' +
            '</div>');
    }

    $('.container-box').each(function () {
        var layout = $(this).find('div.newlayout').text();
        var zone = $(this).attr('name');
        $(this).find('div.tiles-grid').each(function () {
            $(this).find('div:last-child').click(function () {
                 var source = $(this).find('p').attr('name');
                 var sourceid = $(this).find('p').attr('id');
                 var orignalAppLabel = $(this).find('p#'+sourceid+'').text();
                openSetingsDailog(displayId,orignalAppLabel,zone, layout, source);
            });
        })
        
    })
}


var ornament;
$(document).ready(function () {
     checks = document.querySelector('#accept');
});
function openSetingsDailog(disp,appl,zon, lay, src) {
     var dialog = $('#TilesModal').modal('show');
     getOrnamentslist(src,lay,appl);
     $('#sourceName').html(src);
     $('#displayName').html(disp);
        
     $('#cnfg').click(function(){
        
        const heights = $('#heights').val();
        const forg = $('#forground').val();
        const backg = $('#background').val();
       
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
       
       
       var result =  appl.split('}},',2);
        var locationsize =  result[1].split('},',2);
        var altervalue = locationsize[0]+'}';
        var locationvalue = altervalue.split(":{",2);
        var sizevalue = locationsize[1].split(":{",2);
         var data ={"referenceapplicationlabel": JSON.parse(result[0]+'}}'),"location": JSON.parse('{'+locationvalue[1]), "size" : JSON.parse('{'+ sizevalue[1]),
        'ornament':{'foregroundcolor':forg,'backgroundcolor':backg,'isdisplayornament':displayCheck,'istoshowsourcename':sourceN,'displayfullborder':borderCheck,'isblink':blinkCheck,'blinkingtime':blinkingTime,'heightpercentage':heights,
        'staticornaments':staticArray}};
        console.log("layout>"+lay+"display"+disp+"zone"+zon+JSON.stringify(data));
        
        $.ajax({
            url:'/app/gui/'+disp+'/'+zon+'/'+lay+'/source/design/update',
            "headers":header,
            type:'POST',
            data:JSON.stringify(data),
            contentType:'application/json',
            success:function(response){
                $('#TilesModal').modal('hide');
                Metro.infobox.create("<p>Your tiles has been successfully configured!</p>", "success");
                setTimeout(function(){
                    window.location.reload();
                },5000);
            },
            error:function(ers , status){
                alert(status);
            }
        });


     });

     $('#indicator').on('click',function(evt){
        evt.preventDefault();
        $('#Indicators').modal('show');
        resetForm();
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
        const indForg = $('#forgroundInd').val();
        const indBackg = $('#backgroundInd').val();
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

        
    
           /* if(indPath ==''){
                $('#indPath').html('This field should not be blank');
                $('#path').focus();
                return false;
            }else{
                $('#indPath').html('');
            }*/
    
            /*if(indHtmlString ==''){
                
                $('#indHtml').html("This field should not be blank");
                $('#html-string').focus();
                
                return false;
            }else{
                $('#indHtml').html('');
            }*/
        
       
        
        
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
                Metro.infobox.create("<p>Already exist data !</p>", "alert");
                break;
            }
        }
        if(!found){
            staticArray.push(ornament);
            Metro.infobox.create("<p>device added!</p>", "success");
            $('#Indicators').modal('hide');
            resetForm();
            populateTable(staticArray);
        }
        if(found){
            $('#path').focus();
            $('#date-format').focus();
            $('#html-string').focus();
            return false;
        }
        
        
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
            Metro.infobox.create("<p>device updated!</p>", "success");
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
    $('#indicateTable > tbody tr').empty();
    var stringT ='';
    
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
       

        stringT +="<tr>"+
                    "<td>"+type+"</td>"+
                    "<td>"+fgcolor+"</td>"+
                    "<td>"+bgcolor+"</td>"+
                    "<td>"+logopath+"</td>"+
                    "<td>"+datefmt+"</td>"+
                    "<td>"+
                        "<textarea id='textID' rows='1' cols='6'>"+htmlstr+"</textarea>"+
                    "</td>"+
                    "<td class='btn-group'>"+
                        "<span class='btn btn-sm m-1 btn-primary fa fa-pencil' onclick='editIndicate(this);'>"+"</span>"+
                        "<span class='btn btn-sm m-1 btn-danger fa fa-trash ml-1 justify-content-center' onclick='deleteIndicate(this);'>"+"</span>"+
                    "</td>"+
                "</tr>";
    }

    $('#indicateTable > tbody').append(stringT);
}

function resetForm(){
    
        $('#forgroundInd').val('');
        $('#backgroundInd').val('');
        $('#type').val('');
        $('#path').val('');
        $('#date-format').val('');
        $('#html-string').val('');

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
        $('#forgroundInd').val($(_cols[1]).text());
        $('#backgroundInd').val($(_cols[2]).text());
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
            Metro.infobox.create("<p>Your device succesfully deleted!</p>", "alert");
            break;
        }
        resetForm();
        $(_row).remove();
        
    }
    
        
    }
    
}




function getOrnamentslist(source,lyout,appl){
    $.ajax({
        url:'/app/gui/users/displays/list',
        "headers":header,
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
                           if(lyname == lyout){
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
                                        var fground = ornmt.foregroundcolor;
                                        var bground = ornmt.backgroundcolor;
                                       
                                        $('#forground').val(fground);
                                        $('#background').val(bground);
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
        },
        error:function(ers , status){
            alert(status);
        }
    });
}

/*
window.onclick = hideContextMenu;
window.keyCode = listenKeys;
var contextmenu = document.getElementById("contextMenu");

window.addEventListener('contextmenu', function(event){
    event.preventDefault();
    contextmenu.style.left = event.clientX+"px";
    contextmenu.style.top = event.clientY+"px";
    contextmenu.style.display = "block";
});

function listenKeys(event){
    var keyCode = event.which || event.keyCode;
    if(keyCode == 13){
        hideContextMenu();
    }
}

function hideContextMenu(){
    contextmenu.style.display = "none";
}
*/
