//?Espera la obtención de la info del profe
chrome.runtime.onMessage.addListener((message, sender, senRequest) => {
    let bloque=document.querySelectorAll('#v-expansion-panel__body');
    console.log(bloque);
}
);