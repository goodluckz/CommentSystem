// var host = "172.20.6.36:3000";
var host = "192.168.11.16:3000";

var myid = chrome.i18n.getMessage("@@extension_id");

var allComments;

$.get('http://'+host+'/getComment',{url:location.href}).done(function(data) {
	allComments=data;
	replaceComments(data);
});

function replaceComments(data){
  for (var i=0, size=data.length; i<size; ++i) {
	var offset = $(data[i].selector).offset();
	var left ,top;
	if(!offset){
		top=left=0;
	}else{
		left= offset.left+data[i].point[0];
		top= offset.top+data[i].point[1];
	}
	var id = data[i]._id;
	var content = data[i].content;
	$("body").append('<div style="position:absolute;left:'+left+'px; top:'+top+'px; " class="tip" id="id'+id+'"><img src="chrome-extension://'+myid+'/horn.png"></div>');
	$("#id"+id).balloon({contents:content,position:"right"});  
  }
}

window.onscroll=function(){
	replaceComments(allComments);
}

// chrome.extension.sendRequest({message:"get",url:location.href}, function(response) {
//   var data = response.data;
//   for (var i=0, size=data.length; i<size; ++i) {
//     var offset = $(data[i].selector).offset();
//     var left = offset.left+data[i].point[0];
//     var top = offset.top+data[i].point[1];
//     var id = data[i]._id;
//     var comment = data[i].content;
//     $("body").append('<div style="position:absolute;left:'+left+'px; top:'+top+'px; " class="tip" id="id'+id+'"><img src="http://i.imgur.com/UY5EiVO.png"></div>');
//     $("#id"+id).balloon({contents:comment});  
//   }
// });

// chrome.extension.onRequest.addListener(
//   function(request, sender, sendResponse) {
//      // snub them.
//   //コメントのメッセージを受けた
//     if(request.message == "get"){
//     // getAndSend();
//     console.log(sender.tab ?
//         "from a content script:" + sender.tab.url :
//         "from the extension");
//     console.log("bye"); 
//     sendResponse({});
//     }else{
//       sendResponse({});
//     }
//   }
// );