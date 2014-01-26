 function getClickHandler() {
 	return function(info, tab) {
 		//現在のタブにメッセージを送る
 		chrome.tabs.getSelected(null, function(tab) {
 			chrome.tabs.sendRequest(tab.id, {greeting: "hello"}, function(response) {
 				console.log("message sended");
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
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (sendToServer(request)){
    	sendResponse({message:"success"});
    }
    else
      sendResponse({message:"failed"}); // snub them.
  }
);

function sendToServer(request){
	    $.ajax({
        type:"post",                // method = "POST"
        url:"/create",        // POST送信先のURL
        data:JSON.stringify(data),  // JSONデータ本体
        contentType: 'application/json', // リクエストの Content-Type
        dataType: "json",           // レスポンスをJSONとしてパースする
        success: function(json_data) {   // 200 OK時
            // JSON Arrayの先頭が成功フラグ、失敗の場合2番目がエラーメッセージ
            if (!json_data[0]) {    // サーバが失敗を返した場合
                alert("Transaction error. " + json_data[1]);
                return;
            }
            // 成功時処理
             location.reload();
        },
        error: function() {         // HTTPエラー時
            alert("Server Error. Pleasy try again later.");
        },
        complete: function() {      // 成功・失敗に関わらず通信が終了した際の処理
            button.attr("disabled", false);  // ボタンを再び enableにする
        }
    });
}