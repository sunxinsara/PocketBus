const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const shapesFilePath = path.join(__dirname,"GTFS_Realtime", "stop_times.txt");
const outputDir = path.join(__dirname,"GTFS_Realtime", "stop_times");

// 创建输出文件夹
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 存储用于写入的文件流
const shapeFileStreams = {};

fs.createReadStream(shapesFilePath)
    .pipe(csv())
    .on("data", (row) => {
        const tripId = row.tripId;

        // 检查 trip_id 是否存在
        if (!tripId) {
            console.warn("Skipping record without shape_id:", row);
            return;
        }

        // 如果没有为该 shape_id 创建写入流，则创建新的文件流
        if (!shapeFileStreams[tripId]) {
            const outputFilePath = path.join(outputDir, `shape_${tripId}.csv`);
            shapeFileStreams[tripId] = fs.createWriteStream(outputFilePath, { flags: "a" });
            shapeFileStreams[tripId].write("trip_id,arrival_time,departure_time,stop_id,stop_sequence,stop_headsign,pickup_type,drop_off_type,timepoint\n"); // 写入 CSV 表头
            console.log(`Created file for trip_id ${tripId}: ${outputFilePath}`);
        }

        // 将当前记录写入对应的文件流
        shapeFileStreams[tripId].write(`${row.shape_id},${row.shape_pt_lat},${row.shape_pt_lon},${row.shape_pt_sequence},${row.shape_dist_traveled}\n`);
    })
    .on("end", () => {
        // 关闭所有文件流
        Object.keys(shapeFileStreams).forEach((shapeId) => {
            shapeFileStreams[shapeId].end();
            console.log(`Closed file for shape_id ${shapeId}`);
        });
        console.log("Shapes data successfully split by shape_id.");
    })
    .on("error", (error) => {
        console.error("Error processing shapes CSV file:", error);
    });
