const { app, BrowserWindow } = require('electron');
const path = require('path');

function main() {
    let mainWindow = new BrowserWindow({
        width: 250,
        height: 300,
    });
    mainWindow.loadFile('index.html');

    
    mainWindow.once('show', ()=> {
        mainWindow.webContents.send('dspStart');
        console.log("show");
    });
}

app.on('ready', main);
app.on('window-all-closed', () => {
    app.quit();
});