-- 创建 stop_times 表
DROP TABLE IF EXISTS stop_times;
CREATE TABLE stop_times (
    trip_id VARCHAR(50),
    arrival_time TIME,
    departure_time TIME,
    stop_id VARCHAR(50),
    stop_sequence INT,
    stop_headsign VARCHAR(255),
    pickup_type INT,
    drop_off_type INT,
    timepoint INT
);

-- 创建 shapes 表
CREATE TABLE IF NOT EXISTS shapes (
    shape_id VARCHAR(50),
    shape_pt_lat DECIMAL(10, 7),
    shape_pt_lon DECIMAL(10, 7),
    shape_pt_sequence INT,
    shape_dist_traveled DECIMAL(10, 2)
);