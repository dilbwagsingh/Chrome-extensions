// Fetch data from the API
fetch(
  "https://api.unsplash.com/photos/random/?orientation=landscape&client_id=mQJlo3wxw7LyH9mh0nxZl5cr8hzsGTJiOyzA_5d05Mo"
)
  .then((response) => response.json()) // Translate JSON into JavaScript
  .then((item) => {
    const img = item.urls.full;
    console.log(img);
    const holder = document.getElementById("image");
    holder.src = img;
  })
  .catch((err) => {
    console.error(err.message);
  });
