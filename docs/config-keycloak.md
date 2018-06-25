# Keycloak & DemocracyOS
Keycloak is a single sign on solution for web apps and RESTful web services. The goal of Keycloak is to make security simple so that it is easy for application developers to secure the apps and services they have deployed in their organization

Keycloak is basically an app/service that authenticates and authorize clients. Clients are applications that uses keycloak, and users are part of a **realm**. A realm might be a group of clients, and so on.. it might sound a bit confusing and it has lots of configuration, so, for a good start, we recommend the following articles from the docs:

- [System requirements](https://www.keycloak.org/docs/latest/server_installation/index.html#system-requirements)
- [Section 3. Server administration](https://www.keycloak.org/docs/latest/server_admin/index.html#admin-console)

To understand about the concepts that Keycloak uses, read [this section](https://www.keycloak.org/docs/latest/server_admin/index.html#core-concepts-and-terms)

Interesting stuff to discuss:
- [reCAPTCHA support](https://www.keycloak.org/docs/latest/server_admin/index.html)
- [Enabling terms and conditions](https://www.keycloak.org/docs/latest/server_admin/index.html#terms-and-conditions)

To install it, you need to use *docker* and we will build the images using the following docker-compose.yml

1. Create a project directory. Name it "keycloak-app" or any other name, it is not important.
2. Create a new file called `docker-compose.yml`

```
version: '3'

volumes:
  mysql_data:
      driver: local

services:
  mysql:
      image: mysql:5.7
      volumes:
        - mysql_data:/home/zaqueo/www/fake_mysql
      environment:
        MYSQL_ROOT_PASSWORD: root
        MYSQL_DATABASE: keycloak
        MYSQL_USER: keycloak
        MYSQL_PASSWORD: password
  keycloak:
      image: jboss/keycloak
      environment:
        DB_VENDOR: MYSQL
        DB_ADDR: mysql
        DB_DATABASE: keycloak
        DB_USER: keycloak
        DB_PASSWORD: password
        KEYCLOAK_USER: admin
        KEYCLOAK_PASSWORD: Pa55w0rd
        DB_VENDOR: MYSQL
        # Uncomment the line below if you want to specify JDBC parameters. The parameter below is just an example, and it shouldn't be used in production without knowledge. It is highly recommended that you read the MySQL JDBC driver documentation in order to use it.
        #JDBC_PARAMS: "connectTimeout=30000"
      ports:
        - 8080:8080
      depends_on:
        - mysql
```

3. Now run `docker-compose up -d` in your terminal

Once you are done, start your keycloack images (there are 2, the mysql instance for keycloak, and the jboss server running the keycloak instance)

After a few seconds, go to http://localhost:8080/ and see if you can enter into the Administration Panel by using the default admin and password credentials defined inside the docker-compose.yml file. Remember this if you change it!

