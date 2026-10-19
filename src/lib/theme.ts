/** Runs before paint (inlined in <head>) so the page never flashes the wrong theme. Dark unless the visitor chose light. */
export const themeScript = `(function(){var t="dark";try{if(localStorage.getItem("theme")==="light")t="light"}catch(e){}document.documentElement.dataset.theme=t})()`;
