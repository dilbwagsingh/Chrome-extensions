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

    // Prevent the link from opening in the extension pop-up
    pageLink.onclick = (event) => {
      event.preventDefault();
      chrome.tabs.create({ url: event.target.href, active: false });
    };

    // Displaying the added bookmark in the extension
    pageItem.appendChild(pageLink);
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
