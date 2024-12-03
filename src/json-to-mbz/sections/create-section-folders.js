const fs = require('fs');
const path = require('path');
const generateBoaInforefXml = require('../../components/activities/board-xml-files/generateBoaInforefXml');
const { generateSectionXml } = require('../../components/section/sectionXmlFiles/generateSectionXml');

function createSectionsFolders(outputDir, startId, numberOfSections) {

    // Ensure the parent "sections" folder exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created parent folder: ${outputDir}`);
    } else {
        console.log(`Parent folder already exists: ${outputDir}`);
    }

    // create sections folders
    for (let i = startId; i < startId + numberOfSections; i++) {
        const folderName = `section_${i}`;
        const folderPath = path.join(outputDir, folderName);

        // Check if the folder already exists
        if (!fs.existsSync(folderPath)) {
            // Create the folder
            fs.mkdirSync(folderPath);
            console.log(`Created folder: ${folderPath}`);
        } else {
            console.log(`Folder already exists: ${folderPath}`);
        }

        // Generate XML files inside the created subdirectory
        generateBoaInforefXml(folderPath);
        generateSectionXml(folderPath);
    }
}

module.exports = createSectionsFolders;