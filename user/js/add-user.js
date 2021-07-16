	$(function(){
		populate();
	});	
		
    /*-----------------------------------Adding the user records on server side--------------------------------*/
	$('#btnAddUser').click(function()
    {	var selected=$("#btnAddUser");
		var username=$('#username').val();
		var password=$('#password').val();
		if(username ==''){
			$('#uerror').html(usernameError).css('color','red');
			$('#username').focus();
			return false;
		}else if(password ==''){
			$('#uerror').html('');
			$('#perror').html(passwordError).css('color','red');
			$('#password').focus();
			return false;

		}else{
			$('#perror').html('');
			if(username =='admin'){
				$('#adminError').html(adminError).css('color','red');
		}else{
			$('#adminError').html('');
			$.ajax({
				contentType: "application/json",
				type: "POST",
				url: '/app/gui/user/'+username+'/'+password+'/save',
				success: function(data) 
					{	if(selected.length==1)
						{
						alert("New User Records has been successfuly inserted!");
						$('#username').val('');
						$('#password').val('');
						$('#user-table tbody').html('');
						populate();
							selected.text("Submit");
							$('#username').attr('disabled',false);
							$("#password").val('').trigger("change");
						}
					
					},
					error: function(jqXHR, textStatus, errorThrown) 
					{
					console.log('error while post');
					}
			});		
		}
		}
		
			
    });
	
    /*--------------------------End here----------------------------------------------------------------------*/
	
	
	/*-----------------------------------Auto fetching the all existing records here--------------------------------*/
			function populate(){
			$.ajax({
            url: '/app/gui/user/list',
            "headers": header,
            type: "GET",
            crossDomain: true,
            dataType: "json",

            success: function(data) {
				
				
                var obj=JSON.parse(data.result);
                var userRecords=obj.userroles;

                for(var i in userRecords)
                {
                    var userName=userRecords[i].user;
					
                    var userPass=userRecords[i].password;
					
                    if(userName!='admin'){
                    	$('#user-table tbody').append('<tr>'+
    							'<td id="username">'+userName+'</td>'+
    							'<td class="hidetext" style="-webkit-text-security: disc;">'+userPass+'</td>'+
    							'<td>'+'<button id="edit" class="btn btn-primary btn-sm" onclick="userEdit(this)">'+
    							'<i class="fa fa-edit"></i>'+
    							'</button>   '+
    							'<button id="delete" class="btn btn-danger btn-sm" onclick="userDelete(this)">'+
    							'<i class="fa fa-trash"></i>'+
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
	/*--------------------------End here----------------------------------------------------------------------*/
	
	
	/*--------------------------Edit function ----------------------------------------------------------------------*/
function userEdit(td){
	
	var _row = $(td).parents("tr");
    var cols =_row.children("td");
    $("#username").val($(cols[0]).text());
	if($("#username").val($(cols[0]).text()) =='admin'){
		alert('Sorry!, You cant edit the admin password');
	}else{
		$('#username').attr('disabled','disabled');
		var array = $(cols[1]).text().split(',');
		$("#password").val(array);
		
		$('#btnAddUser').text('Update');
	}
	
}
	/*--------------------------End here----------------------------------------------------------------------*/
	
	
	
	/*--------------------------delete function here----------------------------------------------------------------------*/
function userDelete(td){
	if(confirm('Are You sure to delete this record?'))
	{
        var rows =td.parentElement.parentElement;
		//var username=$('#user-table tbody tr #username').html();
        var username= $.trim($(rows).find("#username").text());
		$.ajax({
			contentType: "application/json",
			type: "POST",
			url: '/app/gui/user/'+username+'/delete',
			success: function() {
					alert('Your record has been deleted!');
					document.getElementById('user-table').deleteRow(rows.rowIndex);
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				console.log('error while post');
					
			}
					
			}); 
	}    
}
	/*--------------------------End here----------------------------------------------------------------------*/































/*
//----------------------------------------------------------------------------
var formData={};
var selectedRow=null;
function addToUser() {
    var formData=readFormData();
    if(selectedRow ==null)
        insertNewRecord(formData);
    else
        updateRecord(formData);

    resetForm();
}
function readFormData() {


    formData['userName']=document.getElementById('username').value;
    formData['password']=document.getElementById('password').value;
    return formData;
}
function insertNewRecord(data) {
    var table=document.getElementById('user-table').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell2=newRow.insertCell(0);
    cell2.innerHTML = data.userName;
    cell3=newRow.insertCell(1);
    cell3.innerHTML = data.password;

    cell4 =newRow.insertCell(2);
    cell4.innerHTML='<button onclick="onEdit(this)" id="edit"><b>Edit</b></button>  ' +
        '   <button onclick="onDelete(this)" id="delete">Delete</button>';


}
function resetForm() {

    document.getElementById('username').value='';
    document.getElementById('password').value='';
    selectedRow=null;

}
function onEdit(td) {
    selectedRow=td.parentElement.parentElement;

    document.getElementById('username').value=selectedRow.cells[0].innerHTML;
    document.getElementById('password').value=selectedRow.cells[1].innerHTML;

}
function updateRecord(formData) {
    alert('Your record has been updated!');

    selectedRow.cells[0].innerHTML=formData.userName;
    selectedRow.cells[1].innerHTML=formData.password;

}

function onDelete(td) {
    if(confirm('Are you sure to delete this record?')){
        var row =td.parentElement.parentElement;
        document.getElementById('user-table').deleteRow(row.rowIndex);
        resetForm();
    }
}
*/
