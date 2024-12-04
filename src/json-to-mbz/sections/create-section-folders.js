const fs = require('fs');
const path = require('path');
const generateBoaInforefXml = require('../../components/activities/board-xml-files/generateBoaInforefXml');
const { generateSectionXml } = require('../../components/section/sectionXmlFiles/generateSectionXml');

function createSectionsFolders(finalDir) {

    // Ensure the main folder exists
    if (!fs.existsSync(finalDir)) {
        fs.mkdirSync(finalDir, { recursive: true });
        console.log(`Created parent folder: ${finalDir}`);
    } else {
        console.log(`Parent folder already exists: ${finalDir}`);
    }

    const sectionsDir = path.join(finalDir, "sections");
    if (!fs.existsSync(sectionsDir)) {
      fs.mkdirSync(sectionsDir, { recursive: true });
      console.log(`Created sections directory: ${sectionsDir}`);
    } else {
      console.log(`Sections directory already exists: ${sectionsDir}`);
    }

    startId = 5631;
    numberOfSections = 4;

    // create sections folders
    for (let i = startId; i < startId + numberOfSections; i++) {
        const folderName = `section_${i}`;
        const folderPath = path.join(sectionsDir, folderName);

        // Check if the folder already exists
        if (!fs.existsSync(folderPath)) {
            // Create the section folders
            fs.mkdirSync(folderPath);
            console.log(`Created folder: section_id ${folderPath}`);
        } else {
            console.log(`Folder already exists: ${folderPath}`);
        }

        // Generate XML files inside the created subdirectory
        generateBoaInforefXml(folderPath);
        generateSectionXml(folderPath);
    }
}

module.exports = createSectionsFolders;
