const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

const generateContextid = () => parseInt(Math.random() * 10000000);
const oneYearInSeconds = 365 * 24 * 60 * 60;
const timestamp = Math.floor(Date.now() / 1000);
const oneYearFromNow = timestamp + oneYearInSeconds;

// Function to create course content from JSON data
const createCourseContent = (data) =>
    JSON.parse(data).wp_data.map(
        ({
            wp_post_id,
        }) => ({
            id: wp_post_id,
            contextid: generateContextid(),
            startdate: timestamp,
            enddate: oneYearFromNow,
            timecreated: timestamp,
            timemodified: timestamp,
        })
    );



// Function to update XML with JSON content
const updateCourseXmlWithJsonContent = (xmlData, jsonContent) => {
  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder({
    xmldec: { standalone: null, encoding: "UTF-8" },
  });

  return new Promise((resolve, reject) => {
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        return reject(err);
      }
      // Update course.xml
      result.course.$.id = jsonContent.id;
      result.course.$.contextid = jsonContent.contextid;
      result.course.shortname = "Pro quiz";
      result.course.fullname = "Pro quiz course";
      result.course.startdate = jsonContent.startdate;
      result.course.enddate = jsonContent.enddate;
      result.course.timecreated = jsonContent.timecreated;
      result.course.timemodified = jsonContent.timemodified;

      const updatedXml = builder.buildObject(result);
      resolve(updatedXml);
    });
  });
};

const enrol_id1 = () => parseInt(Math.random() * 100000);
const enrol_id2 = () => parseInt(Math.random() * 100000);

// function to update enrolments.xml
const updateEnrolmentsXml = (xmlData, jsonContent) => {
  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder({
    xmldec: { standalone: null, encoding: "UTF-8" },
  });

  return new Promise((resolve, reject) => {
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        return reject(err);
      }
      // Update enrolments.xml
      if (
        result.enrolments &&
        result.enrolments.enrols &&
        result.enrolments.enrols[0] &&
        result.enrolments.enrols[0].enrol
      ) {
        result.enrolments.enrols[0].enrol.forEach((enrol, index) => {
          enrol.$.id = index === 0 ? enrol_id1() : enrol_id2();
          enrol.timecreated = jsonContent.timecreated;
          enrol.timemodified = jsonContent.timemodified;
        });
      }

      const updatedXml = builder.buildObject(result);
      resolve(updatedXml);
    });
  });
}

// Function to read, update, and write XML files
const processCourseXmlFile = async (jsonFilePath, xmlDirPath) => {
try {
  const jsonData = await fs.promises.readFile(jsonFilePath, "utf8"); // read json file
  const jsonContentArray = createCourseContent(jsonData);

  const courseXmlFilePath = path.join(xmlDirPath, "course.xml");
  const enrolmentsXmlFilePath = path.join(xmlDirPath, "enrolments.xml");

  // Read both XML files asynchronously
  const [courseXmlData, enrolmentsXmlData] = await Promise.all([
    fs.promises.readFile(courseXmlFilePath, "utf8"),
    fs.promises.readFile(enrolmentsXmlFilePath, "utf8"),
  ]);

  // Initialize variables to hold the updated XML data
  let updatedCourseXml = courseXmlData;
  let updatedEnrolmentsXml = enrolmentsXmlData;

  // Process each jsonContent
  for (const jsonContent of jsonContentArray) {
    try {
      updatedCourseXml = await updateCourseXmlWithJsonContent(updatedCourseXml, jsonContent ); // Update course XML data
    } catch (err) {
      console.error("Error updating course XML content:", err);
    }

    try {
      updatedEnrolmentsXml = await updateEnrolmentsXml(updatedEnrolmentsXml, jsonContent); // Update enrolments XML data
    } catch (err) {
      console.error("Error updating enrolments XML content:", err);
    }
  }

  // After processing all jsonContent, write the updated XML files
  await Promise.all([
    fs.promises.writeFile(courseXmlFilePath, updatedCourseXml, "utf8"),
    fs.promises.writeFile(enrolmentsXmlFilePath, updatedEnrolmentsXml, "utf8"),
  ]);

  console.log("XML files updated successfully.");
} catch (err) {
  console.error("Error processing course XML file:", err);
}
};
exports.processCourseXmlFile = processCourseXmlFile;
