var express = require("express");
var router = express.Router();
const fs = require('fs');
const moment = require('moment');
const xlsx = require('xlsx');
let receivedData = '';
let buttonVariable = false;

router.post(`/button`, (req, res) => {
  buttonVariable = req.body.variable;
  console.log(`Received variable value: ${buttonVariable}`);
  res.send("Variable value received");
});

router.get(`/api/button`, (req, res) => {
  res.send(`${buttonVariable}`);
})

router.get(`/api/data`, (req, res) => {
  const { data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13, data14, data15, data16, data17, data18, data19, data20 } = req.query;
  console.log('Received data:', data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13, data14, data15, data16, data17, data18, data19, data20);
  receivedData = [data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13, data14, data15, data16, data17, data18, data19, data20];
  res.status(200).send('Data received successfully');
  writeDataToExcel();
});

function generateValues() {
  const values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  return values;
}

router.get(`/table`, (req, res) => {
  const date = new Date();
  const variables = receivedData.length ? receivedData : generateValues();
  res.render('table.ejs', { variables: variables });
});

router.get(`/variables`, (req, res) => {
  const values = receivedData.length ? receivedData : generateValues();
  res.send({ variables: [values.join(' ')] });
});

function writeDataToExcel() {
  const varr = receivedData.length ? receivedData : generateValues();
  const currentDate = moment().format('YYYY-MM-DD');
  const currentTime = moment().format('HH:mm:ss');
  const data = [[currentTime, varr[0], varr[1], varr[2], varr[3], varr[4], varr[5], varr[6], varr[7], varr[8], varr[9]]];

  // Check if the current date is different from the date in the filename
  const filename = `variables-${currentDate}.xlsx`;
  fs.stat(filename, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.aoa_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        xlsx.writeFile(wb, filename);
      } else {
        throw err;
      }
    } else {
      const wb = xlsx.readFile(filename);
      const ws = wb.Sheets['Sheet1'];
      const previousData = xlsx.utils.sheet_to_json(ws, { header: 1, raw: false });
      const newData = previousData.concat(data);
      ws['!ref'] = `A1:J${newData.length}`;
      xlsx.utils.sheet_add_aoa(ws, newData, { origin: 'A1' });
      xlsx.writeFile(wb, filename);
    }
  });
  console.log('this is good');
}

// setInterval(writeDataToExcel, 1000);

module.exports = router;


// http://192.168.20.52:3000/raw-data/api/data?data1=65.5&data2=123.78&data3=100&data4=4560&data5=65&data6=78&data7=33&data8=42&data9=490&data10=3789&data11=876587&data12=-4&data13=61&data14=1&data15=1&data16=1&data17=1&data18=1&data19=1&data20=1