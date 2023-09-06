CREATE TABLE IF NOT EXISTS Users
( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    first_name TEXT NOT NULL,
    second_name TEXT, 
    login TEXT NOT NULL , 
    password TEXT NOT NULL,
    role TEXT NOT NULL
);
