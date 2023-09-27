const { exec } = require('child_process');
const path = require('path');
console.log(__dirname);

// Specify the path to your HTML file
const htmlFilePath = 'file:///D:/repos/zz%20-%20other/branch%20name%20generator/index.html';

// Check if the platform is Windows or not
const isWindows = process.platform === 'win32';

// Command to open the default web browser based on the platform
const openCommand = isWindows ? 'start' : 'open';

// Execute the command to open the HTML file in the default browser
exec(`${openCommand} ${htmlFilePath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error opening the file: ${error}`);
    return;
  }
  console.log('File opened in the default web browser.');
});
