const displayPages = async () => {
  const visitedPages = await PageService.getPages();
  const pageList = document.getElementById("page-list");
  pageList.innerHTML = "";

  visitedPages.forEach((page) => {
    const pageItem = document.createElement("li");
    pageList.appendChild(pageItem);

    const pageLink = document.createElement("a");
    pageLink.title = page.title;
    pageLink.innerHTML = page.title;
    pageLink.href = page.url;

    // Delete individual items from the list
    const deleteBtn = document.createElement("a");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.className = "del-btn";
    deleteBtn.addEventListener(
      "click",
      function (event) {
        PageService.clearPage(page.title);
        // pageItem.parentNode.removeChild(pageItem);
      },
      false
    );

    // Prevent the link from opening in the extension pop-up
    pageLink.onclick = (event) => {
      event.preventDefault();
      chrome.tabs.create({ url: event.target.href, active: false });
    };

    // Displaying the added bookmark in the extension
    pageItem.appendChild(pageLink);
    pageItem.appendChild(deleteBtn);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  // Display history.
  await displayPages();

  const clearHistoryBtn = document.getElementById("clear-history");
  clearHistoryBtn.onclick = async () => {
    await PageService.clearPages();
    await displayPages();
  };
});

// Add to list in real-time even when the popup window is open
chrome.storage.sync.onChanged.addListener(async () => {
  await displayPages();
});
