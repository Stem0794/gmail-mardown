(function () {
  console.log('[Markdown4Gmail] injector.js loaded');

  const MAX_ATTEMPTS = 50;
  let attempts = 0;

  const interval = setInterval(() => {
    const emailBody = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');
    console.log(`[Markdown4Gmail] Attempt ${attempts}, emailBody found: ${!!emailBody}`);
    console.log(`[Markdown4Gmail] typeof marked: ${typeof marked}`);

    if (emailBody && typeof marked?.parse === 'function') {
      clearInterval(interval);
      const markdown = emailBody.innerText;
      const html = marked.parse(markdown);
      emailBody.innerHTML = html;
    } else {
      attempts++;
      if (attempts > MAX_ATTEMPTS) {
        clearInterval(interval);
        console.log("[Markdown4Gmail] Still couldn't find the email body or Markdown parser after waiting.");
      }
    }
  }, 300);
})();