
(async () => {
	const src = chrome.runtime.getURL("./src/background.js");
	const background = await import(src);
	background.main();
})();
