$(function(){

	var PENDING = 10;
	var DELIVERED = 100;
	
	var socket = io.connect("localhost:8080");
	var itemList = null;
	var orderList = [];
	var qtyList = [];

	$.ajax({
		url: "/get_orderlist",
		type: "get",
		success: function(response){
			if(response.code==200){
				orderList = response.data;
				displayOrderList();
				console.log(orderList);
			}
			else{
				alert("404");
			}
		}
	});

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
	}

	var formatDate = function(date){

		var d = new Date(date);
		return d.toLocaleDateString();
	}

	var formatTime = function(date){
		var d = new Date(date);
		return d.toLocaleTimeString();
	}

	// var displayItemList = function(){

	// 	var text = "";
	// 	for(var i=0; i<itemList.length; i++)
	// 	{
	// 		text += '<div class="item-container">';
	// 		text += '<div class="img-wrapper">';
	// 		text += '<img src="' + itemList[i].IMAGE + '" class="item-img"/>';
	// 		text += '<div class="title-wrapper"><div class="item-title">' + itemList[i].NAME + '</div></div>';
	// 		text += '</div>';
	// 		text += '<div class="price-wrapper"><div class="item-price">Rs. ' + itemList[i].PRICE + '/-</div></div>';
	// 		text += '<div class="order-wrapper">';
	// 		text += '<input type="button" class="add-to-order-btn" value="Add to Order"/>';
	// 		text += '</div>';
	// 		text += '</div>';
	// 	}
	// 	$("#items-list").html(text);

	// 	$(".add-to-order-btn").each(function(){

	// 		$(this).click(function(){

	// 			var item = $(this).closest('.item-container').index();
	// 			addItemToOrder(item);
	// 		});
	// 	});
	// }

	// var addItemToOrder = function(item){

	// 	//if item is already in the orderlist, do nothing
	// 	for(var i=0; i<orderList.length; i++)
	// 		if(orderList[i]==item)
	// 			return;

	// 	orderList.push(item);
	// 	qtyList.push(1);
	// 	fillOrderTable();
	// }

	// var fillOrderTable = function(){

	// 	$("#order-total-amount").html(calculateBill());

	// 	var text = "";
		// if(orderList.length>0)
		// 	text = "<tr><th>#</th><th>NAME</th><th>RS.</th><th>QTY</th><th>PRICE</th><th></th></tr>";
		// for(var i=0; i<orderList.length; i++){

		// 	var j = orderList[i];
		// 	text += '<tr>';
		// 	text += '<td class="center">' + (i+1) + '</td>';
		// 	text += '<td>'+ itemList[j].NAME +'</td>';
		// 	text += '<td class="right">' + itemList[j].PRICE + '</td>';
		// 	text += '<td><input type="number" min="1" value="' + qtyList[i] + '" class="item-qty"/></td>';
		// 	text += '<td class="right total-item-price">' + itemList[j].PRICE*qtyList[i] + '</td>';
		// 	text += '<td><input type="button" value="X" class="remove-item-btn"/></td>';
		// 	text += '</tr>';
		// }
		// $("#order-table").html(text);

	// 	$(".item-qty").each(function(){

	// 		$(this).change(function(){

	// 			var n = $(this).closest('tr').index()-1;
	// 			var v = $(this).val();
	// 			if(v<1){
	// 				v = 1;
	// 				$(this).val(v);
	// 			}
	// 			qtyList[n] = v;
	// 			var price = itemList[orderList[n]].PRICE*v;
	// 			$(".total-item-price").eq(n).html(price);
	// 			$("#order-total-amount").html(calculateBill());
	// 		});
	// 	});

	// 	$(".remove-item-btn").each(function(){

	// 		$(this).click(function(){

	// 			var n = $(this).closest('tr').index()-1;
	// 			orderList.splice(n,1);
	// 			qtyList.splice(n,1);
	// 			fillOrderTable();
	// 		});
	// 	});
	// }

	// var calculateBill = function(){

	// 	var bill = 0;
	// 	for(var i=0; i<orderList.length; i++){

	// 		var j = orderList[i];
	// 		bill += itemList[j].PRICE*qtyList[i];
	// 	}
	// 	return bill;
	// }

	// $("#order-btn-wrapper").click(function(){

	// 	if(orderList.length==0){
	// 		alert("Cart is empty");
	// 		return;
	// 	}

	// 	var order = [];
	// 	for(var i=0; i<orderList.length; i++){

	// 		var j = orderList[i];
	// 		order.push({
	// 			ID: itemList[j].ID,
	// 			QTY: qtyList[i]
	// 		});
	// 	}

	// 	$.ajax({
	// 		url: "/place_order",
	// 		type: "post",
	// 		data: { list:order, time: getSqlDateTime()},
	// 		success: function(response){
	// 			if(response.code==200){
	// 				alert("Order successfully placed");
	// 			}
	// 			else{
	// 				alert("404");
	// 			}
	// 		}
	// 	});
	// });

	// var getSqlDateTime = function(){

	// 	var date = new Date();
	// 	date = date.getUTCFullYear() + '-' +
	//     ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
	//     ('00' + date.getUTCDate()).slice(-2) + ' ' + 
	//     ('00' + date.getUTCHours()).slice(-2) + ':' + 
	//     ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
	//     ('00' + date.getUTCSeconds()).slice(-2);
	//     return date;
	// }
});