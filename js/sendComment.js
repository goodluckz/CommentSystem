var  id = 0;
var commentArea='<div id="commentArea" >'+'<p><textarea id="commentContent" ></textarea><p>'+'<button id="sendComment">send</button>'+'<button id="cancelSendComment">cancel</button>'+'</div>';
$("body").append(commentArea);
$('#commentArea').css('visibility', 'hidden');

var myid = chrome.i18n.getMessage("@@extension_id");
var lastTimeStamp=(new Date).getTime();
var element = '*';
//var disable='a,button,input,img';

var selector,offset,leftValue,topValue;

var point=[0,0];

$(element).bind('contextmenu', function(e) {
	var timeStamp=(new Date).getTime();
		// console.log("last="+lastTimeStamp+",now="+timeStamp);
		if((timeStamp-lastTimeStamp)<300){
			console.log("event stopped");
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
		// console.log(leftValue+" "+topValue+" "+offset.top+" "+point[1]);
		
		console.log("not null ");
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
	//disable a links 
	// $(disable).click(function(){return false});
	// $(element).click(function(e) {
		
		var timeStamp=(new Date).getTime();
		// console.log("last="+lastTimeStamp+",now="+timeStamp);
		if((timeStamp-lastTimeStamp)<300){
			console.log("event stopped");
			return;
		}
		lastTimeStamp  =timeStamp;
		
		// $(element).off('click');

		// var selector=$(this).getPath();
		// var offset=$(selector).offset();
		// var left= e.pageX;
		// var top = e.pageY;
		// var point=[left-offset.left,top-offset.top];

		//showWindow
		var text = $('#commentArea').css('visibility', 'visible');
		console.log(selector+" "+point[0]+" "+point[1]);

		$(selector).showBalloon({contents:text,position:'top left',offsetX:point[0]+100,offsetY:-point[1],tipSize: 0}).draggable();
		
		$("#sendComment").click(function() {
			//commentは空でないことをチェック
			if(!(/[^\s\b]/.test($("#commentContent").val()))) return false;
			// if($("#commentContent").val()=="") return false;
			var content = $("#commentContent").val();
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
					//$(disable).off('click');
					$('#commentArea').css('visibility', 'hidden');
				}else{
					console.log("response failed");
				}

			});
		});

		//cancelボタンのイベントハンドラー
		$("#cancelSendComment").click(function() {
			$(selector).hideBalloon();
			//$(disable).off('click');
			$('#commentArea').css('visibility', 'hidden');
		});
	}
