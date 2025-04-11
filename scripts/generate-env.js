const fs = require('fs');
const dotenv = require('dotenv');

// Get the optional "configuration" argument from the command line
const args = process.argv.slice(2);
const configuration = args.find(arg => arg.startsWith('configuration='))?.split('=')[1];

// Determine the .env file path based on the configuration
const envFilePath = configuration ? `./.env.${configuration}` : './.env';

// Load environment variables from the specified .env file
const env = dotenv.config({ path: envFilePath }).parsed;

if (!env) {
  console.error(`Failed to load ${envFilePath} file. Ensure the file exists and is properly formatted.`);
  process.exit(1); // Exit the script with an error code
}

console.log(`Loaded environment variables from ${envFilePath}:`, env); // Debug log

// Convert the environment variables to JSON format
const envJson = JSON.stringify(env, null, 2);

// Write the env.json file to the src/assets directory
fs.writeFile('./src/assets/env.json', envJson, (err) => {
  if (err) {
    console.error('Error writing env.json:', err);
  } else {
    console.log('env.json generated successfully.');
  }
});
