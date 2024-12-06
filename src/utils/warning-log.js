const { write } = require("./utils");

// write warning-log.txt to output folder
const writeWarningLog = (title, content) => {
  const cleanedTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const outputFolder = "output/warning-logs";
  const outputFilePath = `${outputFolder}/warning-log-${cleanedTitle}.txt`;

  write(outputFolder, outputFilePath, content);
};

// write todo.json to output folder
const writeTodoJson = (content) => {
  const outputFolder = "output";
  const outputFilePath = `${outputFolder}/todo.json`;

  write(outputFolder, outputFilePath, JSON.stringify(content, null, 2));
};

const generateWarningArray = (results, message) => {
  const warnings = [];

  results.forEach((match) => {
    console.warn("Check warning-logs for:", match);
    warnings.push(`${message}: ${match}`);
  });

  return warnings;
};

const warnSiteUrl = (content) => {
  const regexWholeLine = /{site_url}/g;
  const matches = content.match(regexWholeLine);

  if (!matches) {
    return;
  }

  return generateWarningArray(
    matches,
    "Found {site_url} which needs to be edited"
  );
};

const findMotiva = (content) => {
  const regex = /https:\/\/motiva-verkkokurssit.fi/g;
  const matches = content.match(regex);

  if (!matches) {
    return;
  }

  return generateWarningArray(matches, "Motiva link");
};

const findAudioTags = (content) => {
  const regex = /<audio[^>]+src="([^">]+)"/g;
  const matches = content.match(regex);

  if (!matches) {
    return;
  }

  return generateWarningArray(matches, "Audio");
};

const findImages = (content) => {
  const regex = /<img[^>]+src="([^">]+)"/g;
  const matches = content.match(regex);

  if (!matches) {
    return;
  }

  return generateWarningArray(matches, "Image");
};

const findH2Tags = (content) => {
  const regex = /<h2/g;
  const matches = content.match(regex);

  if (!matches) {
    return;
  }

  return generateWarningArray(
    matches,
    "Heading 2 tag needs be converted to Heading 3. <h2> -> <h3>"
  );
};

const log = {};

const generateTodoJson = (title, content) => {
  const siteUrlWarnings = warnSiteUrl(content);
  const motiveWarnings = findMotiva(content);
  const images = findImages(content);
  const audioTags = findAudioTags(content);
  const h2Tags = findH2Tags(content);

  const logs = {
    siteUrlWarnings,
    motiveWarnings,
    images,
    audioTags,
    h2Tags,
  };

  Object.keys(logs).forEach((key) => {
    if (logs[key]) {
      log[title] = {
        ...log[title],
        [key]: logs[key],
      };
    }
  });

  writeTodoJson(log);
};

const generateWarningLog = (title, content) => {
  generateTodoJson(title, content);
  const siteUrlWarnings = warnSiteUrl(content, title);
  const motiveWarnings = findMotiva(content, title);
  const images = findImages(content, title);
  const audioTags = findAudioTags(content, title);

  if (siteUrlWarnings || motiveWarnings || images || audioTags) {
    writeWarningLog(
      title,
      [
        `Warnings for title: ${title}`,
        ...(siteUrlWarnings ?? []),
        ...(motiveWarnings ?? []),
        ...(images ?? []),
        ...(audioTags ?? []),
        `Content: ${content}`,
      ].join("\n\n")
    );
  }
};

module.exports = {
  generateWarningLog,
};
