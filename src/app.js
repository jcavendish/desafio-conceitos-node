const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findRepositoryIndex(request, response, next) {
  const { id } = request.params;
  const index = repositories.findIndex((repository) => repository.id === id);
  if (index < 0) {
    return response.status(400).send("Repository not found");
  }
  request.repositoryIndex = index;
  next();
}

app.use("/repositories/:id", findRepositoryIndex);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepository);
  response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const foundRepository = repositories[request.repositoryIndex];
  const repository = {
    id,
    title,
    url,
    techs,
    likes: foundRepository.likes,
  };

  repositories[request.repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  repositories.splice(request.repositoryIndex, 1);
  return response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const repository = repositories[request.repositoryIndex];
  repository.likes++;
  return response.json(repository);
});

module.exports = app;
