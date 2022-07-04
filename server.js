const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  let userNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4(),
  };

  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    let notes = JSON.parse(data);
    notes.push(userNote);

    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      console.log("Note Saved!");
    });
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
});

app.delete("/api/notes/:id", (req, res) => {
  let clicked = req.params.id;

  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    let notes = JSON.parse(data);

    let filteredNotes = notes.filter((note) => note.id !== clicked);

    fs.writeFile("./db/db.json", JSON.stringify(filteredNotes), (err) => {
      if (err) throw err;
      console.log("Note Deleted!");
    });
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
});

app.listen(PORT, () => console.log("listening on http://localhost:" + PORT));
