/**
 * Runs before paint (inlined in <head>) so the page never flashes the wrong theme. Dark unless the visitor chose light.
 * It also raises the opening sequence (data-intro) unless a viewer profile was already picked this session,
 * so without JavaScript the page simply renders with no overlay.
 */
export const themeScript = `(function(){var d=document.documentElement,t="dark";try{if(localStorage.getItem("theme")==="light")t="light"}catch(e){}d.dataset.theme=t;try{if(!sessionStorage.getItem("series-profile"))d.dataset.intro="1"}catch(e){}})()`;

export const PROFILE_KEY = "series-profile";
