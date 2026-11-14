/**
 * Runs before first paint (inline in <body>) so the first visit renders the
 * intro overlay immediately instead of flashing the page content and then
 * covering it after hydration.
 *
 * Returning visitors within the same session and reduced-motion users skip it.
 * Failure to read storage must not break the page.
 */
export const introBootScript =
  '(function(){try{var d=document.documentElement;' +
  'if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;' +
  'if(window.sessionStorage.getItem("studio-intro-seen")==="1")return;' +
  'd.setAttribute("data-studio-intro","on")}catch(e){}})()'
