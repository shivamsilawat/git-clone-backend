const fs = require('fs').promises;
const path = require('path');


async function addRepo(filepath) {
    const repoPath = path.resolve(process.cwd(),".mygit");

    const staingingPath = path.join(repoPath, "staging");
    

    try {

        await fs.mkdir(staingingPath, { recursive: true });
        const fileName = path.basename(filepath);
        await fs.copyFile(filepath, path.join(staingingPath, fileName));
        console.log(`File ${fileName} added to staging area.`);

}catch(err){
    console.error("Error creating staging directory:", err);
}

}


module.exports = {
    addRepo
}