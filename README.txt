El servidor depende de que este mysql corriendo:
    host: localhost
    port: 3306
    root password: root
    database: neocomplexx

comando para levantar el server mysql en docker:
    docker run -d -n neocomplexx_mysql -p 3306:3306 -v mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=neocomplexx mysql

comando para migrar la base de datos:
    run migrate-up


comando para entrar al server mysql y configurar la base de datos manualmente (no se necesita con el comando para migrar):
    docker exec -it <mysql-id> mysql -u root -p"root"
    (obtener <mysql-id> con "docker ps")
