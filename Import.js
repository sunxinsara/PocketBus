const sqlite3 = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new sqlite3("gtfs.db");
const dataFolder = path.join(__dirname, "GTFS_Realtime");

function importJSON(fileName, tableName, columns) {
    const data = JSON.parse(fs.readFileSync(path.join(dataFolder, `${fileName}.json`), "utf-8"));
    const placeholders = columns.map(() => "?").join(",");
    const insert = db.prepare(`INSERT INTO ${tableName} (${columns.join(",")}) VALUES (${placeholders})`);

    db.transaction(() => {
        data.forEach((item, index) => {
            // 检查 item 是否为有效对象
            if (!item || typeof item !== 'object') {
                console.warn(`Skipping invalid record in ${fileName} at index ${index + 1}:`, item);
                return;
            }

            // 将每个列的值获取出来，如果字段不存在则使用 `null`
            const values = columns.map(column => item.hasOwnProperty(column) ? item[column] : null);

            // 如果所有的值都是 null，则跳过该条数据
            if (values.every(value => value === null)) {
                console.warn(`Skipping incomplete record in ${fileName} at index ${index + 1}:`, item);
                return;
            }

            try {
                insert.run(...values);
            } catch (error) {
                console.error(`Error inserting record in ${fileName} at index ${index + 1}:`, error, item);
            }
        });
    })();
}

// 创建表格并导入数据
function setupDatabase() {
    db.prepare("CREATE TABLE IF NOT EXISTS calendar (service_id TEXT, monday INTEGER, tuesday INTEGER, wednesday INTEGER, thursday INTEGER, friday INTEGER, saturday INTEGER, sunday INTEGER, start_date TEXT, end_date TEXT)").run();
    db.prepare("CREATE TABLE IF NOT EXISTS calendar_dates (service_id TEXT, date TEXT, exception_type INTEGER)").run();
    db.prepare("CREATE TABLE IF NOT EXISTS routes (route_id TEXT, agency_id TEXT, route_short_name TEXT, route_long_name TEXT, route_desc TEXT, route_type INTEGER, route_url TEXT)").run();
    db.prepare("CREATE TABLE IF NOT EXISTS shapes (shape_id TEXT, shape_pt_lat REAL, shape_pt_lon REAL, shape_pt_sequence INTEGER)").run();
    db.prepare("CREATE TABLE IF NOT EXISTS stop_times (trip_id TEXT, arrival_time TEXT, departure_time TEXT, stop_id TEXT, stop_sequence INTEGER)").run();
    db.prepare("CREATE TABLE IF NOT EXISTS stops (stop_id TEXT, stop_name TEXT, stop_lat REAL, stop_lon REAL)").run();
    db.prepare("CREATE TABLE IF NOT EXISTS trips (route_id TEXT, service_id TEXT, trip_id TEXT, trip_headsign TEXT)").run();

    importJSON("calendar", "calendar", ["service_id", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "start_date", "end_date"]);
    importJSON("calendar_dates", "calendar_dates", ["service_id", "date", "exception_type"]);
    importJSON("routes", "routes", ["route_id", "agency_id", "route_short_name", "route_long_name", "route_desc", "route_type", "route_url"]);
    importJSON("shapes", "shapes", ["shape_id", "shape_pt_lat", "shape_pt_lon", "shape_pt_sequence"]);
    importJSON("stop_times", "stop_times", ["trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence"]);
    importJSON("stops", "stops", ["stop_id", "stop_name", "stop_lat", "stop_lon"]);
    importJSON("trips", "trips", ["route_id", "service_id", "trip_id", "trip_headsign"]);
}

setupDatabase();
console.log("All data imported successfully.");
