const fs = require("fs");
const path = require("path");
const { processBookXmlFiles } = require("./book");
const { processPageXmlFiles } = require("./page");
const createActivitiesFolders = require("./create-activities-folders");

// This function reads the lessons JSON file and the topics JSON file, and creates the XML files for the lessons
function buildLessonsXml(lessonsJsonFilePath, topicsJsonFilePath, finalDir) {
  fs.readFile(lessonsJsonFilePath, "utf8", (err, lessonsData) => {
    if (err) {
      console.error("Error reading lessons JSON file:", err);
      return;
    }

    fs.readFile(topicsJsonFilePath, "utf8", (err, topicsData) => {
      if (err) {
        console.error("Error reading topics JSON file:", err);
        return;
      }

      // Create activities folders
      createActivitiesFolders(finalDir, lessonsData);
      console.log("Activities folders created successfully at", finalDir);

      // Process the XML files, passing both JSON datasets
      processPageXmlFiles(lessonsJsonFilePath, path.join(finalDir, "activities"), "lessons");
      processBookXmlFiles(lessonsJsonFilePath, topicsJsonFilePath, path.join(finalDir, "activities"));
      console.log("XMLs processed and created in", finalDir);
    });
  });
}

module.exports = buildLessonsXml;