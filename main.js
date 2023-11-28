const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const pa11y = require('pa11y');
const fs = require('fs').promises;
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
    },
    menuBarVisible: false, // Add this line to hide the menu bar
    frame: false, // Add this line to remove the window frame
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}



ipcMain.on('runPa11y', async (event, url, standard, outputFile, outputFormat, outputFolder, runner) => {
  try {
    const results = await pa11y(url, {
      runners: [runner],
      standard: standard,
      screenCapture: { path: path.join(outputFolder, `${outputFile}.png`) },
    });

    // Return the results directly as JSON
    const jsonResults = JSON.stringify(results);

    // Save the JSON result to a file
    const filePath = path.join(outputFolder, `${outputFile}.json`);
    await fs.writeFile(filePath, jsonResults);

    event.reply('pa11yResult', { result: jsonResults, filePath });
  } catch (error) {
    event.reply('pa11yResult', { error: error.message });
  }
});

ipcMain.handle('selectOutputFolder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
