$(function(){
	$('#form').submit(function(){
		$.ajax({
			url: $('#form').attr('action'),
			type: "post",
			data : $('#form').serialize(),
			success: function(response){
				if(response.code==200)
					window.location = "/home";
				else
					$("#error").show();
			}
		});
		return false;
	});
});