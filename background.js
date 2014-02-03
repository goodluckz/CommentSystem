// var host = "192.168.11.16:3000";
var host = "172.20.6.31:3000";
 function getClickHandler() {
 	return function(info, tab) {
 		//現在のタブにメッセージを送る
 		chrome.tabs.getSelected(null, function(tab) {
 			chrome.tabs.sendRequest(tab.id, { message :"create"}, function(response) {
 				//console.log("start to create a comment");
 			});
 		});

 	};
 };

var parentId = chrome.contextMenus.create({
	"title" : "Comment",
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : getClickHandler()
});


chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
        // console.log("send comment started");    
        // console.log(sender.tab ?
                    // "from a content script:" + sender.tab.url :
                    // "from the extension");
        if (request){
            sendToServer(request);
            sendResponse({message:"success"});
        }
        else
          sendResponse({message:"failed"}); // snub them.
    // }
   }
);

function sendToServer(request){
	    $.ajax({
        type:"post",                // method = "POST"
        url:'http://'+host+'/create',        // POST送信先のURL
        data:JSON.stringify(request),  // JSONデータ本体
        contentType: 'application/json', // リクエストの Content-Type
        dataType: "json",           // レスポンスをJSONとしてパースする
        success: function(json_data) {   // 200 OK時
            // JSON Arrayの先頭が成功フラグ、失敗の場合2番目がエラーメッセージ
            if (!json_data) {    // サーバが失敗を返した場合
                alert("Transaction error. " + json_data);
                return false;
            }
            // 成功時処理
            console.log("comment saved");
            return true;
        },
        error: function() {         // HTTPエラー時
            alert("Server Error. Pleasy try again later.");
            return false;
        },
        complete: function() {      // 成功・失敗に関わらず通信が終了した際の処理
            
        }
        });
    }