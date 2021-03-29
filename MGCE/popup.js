const displayPages = async () => {
  const visitedPages = await PageService.getPages();
  visitedPages.reverse();
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
    deleteBtn.innerHTML =
      '<img src="./images/icon-delete.png" width=16px height=16px/>';
    deleteBtn.className = "del-btn";
    deleteBtn.addEventListener(
      "click",
      function (event) {
        PageService.clearPage(page.title);
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
    pageList.appendChild(pageItem);
  });
};

const input = document.getElementById("input");
input.addEventListener("keyup", () => {
  let filter = input.value.trim().toUpperCase();
  let itemList = document
    .getElementById("page-list")
    .getElementsByTagName("li");

  for (let i = 0; i < itemList.length; i++) {
    let txtValue = itemList[i].textContent || itemList[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      itemList[i].style.display = "";
    } else {
      itemList[i].style.display = "none";
    }
  }
});

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
