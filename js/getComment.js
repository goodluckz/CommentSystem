// var host = "172.20.6.36:3000";
// var host = "192.168.11.16:3000";
// var host = "172.20.6.31:3000";
var host = "172.20.6.27:3000";
var myid = chrome.i18n.getMessage("@@extension_id");
var allComments;

getComment();
// updateComment();

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.message == "delete") {
			console.log("delete comments");
			removeAllComments();
			sendResponse({
				message: "deleted"
			});
		}
		if (request.message == "update") {
			removeAllComments();
			getComment();
			sendResponse({
				message: "updated"
			});
		}
	}
);
// function updateComment(){
// 	setTimeout(function() {
// 		removeAllComments(allComments);
// 		getComment();
// 		updateComment();
// 	}, 10000);
// }
function getComment() {
	$.get('http://' + host + '/getComment', {
		url: location.href
	}).done(function(data) {
		allComments = data;
		replaceComments(data);
	});
}

function removeAllComments() {
	$(".balloon").remove();
	$(".tip").remove();
}

function replaceComments(data) {
	for (var i = 0, size = data.length; i < size; ++i) {
		var offset = $(data[i].selector).offset();
		var left, top;
		if (!offset) {
			top = left = 0;
		} else {
			left = offset.left + data[i].point[0];
			top = offset.top + data[i].point[1];
		}
		var id = data[i]._id;
		var content = data[i].content;
		$("body").append('<div style="position:absolute;left:' + left + 'px; top:' + top + 'px; " class="tip" id="id' + id + '"><img src="chrome-extension://' + myid + '/horn.png"></div>');
		$("#id" + id).balloon({
			contents: content,
			position: "right"
		}).draggable();
		$(".tip").dblclick(function(event) {
			$(".balloon").remove();
			$(this).remove();
		});
		// $("#id"+id).click(function() {
		// 	$(this).remove();
		// });

	}
}

// window.onscroll=function(){
// 	replaceComments(allComments);
// }