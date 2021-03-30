/** Shared logic */
class Util {
  /**
   * Gets the active Tab
   * @returns {Promise<*>} Active tab
   */
  getActiveTab = async () => {
    const query = { active: true, currentWindow: true };
    const getTabTitlePromise = new Promise((resolve, reject) => {
      chrome.tabs.query(query, (tabs) => {
        resolve(tabs[0]);
      });
    });
    return getTabTitlePromise;
  };

  /**
   * @param {String} tabTitle Current tab title
   * @returns {String}
   */
  getTitle = (tabTitle) => {
    const title = `Bookmarked <br><b>${tabTitle}</b>`;
    return title;
  };
}
