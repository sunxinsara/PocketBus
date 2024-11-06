document.addEventListener("DOMContentLoaded", () => {
    const routeSelect = document.getElementById("route");
    const stopList = document.getElementById("stop-list");
    let routeMap = {};

    // 初始化并创建 route_short_name 到 route_id 的映射
    async function loadRoutes() {
        const routesData = await fetch('.GTFS_Realtime/routes.json').then(res => res.json());
        routesData.forEach(route => {
            routeMap[route.route_short_name] = route.route_id;
        });
        console.log(routeMap);
    }

    // 调用 loadRoutes 函数，确保 routeMap 加载完成
    loadRoutes();

    // 处理线路选择更改
    routeSelect.addEventListener("change", () => {
        const selectedRouteShortName = routeSelect.value; // 比如 A1 或 A2
        const routeId = routeMap[selectedRouteShortName]; // 获取对应的 route_id
        if (routeId) {
            fetchRouteStops(routeId);
        } else {
            console.error(`Route ID not found for route: ${selectedRouteShortName}`);
        }
    });

    // 根据 route_id 获取并显示站点信息
    async function fetchRouteStops(routeId) {
        stopList.innerHTML = ''; // 清空当前站点列表

        // 读取 stops.json 和 stop_times.json（假设 JSON 文件已准备好）
        const stopsData = await fetch('.GTFS_Realtime/stops.json').then(res => res.json());
        const stopTimesData = await fetch('.GTFS_Realtime/stop_times.json').then(res => res.json());
        const tripsData = await fetch('.GTFS_Realtime/trips.json').then(res => res.json());

        // 查找此 route_id 的 trip_id 列表
        const tripIds = tripsData
            .filter(trip => trip.route_id === routeId)
            .map(trip => trip.trip_id);

        // 从 stop_times.json 中找出相应的 stop_id 并按顺序排序
        const routeStops = stopTimesData
            .filter(stopTime => tripIds.includes(stopTime.trip_id))
            .sort((a, b) => a.stop_sequence - b.stop_sequence)
            .map(stopTime => stopTime.stop_id);

        // 根据 stop_id 在 stops.json 中查找站点名称
        const stopDetails = stopsData.filter(stop => routeStops.includes(stop.stop_id));

        // 显示站点信息
        stopDetails.forEach(stop => {
            const stopElement = document.createElement("div");
            stopElement.classList.add("stop");
            stopElement.textContent = stop.stop_name;
            stopList.appendChild(stopElement);
        });
    }

    // 默认加载 A1 路线（例如可以更改为其他默认值）
    routeSelect.value = "A1"; // 设置默认值
    routeSelect.dispatchEvent(new Event("change")); // 手动触发选择事件
});
