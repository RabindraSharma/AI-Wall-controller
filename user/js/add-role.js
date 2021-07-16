$(function(){
	
	populate();
	});
    /*-----------------------------------Adding the role records on server side--------------------------------*/

		
		$('#btnAddRole').click(function(){

			if($('#role').val()==''){
				$('#error').html(roleError).css('color','red');
				$('#role').focus();
				return false;
			}else{
				$('#error').html('');
			var rolename = $('#role').val();
			$.ajax({
				contentType: "application/json",
				type: "POST",
				url: '/app/gui/role/'+rolename+'/save',
				success: function(data) {
						alert("Your record has been successfuly inserted!");
						$('#role').val('');
						$('#role-table tbody').html('');
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
	
	
	
	
	/*-----------------------------------fetcheing the existing role records from server side--------------------------------*/
		function populate(){
			$.ajax({
            url: '/app/gui/role/list',
            "headers": header,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function(data) {
                var obj=JSON.parse(data.result);
                var roleRecords=obj.roleResources;

                for(var i in roleRecords)
                {
                    var roleName=roleRecords[i].role; 
                    if(roleName!='ROLE_ADMIN'){
                    	  $('#role-table tbody').append('<tr>'+
      							'<td id="rolename">'+roleName+'</td>'+
      							'<td>'+'<button id="edit" class="btn btn-primary btn-sm" onclick="editRole(this)">'+
      							'<i class="fa fa-edit"></i>'+
      							'</button>   '+
      							'<button id="delete" class="btn btn-danger btn-sm" onclick="deleteRole(this)">'+
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

		
	/*--------------------------End here---------------------------------------------------------------------------- */	
		
	/*--------------------------deleteRole() function here---------------------------------------------------------------------------- */
	function deleteRole(td){
	if(confirm('Are You sure to delete this record?'))
	{
        var rows =td.parentElement.parentElement;
		//var rolename=$('#role-table tbody tr td').html();
        var rolename= $.trim($(rows).find("#rolename").text());
        $.ajax({
			contentType: "application/json",
			type: "POST",
			url: '/app/gui/role/'+rolename+'/delete',
			success: function() {
				alert('Your record has been deleted!');
				document.getElementById('role-table').deleteRow(rows.rowIndex);
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
			console.log('error while post');
				
			}	
			});
	}
		
	}
	/*--------------------------End here---------------------------------------------------------------------------- */
	
	
	
	/*--------------------------editRole() function here---------------------------------------------------------------*/
	function editRole(td) {
    selectedRows=td.parentElement.parentElement
            document.getElementById('role').value=selectedRows.cells[0].innerHTML;

	}
	/*--------------------------End here---------------------------------------------------------------------------- */





































/*
///--------------------------------
var formsData={};
var selectedRows=null;
function addRole() {
        var formData=readFormData();
        if(selectedRows==null)
            insertNewRoleRecord(formData);
        else
            roleUpdate(formData);

        resetForm();
}

////-------------------readFormData() function start from here------------------------------------------
function readFormData() {
    formsData['roleName']=document.getElementById('role').value;


    return formsData;
}

////-------------------------End here-----------------------------------------------------------------


//----------------------------insertNewRoleRecord() function start from here---------------------------
function insertNewRoleRecord(data) {
    var table=document.getElementById('role-table').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);

    cell=newRow.insertCell(0);
    cell.innerHTML=data.roleName;

    cell2=newRow.insertCell(1);
    cell2.innerHTML='<button onclick="onEditRole(this)" id="edit">Edit</button>'+
        '<button onclick="deleteRecord(this)" id="delete">Delete</button>';

}

////-------------------------End here-----------------------------------------------------------------

//----------------------------resetForm() function start from here---------------------------

function resetForm() {
    document.getElementById('role').value='';

    selectedRows=null;
}

//--------------------------End here-------------------------------------------------------------


//----------------------------onEdit() function start from here---------------------------
function onEditRole(td) {
    selectedRows=td.parentElement.parentElement
            document.getElementById('role').value=selectedRows.cells[0].innerHTML;


}
//--------------------------End here-------------------------------------------------------------


//--------------------------roleUpdate() function start from here--------------------------------
function roleUpdate(formData) {
    alert('Your record has been updated successfully!');
    selectedRows.cells[0].innerHTML=formData.roleName;

}
//------------------------End here---------------------------------------------------------------

//-----------------------deleteRecord() function start from here---------------------------------
function deleteRecord(td) {
    if(confirm('Are You sure to delete this record?'));
        var rows =td.parentElement.parentElement;
        document.getElementById('role-table').deleteRow(rows.rowIndex);
        resetForm();

}

//------------------------End here---------------------------------------------------------------*/
