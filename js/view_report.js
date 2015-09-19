$(function(){

	var cList = null;

	$("#hide-message-box").click(function(){
		$("#messagebox").hide();
	});

	$.ajax({
		url: "/get_classlist",
		type: "get",
		success: function(response){
			if(response.code==200){
				// console.log(response.data);
				cList = response.data;
				setClassDataList();
			}
			else{
				alert("404");
			}
		}
	});

	var setClassDataList = function(){

		var text = "";
		for(var i=0; i<cList.length; i++)
			text += "<option>" + cList[i].TITLE + "</option>";
		$("#cList").html(text);
	}


	$('#form').submit(function(){

		var clas = $("#class").val().trim().toUpperCase();
		var sec = $("#section").val().trim().toUpperCase();
		var cid = 0;
		for(var i=0; i<cList.length; i++){
			if(cList[i].TITLE==clas){
				cid = cList[i].ID;
				break
			}
		}
		if(cid>0){
			$.ajax({
				url: $('#form').attr('action'),
				type: "get",
				data : {"class":cid,"section":sec},
				success: function(response){
					if(response.code==200){

						console.log(response.data);
						displayReport(response.data);
					}
					else{
						displayMessageBox("Failed to retrieve report");
					}
				}
			});
		}
		return false;
	});

	var displayReport = function(data){

		$("#report-tab").html("");

		if(data.length==0){

			displayMessageBox("No result found!");
			return;
		}

		var students = [];
		var subjects = [];
		for(var i=0; i<data.length; i++){

			for(var j=0; j<students.length; j++){
				var found = false;
				if(students[j].ID==data[i].STD_ID){
					found = true;
					break;
				}
			}
			if(!found)
				students.push({ID:data[i].STD_ID, NAME:data[i].NAME});

			for(var j=0; j<subjects.length; j++){
				var found = false;
				if(subjects[j].ID==data[i].SUB_ID){
					found = true;
					break;
				}
			}
			if(!found)
				subjects.push({ID:data[i].SUB_ID, NAME:data[i].SUBJECT});
		}

		var coltotal = [];
		var colobtain = [];
		var text = "<tr>";
		text += "<th>STUDENT</th>";
		for(var i=0; i<subjects.length; i++){
			text += "<th>" + subjects[i].NAME +"</th>";
			coltotal.push(0);
			colobtain.push(0);
		}
		text += "<th>TOTAL</th>";
		text += "</tr>";

		for(var i=0; i<students.length; i++){

			var rowtotal = 0;
			var rowobtain = 0;
			text += "<tr>";
			text += "<td>" + students[i].NAME + "</td>";
			for(var j=0; j<subjects.length; j++){

				var subtotal = 0;
				var subobtain = 0;
				text += "<td class='center'>";
				for(var k=0; k<data.length; k++){
					if(students[i].ID==data[k].STD_ID && subjects[j].ID==data[k].SUB_ID){
						subtotal += data[k].TM;
						subobtain += data[k].OM;
					}
				}
				rowtotal += subtotal;
				rowobtain += subobtain;

				coltotal[j] += subtotal;
				colobtain[j] += subobtain;

				if(subtotal>0){
					text += ((subobtain*100)/subtotal).toFixed(2);
				}
				text += "</td>";
			}
			text += "<td class='center'>";
			if(rowtotal>0){
				text += ((rowobtain*100)/rowtotal).toFixed(2);
			}
			text += "</td>";
			text += "</tr>";
		}

		text += "<tr>";
		text += "<td>CLASS</td>";
		var total = 0;
		var obtain = 0;

		for(var i=0; i<subjects.length; i++){
			total += coltotal[i];
			obtain += colobtain[i];
			text += "<td class='center'>";
			if(coltotal[i]>0)
				text += ((colobtain[i]*100)/coltotal[i]).toFixed(2);
			text += "</td>";
		}
		text += "<td class='center'>" + ((obtain*100)/total).toFixed(2) + "</td>";
		text += "</tr>";

		$("#report-tab").html(text);
	}

	displayMessageBox = function(msg){

		$("#user-message").html(msg);
		$("#messagebox").show();
	}
});