$(function(){
	
	populate();
});

		
		/*-------------------fetching the data from server side of role records---------------------------*/
			$.ajax({
			url: '/app/gui/role/list',
			 "headers": {
              "accept": "application/json",
              "Access-Control-Allow-Origin":"*"
			},
	        
	        type: "GET",
			crossDomain: true,
			dataType: "json",
			
	        success: function(data) {
				
                var obj=JSON.parse(data.result);
				var rolearray=obj.roleResources;
				
				
				for(var i in rolearray)
				{	
					var role=rolearray[i].role;
					if(role!='ROLE_ADMIN')
					$("#role").append('<option value="'+role+'">'+role+'</br>'+'</option>');
				}
				
			},
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('error while get');
				}
			});
    /*--------------------------End here---------------------------------------------------------------------------- */
			
    /*------------------fetching the data from server side of source records-----------------------------------------*/
			$.ajax({
			url: '/app/gui/sources/list',
			 "headers": {
              "accept": "application/json",
              "Access-Control-Allow-Origin":"*"
			},
	        
	        type: "GET",
			crossDomain: true,
			dataType: "json",
			
	        success: function(data) {
				
                var obj=JSON.parse(data.result);
				//var sourcearray=obj.type;
				
				for(var i in obj)
				{	
					var source=obj[i].name;
					
					$("#source").append('<option value="'+source+'">'+source+'</br>'+'</option>');
				}
				
				console.log(source);
			},
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('error while get');
				}
			});
    /*--------------------------End here---------------------------------------------------------------------------- */
			
    /*---------------------------updating data on server side instead of existing data------------------------------*/

			$('#btnSourceRole').click(function(){
				var role=$('#role').val();
				var source=$('#source').val();
				source = source.join(":,"); // there is a break after comma
				$.ajax({
				contentType: "application/json",
				type: "POST",
				url: '/app/gui/role/'+role+'/sources/'+source+'/update',
				success: function() {
					
					alert('Your record has been updated!');
					$('#source-table tbody').html('');
						populate();
					
				},
				error: function(jqXHR, textStatus, errorThrown)
				{
				console.log('error while post');
					
				}
					
				});  
			});
    /*--------------------------End here---------------------------------------------------------------------------- */
			function populate(){
			$.ajax({
            url: '/app/gui/role/list',
            "headers": {
                "accept": "application/json",
                "Access-Control-Allow-Origin":"*"
            },
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function(data) {
                var obj=JSON.parse(data.result);
                var roleSourceRecords=obj.roleResources;
                for(var i in roleSourceRecords)
                {
                    var roleName=roleSourceRecords[i].role;
                    var sourceName=roleSourceRecords[i].sources;
                    if(roleName!='ROLE_ADMIN'){
                    	$('#source-table tbody').append('<tr>'+
    							'<td>'+roleName+'</td>'+
    							'<td>'+sourceName+'</td>'+
    							'<td>'+'<button id="edit" class="btn btn-primary" onclick="sourceRoleEdit(this)">'+
    							'<img src="resources/images/edit.png"/>'+
    							'</button>'+
    							'</td>'+
    							'</tr>');
                       	
                    }
                    
                }

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error while get');
            }
        });
	}
	
	function sourceRoleEdit(td){
	var _row = $(td).parents("tr");
    var cols =_row.children("td");
    $("#role").val($(cols[0]).text());
	$('#role').attr('disabled','disabled');
    var array = $(cols[1]).text().split(':,');
    $("#source").val(array);
	$('#btnSourceRole').text('Update');
	
}
