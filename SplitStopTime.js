const fs = require("fs");
const path = require("path");
const readline = require("readline");

const inputFilePath = path.join(__dirname,"GTFS_Realtime", "stop_times.txt");
const outputDir = path.join(__dirname, "GTFS_Realtime", "stop_times_split");
const linesPerFile = 5; // 每个文件包含的行数

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 逐行读取文件并分割
let fileIndex = 1;
let lineCount = 0;
let outputStream = fs.createWriteStream(path.join(outputDir, `stop_times_part_${fileIndex}.txt`));

// 写入表头
const writeHeader = (header) => {
    outputStream.write(header + "\n");
};

// 读取文件流
const rl = readline.createInterface({
    input: fs.createReadStream(inputFilePath),
    crlfDelay: Infinity
});

let header;

// 处理每一行
rl.on("line", (line) => {
    // 将第一行保存为表头
    if (!header) {
        header = line;
        writeHeader(header);
        return;
    }

    // 如果达到指定行数，创建新文件
    if (lineCount >= linesPerFile) {
        outputStream.end(); // 关闭当前文件流
        fileIndex++;
        lineCount = 0;
        outputStream = fs.createWriteStream(path.join(outputDir, `stop_times_part_${fileIndex}.txt`));
        writeHeader(header); // 写入新文件的表头
    }

    // 写入当前行
    outputStream.write(line + "\n");
    lineCount++;
});

rl.on("close", () => {
    outputStream.end();
    console.log("CSV 文件已成功分割！");
});
