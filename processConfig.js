const fs = require("fs");
const path = require("path");

// Get file paths from environment variables or use defaults
const CONFIG_FILE =
  process.env.CONFIG_FILE || path.join(__dirname, "config.json");
const OUTPUT_FILE =
  process.env.OUTPUT_FILE || path.join(__dirname, "githubconfigsFile.json");

// Function to read the project configuration from config.json
const getConfigData = () => {
  try {
    const data = fs.readFileSync(CONFIG_FILE, "utf8");
    console.log(`Debug: Reading configuration from file: ${CONFIG_FILE}`);
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${CONFIG_FILE}:`, err.message);
    return {};
  }
};

// Function to read GitHub inputs (from the environment or GitHub Actions context)
const getGithubInputs = () => {
  try {
    if (process.env.GITHUB_INPUTS) {
      console.log(
        "Debug: Raw GITHUB_INPUTS environment variable:",
        process.env.GITHUB_INPUTS
      );
      return JSON.parse(process.env.GITHUB_INPUTS);
    }
    console.log(
      "Debug: GITHUB_INPUTS environment variable is not set or empty."
    );
    return {};
  } catch (err) {
    console.error("Error parsing GITHUB_INPUTS:", err.message);
    return {};
  }
};

// Function to determine the final config to use (GitHub inputs or fallback to config.json)
const getFinalConfig = () => {
  let configData = getGithubInputs();

  if (!configData || Object.keys(configData).length === 0) {
    console.log("No GitHub inputs received. Falling back to config.json...");
    configData = getConfigData();
  }

  if (!configData || Object.keys(configData).length === 0) {
    console.warn(
      "Final configuration is empty. Ensure inputs or config.json are provided."
    );
  }

  return configData;
};

// Function to save the final config to githubconfigsFile.json
const saveConfigToFile = (configData) => {
  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(configData, null, 2), "utf8");
    console.log(`GitHub Configs saved to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error(`Error writing to ${OUTPUT_FILE}:`, err.message);
  }
};

// Main execution
const finalConfigData = getFinalConfig();
saveConfigToFile(finalConfigData);
