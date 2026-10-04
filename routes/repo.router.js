const express = require('express');
const repoController = require('../controllers/repoController');
const authMiddleware = require("../middleware/authMiddleware");

const repoRouter = express.Router();




repoRouter.post("/createRepo", repoController.createRepository);
repoRouter.get("/AllRepos", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repoByName/:name", repoController.fetchRepositoryByName);
// repoRouter.get("/currentUserRepo", repoController.fetchRepositoryForCurrentUser);
repoRouter.get(
    "/currentUserRepo",
    authMiddleware,
    repoController.fetchRepositoryForCurrentUser
);
repoRouter.put("/updateRepo/:id", repoController.updateRepositoryById);
repoRouter.delete("/deleteRepo/:id", repoController.deleteRepository);
repoRouter.patch("/toggleVisibility/:id", repoController.toggleRepositoryVisibilityById);


module.exports = repoRouter;