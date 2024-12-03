const fs = require("fs");
const path = require("path");
const { buildGroupsXml } = require("./json-to-mbz/groups");
const { buildQuestionsXml } = require("./json-to-mbz/questions");
const { create } = require("lodash");
const createActivitiesFolders = require("./json-to-mbz/activities/create-activities-folders");
const buildLessonsXml = require("./json-to-mbz/activities/lessons");
const createSectionsFolders = require("./json-to-mbz/sections/create-section-folders");
const processSectionXmlFiles = require("./json-to-mbz/sections/section");
const createCourseFolder = require("./json-to-mbz/course/create-course-folder");
const buildCourseXml = require("./json-to-mbz/course/build-course");
const generateMainFiles = require("./json-to-mbz/main-files/create-main-files");

const finalDir = path.join(__dirname, "..", "final-mbz");

// Ensure the output directory exists
if (!fs.existsSync(finalDir)) {
  fs.mkdirSync(finalDir, { recursive: true });
}

const groupsJsonFilePath =
  "./exported_data/json/export-file-groups-2024-07-01-11-30-19.json";
const courseJsonFilePath =
  "./exported_data/json/export-file-sfwd-courses-2024-07-01-11-30-19.json";
const questionsJsonFilePath =
  "./exported_data/json/export-file-quiz_pro_1-2024-07-01-11-30-19.json";
const lessonsJsonFilePath =
  "./exported_data/json/export-file-sfwd-lessons-2024-07-01-11-30-19.json";
const topicsJsonFilePath =
  "./exported_data/json/export-file-sfwd-topic-2024-07-01-11-30-19.json";

function createFinalMoodleBackup() {
  //buildGroupsXml(groupsJsonFilePath, finalDir);
  //buildCoursesXml(courseJsonFilePath, finalDir);
  //buildQuestionsXml(questionsJsonFilePath, finalDir);
  //buildLessonsXml(lessonsJsonFilePath, topicsJsonFilePath, finalDir);

  //createCourseFolder(finalDir);
  //processCourseXmlFile(courseJsonFilePath, finalDir);
  //buildCourseXml(courseJsonFilePath, finalDir);

  const outputDir = './final-mbz/sections';
  const startId = 5630;
  const numberOfSections = 4;
  //createSectionsFolders(outputDir, startId, numberOfSections);
  //processSectionXmlFiles(courseJsonFilePath, outputDir);
  generateMainFiles(finalDir);
  }

createFinalMoodleBackup();
