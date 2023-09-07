import express from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
   console.log(`App running on http://localhost:${port}`);
});

app.get("/", async (request, response) => {
   const data = await fs.readFile("data.json");
   const artists = JSON.parse(data);
   response.json(artists);
});

app.post("/", async (request, response) => {
   const newArtist = request.body;
   newArtist.id = new Date().getTime();
   console.log(newArtist);

   const data = await fs.readFile("data.json");
   const artists = JSON.parse(data);

   artists.push(newArtist);
   console.log(newArtist);
   fs.writeFile("data.json", JSON.stringify(artists));
   response.json(artists);
});

app.put("/:id", async (request, response) => {
   const id = Number(request.params.id);
   console.log(id);

   const data = await fs.readFile("data.json");
   const artists = JSON.parse(data);

   let artistToUpdate = artists.find((artist) => artist.id === id);

   const body = request.body;
   console.log(body);
   artistToUpdate.name = body.name;
   artistToUpdate.birthdate = body.birthdate;
   artistToUpdate.activeSince = body.activeSince;
   artistToUpdate.genre1 = body.genre1;
   artistToUpdate.genre2 = body.genre2;
   artistToUpdate.labels = body.labels;
   artistToUpdate.website = body.website;
   artistToUpdate.image = body.image;
   artistToUpdate.shortDescription = body.shortDescription;
   artistToUpdate.favourite = body.favourite;

   fs.writeFile("data.json", JSON.stringify(artists));
   response.json(artists);
});

app.delete("/:id", async (request, response) => {
   const id = Number(request.params.id);

   const data = await fs.readFile("data.json");
   const artists = JSON.parse(data);

   const newArtists = artists.filter((artist) => artist.id !== id);
   fs.writeFile("data.json", JSON.stringify(newArtists));

   response.json(artists);
});
