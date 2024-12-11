const fs = require("fs");

// Function to read the project configuration from config.json
const getConfigData = () => {
  try {
    const data = fs.readFileSync("config.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading config.json:", err);
    return {};
  }
};

// Function to read GitHub inputs (from the environment or GitHub Actions context)
const getGithubInputs = () => {
  console.log("Debug: Reading inputs from environment variables...");

  const projectName = process.env.PROJECT_NAME ?? "DefaultProject";
  console.log(`PROJECT_NAME: ${projectName}`);

  const client = process.env.CLIENT ?? "DefaultClient";
  console.log(`CLIENT: ${client}`);

  const projectManager = process.env.PROJECT_MANAGER ?? "DefaultPM";
  console.log(`PROJECT_MANAGER: ${projectManager}`);

  const qaManager = process.env.QA_MANAGER ?? "DefaultQA";
  console.log(`QA_MANAGER: ${qaManager}`);

  const expectedLoadTime = process.env.EXPECTED_LOAD_TIME ?? "3 seconds";
  console.log(`EXPECTED_LOAD_TIME: ${expectedLoadTime}`);

  // Return the inputs as an object
  return {
    projectName,
    client,
    projectManager,
    qaManager,
    expectedLoadTime,
  };
};

// Function to determine the final config to use (GitHub inputs or fallback to config.json)
const getFinalConfig = () => {
  let configData = getGithubInputs(); // First, try using GitHub inputs

  if (!configData || Object.keys(configData).length === 0) {
    console.log("No GitHub inputs received. Falling back to config.json...");
    configData = getConfigData(); // Fall back to config.json if inputs are empty
  }

  return configData;
};

// Function to save the final config to githubconfigsFile.json
const saveConfigToFile = (configData) => {
  try {
    fs.writeFileSync(
      "githubconfigsFile.json",
      JSON.stringify(configData, null, 2),
      "utf8"
    );
    console.log("GitHub Configs saved to githubconfigsFile.json");
  } catch (err) {
    console.error("Error writing to githubconfigsFile.json:", err);
  }
};

// Main execution
const finalConfigData = getFinalConfig();
saveConfigToFile(finalConfigData);
 
