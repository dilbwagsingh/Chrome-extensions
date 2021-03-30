importScripts("./helpers/util.js", "./helpers/page.service.js");

// Asking user to access all urls at the time of install
chrome.runtime.onStartup.addListener((r) => {
  if (r.reason === "install") {
    chrome.permissions.request({
      origins: ["<all_urls>"],
    });
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "open-grouped-tab":
      await openGroupedTab();
      break;
    case "create-new-group":
      await createNewGroup();
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
const openGroupedTab = async () => {
  const util = new Util();
  const tab = await util.getActiveTab();

  chrome.tabs.create({ index: tab.index + 1 }, (newTab) => {
    chrome.tabs.group({ tabIds: newTab.id, groupId: tab.groupId });
  });
};

const createNewGroup = async () => {
  const util = new Util();
  const tab = await util.getActiveTab();

  if (tab.groupId === -1) chrome.tabs.group({ tabIds: tab.id });
};

const notifyAndBookmark = async () => {
  const util = new Util();
  const tab = await util.getActiveTab();
  chrome.tabs.sendMessage(tab.id, { tabTitle: tab.title });

  // Store page
  await PageService.savePage(tab.title, tab.url);
};
