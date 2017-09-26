let _getTrueDomComponent=(function(){
           //get true dom func-start**********************
        
            //data
            let classCheckReg=/^(\.([\w-\d]+))$/
                ,idCheckReg=/^(#([\w-\d]+))$/
                ,tagCheckReg=/^([\w-\d]+)$/  
                ,spaceReg=/\s+/
                ,checkRegArr=[classCheckReg,idCheckReg,tagCheckReg]
                ,currentReg=null
                    ;

                classCheckReg.checkType="classReg";
                idCheckReg.checkType="idReg";
                tagCheckReg.checkType="tagReg";

            //清除两边空格，单个或多个参数都转化为数组
            function _arrayPara(para){
                para=para.trim();

                spaceReg.test(para)?(function(){
                    para=para.split(spaceReg);
                }()):(function(){
                    para=[para];
                })();

                return para;
            }

            //遍历器 绑定了regMatch由纯粹的遍历逻辑转变为遍历
            function _ergodic(arrayablePara){
                return $.map(arrayablePara,_regMatch);
            }

            //正则表达式类名，id名，tag名抽取器
            function _regMatch(selr,index){
                return $.map(checkRegArr,function(reg,ix){
                if(reg.test(selr)){
                    return _getTrueDom(reg,selr);
                }
            })[0];
            }

            //获取真实dom
            function _getTrueDom(reg,selr){
                var selectorText
                    ,selectorType=reg.checkType
                ;

                switch(selectorType){
                    case "classReg":
                        selectorText=reg.exec(selr)[2];
                        return document.getElementsByClassName(selectorText);
                    case "idReg":
                        selectorText=reg.exec(selr)[2];
                        return document.getElementById(selectorText);
                    case "tagReg":
                        selectorText=reg.exec(selr)[1];
                        return document.getElementsByTagName(selectorText);
                } 
            }
            
            //selector:"./#/tag name"单个".className" 或多
            //个".className #idName tagName"都可以
            //当为多个选择器时返回的数组会是一个按选择器顺序排列的数组，
            //无效的选择器不占据位置，由后边的选择器得到dom元素补上,
            //对于className和tagName选择器来说得到在结果数组的相应位置
            //如果选择器有效在结果数组的相应位置是一个HTMLCollection的
            //类数组对象
            //return :由 seletor 的合法值取得的dom 元素的一个数组
            function getTrueDom(selectorStr){
                return _ergodic(_arrayPara(selectorStr));
            }
            
            return {
              getTrueDom:getTrueDom 
            };
        })();
