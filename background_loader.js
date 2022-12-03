
(async () => {
  const src = chrome.runtime.getURL("./background.js");
  const background = await import(src);
  background .main();
})();
