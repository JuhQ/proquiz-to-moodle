const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

const generateRandomNumber = () => parseInt(Math.random() * 10000000);
const bookatt_id = () => parseInt(Math.random() * 10000);

// Function to create content from JSON data
const createContent = (data) => {
  const jsonData = JSON.parse(data);
  return jsonData.wp_data.map((post) => {
    const {
      wp_post_id,
      wp_post_title,
      wp_post_content,
      wp_post_date_gmt,
      wp_post_date,
      wp_postmeta,
      wp_menu_order,
    } = post;

    const context_id = generateRandomNumber();
    const book_id = bookatt_id();

    // Find the specific meta value for "lesson_id"
    const lessonMeta = wp_postmeta.find(meta => meta.wp_meta_key === "lesson_id");
    const lessonId = lessonMeta ? lessonMeta.wp_meta_value : null;

    return {
      id: book_id,
      contextid: context_id,
      moduleid: wp_post_id,
      name: wp_post_title,
      intro: wp_post_content,
      timemodified: wp_post_date_gmt,
      timecreated: wp_post_date,
      introformat: 1,
      numbering: 1,
      navstyle: 1,
      customtitles: 0,
      chapterId: wp_post_id,
      lessonId: lessonId,
      title: wp_post_title,
      content: wp_post_content,
      order: wp_menu_order,
    };
  });


};

// Function to update XML with JSON content
const updateBookXmlWithJsonContent = (xmlData,  bookJsonContent, sortedChaptersJsonContent) => {
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

      // Update the <book> section
      result.activity.$.id = bookJsonContent.id;
      result.activity.$.moduleid = bookJsonContent.moduleid;
      result.activity.$.contextid = bookJsonContent.contextid;
      result.activity.book[0].$.id = bookJsonContent.id;
      result.activity.book[0].name[0] = bookJsonContent.name;
      result.activity.book[0].intro[0] = bookJsonContent.intro;
      result.activity.book[0].introformat[0] = bookJsonContent.introformat;
      result.activity.book[0].numbering[0] = bookJsonContent.numbering;
      result.activity.book[0].navstyle[0] = bookJsonContent.navstyle;
      result.activity.book[0].customtitles[0] = bookJsonContent.customtitles;
      result.activity.book[0].timecreated[0] = bookJsonContent.timecreated;
      result.activity.book[0].timemodified[0] = bookJsonContent.timemodified;

      // Update the <chapters> section
      const chaptersArray = result.activity.book[0].chapters[0].chapter || [];
      chaptersArray.length = 0; // Clear existing chapters

      sortedChaptersJsonContent.forEach((chapter, index) => {
        chaptersArray.push({
          $: { id: chapter.chapterId || "" },
          pagenum: [index + 1],
          subchapter: [chapter.subchapter || 0],
          title: [chapter.title || `Chapter ${index + 1}`],
          content: [chapter.content || ""],
          contentformat: [1],
          hidden: [0],
          timemodified: [chapter.timemodified || ""],
          importsrc: [chapter.importsrc || ""],
        });
      });

      result.activity.book[0].chapters[0].chapter = chaptersArray;

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
const processBookXmlFiles = (lessonsJsonPath, topicsJsonPath, xmlDirPath) => {
  fs.readFile(lessonsJsonPath, "utf8", (err, lessonsData) => {
    if (err) {
      console.error("Error reading JSON file (lessonsPath):", err);
      return;
    }

    fs.readFile(topicsJsonPath, "utf8", (err, topicsData) => {
      if (err) {
        console.error("Error reading JSON file (topicsPath):", err);
        return;
      }

      const lessonsContentArray = createContent(lessonsData); // For <book> data
      const topicsContentArray = createContent(topicsData);  // For <chapters> data

      // List directories in xmlDirPath that start with "book_"
      const bookDirs = fs.readdirSync(xmlDirPath).filter(dir => dir.startsWith('book_'));

      bookDirs.forEach((dir) => {
        const dirPath = path.join(xmlDirPath, dir);
        const xmlFilePath = path.join(dirPath, "book.xml");
        const moduleXmlFilePath = path.join(dirPath, "module.xml");

        // Extract the folder ID and name from the directory name
        const [folderName, folderId] = dir.split('_');

        // Find the corresponding JSON content based on folderId
        const bookJsonContent = lessonsContentArray.find(content => content.moduleid == folderId);

        // Filter chapters that match the book's ID (lessonId matches book_id)
        const chaptersJsonContent = topicsContentArray.filter(content => content.lessonId == folderId);
        const sortedChaptersJsonContent = chaptersJsonContent.sort((a, b) => a.order - b.order);

        if (!bookJsonContent) {
          console.error(`No book JSON content found for folder ID: ${folderId}`);
          return;
        }

        console.log(`Processing book XML file: ${xmlFilePath}`);
        console.log(`Processing module XML file: ${moduleXmlFilePath}`);

        // Update book.xml
        fs.readFile(xmlFilePath, "utf8", (err, xmlData) => {
          if (err) {
            console.error(`Error reading XML file: ${xmlFilePath}`, err);
            return;
          }

          updateBookXmlWithJsonContent(xmlData, bookJsonContent, sortedChaptersJsonContent)
            .then((updatedXml) => {
              fs.writeFile(xmlFilePath, updatedXml, "utf8", (err) => {
                if (err) {
                  console.error(`Error writing book XML file: ${xmlFilePath}`, err);
                  return;
                }
                console.log(`Updated XML book file: ${xmlFilePath}`);
              });
            })
            .catch((err) => {
              console.error("Error updating book XML content:", err);
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
                console.error(`Error writing book module XML file: ${moduleXmlFilePath}`, err);
                return;
              }
              console.log(`Updated book module XML file: ${moduleXmlFilePath}`);
            });
          })
          .catch((err) => {
            console.error("Error updating book module XML content:", err);
          });
        });
      });
    });
  });
};

module.exports = { processBookXmlFiles };