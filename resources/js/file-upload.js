	function createSchedule(){
		var radioValue = $("input[name='scheduletype']:checked").val();
		if(radioValue==='non-recursive')
			opendialog("non-recurence-schedule.html");
		if(radioValue==='recursive')
		    opendialog("recurence-schedule.html");
	}
	
	function opendialog(page) {
		  var $dialog = $('#emptyschedulediv')
		  .html('<iframe style="border: 0px; " src="' + page + '" width="100%" height="100%"></iframe>')
		  .dialog({
		    title: "Page",
		    autoOpen: false,
		    dialogClass: 'dialog_fixed,ui-widget-header',
		    modal: true,
		    height: 550,
		    minWidth: 600,
		    minHeight: 550,
		    draggable:true,
		    buttons: { "Ok": function () {         $(this).dialog("close"); } }
		  });
		  $dialog.dialog('open');
		} 

$(document).ready(function(){
	$('#btnFile').click(function(event){
		event.preventDefault();
		//get form
		var form= $('#file-upload')[0];
		// create an formdata object
		var data = new FormData(form);
		// disabled the submit button
		$('#btnFile').prop('disabled',true);
		$.ajax({
			type:"post",
			url: '/app/restore',
			enctype:'multipart/form-data',
			data:data,
			processData:false,
			contentType:false,
			cache:false,
			timeout:6000000,
			success:function(data){
				console.log(data);
				$('#btnFile').prop('disabled',false);
				$('#fileModel').modal('hide');
			},
			error:function(e){
				console.log('Error:',e);
				$('#btnFile').prop('disabled',false);
				$('#fileModel').modal('hide');
			}
		});
	});
	
	
	
});