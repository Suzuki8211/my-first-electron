const { app, BrowserWindow } = require('electron');

function main() {
    let mainWindow = new BrowserWindow({
        width: 1000,
        height: 300,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });

    mainWindow.loadFile('index.html');
    mainWindow.show();
    mainWindow.once('show', ()=> {
        console.log("execute");
        mainWindow.webContents.send('dspStart');
    });
}

app.on('ready', main);
app.on('window-all-closed', () => {
    app.quit();
});