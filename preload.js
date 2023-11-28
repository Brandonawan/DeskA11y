// preload.js

const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  runPa11y: (url, standardsFormat, outputFile, outputFormat, outputFolder, runner) => {
    ipcRenderer.send('runPa11y', url, standardsFormat, outputFile, outputFormat, outputFolder, runner);
  },
  receivePa11yResult: (callback) => {
    ipcRenderer.on('pa11yResult', (_, result) => callback(result));
  },
  selectOutputFolder: async () => {
    return await ipcRenderer.invoke('selectOutputFolder');
  },
});

