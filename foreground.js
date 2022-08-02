//?Se obtienen los nombres de los profesores
let nombres=[];
let spans=document.getElementsByTagName("span");
for(i=0; i<spans.length;i++){
    if(spans[i].innerText=="Profesor"){
        nombres.push(spans[i+1].innerText);
    }
}
chrome.runtime.sendMessage({msg:nombres})