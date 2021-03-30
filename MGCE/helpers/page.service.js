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
        /** Switched from chrome.storage.local to cloud storage across the same google account */
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

    let titleAlreadyPresent = false;
    let urlAlreadyPresent = false;
    pages.forEach((page) => {
      if (page.url === url) {
        urlAlreadyPresent = true;
      }
      if (page.title === title) {
        titleAlreadyPresent = true;
      }
    });

    if (!urlAlreadyPresent && !titleAlreadyPresent) {
      updatedPages.push({ title, url });
    } else if (!urlAlreadyPresent && titleAlreadyPresent) {
      title += "_";
      updatedPages.push({ title, url });
    }

    const promise = new Promise((resolve, reject) => {
      try {
        /** [Pages_KEY] is the Computed Property Name, introduced in ECMA 2015 */
        chrome.storage.sync.set({ [PAGES_KEY]: updatedPages }, () => {
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

  static clearPage = async (pageTitle) => {
    // This commented out code would delete the whole database of links stored as an array under the key PAGES_KEY in the chrome sync storage. In my current architechture this cannot be used to clear individual pages but i am planning to use this once i start using the chrome tabGroups API.
    // const promise = new Promise((resolve, reject) => {
    //   try {
    //     chrome.storage.sync.remove(PAGES_KEY, () => {
    //       if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
    //       console.log(pageTitle);
    //       resolve();
    //     });
    //   } catch (err) {
    //     console.log("Error");
    //     reject(err);
    //   }
    // });
    // return promise;

    const pages = await this.getPages();
    const newPages = pages.filter((page) => page.title !== pageTitle);
    const promise = new Promise((resolve, reject) => {
      try {
        this.clearPages();
        chrome.storage.sync.set({ [PAGES_KEY]: newPages }, () => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          resolve(newPages);
        });
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  };
}
