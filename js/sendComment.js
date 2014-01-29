var  id = 0;
var commentArea='<div id="commentArea" >'+'<p><textarea id="commentContent" ></textarea><p>'+'<button id="sendComment">send</button>'+'<button id="cancelSendComment">cancel</button>'+'</div>';
$("body").append(commentArea);
$('#commentArea').css('visibility', 'hidden');

var myid = chrome.i18n.getMessage("@@extension_id");
var lastTimeStamp=(new Date).getTime();
var element = '*';

var selector,offset,leftValue,topValue;
var point=[0,0];

$(element).bind('contextmenu', function(e) {
	var timeStamp=(new Date).getTime();
		if((timeStamp-lastTimeStamp)<300){
			return;
		}
		lastTimeStamp  =timeStamp;

		selector=$(this).getPath();
		offset=$(selector).offset();
		leftValue= e.pageX;
		topValue = e.pageY;
		if(!offset){
			point=[leftValue,topValue];
		}else{
			point=[leftValue-offset.left,topValue-offset.top];
	}
});

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if(request.message == "create"){
			console.log("hello create comment"); 
			getAndSend();
			sendResponse({message:"success"});
		}else{
			sendResponse({message:"failed"});
		}
	}
	);

function getAndSend(){

		var timeStamp=(new Date).getTime();
		// console.log("last="+lastTimeStamp+",now="+timeStamp);
		if((timeStamp-lastTimeStamp)<300){
			console.log("event stopped");
			return;
		}
		lastTimeStamp  =timeStamp;

		//showWindow
		var text = $('#commentArea').css('visibility', 'visible');
		$(selector).showBalloon({contents:text,position:'top left',offsetX:point[0]+100,offsetY:-point[1],tipSize: 0}).draggable();
		
		$("#sendComment").click(function() {
			//commentは空でないことをチェック
			var content = $("#commentContent").val();

			if(!(/[^\s\b]/.test(content))) return false;
			content=StringUtility.Encode.HTML(content);
			
			var comment = {url:location.href,content:content,point:point,selector:selector};
			//投稿されたコメントを即時にページに追加
			$("body").append('<div style="position:absolute;left:'+leftValue+'px; top:'+topValue+'px; " class="tip" id="id'+id+'"><img src="chrome-extension://'+myid+'/horn.png"></div>');
			$("#id"+id).balloon({contents:content,position:"right"});
			id++;
			//send to background
			chrome.extension.sendRequest(comment, function(response) {
				if(response.message == "success"){
					console.log("response accepted");
					//後処理
					$(selector).hideBalloon();
					$('#commentArea').css('visibility', 'hidden');
				}else{
					console.log("response failed");
				}

			});
		});

		//cancelボタンのイベントハンドラー
		$("#cancelSendComment").click(function() {
			$(selector).hideBalloon();
			$('#commentArea').css('visibility', 'hidden');
		});
	}
