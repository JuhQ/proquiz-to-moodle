const fs = require('fs');
const path = require('path');

const sectionsJsonContent = (finalDir) => {
    const sectionsDir = path.join(finalDir, "sections");
    try {
      const sectionFolderNames = fs.readdirSync(sectionsDir);

      const result = sectionFolderNames
        .filter((folderName) => folderName.startsWith("section_"))
        .map((folderName) => {
          const folderId = folderName.replace("section_", "");
          return { wp_post_id: parseInt(folderId) };
        });

      return result;
    } catch (error) {
      console.error("Error generating JSON content:", error);
      return [];
    }
}

const jsonContent = (sectionData) => {
  // Read the JSON data from a file
  const data = JSON.parse(
    fs.readFileSync(
      "./exported_data/json/export-file-sfwd-courses-2024-07-01-11-30-19.json",
      "utf-8"
    )
  ).wp_data;

  // Find the post with wp_post_id: 5630
  const post5630 = data.find((post) => post.wp_post_id === 5630);
  if (!post5630) {
    throw new Error("Post with wp_post_id 5630 not found.");
  }

  // Extract content (paragraphs, headings, lists) from the wp_post_content
  const content = post5630.wp_post_content;
  const paragraphs = [...content.matchAll(/<p>.*?<\/p>/gs)].map((match) =>match[0]);
  const headings = [...content.matchAll(/<h[1-6]>.*?<\/h[1-6]>/gs)].map((match) => match[0]);
  const lists = [...content.matchAll(/<li>.*?<\/li>/gs)].map((match) => match[0]);

  // Ensure there are enough paragraphs
  if (paragraphs.length < 2) {
    throw new Error(
      "Not enough paragraphs in the content to extract the first two."
    );
  }

  // Construct the JSON result
  // TODO: Check the layout in the website to ensure the correct data of sections
  const result = sectionData.map((section, index) => {
    return {
      wp_post_id: section.wp_post_id,
      wp_post_content: [
        headings[index] || "", // Heading for this section (if exists)
        ...paragraphs.slice(index * 2, index * 2 + 2), // Two paragraphs per section
        ...lists, // Include lists if available
      ],
    };
  });

  return result;
};

// Main function to run both tasks asynchronously
const generateCombinedJsonData = async (finalDir) => {
  try {
    // Step 1: Generate section data
    const sectionData = sectionsJsonContent(finalDir);

    // Step 2: Generate content JSON and combine it with section data
    const finalJson = jsonContent(sectionData);

    // Save the final combined JSON data to a file
    fs.writeFileSync(
      "./exported_data/json/combined_sections.json",
      JSON.stringify({ wp_data: finalJson }, null, 2)
    );

    console.log("JSON file created with the final combined data.");
  } catch (error) {
    console.error("Error during JSON generation:", error);
  }
};

module.exports = generateCombinedJsonData;
