var bgAniObject=(function(){
	var bg=document.getElementsByClassName("bg")
	,len=bg.length
	,each=[].forEach
	,i=2
	,loopKey=null
	;

	return {
		start:function(){
			loopKey=setInterval(function(){
				var curIndex=0;
				each.call(bg,function(v,k){
					var downEle
					,upEle;
					console.log(i);
					curIndex=(++i)%len;
					if(curIndex===0){
						downEle=bg[len-1];
						upEle=bg[0];	
					}else{
						downEle=bg[curIndex-1];
						upEle=bg[curIndex];
					}
					
					downEle.style.animationName='opa_0';
					upEle.style.animationName='opa_1';
				});
			},1500);
		}
		,stop:function(){
			clearInterval(loopKey);
		}
	}	
}());
