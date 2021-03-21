/** @private */
const PAGES_KEY = "pages"; /* Declaring variable for use later */

/** Shared logic */
class PageService {
  /**
   * @returns {Promise<Array>}
   */
  static getPages = () => {
    const promise = new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get([PAGES_KEY], (result) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);

          const researches = result.pages ?? [];
          resolve(researches);
        });
      } catch (err) {
        reject(err);
      }
    });

    return promise;
  };

  static savePage = async (title, url) => {
    const pages = await this.getPages();
    const updatedPages = [...pages];

    let presentAlready = false;
    pages.forEach((page) => {
      if (page.url === url) {
        presentAlready = true;
      }
    });

    if (!presentAlready) {
      updatedPages.push({ title, url });
    }
    const promise = new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set({ [PAGES_KEY]: updatedPages }, () => {
          /* [Pages_KEY] is the Computed Property Name, introduced in ECMA 2015 */
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          resolve(updatedPages);
        });
      } catch (err) {
        reject(err);
      }
    });

    return promise;
  };

  static clearPages = async () => {
    const promise = new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.clear(() => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);

          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });

    return promise;
  };
}
