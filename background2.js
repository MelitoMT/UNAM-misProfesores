
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
}
);