use gtfs;
-- 创建 stops 表
DROP TABLE IF EXISTS stops;

CREATE TABLE stops (
    stop_id VARCHAR(50) NOT NULL,
    stop_code VARCHAR(50),
    stop_name VARCHAR(255),
    stop_desc TEXT,
    stop_lat DECIMAL(10, 7),
    stop_lon DECIMAL(10, 7),
    zone_id VARCHAR(50),
    stop_url VARCHAR(255),
    location_type INT NULL,
    parent_station VARCHAR(50) NULL,
    PRIMARY KEY (stop_id)
);

-- 创建 routes 表
DROP TABLE IF EXISTS routes;
CREATE TABLE routes (
    route_id VARCHAR(50) NOT NULL,
    agency_id VARCHAR(50),
    route_short_name VARCHAR(50),
    route_long_name VARCHAR(255),
    route_desc TEXT,
    route_type INT,
    route_url VARCHAR(255),
    route_color VARCHAR(10),
    route_text_color VARCHAR(10),
    PRIMARY KEY (route_id)
);

-- 创建 trips 表
DROP TABLE IF EXISTS trips;
CREATE TABLE trips (
    route_id VARCHAR(50),
    service_id VARCHAR(50),
    trip_id VARCHAR(50) NOT NULL,
    trip_headsign VARCHAR(255),
    trip_short_name VARCHAR(255),
    direction_id INT,
    block_id VARCHAR(100),
    shape_id VARCHAR(50),
    PRIMARY KEY (trip_id)
);