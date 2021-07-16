$(function(){
	populate();
});
	/*--------------------------- fetching the data from server side of user records--------------------------*/
            $.ajax({
			url: '/app/gui/user/list',
			 "headers": header,
	        type: "GET",
			crossDomain: true,
			dataType: "json",
			
	        success: function(data) {
				
                var obj=JSON.parse(data.result);
				var userarray=obj.userroles;
				
				
				for(var i in userarray)
				{	
					var user=userarray[i].user;
					if(user!='admin')
					$("#user").append('<option value="'+user+'">'+user+'</br>'+'</option>');
				}
				
			},
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('error while get');
				}
			});
     /*----------------------End here---------------------------------------------------------------------------- */


    /*---------------------fetching the data from server side of role records-------------------------------------*/
			$.ajax({
			 url:'/app/gui/role/list',
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
					
					$("#role").append('<option value="'+role+'">'+role+'</br>'+'</option>');
				}
				
			},
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('error while get');
				}
			});
    /*--------------------------End here---------------------------------------------------------------------------- */



    /*------------updating the data on server side of existing user and roles----------------------------------------*/
				$('#btnUserRole').click(function(){
				var user=$('#user').val();
				var role=$('#role').val();
				if(user ==null){
					$('#uerror').html('');
					$('#user').focus();
					$('#uerror').html(userError).css('color','red');
					return false;
				}
				 if(role ==''){
					$('#uerror').html('');
					$('#role').focus();
					$('#rerror').html(mapRoleError).css('color','red');
					return false;
				}else{
					$('#rerror').html('');
					
					if(user !=null && role !=''){
						$.ajax({
							contentType: "application/json",
							type: "POST",
							url: '/app/gui/user/'+user+'/role/'+role+'/update',
							success: function(data) {
									alert('User Roles Updated!');
									$('#user-role-table tbody').html('');
									$('#mapUserRole')[0].reset();
									$("#user").attr('disabled',false);
									$('#btnUserRole').text('submit');
									populate();
							},
							error: function(jqXHR, textStatus, errorThrown)
							{
							console.log('error while post');
								
							}
								
							});  
					}else{
						$('#uerror').html('');
						$('#role').focus();
						$('#rerror').html('User & Role Name Required').css('color','red');
						return false;
					}
					
				}
				
			});
    /*--------------------------End here---------------------------------------------------------------------------- */
			function populate(){
			$.ajax({
            url: '/app/gui/user/list',
            "headers": header,
            type: "GET",
            crossDomain: true,
            dataType: "json",

            success: function(data) {

                var obj=JSON.parse(data.result);
                var userRoleRecords=obj.userroles;

                for(var i in userRoleRecords)
                {
                    var userName=userRoleRecords[i].user;
					var roleName=userRoleRecords[i].roles;
					if(typeof roleName ==='undefined'){
						roleName ='';
					}
					if(userName!='admin')
                    $('#user-role-table tbody').append('<tr>'+
							'<td>'+userName+'</td>'+
							'<td>'+roleName+'</td>'+
							'<td>'+'<button id="edit" class="btn btn-primary btn-sm" onclick="userRoleEdit(this)">'+
							'<i class="fa fa-edit"></i>'+
							'</button>'+
							'</td>'+
							'</tr>');
                   
                }

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error while get');
            }
        });
	}

function userRoleEdit(td){
	var _row = $(td).parents("tr");
    var cols =_row.children("td");
    $("#user").val($(cols[0]).text());
	$("#user").attr('disabled','disabled');
    var array = $(cols[1]).text().split(',');
    $("#role").val(array);
	$('#btnUserRole').text('update');
	
}









































/*
//////----------------userAddToRole() function start here-----------------------------------//////////////////////////////
function userAddToRole() {
    var user = document.getElementById('user').value;
    $('#user-role-table tr').each(function(){
        $(this).find('td').each(function(){

            if($(this).html()== user){
                var row_index = $(this).parent().index('tr');
                alert("Your record has been updated!");
                document.getElementById('user-role-table').deleteRow(row_index);
                return;
            }
        })
    })

    var table = document.getElementById("user-role-table").getElementsByTagName('tbody')[0];
    var row = table.insertRow(table.length);
    var userCell = row.insertCell(0);
    userCell.innerHTML = user;

    var role = document.getElementById('role');

    var roleCell = row.insertCell(1);
    var roleValue = "";
    for (var i = 0; i < role.options.length; i++) {
        if (role.options[i].selected == true) {

            roleValue = roleValue + role.options[i].value + ",";

        }
        roleCell.innerHTML = roleValue;

    }
    var actionCell = row.insertCell(2);
    actionCell.innerHTML = '<button onclick="userRoleEdit(this)" id="edit">Edit</button>' +
        '<button onclick="userRoleDelete(this)" id="delete">Delete</button>';
}
//-------------userAddToRole() end here-------------------------//////////////////


///--------------Start to create userRoleDelete() function here--------------------////////////////
function userRoleDelete(td) {
    if (confirm("Are You sure to delete this record?")) ;
    var row = td.parentElement.parentElement;
    document.getElementById('user-role-table').deleteRow(row.rowIndex);

}

////--------------End here-------------------------------------------------------------/////////////////////

////---------------Start to create userRoleDelete() function here------------------------////////////////
function userRoleEdit(td) {

    var _row = $(td).parents("tr");
    var cols =_row.children("td");
    $("#role").val($(cols[0]).text());
    var array = $(cols[1]).text().split(',');
    $("#source").val(array);

}

////--------------End here-------------------------------------------------------------/////////////////////

*/
