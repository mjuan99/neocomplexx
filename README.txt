El servidor ahora depende de que este mysql corriendo
    host: localhost
    port: 3306
    root password: root
    database: neocomplexx
                    table: registro
                            campo: nombre
                            campo: vers
                            entrada: ("Neocomplexx", "1.0.0")

comando para levantar el server mysql en docker:
    docker run -d -n neocomplexx_mysql -p 3306:3306 -v mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=neocomplexx mysql

comando para entrar al server mysql y configurar la base de datos necesaria:
    docker exec -it <mysql-container-id> mysql -u root -p"root"
    (obtener <mysql-container-id> con "docker ps")

configuracion de la base de datos:
    USE neocomplexx;

    CREATE TABLE Registro(
        nombre  VARCHAR(45) NOT NULL,
        vers    VARCHAR(45) NOT NULL,

        CONSTRAINT pk_registro
        PRIMARY KEY (nombre)
    ) ENGINE=InnoDB;

    INSERT INTO Registro VALUES ("Neocomplexx", "1.0.0")