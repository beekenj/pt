const fs = require("fs");
const { parse } = require("csv-parse");

const data = [];

fs.createReadStream("./deck.csv")
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
    console.log(data);
    fs.writeFile(
        'data.js', 
        `const data = ${JSON.stringify(data)}; export default data;`, 
        function (err) {
            if (err) return console.log(err);
    });
  });