const { app, BrowserWindow, ipcMain,Menu } = require('electron');
const path = require('path');
const reader = require('xlsx');
// const { readFile } = require('fs').promises;
const fs = require('fs')
var Excel = require('exceljs');
var workbook = new Excel.Workbook();
const fileDownload = require('js-file-download')
var os = require('os');
var { dialog } = require('electron')
const {download} = require('electron-dl');
app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // icon: './icon/upload.png',
    webPreferences: {
        devTools: true,
        nodeIntegration:true,
        contextIsolation:false
    }
  });

      //Build menu from template
      const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
      //Insert menu
      Menu.setApplicationMenu(mainMenu);

  ipcMain.on('file-selected', async (event, filePath) => {
    
    const file = reader.readFile(filePath);
    // console.log(filePath)
    const sheetNames = file.SheetNames;

     let data  =[]
    // Get the first sheet
    const sheets = file.SheetNames
  
    
    for(let i = 0; i < sheets.length; i++){
   
      const temp = reader.utils.sheet_to_json(
           file.Sheets[file.SheetNames[0]])
      temp.forEach((res) => {
         data.push(res)
      })
   
   }

   let result = data
  //  console.log(result)
   let dataArr = result.map((e) => Object.values(e));
  //  console.log(dataArr)
   let sumArr = [];

   for(let i = 0; i < dataArr.length; i++){
    
    // console.log(dataArr[i])
    for(let j =0; j < dataArr[i].length; j++ ) {

        
        if(!sumArr[j]){
            sumArr[j] = [];
        }
        sumArr[j].push(dataArr[i][j])

        // console.log(sumArr[j])
       
    }
    
    
}

let arrResult = [];



sumArr.forEach((arr) => {
  let sum = arr.reduce(  (accumulator, currentValue) => accumulator + currentValue,
   0);
  let length  = arr.length;
  let avg = sum / length
  // arrResult.push({sum, length, avg})
  arrResult.push(avg)
})

await workbook.xlsx.readFile('data.xlsx')
// .then(async function() {

    var worksheet = workbook.getWorksheet(1);
    // console.log(arrResult)
        for(let i = 1; i < arrResult.length; i++) {
            var row = worksheet.getRow(2+i);
            row.getCell(4).value = arrResult[i]; // A5's value set to 5
            row.commit();
        }

    let filename = `temp/${new Date().toJSON().slice(0,10)}.xlsx`;
    await workbook.xlsx.writeFile(filename);
    console.log(filename)

  
    fs.readFile(filename, (err, data) => {
      if (err) {
        event.reply('read-file-reply', err)
      } else {
        event.reply('read-file-reply', null, data)
       
      }
    })
    // fileDownload(filename,filename)
    // event.reply('data-from-backend-reply', filename);
//arrived
  })

  



  mainWindow.loadFile('index.html');
});

//Create menu template
const mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label:'Add Item',
          click() {
            createAddWindow();
          }
        },
        {
          label:'Clear Items'
        },
        {
          label:'Quit',
          accelerator: process.platform == 'darwin' ? 'command+Q' : 'ctrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    }
  ]
  
  // IF mac, add empty object to menu
  if(process.platform == 'drawin') {
    mainMenuTemplate.unshift({});
  }

// Add developer tools item if not in prod
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Toggle devTools',
          accelerator: process.platform == 'darwin' ? 'command+I' : 'ctrl+I',
          click(item, focusedWindow) {
             focusedWindow.toggleDevTools();
          }
        },
        {
          role: 'reload'
        }
      ]
    });
  }