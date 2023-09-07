insert into Users (firstName, secondName, login, password, role) 
            VALUES ("admin", "admin", "admin", "admin", "admin")
            WHERE NOT EXISTS (
                SELECT * 
                FROM Users
                WHERE login = "admin"
            );
