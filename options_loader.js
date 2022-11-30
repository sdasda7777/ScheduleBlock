
(async () => {
  const src = chrome.runtime.getURL("./options.js");
  const optionsMain = await import(src);
  optionsMain.main();
})();
