 const fs = require('fs');
 const path = require('path');
 
 
 
 async function initRepo(){
    
const repoPath = path.join(process.cwd(), '.mygit');
const commitPath = path.join(repoPath, 'commits');

try {
    await fs.promises.mkdir(repoPath, { recursive: true });
    await fs.promises.mkdir(commitPath, { recursive: true });
    await fs.promises.writeFile(path.join(repoPath, 'config.json'),
     JSON.stringify({bucket:process.env.S3_BUCKET}));
    console.log('Repository initialized successfully.');

}catch (err) {
    console.error('Error initializing repository:', err);
    
}
 }

module.exports = {
    initRepo
}