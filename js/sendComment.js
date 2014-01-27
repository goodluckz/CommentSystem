chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
	console.log(sender.tab ?
				"from a content script:" + sender.tab.url :
				"from the extension");
	sendResponse({}); // snub them.
	//コメントのメッセージを受けた
	getAndSend();

  }
);

function getAndSend(){
	var commentArea='<div id="commentArea" >'+'<textarea id="commentContent" ></textarea>'+'<button id="sendComment">click</button>'+'</div>';
	$("body").append(commentArea);
	$('#commentArea').css('visibility', 'hidden');

	$('img').click(function(e) {
		var selector=$(this).getPath();
		var offset=$(selector).offset();
		// alert(e.pageX-offset.left);
		var point=[e.pageX-offset.left,e.pageY-offset.top];
		// alert(point[0]+' , '+point[1]);
		//showWindow
		var text = $('#commentArea').css('visibility', 'visible');
		$(this).showBalloon({contents:text,position:'top left',offsetX:point[0]+100,offsetY:-point[1]});
		
		$("#sendComment").click(function() {
			var content = $("#commentContent").val();
			var comment = {url:location.href,content:content,point:point,selector:selector};
			chrome.extension.sendRequest(comment, function(response) {
				if(response.message == "success"){
					console.log("response accepted");
					$(selector).hideBalloon();
					$('img').off('click');
					//location.reload();
				}else{
					console.log("response failed");
					//location.reload();
				}

			});
		});

	});
}
