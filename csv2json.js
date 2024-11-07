const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputDir = path.join(__dirname, "GTFS_Realtime", "shapes_split");

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }

    // 过滤出所有CSV文件
    const csvFiles = files.filter(file => path.extname(file) === ".csv");

    csvFiles.forEach((file) => {
        const csvFilePath = path.join(inputDir, file);
        const jsonFilePath = path.join(inputDir, file.replace(".csv", ".json"));

        const jsonData = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on("data", (row) => {
                jsonData.push(row);
            })
            .on("end", () => {
                fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
                console.log(`Converted ${file} to JSON format.`);
            })
            .on("error", (error) => {
                console.error(`Error processing file ${file}:`, error);
            });
    });
});
