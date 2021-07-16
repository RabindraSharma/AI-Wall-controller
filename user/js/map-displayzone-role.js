$(function(){
	
	populate();
});

		
		/*-------------------fetching the data from server side of role records---------------------------*/
			$.ajax({
			url: '/app/gui/role/list',
			 "headers": header,
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
			url: '/app/gui/displayzones/list',
			 "headers":header,
	        type: "GET",
			crossDomain: true,
			dataType: "json",
			
	        success: function(data) {
				
                var obj=JSON.parse(data.result);
				//var sourcearray=obj.type;
				
				for(var i in obj)
				{	
					var source=obj[i];
					
					$("#displayzones").append('<option value="'+source+'">'+source+'</br>'+'</option>');
				}
				
				console.log(source);
			},
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('error while get');
				}
			});
    /*--------------------------End here---------------------------------------------------------------------------- */
			
    /*---------------------------updating data on server side instead of existing data------------------------------*/

			$('#btnDisplayZonesRole').click(function(){
				var role=$('#role').val();
				var displayzones=$('#displayzones').val();
				displayzones = displayzones.join(":,"); // there is a break after comma
				if(role ==null){
					$('#rerror').html(mappeddispRoleError).css('color','red');
					$('#role').focus();
					return false;
				}
				if(displayzones ==''){
					$('#rerror').html('');
					$('#derror').html(mappedToZoneError).css('color','red');
					$('#displayzones').focus();
					return false;
				}else{
					$('#derror').html('');
					$.ajax({
						contentType: "application/json",
						type: "POST",
						url: '/app/gui/role/'+role+'/displayzones/'+displayzones+'/update',
						success: function() {
							
							alert('Your record has been updated!');
							$('#displayzones-table tbody').html('');
							$('#role').attr('disabled',false);
							$("#displayzones").val('');
							$('#btnDisplayZonesRole').text('submit');
								populate();
							
						},
						error: function(jqXHR, textStatus, errorThrown)
						{
						console.log('error while post');
							
						}
							
						});  
				}
				
			});
    /*--------------------------End here---------------------------------------------------------------------------- */
			function populate(){
			$.ajax({
            url: '/app/gui/role/list',
            "headers":header,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function(data) {
                var obj=JSON.parse(data.result);
                var roleSourceRecords=obj.roleResources;
                for(var i in roleSourceRecords)
                {
                    var roleName=roleSourceRecords[i].role;
                    var displayzones=roleSourceRecords[i].displayzones;
					if(typeof displayzones ==='undefined'){
						displayzones = '';
					}
                    if(roleName!='ROLE_ADMIN'){
                    	$('#displayzones-table tbody').append('<tr>'+
    							'<td>'+roleName+'</td>'+
    							'<td>'+displayzones+'</td>'+
    							'<td>'+'<button id="edit" class="btn btn-primary btn-sm" onclick="displayzonesRoleEdit(this)">'+
    							'<i class="fa fa-edit"></i>'+
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
	
	function displayzonesRoleEdit(td){
	var _row = $(td).parents("tr");
    var cols =_row.children("td");
    $("#role").val($(cols[0]).text());
	$('#role').attr('disabled','disabled');
    var array = $(cols[1]).text().split(':,');
    $("#displayzones").val(array);
	$('#btnDisplayZonesRole').text('Update');
	
}
