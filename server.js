const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const dataFolder = path.join(__dirname, "GTFS_Realtime");

// 加载 JSON 文件并解析为对象
function loadJSON(fileName) {
    const filePath = path.join(dataFolder, `${fileName}.json`);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    } else {
        throw new Error(`File ${fileName}.json not found`);
    }
}

// 通过公交车名称获取停站信息的接口
app.get("/api/bus-stops", (req, res) => {
    const routeName = req.query.routeName; // 从查询参数中获取公交车名称（如 A1 或 A2）

    if (!routeName) {
        return res.status(400).json({ error: "Route name is required" });
    }

    try {
        // 加载数据
        const routes = loadJSON("routes");
        const stops = loadJSON("stops");
        const trips = loadJSON("trips");
        const stopTimes = loadJSON("stop_times");

        // 查找 route_id
        const route = routes.find(r => r.route_short_name === routeName);
        if (!route) {
            return res.status(404).json({ error: "Route not found" });
        }
        
        const routeId = route.route_id;

        // 获取对应的 trip_id 列表
        const tripIds = trips
            .filter(trip => trip.route_id === routeId)
            .map(trip => trip.trip_id);

        // 从 stop_times.json 中找出相应的 stop_id 并按顺序排序
        const routeStops = stopTimes
            .filter(stopTime => tripIds.includes(stopTime.trip_id))
            .sort((a, b) => a.stop_sequence - b.stop_sequence)
            .map(stopTime => stopTime.stop_id);

        // 根据 stop_id 在 stops.json 中查找站点名称
        const stopDetails = stops
            .filter(stop => routeStops.includes(stop.stop_id))
            .map(stop => ({
                stop_id: stop.stop_id,
                stop_name: stop.stop_name
            }));

        // 返回结果给前端
        res.json({
            route_id: routeId,
            route_name: route.route_short_name,
            stops: stopDetails
        });

    } catch (error) {
        console.error("Error fetching bus stops:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});