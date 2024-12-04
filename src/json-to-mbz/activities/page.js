const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const { generateHtmlContent } = require("../../utils/html");

const generateRandomNumber = () => parseInt(Math.random() * 10000000);
const att_id = () => parseInt(Math.random() * 20000);

// Function to create content from JSON data
const createContent = (data) => {
  const jsonData = JSON.parse(data);
  return jsonData.wp_data.map((post) => {
    const {
      wp_post_id,
      wp_post_title,
      wp_post_content,
      wp_post_date_gmt,
    } = post;

    const context_id = generateRandomNumber();
    const page_id = att_id();

    return {
      moduleid: wp_post_id,
      name: wp_post_title,
      content: wp_post_content,
      timemodified: wp_post_date_gmt,
      contentformat: 1,
      legacyfiles: 0,
      legacyfileslast: "$@NULL@$",
      display: 5,
      displayoptions: {
        printintro: 0,
        printlastmodified: 1,
      },
      revision: 1,
      id: page_id,
      contextid: context_id
    };
  });
};

// Function to update XML with JSON content
const updateXmlWithJsonContent = (xmlData, jsonContent, xmlFilePath, theme) => {
  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder({
    xmldec: { standalone: null, encoding: "UTF-8" },
    cdata: true
  });

  return new Promise((resolve, reject) => {
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        return reject(err);
      }

      // Update the XML content with JSON content
      result.activity.$.id = jsonContent.id;
      result.activity.$.moduleid = jsonContent.moduleid;
      result.activity.$.contextid = jsonContent.contextid;
      result.activity.page[0].$.id= jsonContent.id;
      result.activity.page[0].name[0] = jsonContent.name;
      result.activity.page[0].intro[0] = "";
      result.activity.page[0].introformat[0] = jsonContent.contentformat;
      result.activity.page[0].content[0] = generateHtmlContent(jsonContent.name, jsonContent.content, xmlFilePath, theme);
      result.activity.page[0].contentformat[0] = jsonContent.contentformat;
      result.activity.page[0].legacyfiles[0] = jsonContent.legacyfiles;
      result.activity.page[0].legacyfileslast[0] = jsonContent.legacyfileslast;
      result.activity.page[0].display[0] = jsonContent.display;
      result.activity.page[0].displayoptions[0] = JSON.stringify(jsonContent.displayoptions);
      result.activity.page[0].revision[0] = jsonContent.revision;
      result.activity.page[0].timemodified[0] = jsonContent.timemodified;

      const updatedXml = builder.buildObject(result);
      resolve(updatedXml);
    });
  });
};

// Function to update module.xml with static content
const updateModuleXmlWithStaticContent = (xmlData, folderId, folderName) => {
  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder({
    xmldec: { standalone: null, encoding: "UTF-8" },
    cdata: true
  });

  const sectionId = 5633;
  const timestamp = Math.floor(Date.now() / 1000);

  return new Promise((resolve, reject) => {
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        return reject(err);
      }

      // Update the XML content with static values
      result.module.$.id = folderId;
      result.module.$.version = "2022112800";
      result.module.modulename[0] = folderName;
      result.module.sectionid[0] = sectionId;
      result.module.sectionnumber[0] = 1;
      result.module.idnumber[0] = "";
      result.module.added[0] = timestamp;
      result.module.score[0] = 0;
      result.module.indent[0] = 0;
      result.module.visible[0] = 1;
      result.module.visibleoncoursepage[0] = 1;
      result.module.visibleold[0] = 1;
      result.module.groupmode[0] = 0;
      result.module.groupingid[0] = 0;
      result.module.completion[0] = 0;
      result.module.completiongradeitemnumber[0] = "$@NULL@$";
      result.module.completionpassgrade[0] = 0;
      result.module.completionview[0] = 0;
      result.module.completionexpected[0] = 0;
      result.module.availability[0] = "$@NULL@$";
      result.module.showdescription[0] = 0;
      result.module.downloadcontent[0] = 1;

      const updatedXml = builder.buildObject(result);
      resolve(updatedXml);
    });
  });
};

// Function to read, update, and write XML files
const processPageXmlFiles = (jsonFilePath, xmlDirPath, theme) => {

  fs.readFile(jsonFilePath, "utf8", (err, jsonData) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return;
    }

    const jsonContentArray = createContent(jsonData);

     // List directories in xmlDirPath that start with "page_"
     const pageDirs = fs.readdirSync(xmlDirPath).filter(dir => dir.startsWith('page_'));

     pageDirs.forEach((dir) => {
       const dirPath = path.join(xmlDirPath, dir);
       const xmlFilePath = path.join(dirPath, "page.xml");
       const moduleXmlFilePath = path.join(dirPath, "module.xml");

       // Extract the folder ID and name from the directory name
       const [folderName, folderId] = dir.split('_');

       // Find the corresponding jsonContent based on folderId
       const jsonContent = jsonContentArray.find(content => content.moduleid == folderId);

       if (!jsonContent) {
         console.error(`No JSON content found for folder ID: ${folderId}`);
         return;
       }

       console.log(`Processing page XML file: ${xmlFilePath}`);
       console.log(`Processing module XML file: ${moduleXmlFilePath}`);

       // Update page.xml
       fs.readFile(xmlFilePath, "utf8", (err, xmlData) => {
         if (err) {
           console.error(`Error reading XML file: ${xmlFilePath}`, err);
           return;
         }

         updateXmlWithJsonContent(xmlData, jsonContent, xmlFilePath, theme)
           .then((updatedXml) => {
             fs.writeFile(xmlFilePath, updatedXml, "utf8", (err) => {
               if (err) {
                 console.error(`Error writing page XML file: ${xmlFilePath}`, err);
                 return;
               }
               console.log(`Updated XML page file: ${xmlFilePath}`);
             });
           })
           .catch((err) => {
             console.error("Error updating page XML content:", err);
           });
       });

       // Update module.xml
      fs.readFile(moduleXmlFilePath, "utf8", (err, xmlData) => {
        if (err) {
          console.error(`Error reading XML file: ${moduleXmlFilePath}`, err);
          return;
        }

        updateModuleXmlWithStaticContent(xmlData, folderId, folderName)
          .then((updatedXml) => {
            fs.writeFile(moduleXmlFilePath, updatedXml, "utf8", (err) => {
              if (err) {
                console.error(`Error writing page module XML file: ${moduleXmlFilePath}`, err);
                return;
              }
              console.log(`Updated page module XML file: ${moduleXmlFilePath}`);
            });
          })
          .catch((err) => {
            console.error("Error updating page module XML content:", err);
          });
        });
     });
  });
};

module.exports = { processPageXmlFiles };