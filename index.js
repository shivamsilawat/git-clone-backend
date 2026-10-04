const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const dns = require("dns");

const mainRouter = require("./routes/main.router");







const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');




const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();


yargs(hideBin(process.argv))
.command("start","start a new Server",{},startServer)
.command("init", "Initialize the repository",  {}, initRepo)
.command("add <file>", "Add files to the repository", (yargs) => {
    yargs.positional("file", {
        describe: "File to add",
        type: "string"
    });
}, (argv) => {
    addRepo(argv.file)
}
)


.command("commit <message>", "Commit changes to the repository", (yargs) => {
    yargs.positional("message", {
        describe: "Commit message",
        type: "string"
    });
    }, 

    (argv) => {
        commitRepo(argv.message);
    }
)

.command("push", "Push changes to the remote repository",  {}, pushRepo)
.command("pull", "Pull changes from the remote repository",  {}, pullRepo)
.command("revert <commitID>", "Revert changes in the repository", (yargs) => {
    yargs.positional("commitID", {
        describe: "Commit ID to revert",
        type: "string"
    });
}, (argv) => {
    revertRepo(argv.commitID);
})
.demandCommand(1,"Please provide a command")
.help().argv;

function startServer() {
   const app = express();
   const port = process.env.PORT || 3002;


    app.use(cors({ origin: "*" }));
   app.use(bodyParser.json());
   app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
   app.use("/", mainRouter);
  
   

   const mongoURI = process.env.MONGODB_URI;
  
   
   mongoose.connect(mongoURI).then(() => {
       console.log("Connected to MongoDB");
   }).catch((err) => {
       console.error("Error connecting to MongoDB:", err);
   });

   app.use(cors({origin: "*"}));


   let user = "testUser";

   const httpServer = http.createServer(app);
   const io = new Server(httpServer, {
       cors: {
           origin: "*",
           methods: ["GET", "POST"]
       }
   });

   io.on("connection", (socket) => {
      socket.on("joinRoom",(userID) => {
         userID = userID;
         console.log("=====");
         console.log(user);
         console.log("=====");
         socket.join(userID);
      });
   });


   const db = mongoose.connection;

   db.once("open", async () => {
       console.log("CRUD oerations called");
       // Call CRUD operations here
   });

   httpServer.listen(port, () => {
       console.log(`Server is running on port ${port}`);
   });
}