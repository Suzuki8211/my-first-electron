const { app, BrowserWindow } = require('electron');

function main() {
    let mainWindow = new BrowserWindow({
        width: 165,
        height: 330,
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
        frame: false
    });


    mainWindow.loadFile('index.html');
    mainWindow.show();
    mainWindow.webContents.on('did-finish-load', ()=> {
        console.log("execute");
        mainWindow.webContents.send('dspStart');
    });
}

app.on('ready', main);
app.on('window-all-closed', () => {
    app.quit();
});