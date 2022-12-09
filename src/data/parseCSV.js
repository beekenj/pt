const fs = require("fs");
const { parse } = require("csv-parse");

if (process.argv.slice(2).length < 2) {
  console.log('Please include a source file and a destination file in the command line args');
  process.exit(1);
}

const data = [];
const arg1 = process.argv.slice(2)[0];
const arg2 = process.argv.slice(2)[1];

fs.createReadStream(arg1)
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {
    // 👇 push the object row into the array
    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    // 👇 log the result array
    console.log("parsed csv data:");
    // console.log(data);
    fs.writeFile(
        arg2, 
        `const data = ${JSON.stringify(data)}; export default data;`, 
        function (err) {
            if (err) return console.log(err);
    });
  });