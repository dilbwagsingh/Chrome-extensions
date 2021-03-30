importScripts("util.js", "page.service.js");

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "duplicate-tab":
      await duplicateTab();
      break;
    case "bookmark-and-close":
      await bookmarkAndClose();
      break;
    case "bookmark":
      await notifyAndBookmark();
      break;
    default:
      console.log(`Command ${command} not found`);
  }
});

/**
 * Gets the current active tab URL and opens a new tab with the same URL.
 */
const duplicateTab = async () => {
  const util = new Util();
  const tab = await util.getActiveTab();
  chrome.tabs.create({ url: tab.url, active: false });
};

const notifyAndBookmark = async () => {
  const util = new Util();
  const tab = await util.getActiveTab();
  chrome.tabs.sendMessage(tab.id, { tabTitle: tab.title });

  // Store page
  await PageService.savePage(tab.title, tab.url);
};

const bookmarkAndClose = async () => {
  const util = new Util();
  const tab = await util.getActiveTab();

  // Store page
  await PageService.savePage(tab.title, tab.url);

  // Close current tab
  chrome.tabs.remove(tab.id);
};
