Google = new function(){

	var classes = null;

	this.displayClassList = function(data){

		classes = data;

		var text = "<div><input id='suball' type='checkbox'/>";
		text += "<label for='suball' >All</label></div>";
		text += "<div>";
		for(var i=0; i<data.length; i++){

			text += "<input class='sub-check' id='subject"+i+"' type='checkbox'/>";
			text += "<label for='subject"+i+"' >"+data[i].TITLE+"</label>";
		}
		text += "</div>";
		$("#audience").html(text);

		$("#suball").change(function(){
			if($(this).is(':checked')){

				$(".sub-check").each(function(){
					$(this).prop('checked', true);
				});
			}
			else{
				$(".sub-check").each(function(){
					$(this).prop('checked', false);
				});
			}
		});

		$(".sub-check").each(function(){
			$(this).change(function(){
				if($(this).prop('checked')==false)
					$("#suball").prop('checked', false);
			});
		});
	}

	this.generateInvoice = function(){

		var i = 0;
		var list = [];
		$(".sub-check").each(function(){

			if($(this).prop('checked'))
				list.push(classes[i].CLASS);
			i++;
		});

		var object = {};
		object.list = list;
		object.st_date = $("#start-date").val();
		object.end_date = $("#end-date").val();
		object.due_date = $("#due-date").val();
		object.annual = $("#annual-fee").val();
		object.transport = $("#transport").val();

		$.ajax({
			url: "/generate_invoice",
			type: "post",
			data: object,
			success: function(response){
				if(response.code==200){
					Google.displayMessageBox("Invoices successfully generated");
				}
				else{
					Google.displayMessageBox("Unable to generate invoices!");
				}
			}
		});		
	}

	this.displayMessageBox = function(msg){

		$("#user-message").html(msg);
		$("#messagebox").show();
	}
}


$(function(){

	$("#hide-message-box").click(function(){
		$("#messagebox").hide();
	});

	$.ajax({
		url: "/get_classlist",
		type: "get",
		success: function(response){
			if(response.code==200){
				console.log(response.data);
				Google.displayClassList(response.data);
			}
			else{
				alert("404");
			}
		}
	});

	$("#send-sms").change(function(){

		if($(this).is(':checked')){

			$("#sms-area").prop("disabled",false);
		}
		else{
			$("#sms-area").prop("disabled",true);
		}
	});

	$('#form').submit(function(){

		var i = 0;
		var list = [];
		$(".sub-check").each(function(){

			if($(this).prop('checked'))
				list.push(classes[i].CLASS);
			i++;
		});

		var object = {};
		object.list = list;
		object.st_date = $("#start-date").val();
		object.end_date = $("#end-date").val();
		object.due_date = $("#due-date").val();
		object.annual = $("#annual-fee").val();
		object.transport = $("#transport").val();

		$.ajax({
			url: $('#form').attr('action'),
			type: "post",
			data: object,
			success: function(response){
				if(response.code==200){
					alert("200");
				}
				else{
					alert("404");
				}
			}
		});
		return false;
	});

	$("#add-annual").change(function(){

		if($(this).is(':checked')){

			$("#annual-fee").prop("disabled",false);
		}
		else{
			$("#annual-fee").prop("disabled",true);
		}
	});

	$("#add-transport").change(function(){

		if($(this).is(':checked')){

			$("#transport").prop("disabled",false);
		}
		else{
			$("#transport").prop("disabled",true);
		}
	});

	// $("#generate-btn").click(Google.generateInvoice);
});