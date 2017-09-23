//默认开启db命名空间（顶级域）和组件命名空间（组件级别的域）方法级别的域要调用组件对应的start方法才会开启
    var db=(function dbNameSpace(){
        
        //db命名空间数据定义方法,将键值对添加到指定的dom元素的dbData属性中
        function setdbData(dom,k,v){
            dom.dbData===undefined&&(dom.dbData={});
            dom.dbData[k]=v;
        }
        
        
        //touchMoveComponent
        let touchMoveComponent=(function touchMoveComponentNS(){
            //touchstart touchmove touchend common NS
            let touchFire=document.getElementById("touchSlideBlk")
            ,tele=touchFire.dataset.targetele
            ,rele=touchFire.dataset.relatedele
            
            //真实的dom节点对象,结构为{targetEle:[eleDom],relatedEle:[eleDoms]}
            ,domObject={}
            
            //保存的克隆节点
            ,relatedClonedDoms=[]
            
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
                        
                        
                        //得到元素的视口（视口可以是浏览器的可视区域，iframe元素的区域）坐标
                        //return {left,top,right,bottom}
                        function getEleClientCoord(ele/*DomElement*/){
                            return ele.getBoundingClientRect();
                        }

                        //改变元素position,固定其坐标,并且储存坐标对象在dom上的originalPosi属性中，使用db组件数据储存方法setdbData(ele/*dom*/,k,v)
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
                            setdbData(ele,"originalPosi",elePositionInfo);
                            
                            let eleClone=$(ele).clone();
                            eleClone.css({
                                opacity:0
                            });
                            
                            relatedClonedDoms.push(eleClone);
                            
                            $(ele).replaceWith(eleClone);
                                
                            $(document.body).append(fixEle(ele,elePositionInfo));
                        })();
                        
                        
                    }
                    
                    $.each(domObject.relatedEle,(index,ele)=>{
                        _eleMoveAble(ele);
                    });
                    
                    setdbData(domObject.targetEle[0],"originalPosi",domObject.targetEle[0].getBoundingClientRect());
                }
                
                
                
                $("#touchSlideBlk").one("touchstart",touchstartAction);
            }
            
            
            //touchmoveNs
            function touchmoveNS(){
                
                let offsetClientCoordObj={cx:0,cy:0};
                
                //设置偏移量对象offsetClientCoordObj，结构为{cx:0,cy:0}
                function getCurrentOffset(event){
                    let coord=event.targetTouches[0]
                    ,curClientCoordObj={
                        cX:coord.clientX
                        ,cY:coord.clientY
                    }
                    ;
                    
                    for(let k in curClientCoordObj){
                        offsetClientCoordObj[k]=curClientCoordObj[k]-storedClientCoordObj[k];
                        storedClientCoordObj[k]=curClientCoordObj[k];
                    }
                }
                
                //移动元素
                function moveEles(eles){
                    for(let k in eles){
                        let v=eles[k];
                        if($.isArray(v)){
                            moveEles(v);
                        }else{
                            if(offsetClientCoordObj.cX<0){
                                $(v).css({
                                left:"-="+Math.abs(offsetClientCoordObj.cX)+"px"        //即使在css中原本设置的left值为100%也适用"-="或"+="后跟
                                                                                        //px单位的这种用法
                            });
                            }else{
                                $(v).css({
                                left:"+="+offsetClientCoordObj.cX+"px"
                            });
                            }
                        }
                    }
                }
                
                
                //组件内的方法  域的级别为组件方法级别 在该域内定义的方法和变量围绕要绑定的事件处理程序，和其他方法域共有的变量和方法放在组件级别的域，
                //action 为调用在方法域内定义的函数，形成合适的逻辑，这样的话需要的变量和函数只定义一次，节省内存
                function touchMoveAction(event){
                    getCurrentOffset(event);
                    moveEles(domObject);
                }
                
                
                $("#touchSlideBlk").bind("touchmove",touchMoveAction);
            }
            
            //组件级别的遍历器eles可以是对象，数组，类数组对象，
            function _ergodic(eles,callback){
                for(let k in eles){
                    if($.isArray(eles[k])){
                        _ergodic(eles[k],callback);
                    }else{
                        callback.call(eles[k]);
                    }
                }
            }
            
            
            //touchendNS
            function touchendNS(){
                let aniTime='.3s'
                ,aniTimeMS=300
                ;
                
                function eleAni(){
                    $(this).css({
                        transition:"all "+aniTime+" ease-in-out"
                    });
                    
                    $(this).css(this.dbData.originalPosi);
                    
                    setTimeout(()=>{
                        $(this).css({
                            transition:""
                        });
                    },300);
                }
                
                function reset(){
                    $.each(domObject.relatedEle,function(i,v){
                        $(v).remove();
                    });
                    
                    $.each(relatedClonedDoms,function(i,v){
                        $(v).css({
                            opacity:1
                        });
                    });
                    
                    domObject={};
                    relatedClonedDoms=[];
                    $.each(storedClientCoordObj,function(i,v){
                        v=0;
                    });
                }
                
                function touchEndAction(){
                    _ergodic(domObject,eleAni);
                    reset();
                    touchMoveComponentStart();
                }
                
                $("#touchSlideBlk").bind("touchend",touchEndAction);
            }
            
            
            //组件开启控制器 域的级别为组件级别 在调用此方法时 方法级别的域才开启
            function touchMoveComponentStart(){
                touchstartNS();
                touchmoveNS();
                touchendNS();
            }
            
            
            return {
                touchMoveComponentStart:touchMoveComponentStart
            }
        })();
        
        return {
            touchMoveComponent:touchMoveComponent
        };
        
    })();
    
    db.touchMoveComponent.touchMoveComponentStart();
