var signleArray =[

    {
        'name':'s1',
        'status':true,
        'icons':'resources/images/icons/connected.png',
        'message':'s1 Plugged In'
    },
    {
        'name':'s2',
        'status':true,
        'icons':'resources/images/icons/connected.png',
        'message':'s2 Plugged In'
    },
    {
        'name':'s3',
        'status':false,
        'icons':'resources/images/icons/disconnected.png',
        'message':'s3 Not Plugged In'
    },
    {
        'name':'s4',
        'status':true,
        'icons':'resources/images/icons/connected.png',
        'message':'s4 Plugged In'
    },
    {
        'name':'s5',
        'status':false,
        'icons':'resources/images/icons/disconnected.png',
        'message':'s5 Not Plugged In'
    }
];

$(document).ready(function(){
    var signleDiv ='';
    for(sr of signleArray){
        var status = sr.status;
        var name;
        var icon;
        var msg;
        if(status ==true){
            icon = sr.icons;
            name = sr.name;
            msg = sr.message;
            signleDiv = "<div class='col-md-3 border'>"+
                            "<h6 class='float-right text-info'>"+name+"</h6>"+
                            "<img src="+icon+" class='img p-2'>"+"</img><br>"+
                            "<small>"+
                                "<i class='text-success'>"+msg+"</i>"+
                            "</small>"+
                      "</div>";  
        }else{
            icon = sr.icons;
            name = sr.name;
            msg = sr.message;
            signleDiv = "<div class='col-md-3 border'>"+
                            "<h6 class='float-right text-info'>"+name+"</h6>"+
                            "<img src="+icon+" class='img p-2'>"+"</img><br>"+
                            "<small>"+
                                "<i class='text-warning'>"+msg+"</i>"+
                            "</small>"+
                      "</div>";  
        }
        $('#signle-row').append(signleDiv);
    }
});