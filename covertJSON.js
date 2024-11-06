const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputFolderPath = "./GTFS_Realtime";

fs.readdir(inputFolderPath, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach((file) => {
        const inputFilePath = path.join(inputFolderPath, file);

        // 检查文件扩展名是否为 .txt
        if (path.extname(file) === ".txt") {
            const outputFilePath = path.join(inputFolderPath, file.replace(".txt", ".json"));

            // 创建写入流
            const writeStream = fs.createWriteStream(outputFilePath);
            writeStream.write("[\n");

            fs.createReadStream(inputFilePath)
                .pipe(csv())
                .on("data", (data) => {
                    writeStream.write(JSON.stringify(data) + ",\n");
                })
                .on("end", () => {
                    // 删除最后的逗号，并结束数组
                    writeStream.end("null\n]");
                    console.log(`Converted ${file} to JSON format.`);
                })
                .on("error", (error) => {
                    console.error(`Error processing file ${file}:`, error);
                });
        }
    });
});