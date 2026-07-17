import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,

    showSaveDialog: async (textToWrite, defaultName) =>
    {
        return ipcRenderer.invoke('dialog:saveFile', textToWrite, defaultName);
    },
});
