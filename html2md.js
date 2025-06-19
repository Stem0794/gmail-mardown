(function(){
  'use strict';
  const MAX_ATTEMPTS = 50;
  let attempts = 0;

  const interval = setInterval(() => {
    const emailBody = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');
    if(emailBody && typeof TurndownService !== 'undefined'){
      clearInterval(interval);
      const selection = window.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const td = new TurndownService();

      if(range && emailBody.contains(range.commonAncestorContainer) && selection.toString().trim()){
        const frag = range.cloneContents();
        const div = document.createElement('div');
        div.appendChild(frag);
        const md = td.turndown(div.innerHTML);
        range.deleteContents();
        range.insertNode(document.createTextNode(md));
        range.collapse(false);
      }else{
        const md = td.turndown(emailBody.innerHTML);
        emailBody.innerText = md;
      }
    }else{
      attempts++;
      if(attempts > MAX_ATTEMPTS){
        clearInterval(interval);
      }
    }
  },300);
})();
