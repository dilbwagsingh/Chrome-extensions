const displayPages = async () => {
  const visitedPages = await PageService.getPages();
  visitedPages.reverse();
  const pageList = document.getElementById("page-list");
  pageList.innerHTML = "";

  visitedPages.forEach((page) => {
    const pageItem = document.createElement("li");
    pageList.appendChild(pageItem);

    const pageLink = document.createElement("a");
    pageLink.title = page.url;
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

// Implementing search-bar functionality
const input = document.getElementById("input");
input.addEventListener("keyup", () => {
  const filter = input.value.trim().toLowerCase();
  const itemList = document.querySelectorAll("li");

  itemList.forEach((item) => {
    const txtValue = item.textContent || item.innerText;
    if (txtValue.toLowerCase().indexOf(filter) < 0) {
      item.classList.add("disappear");
    } else {
      item.classList.remove("disappear");
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  // Display history.
  await displayPages();

  const clearHistoryBtn = document.getElementById("clear-history");
  clearHistoryBtn.onclick = async () => {
    // Commented out for testing purposes of the clear all links confirm window
    // await PageService.clearPages();
    await displayPages();
  };
});

// Add to list in real-time even when the popup window is open
chrome.storage.sync.onChanged.addListener(async () => {
  await displayPages();
});
