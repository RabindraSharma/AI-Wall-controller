$(document).ready(function(){
        listOfGalleryItems();
    });

var gimage;
var originImg;
$('#createGallery').click(function(){
        resetGalleryForm();
        $('#galleryFiles').change(function(e){
            gimage  = URL.createObjectURL(e.target.files[0]);
            originImg = e.target.files[0];
            $('#viewGallery').attr('src',gimage);
        });
    $('#dialog').dialog({
        modal:true,
        width:350,
        height:'auto',
        title:'Create Gallery',
        buttons:{
            'Create Gallery':function(){
                    $(this).dialog('close');
                    saveGallery(originImg);
            },
            close:function(){
                $(this).dialog('close');
                listOfGalleryItems();
            }

        }
    });
    
});


function resetGalleryForm(){
    $('#gname').prop('disabled',false);
    $('#formGallery').trigger('reset');
}
function resetGalleryAdd(){
    $('#lname').val('');
    $('#galleryFiles').val('');
    $('#viewGallery').attr('src','');
}
function resetGalleryItems(){
    $('#lname').val('');
    $('#galleryFiles').val('');
    $('#viewGallery').attr('src','');
}


function saveGallery(gimg){
    var gname = $('#gname').val();
    var glabel = $('#lname').val();
    var formData = new FormData();
        formData.append('names',glabel);
        formData.append('files',gimg);
        
    $.ajax({
        url:'/app/gallery/'+gname+'/image/upload',
        method:'POST',
        data:formData,
        cache:false,
        processData:false,
        contentType:false,
        success:function(data){
           Fnon.Hint.Success("Gallery saved successfully", {
            callback:function(){
                listOfGalleryItems();
            }
          });
        },
        error:function(xmlerror, xmlStatus){
            console.log(xmlStatus);
        }
    });
}

function listOfGalleryItems(){
     galleryMapedList();
 }

var modal = document.getElementById("myModal");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

function openGalleryModal(path){
   
    modal.style.display = "block";
    modalImg.src = path.src;
    captionText.innerHTML = path.alt;
}
$('.close').click(function(){
    modal.style.display = 'none';
});
function addGalleryItems(data){
    var ordata = data.id;
    $('#gname').val(ordata).attr('disabled',true);
    resetGalleryAdd();
    $('#galleryFiles').change(function(e){
        gimage  = URL.createObjectURL(e.target.files[0]);
        originImg = e.target.files[0];
        $('#viewGallery').attr('src',gimage);
    });
    $('#dialog').dialog({
        modal:true,
        title:'Add Items',
        buttons:{
            'Add':function(){
                    $(this).dialog('close');
                    saveGallery(originImg);
            },
            close:function(){
                $(this).dialog('close');
            }

        }
    });
}
function editGalleryItems(data){
    var ordata = data.id;
    var d1 = ordata.split(',');
    resetGalleryItems();
    $('#gname').val(d1[1]).attr('disabled',true);
    $('#lname').val(d1[0]);
    $('#galleryFiles').attr('value',d1[0]);
    $('#galleryFiles').change(function(e){
        gimage  = URL.createObjectURL(e.target.files[0]);
        originImg = e.target.files[0];
        $('#viewGallery').attr('src',gimage);
    });
    $('#dialog').dialog({
        modal:true,
        title:'Update Gallery...',
        buttons:{
            'Update Gallery':function(){
                    $(this).dialog('close');
                    saveGallery(originImg);
            },
            close:function(){
                $(this).dialog('close');
            }

        }
    });
}

function deleteGalleryItems(item){
    var ordata = item.id;
    var d1 = ordata.split(',');
    var gname = d1[1];
    var gimage = d1[0];
    alert(gname);
    alert(gimage);
    CustomConfirm(function(confirmed,ele){
        if(confirmed){
            $.ajax({
                url:'/app/gallery/'+gname+'/image/'+gimage+'/delete',
                method:'POST',
                success:function(res){
                    Fnon.Hint.Success("Gallery items deleted!", {
                        callback:function(){
                            listOfGalleryItems();
                        }
                      });
                   
                },
                error:function(error,status){
                    alert(status);
                }
            }); 
        }
       
    });
    
}
function deleteGallery(gallery){
    var galName = gallery.id;
        CustomConfirm(function(confirmed,ele){
            if(confirmed){
                $.ajax({
                    url:'/app/gallery/'+galName.trim()+'/delete',
                    method:'POST',
                    success:function(res){
                        Fnon.Hint.Success("The gallery removed!", {
                            callback:function(){
                                listOfGalleryItems();
                            }
                          });
                    },
                    error:function(error,status){
                        Fnon.Hint.Danger("Something went wrong", {
                            callback:function(){
                                listOfGalleryItems();
                            }
                          });
                    }
                });   
            }
        });
}

function galleryMapedList(){
	alert("called");
    $('#galleryCol').empty();
    $.ajax({
        url:'/app/gallery/mapitems',
        method:'GET',
        success:function(res){
            var gallery ='';
            for(var im in res){
                    gallery +='<div class="col-md-6 pb-2">'+
                                '<div class="card">'+
                                    '<div class="card-header text-white bg-dark">'+
                                        '<span class="fa fa float-left">'+im+'</span>'+
                                        '<span class="fa fa-trash float-right p-2" id="'+im+'" onclick="deleteGallery(this)"></span>'+
                                        '<span class="btn btn-sm btn-primary  float-right position-top" id="'+im+'" onclick="addGalleryItems(this);">Add '+
                                            '<span class="fa fa-plus">'+'</span>'+
                                        '</span>'+
                                    '</div>'+
                                        '<div class="card-body">'+
                                            '<div class="row gCol" id="gCol'+im+'">';
                                            var imageArray = res[im]; 
                                            for(var i =0; i<imageArray.length;i++){
                                                var image = imageArray[i];
                                                gallery +='<div class="col-md-4">'+
                                                '<figure class="bg-dark rounded">'+
                                                '<figcaption class="text-white p-1">'+'</figcaption>'+
                                                    '<img src="/app/gallery/png/'+im+'/'+image+'" alt="'+image+'" class="rounded img-thumbnail" id="myImg" onclick="openGalleryModal(this)">'+
                                                    '<figcaption class="text-white p-1">'+
                                                        '<span class="fa fa-trash text-danger p-1 float-right position-top" id="'+image+','+im+'" onclick="deleteGalleryItems(this);"></span>'+
                                                        '<span class="fa fa-pencil text-info p-1 float-right position-top" id="'+image+','+im+'"  onclick="editGalleryItems(this);"></span>'+
                                                    '</figcaption>'+
                                                '</figure>'+
                                                '</div>'    
                                            }
                                            gallery+='</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'  
            }
           $('#galleryCol').append(gallery); 
        },
        error:function(error,status){
        }
    });
}