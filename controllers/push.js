
const fs = require('fs').promises;

const path = require('path');
const { s3, S3_BUCKET } = require('../.mygit/config/aws-config');


async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), '.mygit');
    const commitsPath = path.join(repoPath, 'commits');

    try{

        const commitDirs = await fs.readdir(commitsPath);
        for(const commitDir of commitDirs){
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);

            for(const file of files){
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);

                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent
                };
                await s3.upload(params).promise();
            }
        }
        console.log("Repository pushed to S3 successfully.");
    }catch (err) {
        console.error("Error occurred while pushing repository:", err);
    }
}

module.exports = {
    pushRepo
}