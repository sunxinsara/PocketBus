const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const dataDir = path.join(__dirname, "GTFS_Realtime");
const shapesDir = path.join(dataDir, "shapes_split");

// 路由：根据公交线路名称获取路线数据
app.get("/api/route", (req, res) => {
    const routeName = req.query.routeName; // 获取查询参数中的公交线路名称，例如 "A1"

    if (!routeName) {
        return res.status(400).json({ error: "Route name is required" });
    }

    // Step 1: 通过 routeName 查找 route_id
    const routesFilePath = path.join(dataDir, "routes.json");
    fs.readFile(routesFilePath, "utf-8", (err, routesData) => {
        if (err) {
            console.error("Error reading routes.json:", err);
            return res.status(500).json({ error: "Error reading routes data" });
        }

        const routes = JSON.parse(routesData);
        const route = routes.find(r => r.route_short_name === routeName);

        if (!route) {
            console.error(`Route not found for name: ${routeName}`);
            return res.status(404).json({ error: "Route not found" });
        }

        const routeId = route.route_id;

        // Step 2: 通过 route_id 查找 shape_id
        const tripsFilePath = path.join(dataDir, "trips.json");
        fs.readFile(tripsFilePath, "utf-8", (err, tripsData) => {
            if (err) {
                console.error("Error reading trips.json:", err);
                return res.status(500).json({ error: "Error reading trips data" });
            }

            const trips = JSON.parse(tripsData);
            const trip = trips.find(t => t.route_id === routeId);

            if (!trip) {
                console.error(`Trip not found for route_id: ${routeId}`);
                return res.status(404).json({ error: "Trip not found for route" });
            }

            const shapeId = trip.shape_id;

            // Step 3: 根据 shape_id 查找并返回路线的地理数据
            const shapeFilePath = path.join(shapesDir, `shape_${shapeId}.json`);
            fs.readFile(shapeFilePath, "utf-8", (err, shapeData) => {
                if (err) {
                    console.error(`Error reading shape file for shape_id: ${shapeId}`, err);
                    return res.status(500).json({ error: "Error reading shape data" });
                }

                // 解析并返回 JSON 数据
                res.json(JSON.parse(shapeData));
            });
        });
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
