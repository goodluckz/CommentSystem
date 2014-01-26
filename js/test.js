function postHandler(){
	alert($(commentContent).val());
	// console.log("success");
	location.reload();
	//alert("success");
}

var commentArea=
'<div id="commentArea" >'+
'<textarea id="commentContent" ></textarea>'+
'<button onclick="postHandler();">click</button>'+
'</div>';
$("body").append(commentArea);
$('#commentArea').css('visibility', 'hidden');
$('img').click(function() {
	$('img,h1,h2').click(function(e) {
		var selector=$(this).getPath();
		var offset=$(selector).offset();
		// alert(e.pageX-offset.left);
		var point=[e.pageX-offset.left,e.pageY-offset.top];
		// alert(point[0]+' , '+point[1]);
		showWindow(this,point);
	});
});

function showWindow(thisObj,point){
	var text = $('#commentArea').css('visibility', 'visible');
	$(thisObj).showBalloon({contents:text,position:'top left',offsetX:point[0]+100,offsetY:-point[1]});
}

