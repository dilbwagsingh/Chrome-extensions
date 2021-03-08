const baseUrl = "https://api.unsplash.com/photos/";
const orient = "landscape";
const accessKey = "mQJlo3wxw7LyH9mh0nxZl5cr8hzsGTJiOyzA_5d05Mo";
const numberOfImages = 100;

const queryString = `${baseUrl}?orientation=${orient}&per_page=${numberOfImages}&client_id=${accessKey}`;
// console.log(queryString);

/*
To store in DB- items.links.html, items.urls.full, 
*/

// Using IndexedDB as clinet-side storage
// const dbName = "fancyTabDB";
// let db;

// // Prevent using IndexedDB funcitonality before the tab has fully loaded
// window.onload = () => {
//   let request = window.indexedDB.open(dbName, 1);

//   request.onerror = () => {
//     console.log("Failed to open database connection");
//   };

//   request.onsuccess = () => {
//     console.log("Database connection opened successfully");
//     db = request.result;
//   };

//   request.onupgradeneeded = (event) => {
//     let db = event.target.result;
//     let objectStore = db.createObjectStore(dbName, {
//       keyPath: "id",
//       autoIncrement: true,
//     });

//     objectStore.createIndex("title", "title", { unique: false });
//     objectStore.createIndex("body", "body", { unique: false });
//     console.log("Database setup complete");
//   };
// };

// Fetch data from the API
if (localStorage.length == 0) {
  fetch(queryString)
    .then((response) => response.json())
    .then((items) => {
      let id = 1;
      console.log("API called");
      items.forEach((item) => {
        localStorage.setItem(id++, item.urls.regular);
      });
      const img = items[0].urls.full;
      const holder = document.getElementById("image");
      holder.src = img;
    })
    .catch((err) => {
      console.error(err.message);
    });
} else {
  console.log("No API called");
  const index = 1 + Math.trunc(Math.random() * 10);
  const img = localStorage.getItem(index);
  const holder = document.getElementById("image");
  holder.src = img;
}

window.onclose = () => {
  localStorage.clear();
};
