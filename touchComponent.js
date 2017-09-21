    <div id="touchSlideBlk" data-targetEle=".nav-left-border" data-relatedEle="#textSection .navbar"></div>

        
    var db=(function dbNameSpace(){
        
        //touchMoveComponent
        let touchMoveComponent=(function touchMoveComponentNS(){
            //touchstart touchmove touchend common NS
            let touchFire=document.getElementById("touchSlideBlk")
            ,tele=touchFire.dataset.targetele
            ,rele=touchFire.dataset.relatedele
            
            //真实的dom节点对象
            ,domObject={}
            
            
            
            //储存的上一次的触摸点视口坐标对象
            ,storedClientCoordObj={
                cX:0
                ,cY:0
            }
            ;
            
            
            //得到当前的坐标对象
            function getCurClientCoord(event){
                let tch=event.targetTouches[0]
                ,tchClientX=tch.clientX
                ,tchClientY=tch.clientY
                
                ;
                
                return {
                    cX:tchClientX
                    ,cY:tchClientY
                };
            }
            
            //更新储存的视口坐标对象
            //为何不直接storedClientCoordObj=coordObj，是因为这样的话会造成很多getCurClientCoord的闭包
            function setStoredClientCoordObj(coordObj){
                for(let k in coordObj){
                    storedClientCoordObj[k]=coordObj[k];
                }
            }
            
            
            //touchstart Ns
            function touchstartNS(){
                function touchstartAction(event){
                    storeTrueDom();
                    eleMoveAble();
                    setStoredClientCoordObj(getCurClientCoord(event));
                }
                
                function storeTrueDom(){
            
                //define regexp
                var 
                classCheckReg=/^(.([\w-\d]+))$/
                ,idCheckReg=/^(#([\w-\d]+))$/
                ,tagCheckReg=/^([\w-\d]+)$/  
                ,spaceReg=/\s+/
                ,checkRegArr=[classCheckReg,idCheckReg,tagCheckReg]
                ,currentReg=null
                    ;

                //part3
                classCheckReg.checkType="classReg";
                idCheckReg.checkType="idReg";
                tagCheckReg.checkType="tagReg";


                //清除两边空格，单个或多个参数都转化为数组
                function correctPara(para){
                    para=para.trim();

                    spaceReg.test(para)&&(function(){
                        para=para.split(spaceReg);
                    }());

                    return para;
                }


                function combinePara(tele,rele){
                    var tele=correctPara(tele)
                    ,rele=correctPara(rele)
                    ;

                    return {
                        targetEle:[tele]
                        ,relatedEle:rele
                    };
                }

                //在组件级别的闭包内设置真实的dom引用
                function _setDomRef(k,v){
                    domObject[k]=v;
                    console.log(domObject[k]);
                }

                //遍历器 绑定了regMatch由纯粹的遍历逻辑转变为遍历
                function ergodic(combinedPara){
                    let doms=null;
                    for(let k in combinedPara){
                        let eles=combinedPara[k];
                        doms=$.map(eles,regMatch);
                        doms.length===0&&(function(){
                            throw "invalid selector!";
                        }());
                        _setDomRef(k,doms);
                    }
                }

                //正则表达式类名，id名，tag名抽取器
                function regMatch(selr,index){
                    return $.map(checkRegArr,function(reg,ix){
                    if(reg.test(selr)){
                        return getTrueDom(reg,selr);
                    }
                })[0];
                }

                //获取真实dom
                function getTrueDom(reg,selr){
                    var selectorText
                        ,selectorType=reg.checkType
                    ;

                    switch(selectorType){
                        case "classReg":
                            selectorText=reg.exec(selr)[2];
                            return document.getElementsByClassName(selectorText)[0];
                        case "idReg":
                            selectorText=reg.exec(selr)[2];
                            return document.getElementById(selectorText);
                        case "tagReg":
                            selectorText=reg.exec(selr)[1];
                            return document.getElementsByTagName(selectorText)[0];
                    } 
                }


                ergodic(combinePara(tele,rele));
            }
                
                
                
                //使元素可移动视觉上也不会产生改变
                function eleMoveAble(){

                    //确保不会因为元素position属性的改变引起size变化
                    function _eleMoveAble(ele/*DomElement*/){
                        //得到父元素的CSSStyleDeclaration对象
//                        let parentNode=ele.parentNode
//                        ,parentCssStyleDeclaration=window.getComputedStyle(parentNode)
//                        ,parentPositionStyle=parentCssStyleDeclaration.position
                        
                        
                        //得到元素的视口（视口可以是浏览器的可视区域，iframe元素的区域）坐标
                        //return {left,top,right,bottom}
                        function getEleClientCoord(ele/*DomElement*/){
                            return ele.getBoundingClientRect();
                        }

                        //改变元素position,固定其坐标
                        function fixEle(ele/*Domelement*/,coord/*一个包涵坐标值的对象*/){
                            $(ele).css({
                                position:"fixed"
                                ,left:coord.left
                                ,top:coord.top
                            });
                            
                            return ele;
                        }
                        
                        let 
                        eleCssStyleDeclaration=window.getComputedStyle(ele)
                        ,elePostionStyle=eleCssStyleDeclaration.position
                        ,elePositionInfo=getEleClientCoord(ele)
                        
                        ,eleSizeStyle={
                            width:eleCssStyleDeclaration.width
                            ,height:eleCssStyleDeclaration.height
                        }
                        ;
                        
                        $(ele).css(eleSizeStyle);

                        ((elePostionStyle==='static')||(elePostionStyle==='relative'))&&(()=>{
                            let eleClone=$(ele).clone();
                            $(eleClone).css({
                                opacity:0
                            });
                            
                            $(ele).replaceWith(eleClone);
                                
                            $(document.body).append(fixEle(ele,elePositionInfo));
                        })();
                        
                        
                    }
                    
                    $.each(domObject.relatedEle,(index,ele)=>{
                        _eleMoveAble(ele);
//                        fixEle(ele,getEleClientCoord(ele));
                    });
                }
                
                
                
                $("#touchSlideBlk").bind("touchstart",touchstartAction);
            }
            
            
            //touchmoveNs
            function touchmoveNS(){
                function touchMoveAction(){
                    
                }
                
                
            }
            
            function touchMoveComponentStart(){
                touchstartNS();
                touchmoveNS();
            }
            
            
            return {
                touchMoveComponentStart:touchMoveComponentStart
            }
        })();
        
        return {
            touchMoveComponent:touchMoveComponent
        };
        
//        function bindTrueDom(){
////            //store node of touchSlideBlk
////            var self=this;
////            
////            //selector define
////            var tele=self.dataset.targetele
////            ,rele=self.dataset.relatedele
////            ;
//            
//            //define regexp
//            var 
//            classCheckReg=/^(.([\w-\d]+))$/
//            ,idCheckReg=/^(#([\w-\d]+))$/
//            ,tagCheckReg=/^([\w-\d]+)$/  
//            ,spaceReg=/\s+/
//            ,checkRegArr=[classCheckReg,idCheckReg,tagCheckReg]
//            ,currentReg=null
//                ;
//            
//            //part3
//            classCheckReg.checkType="classReg";
//            idCheckReg.checkType="idReg";
//            tagCheckReg.checkType="tagReg";
//            
//            
//            //清除两边空格，单个或多个参数都转化为数组
//            function correctPara(para){
//                para=para.trim();
//                
//                spaceReg.test(para)&&(function(){
//                    para=para.split(spaceReg);
//                }());
//                
//                return para;
//            }
//            
//            
//            function combinePara(tele,rele){
//                var tele=correctPara(tele)
//                ,rele=correctPara(rele)
//                ;
//                
//                return {
//                    targetEle:[tele]
//                    ,relatedEle:rele
//                };
//            }
//            
//            //绑定指定键值对到touchSlideBlk元素
//            function _bind(k,v){
//                self[k]=v;
//            }
//            
//            //遍历器 绑定了regMatch由纯粹的遍历逻辑转变为遍历
//            function ergodic(combinedPara){
//                let doms=null;
//                for(let k in combinedPara){
//                    let eles=combinedPara[k];
//                    doms=$.map(eles,regMatch);
//                    doms.length===0&&(function(){
//                        throw "invalid selector!";
//                    }());
//                    _bind(k,doms);
//                }
//            }
//            
//            //正则表达式类名，id名，tag名抽取器
//            function regMatch(selr,index){
//                return $.map(checkRegArr,function(reg,ix){
//                if(reg.test(selr)){
//                    return getTrueDom(reg,selr);
//                }
//            })[0];
//            }
//            
//            //获取真实dom
//            function getTrueDom(reg,selr){
//                var selectorText
//                    ,selectorType=reg.checkType
//                ;
//                
//                switch(selectorType){
//                    case "classReg":
//                        selectorText=reg.exec(selr)[2];
//                        return document.getElementsByClassName(selectorText)[0];
//                    case "idReg":
//                        selectorText=reg.exec(selr)[2];
//                        return document.getElementById(selectorText);
//                    case "tagReg":
//                        selectorText=reg.exec(selr)[1];
//                        return document.getElementsByTagName(selectorText)[0];
//                } 
//            }
//            
//            
//            ergodic(combinePara(tele,rele));
//        }
//        
//        
//        $("#touchSlideBlk").bind("touchstart",bindTrueDom);
//        
//        
//        //移动真实的dom节点
//        function moveDom(event){
//            
//            //定义触摸点坐标
//            let tch=event.taegetTouches[0]
//            ,tchClientX=tch.clientX
//            ,tchClientY=tch.clientY
//            
//            //定义关联的元素
//            ,relatedEles=this.relatedEle
//            ,targetEle=this.targetEle[0]
//            ;
//            
//            //得到元素的视口（视口可以是浏览器的可视区域，iframe元素的区域）坐标
//            //return {left,top,right,bottom}
//            function getEleClientCoord(ele/*DomElement*/){
//                return ele.getBoundingClientRect();
//            }
//            
//            //改变元素position,固定其坐标
//            function fixEle(ele/*Domelement*/,coord/*一个包涵坐标值的对象*/){
//                $(ele).css({
//                    position:"fixed"
//                    ,left:coord.left
//                    ,top:coord.top
//                });
//                
//            }
//            
//            //确保不会因为元素position属性的改变引起size变化
//            function remainSize(ele/*DomElement*/){
//                //得到父元素的CSSStyleDeclaration对象
//                let parentNode=ele.parentNode
//                ,parentCssStyleDeclaration=window.getComputedStyle(parentNode)
//                ,parentPositionStyle=parentCssStyleDeclaration.position
//                ;
//                
//                parentPositionStyle==='static'&&(()=>{
//                    $(parentNode).css({
//                        height:"+="+ele.offsetHeight+"px"
//                    });
//                })();
//            }
//            
//            //改变关联元素的position属性，使其可以移动，并且不会出现滑动条，而且在改变关联元素的position属性时，相关元素的尺寸不会发生变化，避免因尺寸变化引起的视觉样式的改变
//            function changeAFixReElePosition(eleArr/*:Array*/){
//                $.each(eleArr,(index,ele)=>{
//                    
//                });
//            }
//            
//        }
//        
//        let moveDom=(function(){
//            return function(){
//                getCurClientCoord()
//            }
//        })();
//
//        $("#touchSlideBlk").bind("touchmove",moveDom);
        
    })();
