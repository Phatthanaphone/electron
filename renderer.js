const {ipcRenderer} = require('electron');


closeApp.addEventListener('click', () => {
    ipcRenderer.send('closeApp')
})