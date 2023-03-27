const fs = require('fs');
const XLSX = require('xlsx');

// Load JSON file
const jsonData = JSON.parse(fs.readFileSync('dat.json'));

// Define which columns to include in the Excel sheet
const columnsToInclude = ['uid', 'age', 'gender', 'responses'];

// Create an array of rows to include in the Excel sheet
const rows = jsonData.map(item => {
  const row = [];
  columnsToInclude.forEach(column => {
    row.push(item[column]);
  });
  return row;
});

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Create a new sheet in the workbook and populate it with the rows
const sheet = XLSX.utils.aoa_to_sheet([columnsToInclude, ...rows]);
XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

// Write the workbook to a file
XLSX.writeFile(workbook, 'output.xlsx');