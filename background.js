
//?Ejecutar script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
    if (changeInfo.status === 'loading') {
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function(tabs) {
            let tab = tabs[0];
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
    obtenerInfoProfes(nombres,ape);
}
);

function obtenerInfoProfes(nombres,ape){
    fetch('https://www.misprofesores.com/escuelas/Facultad-de-Ciencias-UNAM_2842')
    .then((res)=>{
        if(res.status==200){
            return res.text();
        }else{
            throw res;
        }
    }).then((info)=>{
        console.log(info);
        let profeNom="Eduardo Jos\u00e9".normalize();
        console.log(profeNom);
        let txt1="&#92&#92";
        console.log(txt1);
        let txt2="&#92";
        console.log(txt2);
        let result=info2.normalize().match('Eduardo Jos\u00e9'.normalize())
        console.log(result);

    })
}