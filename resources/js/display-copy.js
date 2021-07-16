var produrl = '';
$(function(){
	$.ajax({
			url:produrl+'/app/gui/web/action/displays/list',
			 "headers":header,
	        type: "GET",
			crossDomain: true,
			dataType: "json",
	        success: function(data) {
				var displays = JSON.parse(data.result);
				var selectedList=[];
				var list;
				var display;
				var displayList ;
				$("#selectable-list option").each( function(){
				$(this).parentNode.removeChild(this);
				});
				for(var dis in displays){
					 display= displays[dis].id;
				displayList=$("#display-list").append('<option value="'+display+'">'+display+'</option>');
				}
				$(displayList).change(function(){
						var la =$(this).val();
						
						$('#selectable-list').empty();
						$.each($("#display-list option"),function(){
							
							var lists =$(this).val();
							list =lists.split(/\b(\s)/);
							
							if(list==la)
							{
								return ;
							}else{
								if(list !='')
								{	
									
										$('#selectable-list').append('<option value="'+list+'">'+list+'</option>');
								}
							}
							
							
						});
						
				});
				
			},
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('error while get');
			}
		});	
		
		$('#copyDisplay').click(function(){
			var selectedDisplay = $('#display-list').val();
			var selectedOption = $('#selectable-list').val();
			
			var data={"displays":selectedOption};
		$.ajax({
			type: "POST",
			data:JSON.stringify(data),
			url:produrl+'/app/gui/display/'+selectedDisplay+'/actions',
			contentType: "application/json",
			success: function(data) 
				{	
					alert("Your displays has been Copied!");
						$('#selectable-list').html('');
					
				},
				error: function(jqXHR, textStatus, errorThrown) 
				{
				console.log('error while post');
				
				}
		});
			
		});
		
			
});
