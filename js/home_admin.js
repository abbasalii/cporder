$(function(){

	var PENDING = 10;
	var DELIVERED = 100;
	
	var socket = io.connect("localhost:8080");
	var itemList = null;
	var orderList = [];
	var qtyList = [];
	var orderIndex;
	var orderItems = [];
	var menuList = [];

	var getOrderList = function()
	{
		$.ajax({
			url: "/get_orderlist",
			type: "get",
			success: function(response){
				if(response.code==200){
					orderList = response.data;
					displayOrderList();
				}
				else{
					alert("404");
				}
			}
		});
	}

	var displayOrderList = function(){

		var text = "";
		if(orderList.length>0)
			text = "<tr><th>#</th><th>DATE</th><th>TIME</th><th>ORDER BY</th><th>ROOM</th><th>STATUS</th><th>VIEW</th></tr>";
		for(var i=0; i<orderList.length; i++){

			text += '<tr>';
			text += '<td class="center">' + (i+1) + '</td>';
			text += '<td>'+ formatDate(orderList[i].ORDER_DATE) +'</td>';
			text += '<td>'+ formatTime(orderList[i].ORDER_DATE) +'</td>';
			text += '<td class="right">' + orderList[i].NAME + '</td>';
			text += '<td>' + 209 + '</td>';
			var s = orderList[i].STATUS;
			if(s==PENDING)
				text += '<td>' + 'PENDING' + '</td>';
			else if(s==DELIVERED)
				text += '<td>' + 'DELIVERED' + '</td>';
			text += '<td><input type="button" value="Detail" class="view-order-detail"/></td>';
			text += '</tr>';
		}
		$("#order-table").html(text);
		$("#order-list").show();

		$(".view-order-detail").each(function(){

			$(this).click(function(){

				orderIndex = $(this).closest('tr').index() - 1;
				getOrderItems();
			});
		});
	}

	var formatDate = function(date){

		var d = new Date(date);
		return d.toLocaleDateString();
	}

	var formatTime = function(date){
		var d = new Date(date);
		return d.toLocaleTimeString();
	}

	var getOrderItems = function(){

		$.ajax({
			url: "/get_orderitems",
			type: "get",
			data: {id:orderList[orderIndex].ID},
			success: function(response){
				if(response.code==200){
					orderItems = response.data;
					displayOrderItems();
					// console.log(orderItems);
				}
				else{
					alert("404");
				}
			}
		});
	}

	var displayOrderItems = function(){

		var text = "<tr><th>#</th><th>NAME</th><th>QTY</th></tr>";
		for(var i=0; i<orderItems.length; i++) {

			text += "<tr>";
			text += "<td>" + (i+1) + "</td>";
			text += "<td>" + orderItems[i].NAME + "</td>";
			text += "<td>" + orderItems[i].QTY + "</td>";
			text += "</tr>";
		}
		$("#order-detail-tab").html(text);

		$("#order-detail").show();

		if(orderList[orderIndex].STATUS==PENDING)
			$("#deliver-order").show();
		else
			$("#deliver-order").hide();
	}

	$("#deliver-checkbox").change(function(){

		if($(this).prop('checked'))
			$("#deliver-button").prop('disabled',false);
		else
			$("#deliver-button").prop('disabled',true);
	});

	$("#deliver-button").click(function(){

		$.ajax({
			url: "/deliver_order",
			type: "get",
			data: {id:orderList[orderIndex].ID},
			success: function(response){
				if(response.code==200){
					alert("200");
				}
				else{
					alert("404");
				}
			}
		});
	});

	$.ajax({
		url: "/get_menulist",
		type: "get",
		success: function(response){
			if(response.code==200){
				menuList = response.data;
				displayMenuList();
				// console.log(menuList);
			}
			else{
				alert("404");
			}
		}
	});

	var displayMenuList = function(){

		var text = "";
		if(menuList.length>0)
			text = "<tr><th>#</th><th>NAME</th><th>PRICE</th><th>AVAILABLE</th><th>EDIT</th></tr>";
		for(var i=0; i<menuList.length; i++){

			text += '<tr>';
			text += '<td class="center">' + (i+1) + '</td>';
			text += '<td> <input type="text" value="'+ menuList[i].NAME +'" class="edit-item-name" disabled/> </td>';
			text += '<td> <input type="number" min="1" value="'+ menuList[i].PRICE +'" class="edit-item-price" disabled/> </td>';
			var ischeck = "checked";
			if(menuList[i].QTY==0)
				ischeck = "";
			text += '<td>' + '<input type="checkbox" class="available-checkbox edit-item-qty" '+ischeck+' disabled/>' + '</td>';
			text += '<td><input type="button" value="Edit" class="edit-menu-item"/></td>';
			text += '</tr>';
		}
		$("#menu-table").html(text);

		$(".edit-menu-item").each(function(){

			$(this).click(function(){

				var itemIndex = $(this).closest('tr').index() - 1;
				
				$(".edit-item-name").eq(itemIndex).prop("disabled",false).focus();
				$(".edit-item-price").eq(itemIndex).prop("disabled",false);
				$(".edit-item-qty").eq(itemIndex).prop("disabled",false);

				$(this).unbind("click");
				$(this).val("Save");
				$(this).click(function(){

					$(this).unbind("click");

					var obj = {};
					obj["ID"] = menuList[itemIndex].ID;
					obj["NAME"] = $(".edit-item-name").eq(itemIndex).val();
					obj["PRICE"] = $(".edit-item-price").eq(itemIndex).val();
					if($(".edit-item-qty").eq(itemIndex).prop("checked"))
						obj["QTY"] = 1;
					else
						obj["QTY"] = 0;
					$.ajax({
						url: "/update_menu_item",
						type: "get",
						data: obj,
						success: function(response){
							if(response.code==200){
								// alert("200");
								menuList[itemIndex].NAME = obj.NAME;
								menuList[itemIndex].PRICE = obj.PRICE;
								menuList[itemIndex].QTY = obj.QTY;
								console.log(menuList[itemIndex]);
								displayMenuList();
							}
							else{
								alert("404");
							}
						}
					});
				});
			});
		});
	}

	$("#get-order-btn").click(function(){
		getOrderList();
	});

	$("#hide-order-btn").click(function(){
		$("#order-list").hide();
	});

	$("#hide-detail-btn").click(function(){
		$("#order-detail").hide();
	});
});