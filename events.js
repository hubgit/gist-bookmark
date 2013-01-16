/* insert a script to extract data from the current tab */
var save_to_gist = function() {
	chrome.tabs.executeScript(null, { file: "extract.js" }, function(result) {
		// TODO:
		//var data = result[0];
		//chrome.windows.create({ url: url, type: "detached_panel", width: 700, height: 350, focused: true });
	});
};

/* when the toolbar button is clicked */
chrome.browserAction.onClicked.addListener(save_to_gist);

/* when the keyboard shortcut is pressed */
chrome.commands.onCommand.addListener(function(command) {
  if (command == "save-to-gist") save_to_gist();
});
