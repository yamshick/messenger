CREATE TABLE IF NOT EXISTS Chats
( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    users TEXT NOT NULL , 
    messages TEXT NOT NULL
);
