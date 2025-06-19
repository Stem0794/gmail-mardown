(function () {
  /*! https://github.com/markedjs/marked */
  !function(t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):(this.marked=t())}(function(){"use strict";function t(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;")}
function e(t,e){if("string"!=typeof t)throw new Error(`Expected string but received ${typeof t}`);return e?e(t):t}
function n(t,n){return e(t,function(t){const e=document.createElement("div");return e.innerHTML=t.trim(),e.childNodes.length>0?e.innerHTML:t})}function r(t){return t=e(t),t=n(t),t}
return function(){return{parse:r}}}());

  const MAX_ATTEMPTS = 30;
  let attempts = 0;

  const interval = setInterval(() => {
    const emailBody = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');

    if (emailBody && typeof marked === 'object' && typeof marked.parse === 'function') {
      clearInterval(interval);
      const markdown = emailBody.innerText;
      const html = marked.parse(markdown);
      emailBody.innerHTML = html;
    } else {
      attempts++;
      if (attempts > MAX_ATTEMPTS) {
        clearInterval(interval);
        alert("Still couldn't find the email body or Markdown parser after waiting.");
      }
    }
  }, 300);
})();