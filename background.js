
//?Ejecutar script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
    if (changeInfo.status === 'loading') {
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function(tabs) {
            let tab = tabs[0];
            //?Arreglar reg primer .+
            if(/https:\/\/www.fciencias.unam.mx\/docencia\/horarios\/.+\/.+\/.+/.test(tab.url)){
                chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['foreground.js'] });
            }
        });
    }
});
//?Espera la obtención de nombres
chrome.runtime.onMessage.addListener((message, sender, senRequest) => {
    console.log(message.msg);
    let nombres=[];
    let ape=[];
    message.msg.forEach(elem => {
        var temp= elem.split(' ');
        nombres.push(temp[0]);
        ape.push(temp[temp.length - 2]+' '+temp[temp.length - 1]);
    });
    obtenerInfoProfes(nombres,ape, sender.tab.id);
}
);
function convertirUnicode(str){
    let unicodeChars=[225,233,237,243,250,193,201,205,211,218,209,241,252]
    var strUni='';
    for(letter in str){
        if(unicodeChars.includes(str.charCodeAt(letter))){
            strUni += "\\\\u00"+str.charCodeAt(letter).toString(16);
        }
        else{
            strUni += str[letter];
        }
    }
    return strUni;
}
function desconvertirUnicode(str){
    let removed = str.normalize('NFD').replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,'$1').normalize();
  return removed;
}
function hacerRegex(str,opt){
    let reg=''
    let strNormal=desconvertirUnicode(str);
    if(opt){
        let strSplit= str.split(' ');
        let strNormalSplit=strNormal.split(' ');
        if(opt==1){
            reg +=strSplit[0]+'|'+strNormalSplit[0];
        }
        else{
            reg +=strSplit[1]+'|'+strNormalSplit[1];
        }
    }else{
        reg += strNormal+'|'+str;
    }
    return reg;
}
function obtenerInfoProfes(nombres,ape,tabid){
    fetch('https://www.misprofesores.com/escuelas/Facultad-de-Ciencias-UNAM_2842')
    .then((res)=>{
        if(res.status==200){
            return res.text();
        }else{
            throw res;
        }
    }).then((info)=>{
        let nombresUni=[];
        let apeUni=[]
        let infoProfe=[]
        nombres.forEach(element => {
            nombresUni.push(convertirUnicode(element));
        });
        ape.forEach(element => {
            apeUni.push(convertirUnicode(element));
        });
        for(i=0; i<nombres.length;i++){
            let regexita= new RegExp('{[^}]*('+hacerRegex(nombres[i])+'|'+hacerRegex(nombresUni[i])+')[^}]*('+hacerRegex(ape[i],1)+'|'+hacerRegex(apeUni[i],1)+')[^}]*('+hacerRegex(ape[i],2)+'|'+hacerRegex(apeUni[i],2)+')[^}]*}','i');
            if(regexita.test(info)){
                infoProfe.push(JSON.parse(info.match(regexita)[0]))
            }
            else{
                infoProfe.push(null);
            }
        }
        chrome.tabs.sendMessage(tabid, {inf: infoProfe})
        chrome.tabs.insertCSS(null, {file:'./misprofes.css'});
    })
    .catch((resi)=>{
        console.log('Error, lo lamentamos...')
    })
}