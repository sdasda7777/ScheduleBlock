
(async () => {
  const src = chrome.runtime.getURL("./src/options.js");
  const optionsMain = await import(src);
  optionsMain.main();
})();
