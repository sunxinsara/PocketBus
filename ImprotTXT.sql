-- 导入 stop_times.txt 文件
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/stop_times.txt'
INTO TABLE stop_times
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(trip_id, arrival_time, departure_time, stop_id, stop_sequence, stop_headsign, pickup_type, drop_off_type, timepoint)
SET stop_headsign = NULLIF(stop_headsign, '');

-- 导入 shapes.txt 文件
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploadstripstrips/shapes.txt'
INTO TABLE shapes
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence, shape_dist_traveled);
LOAD DATA INFILE 'D:/work/Ireland/PocketBUs/GTFS_Realtime/shapes.txt'
INTO TABLE shapes
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence, shape_dist_traveled);