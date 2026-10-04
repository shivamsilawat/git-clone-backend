const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');








async function createRepository(req, res) {
    const {  owner,name, description, content, issues, visibility } = req.body;

    try{
        if(!name){
            return res.status(400).send("Repository name is required");
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).send("Invalid owner ID");
        }

        const newRepository = new Repository({
            name,
            description,
            content,
            visibility,
            owner,
            issues
        });


         const result = await newRepository.save();
        res.status(201).send("Repository created successfully", { repositoryId: result._id });
    }catch(err){
        res.status(500).send("Error creating repository");
    }

}

async function getAllRepositories(req, res) {
    try{
        const repositories = await Repository.find({}).populate('owner', 'username email').populate('issues', 'title description status');
        res.status(200).send(repositories);
    }catch(err){
        res.status(500).send("Error fetching repositories");
    }
}

async function fetchRepositoryById(req, res) {
    const {repoID} = req.params.id;
    try{
        const repository =  Repository.find({_id: repoID}).populate('owner', 'username email').populate('issues', 'title description status').toArray();
        if(!repository){
            return res.status(404).send("Repository not found");
        }
        res.status(200).send(repository);
    }catch(err){
        res.status(500).send("Error fetching repository");
    }
}

async function fetchRepositoryByName(req, res) {
    const {name} = req.params;
    try{
        const repository = await  Repository.find({ name})
        .populate('owner')
        .populate('issues');
        if(!repository){
            return res.status(404).send("Repository not found");
        }
        res.status(200).send(repository);
    }catch(err){
        res.status(500).send("Error fetching repository");
    }

}


async function fetchRepositoryForCurrentUser(req, res) {
    const userId = req.user._id; // Assuming you have user authentication and the user ID is available in req.user
    try {
        const repositories = await Repository.find({ owner: userId })
          if (! repositories || repositories.length === 0) {
            return res.status(404).json({error: "No repositories found for the current user"});
          }
          res.json({message: "Repositories is found", repositories});
    } catch (err) {
        res.status(500).send("Error fetching repositories for the current user");
    }
}

async function updateRepositoryById(req, res) {
const { id } = req.params;
const {description, content } = req.body;
try{

    const repository = await Repository.findById(id);
    if (!repository) {
        return res.status(404).json({error: "Repository not found"});
    }
         repository.description = description;
        repository.content.push(content);

        const updatedRepository = await repository.save();
        res.json({
            message: "Repository usdated successfullly",
            repository: updatedRepository,
        });

}catch(err){
    console.error(err);
    res.status(500).json({error: "Error updating repository"});
}
}

async function toggleRepositoryVisibilityById(req, res) {
    const {id} = req.params;
    
const {description, content } = req.body;
try{

    const repository = await Repository.findById(id);
    if (!repository) {
        return res.status(404).json({error: "Repository not found"});
    }
         repository.visibility = !repository.visibility;

        const updatedRepository = await repository.save();
        res.json({
            message: "Repository visibility toggled successfullly",
            repository: updatedRepository,
        });

}catch(err){
    console.error(err);
    res.status(500).json({error: "Error updating repository"});

}
}

async function deleteRepository(req, res) {
    const {id} = req.params;
    try{

        const repository = await Repository.findOneAndDelete(id);
        if(!repository){
            return res.status(404).json({error: "repository not found"});
        }
        res.json({ message: "Repository deleted succsessfully"});
    }catch(error){
        console.error("Error during deleting repository", err.message);
        res.status(500).send("server error");

    }
}

module.exports ={
    createRepository,
    getAllRepositories,
    fetchRepositoryById,    
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleRepositoryVisibilityById,
    deleteRepository
}