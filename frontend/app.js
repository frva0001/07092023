const endpoint = "http://localhost:4000";
let selectedArtist;

// start

window.addEventListener("load", start);

function start() {
   updateGrid();

   document.querySelector("#form-create-artist").addEventListener("submit", createArtist);
   document.querySelector("#form-update-artist").addEventListener("submit", updateClicked);
   document.querySelector("#btn-favourites").addEventListener("click", showFavourites);
   document.querySelector("#btn-clear").addEventListener("click", updateGrid);
   document.querySelector("#select-genre").addEventListener("change", genreFilter);
   document.querySelector("#btn-eldest").addEventListener("click", sortByOldFirst);
   document.querySelector("#btn-youngest").addEventListener("click", sortByYoungFirst);
}

// showing artists;

async function getArtists() {
   const response = await fetch(`${endpoint}/`);
   const data = await response.json();
   return data;
}

async function updateGrid() {
   const artists = await getArtists();
   showArtists(artists);
}

function showArtist(artist) {
   const html = /* html */ `
    <article class="artistItem">
        <img src="${artist.image}">
        <p>Name: ${artist.name}</p>
        <p>Birthdate: ${artist.birthdate}</p>
        <p>Active since: ${artist.activeSince}</p>
        <p>Genres: ${artist.genre1}, ${artist.genre2}, ${artist.genre3}</p>
        <p>Labels: ${artist.labels}</p>
        <p>Website: ${artist.website}</p>
        <p>Description: ${artist.shortDescription}</p>
        <p>Favourite: ${artist.favourite}</p>
        <button id= "btn-update" >Update</button>
        <button id= "btn-delete" >Delete</button>

    </article>
    `;

   document.querySelector("#artists").insertAdjacentHTML("beforeend", html);

   document.querySelector("#artists article:last-child #btn-update").addEventListener("click", () => updateArtist(artist));
   document.querySelector("#artists article:last-child #btn-delete").addEventListener("click", () => deleteArtist(artist.id));
}

function showArtists(artists) {
   document.querySelector("#artists").innerHTML = "";

   for (const artist of artists) {
      showArtist(artist);
   }
}

// create new artist

async function createArtist(event) {
   event.preventDefault();
   const elements = document.querySelector("#form-create-artist").elements;

   const artist = {
      name: elements.name.value,
      birthdate: elements.birthdate.value,
      activeSince: elements.activeSince.value,
      genre1: elements.genre1.value,
      genre2: elements.genre2.value,
      genre3: elements.genre3.value,
      labels: elements.labels.value,
      website: elements.website.value,
      image: elements.image.value,
      shortDescription: elements.shortDescription.value,
      favourite: elements.favourite.value,
   };

   console.log(elements.favourite.checked);

   const json = JSON.stringify(artist);
   const response = await fetch(`${endpoint}/`, {
      method: "POST",
      body: json,
      headers: {
         "Content-Type": "application/json",
      },
   });

   if (response.ok) {
      console.log("artist added");
      updateGrid();
   }
}

// update artist

function updateArtist(artist) {
   selectedArtist = artist;

   const update = document.querySelector("#form-update-artist");
   update.name.value = artist.name;
   update.birthdate.value = artist.birthdate;
   update.activeSince.value = artist.activeSince;
   update.genre1.value = artist.genre1;
   update.genre2.value = artist.genre2;
   update.genre3.value = artist.genre3;
   update.labels.value = artist.labels;
   update.website.value = artist.website;
   update.image.value = artist.image;
   update.shortDescription.value = artist.shortDescription;
   update.favourite.value = artist.favourite;
   update.scrollIntoView({ behavior: "smooth" });
}

async function updateClicked(event) {
   event.preventDefault();
   const elements = document.querySelector("#form-update-artist").elements;

   const artist = {
      name: elements.name.value,
      birthdate: elements.birthdate.value,
      activeSince: elements.activeSince.value,
      genre1: elements.genre1.value,
      genre2: elements.genre2.value,
      genre3: elements.genre3.value,
      labels: elements.labels.value,
      website: elements.website.value,
      image: elements.image.value,
      shortDescription: elements.shortDescription.value,
      favourite: elements.favourite.value,
   };
   const json = JSON.stringify(artist);
   const response = await fetch(`${endpoint}/${selectedArtist.id}`, {
      method: "PUT",
      body: json,
      headers: {
         "Content-Type": "application/json",
      },
   });

   if (response.ok) {
      console.log("artist updated");
      updateGrid();
   }
}

// delete artist

async function deleteArtist(id) {
   const response = await fetch(`${endpoint}/${id}`, {
      method: "DELETE",
   });
   if (response.ok) {
      console.log("artist deleted");
      updateGrid();
   }
}

// favourite filter

async function showFavourites(event) {
   const artists = await getArtists();
   const favouritesArray = isFavourite(artists);
   showArtists(favouritesArray);
}

function isFavourite(array) {
   const sortedArray = [];
   for (let i = 0; i < array.length; i++) {
      if (array[i].favourite === "Yes") {
         sortedArray.push(array[i]);
      }
   }
   return sortedArray;
}

// sorts

async function sortByOldFirst(event) {
   const artists = await getArtists();
   const sortedArray = artists.sort((a, b) => new Date(a.activeSince) - new Date(b.activeSince));
   showArtists(sortedArray);
}

async function sortByYoungFirst(event) {
   const artists = await getArtists();
   const sortedArray = artists.sort((a, b) => new Date(b.activeSince) - new Date(a.activeSince));
   showArtists(sortedArray);
}

// filter by genre

async function genreFilter(event) {
   const artists = await getArtists();
   const genre = event.target.value;
   const genreArray = isGenre(artists, genre);
   showArtists(genreArray);
}

function isGenre(array, genre) {
   const sortedArray = [];

   for (let i = 0; i < array.length; i++) {
      if (array[i].genre1 === genre || array[i].genre2 === genre || array[i].genre3 === genre) {
         sortedArray.push(array[i]);
      }
   }
   return sortedArray;
}
