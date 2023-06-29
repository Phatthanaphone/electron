const { ipcRenderer,remote } = require('electron');
const fs = require('fs')
const fileDownload = require('js-file-download')
const fileInput = document.querySelector('#file-input')
const submitButton = document.querySelector('#submit-btn')


submitButton.addEventListener('click', () => {
  const files = fileInput.files

  if (files.length > 0) {

    // console.log(files)
  
    ipcRenderer.send('file-selected',files[0].path)
  } else {
    console.log('No file selected')
  }
})



ipcRenderer.on('read-file-reply', (event, err, data) => {
  if (err) {
    console.error(err)
  } else {
    console.log(data)
    fileDownload(data, new Date().toJSON().slice(0,16)+ ".xlsx")
  }
})



