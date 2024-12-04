const fs = require("fs");
const path = require("path");
const generateCourseFiles = require("./create-course-files");

function createCourseFolder(outputDir) {
  //const courseDir = path.join(outputDir, "course");

  // Ensure the course folder exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created course folder: ${outputDir}`);
  } else {
    console.log(`Course folder already exists: ${outputDir}`);
  }

  // create xml files inside the course folder
  generateCourseFiles(outputDir);
}

module.exports = createCourseFolder;
