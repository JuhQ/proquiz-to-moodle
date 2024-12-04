const fs = require("fs");
const path = require("path");
const { processCourseXmlFile } = require("./course");
const createCourseFolder = require("./create-course-folder");
const generateCourseFiles = require("./create-course-files");

async function buildCourseXml(courseJsonFilePath, finalDir) {
  console.log("courseJsonFilePath", courseJsonFilePath);

  const courseDir = path.join(finalDir, "course");
  const courseXmlPath = path.join(courseDir, "course.xml");

  // Check if the main folder exists
  if (!fs.existsSync(finalDir)) {
    // Create the main folder if it doesn't exist
    fs.mkdirSync(finalDir, { recursive: true });
    console.log(`Created main directory: ${finalDir}`);
  }

  // Check if the course folder exists
  if (!fs.existsSync(courseDir)) {
    // Create the course folder if it doesn't exist
    await createCourseFolder(courseDir);

    // Generate course files after folder creation
    await generateCourseFiles(courseDir);

    // Process the XML files after files are generated
    await processCourseXmlFile(courseJsonFilePath, courseDir);
  } else {
    // If the course folder exists, check if the XML file is missing
    if (!fs.existsSync(courseXmlPath)) {
      // Generate course files if the XML is missing
      await generateCourseFiles(courseDir);
    }

    // Update the XML files with the new data
    await processCourseXmlFile(courseJsonFilePath, courseDir);
  }
}

module.exports = buildCourseXml;
