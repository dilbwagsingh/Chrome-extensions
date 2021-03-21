// Notification body.
const notification = document.createElement("div");
notification.className = "my-notification";

// Notification text.
const notificationText = document.createElement("p");
notification.appendChild(notificationText);

// Add to current page.
document.body.appendChild(notification);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const notification = document.getElementsByClassName("my-notification")[0];
  const notificationText = notification.getElementsByTagName("p")[0];

  const util = new Util();
  const tabTitle = util.getTitle(request.tabTitle);
  notificationText.innerHTML = tabTitle;

  notification.style.display = "flex";

  setTimeout(function () {
    notification.style.display = "none";
  }, 1000);

  return true;
});
