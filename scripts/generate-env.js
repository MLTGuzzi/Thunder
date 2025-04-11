const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from the .env file
const env = dotenv.config({path: './.env'}).parsed;

if (!env) {
  console.error('Failed to load .env file. Ensure the file exists and is properly formatted.');
  process.exit(1); // Exit the script with an error code
}

console.log('Loaded environment variables:', env); // Debug log

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
