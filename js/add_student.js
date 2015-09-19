$(function(){

	$("#hide-message-box").click(function(){
		$("#messagebox").hide();
	});

	$('#form').submit(function(){
		$.ajax({
			url: $('#form').attr('action'),
			type: "post",
			data : $('#form').serialize(),
			success: function(response){
				if(response.code==200){
					displayMessageBox("New student succesfully added");
				}
				else{
					displayMessageBox("Failed to add new student!");
				}
			}
		});
		return false;
	});

	displayMessageBox = function(msg){

		$("#user-message").html(msg);
		$("#messagebox").show();
	}
});