var resData;
$(document).ready(function(){
    listOfFaceSource();
    populategalleryMapped();
});

$('#createSource').click(function(){
        resetSourceForm();
        var seletedImage;
    $('#items').change(function(){
        seletedImage = $(this).val();
    });
    $('#dialog').dialog({
        modal:true,
        width:350,
        height:400,
        title:'Create Source',
        buttons:{
            'Create Source':function(){
                    $(this).dialog('close');
                    var name = $('#name').val();
                    var url = $('#url').val();
                    var stype = $('#sourcetype').val(); 
                    var interval = $('#interval').val();
                    var created = 'Source created successfully!';
                    var sourceData = {
                        'name':name,
                        'url':url,
                        'sourcetype':stype,
                        'imagenames':JSON.stringify(seletedImage),
                        'timeinterval':interval
                    };
                    
                    savefaceSource(sourceData,created);
            },
            close:function(){
                $(this).dialog('close');
                location.reload();
            }
        }
    });
});

function savefaceSource(data,msg){
    $.ajax({
        url:'/app/facerecognition/source/create',
        type:'POST',
        crossData:false,
        contentType:'application/json',
        data:JSON.stringify(data),
        success:function(resp){
            Fnon.Hint.Success(msg, {
                callback:function(){
                    location.reload();
                }
              });
        },
        error:function(err,status){
            Fnon.Hint.Danger("Something went wrong", {
                callback:function(){
                    location.reload();
                }
              });
        
        }
    });
}

function resetSourceForm(){
    $('#formFaceSource').trigger('reset');
}

function populategalleryMapped(){
    $.ajax({
        url:'/app/gallery/mapitems',
        method:'GET',
        success:function(res){
            resData = res;
            var gallery = '';
            var galleryList;
            for(var gal in res){
                gallery += '<option value="'+gal+'">'+
                                gal+
                            '</option>'; 
                galleryList = res[gal];                     
            }
            
            $('#gallery').append(gallery);
            
            $('#gallery').change(function(){
                var gvalue = $(this).val();
                
             mappedGalleryToItems(res,gvalue);
            });
        },
        error:function(error,status){
            alert(status);
        }
    });
}

function mappedGalleryToItems(resp,gallery){
    $('#items').empty();
    for(var gal in gallery){
        for(var g in resp){
            if(g==gallery[gal]){
                var imageArray = resp[gallery[gal]];
                for(var i=0; i<imageArray.length;i++){
                     $('#items').append('<option value="'+g+'/'+imageArray[i]+'">'+imageArray[i]+'</option>');
                }
                break;
             }
        }
    }
}

function listOfFaceSource(){
    $.ajax({
        url:'/app/facerecognition/source/list',
        method:'GET',
        success:function(res){
           var srcRows =''; 
           var index=0;
           var parsedObject = JSON.parse(res);
           for(var object of parsedObject){
               let name = object.name;
               let url = object.url;
               let sourcet = object.sourcetype;
               let imgnames = object.imagenames;
               var sdata;
               if(typeof imgnames !=='undefined'){
                sdata = imgnames.replace(/[\'[\]"]/gi,'');
               }
                
               let intv = object.timeinterval;
               index++;
               srcRows +='<tr>'+
                            '<td>'+index+'</td>'+
                            '<td>'+name+'</td>'+
                            '<td>'+url+'</td>'+
                            '<td>'+sourcet+'</td>'+
                            '<td>'+sdata+'</td>'+
                            '<td>'+intv+'</td>'+
                            '<td>'+
                                '<span class="btn btn-sm btn-info fa fa-pencil col-sm-3" onclick="editFaceSource(this);">'+'</span>'+
                                '<span class="btn btn-sm btn-danger fa fa-trash col-sm-3 m-1" onclick="deleteFaceSource(this);">'+'</span>'+
                            '</td>'+
                         '</tr>'  
           }
           $('#faceTbody').append(srcRows);
        },
        error:function(error,status){
           console.log('no found data');
        }
    });
}

function editFaceSource(td){
    resetSourceForm();
    var _rows = $(td).parents('tr');
    var _cols = _rows.children('td');
    $('#name').val($(_cols[1]).text()).prop('disabled',true);
    $('#url').val($(_cols[2]).text());
    $('#sourcetype').val($(_cols[3]).text());
    var editGallery = $(_cols[4]).text();
      var gtype = editGallery.replace('/',',');
      var splitg= editGallery.split(',');
      var gallr =[];
      $.each(splitg,function(index,gal){
        var sglar = gal.replace('/',',').split(',')[0];
        
        $("#gallery option[value='" + sglar + "']").prop("selected", true);
        gallr.push(sglar);
      });
      $('#items').empty();
      const uniqueGNames = [... new Set(gallr)];
      editedGalValueMapped(uniqueGNames);
      
      
        var eimages = editGallery.split(',');
       
        $.each(eimages,function(index,el){
            var splor = el.replace('/',',').split(',')[1];
            $("#items option[value='" + el + "']").prop("selected", true);

        });
    var selected;
    $('#items').change(function(){
        selected = $(this).val();
    });
    $('#interval').val($(_cols[5]).text());
      
    $('#dialog').dialog({
        modal:true,
        width:325,
        height:325,
        title:'Update Source',
        close:function(){
            location.reload();
        },
        buttons:{
            'Update Source':function(){
                var name = $('#name').val();
                var url = $('#url').val();
                var stype = $('#sourcetype').val(); 
                var interval = $('#interval').val();
                var updated = 'Source updated successfully!';
                var sourceData = {
                    'name':name,
                    'url':url,
                    'sourcetype':stype,
                    'imagenames':JSON.stringify(selected),
                    'timeinterval':interval
                };
                
                savefaceSource(sourceData,updated);
                
            },
            close:function(){
                $(this).dialog('close');
            }
        }
    });
}

function editedGalValueMapped(gal){
    mappedGalleryToItems(resData,gal);
}

function deleteFaceSource(data){
    var _rows = $(data).parents('tr');
    var _cols = _rows.children('td');
    var sourceName = $(_cols[1]).text();
    CustomConfirm(function(confirmed,ele){
        if(confirmed){
            $.ajax({
                url:'/app/facerecognition/source/'+sourceName+'/delete',
                type:'GET',
                success:function(){
                    Fnon.Hint.Success("Successfully deleted!", {
                        callback:function(){
                            location.reload();
                        }
                      });
                },
                error:function(err,status){
                    Fnon.Hint.Danger("oops, something went wrong!", {
                        callback:function(){
                            location.reload();
                        }
                      });
                }
            });
        }
    });
   
}
