
const express = require('express');
const issueController = require('../controllers/issueController');

const issueRouter = express.Router();

issueRouter.post("/createIssue", issueController.createIssue);
issueRouter.put("/updateIssue/:id", issueController.updateIssue);
issueRouter.delete("/deleteIssue/:id", issueController.deleteIssue);
issueRouter.get("/AllIssues", issueController.getAllIssues);
issueRouter.get("/issue/:id", issueController.getIssueById);

module.exports = issueRouter;
