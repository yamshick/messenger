CREATE TABLE IF NOT EXISTS Users
( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    firstName TEXT NOT NULL,
    secondName TEXT, 
    login TEXT NOT NULL , 
    password TEXT NOT NULL,
    role TEXT NOT NULL
);
