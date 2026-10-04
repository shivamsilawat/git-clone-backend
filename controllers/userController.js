
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');
var ObjectId = require('mongodb').ObjectId;


dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
}

async function signup(req, res) {
    const { username, email, password } = req.body;
    try {
        await connectClient();
        const db = client.db('shivamgitclone');
        const usersCollection = db.collection('users');
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = {
                username,
                password: hashedPassword,
                email,
                repositories : [],
                followedUsers: [],
                starRepos : [],

            };
           const result = await usersCollection.insertOne(newUser);

            const token = jwt.sign({id:result.insertedId},
                 process.env.JWT_SECRET, 
                 { expiresIn: '1h' });    
            res.status(201).json({ message: "User created successfully", token,  userId: result.insertedId });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

async function login(req, res){
    const { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db('shivamgitclone');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Login successful", token, userId: user._id });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

async function getAllUsers(req, res) {
    try {
        await connectClient();
        const db = client.db('shivamgitclone');
        const usersCollection = db.collection('users');
        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}

async function getUserProfile(req, res) {
    const currentID = req.params.id;
    try {
        await connectClient();
        const db = client.db('shivamgitclone');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(currentID) });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
}

async function updateUserProfile(req, res) {
    const currentID = req.params.id;
   const {  email, password } = req.body;
   
    try {
      
        await connectClient();
         
        const db = client.db('shivamgitclone');
        const usersCollection = db.collection('users');
        let updatedFields = {};
        if(email){
            updatedFields.email = email;
        }
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedFields.password = hashedPassword;
        }
      
      
        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(currentID) },
            { $set: updatedFields },
            { returnDocument: 'after' }
        );
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json( result);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Error updating user profile", error: error.message });
    }
}

async function deleteUserProfile(req, res) {
    const currentID = req.params.id;
    try {
        await connectClient();
        const db = client.db('shivamgitclone');
        const usersCollection = db.collection('users');
        const result = await usersCollection.deleteOne({ _id: new ObjectId(currentID) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting user profile:", error);
        res.status(500).json({ message: "Error deleting user profile", error: error.message });
    }
}

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};