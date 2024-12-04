const path = require("path");
const fs = require("fs");
const { generateWarningLog } = require("./warning-log");

// remove <!-- wp:<tag> --> and <!-- /wp:<tag> --> from the content
const removeWPTags = (content) => {
  return content
    .replace(/<!--\s*wp:[^>]+-->/g, "")
    .replace(/<!--\s*\/wp:[^>]+-->/g, "");
};

const removeWordPress = (content) => removeWPTags(content);

const copyFile = (source, target) =>
  fs.copyFile(source, target, (err) => {
    if (err) {
      // console.error("Error copying file:", err);
      return;
    }
  });

const saveMatch = (originFilePath, theme) => (match) => {
  const filename = match.replace("{site_url}/wp-content/uploads/", "");
  const outputPath = filename.split("/").slice(0, -1).join("/");

  const outputBase = "output";
  const outputFolder = `${outputBase}/html/${theme}/${outputPath}`;

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const originalFolderPath = originFilePath.split("/").slice(0, -1).join("/");

  const originalFile = path.join(
    __dirname,
    `../../${originalFolderPath}/media/${filename}`
  );

  const destinationPath = path.join(outputFolder, path.basename(filename));

  copyFile(originalFile, destinationPath);
};

const copyFiles = (content, path, theme) => {
  const regex = /{site_url}\/wp-content\/uploads\/[^"]+/g;
  const matches = content.match(regex);

  if (!matches) {
    return content;
  }

  matches.forEach(saveMatch(path, theme));

  return content.replace(regex, (match) =>
    match.replace("{site_url}/wp-content/uploads/", "")
  );
};

// convert wp:embed to iframe
// <!-- wp:embed {"url":"https://www.youtube.com/watch?v=Y_GJOxtAQ4I","type":"video","providerNameSlug":"youtube","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
// to
// <iframe width="560" height="315" src="https://www.youtube.com/embed/Y_GJOxtAQ4I" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
const convertEmbedToIframe = (content) => {
  const regex =
    /<!-- wp:embed {"url":"([^"]+)","type":"video","providerNameSlug":"youtube","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->/g;
  const html = content.replace(
    regex,
    '<iframe width="560" height="315" src="$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  );

  // youtube watch must be replaced with embed
  return html.replace(/watch\?v=/g, "embed/");
};

// remove \n\n
const removeMultipleNewLines = (content) => content.replace(/\n\n/g, "");

const removeWordPressClasses = (content) => {
  return content.replace(/class="wp-[^"]+"/g, "");
};

const generateHtmlContent = (title, content, path, theme) => {
  if(!content) {
    return '';
  }

  const contentWithFiles = copyFiles(content, path, theme);
  const contentWithIframe = convertEmbedToIframe(contentWithFiles);
  const contentWithoutWordpress = removeWordPress(contentWithIframe);
  const contentWithoutMultipleNewlines = removeMultipleNewLines(
    contentWithoutWordpress
  );
  const contentWithoutWordpressClasses = removeWordPressClasses(
    contentWithoutMultipleNewlines
  );

  const formattedContent = contentWithoutWordpressClasses;

  generateWarningLog(title, formattedContent);

  return formattedContent;
}

const generateHtml = ({ title, content }, path, theme) => {
  const formattedContent = generateHtmlContent(title, content, path, theme);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body>
      <h1>${title}</h1>
      <div>${formattedContent}</div>
    </body>
    </html>
    `;
};

module.exports = {
  generateHtmlContent,
  generateHtml,
};
