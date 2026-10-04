const  mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");







async function createIssue(req, res) {
    const {title, description} = req.body;
    const {id} = req.params;

try{

    
    const issue = new Issue({
        title,
        description,
        repository: id,
    });

    await issue.save();
    res.status(201).json(issue);


}catch(error){
     console.error("Error to creating issue", err.message);
        res.status(500).send("server error");

}


}

async function updateIssue (req, res) {
    const {id} = req.params;
       const {title, description} = req.body;

    
    try{

        const issue = await Issue.findById(id);
        if(!issue){
            return res.status(404).json({error: " issue not found"});
        }

        issue.title = title;
        issue.description = description;
        issue.status = status;

        await issue.save();
        res.json(issue);

    }catch(error){
         console.error("Error to update issue", err.mrssage);
        res.status(500).send("server error");
    }
    
}
async function deleteIssue (req, res)  {
const {id} = req.params;



    try{
const issue = Issue.findByIdAndDelete(id);

if(!issue){
    return res.status(404).json({error: " issue not foud"});

}
res.json({message:"issue deleted"});
    }catch(error){
         console.error("Error to delete issue", err.mrssage);
        res.status(500).send("server error");
    }
    
}

async function getAllIssues(req, res) {

    const {id} = req.params;




    try{

        const issues = Issue.find({repository: id});
        if(!issues){
            return res.status(404).json({error:"issues not founnd"});
        }
        res.json(200).json(issues);

    }catch(error){
         console.error("Error error to get all issue", err.mrssage);
        res.status(500).send("server error");
    }
   
}

async function getIssueById (req, res) {
const {id} = req.params;


    try{
        const issue = await Issue.findById(id);
        if(!issue){
            return res.status(404).json({error:" issue not found"});
        }

        res.json(issue);

    }catch(error){
         console.error("Error to get issue by id", err.mrssage);
        res.status(500).send("server error");
    }
    
}


module.exports = {
    createIssue,
    updateIssue,
    deleteIssue,
    getAllIssues,
    getIssueById
}