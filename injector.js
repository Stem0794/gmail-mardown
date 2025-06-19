(function () {
  const emailBody = document.querySelector('[aria-label="Message Body"]');
  if (emailBody && window.marked) {
    const markdown = emailBody.innerText;
    const html = marked.parse(markdown);
    emailBody.innerHTML = html;
  } else {
    alert("Could not find email body or Markdown parser.");
  }
})();