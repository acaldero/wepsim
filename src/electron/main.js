import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { join } from 'path';
import { writeFileSync } from 'fs';

let mainWindow = null;

function createWindow()
{
    mainWindow = new BrowserWindow({
        width:          1280,
        height:         800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration:  false,
            preload:          join(__dirname, 'preload.js'),
        },
    });

    mainWindow.removeMenu();
    mainWindow.webContents.toggleDevTools();
    mainWindow.loadFile(join(__dirname, '../index.html'));

    mainWindow.on('close', (e) =>
    {
        const choice = dialog.showMessageBoxSync(mainWindow, {
            type:      'question',
            buttons:   ['Exit', 'Cancel'],
            defaultId: 1,
            cancelId:  1,
            title:     'Close WepSIM',
            message:   'Are you sure you want to exit?',
        });

        if (choice === 0)
        {
            mainWindow.destroy();
        }
        else
        {
            e.preventDefault();
        }
    });

    mainWindow.on('closed', () =>
    {
        mainWindow = null;
    });
}

ipcMain.handle('dialog:saveFile', async (_event, textToWrite, defaultName) =>
{
    console.log('handle(dialog:saveFile');
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName,
        filters:     [
            { name: 'All Files', extensions: ['*'] },
            { name: 'Text', extensions: ['txt', 'asm', 's'] },
        ],
    });

    if (!result.canceled && result.filePath)
    {
        writeFileSync(result.filePath, textToWrite, 'utf-8');
        return true;
    }
    return false;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () =>
{
    app.quit();
});
