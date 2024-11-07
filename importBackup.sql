-- 导入 stops.txt 文件
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/stops.txt'
INTO TABLE stops
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(stop_id, stop_code, stop_name, stop_desc, stop_lat, stop_lon, zone_id, stop_url, @location_type, @parent_station)
SET location_type = NULLIF(@location_type, ''), parent_station = NULLIF(@parent_station, '');

-- 导入 routes.txt 文件
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/routes.txt'
INTO TABLE routes
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(route_id, agency_id, route_short_name, route_long_name, route_desc, route_type, route_url, route_color, route_text_color);

-- 导入 trips.txt 文件
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/trips.txt'
INTO TABLE trips
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(route_id, service_id, trip_id, trip_headsign, trip_short_name, direction_id, block_id, shape_id);