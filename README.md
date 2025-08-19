# Vault Web

**Vault Web** is a full-stack project combining a **Spring Boot** backend, an **Angular** frontend, and a **PostgreSQL** database for persistent data storage. It serves as the central entry point for all services in the Vault Web ecosystem, providing a secure and private dashboard for:

- 💬 Internal chats and collaboration tools 
- ☁️ Private file cloud (via `vault-cloud`)
- 🔐 Built-in password manager
- 🧑‍💻 User and session management

## Project Structure

- See [**DIRECTORY.md**](https://github.com/Vault-Web/vault-web/blob/main/DIRECTORY.md) for a full, generated project structure overview.  

- View our [**Javadoc documentation**](https://vault-web.github.io/vault-web) for a complete backend API overview.

---

## Local Development

The project uses Docker to quickly spin up a PostgreSQL database and pgAdmin instance. Make sure you have **Docker** and **Docker Compose** installed before you begin.

---

### 1. Clone the Repository

```bash
git clone https://github.com/Vault-Web/vault-web.git
```

---

### 2. Create a `.env` File

Before running the containers, create a file named `.env` in the root directory of the project and add the following environment variables:

```env
# PostgreSQL config
DB_HOST=localhost
DB_PORT=5432
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=vaultdb

# pgAdmin config
PGADMIN_DEFAULT_EMAIL=your_email@example.com
PGADMIN_DEFAULT_PASSWORD=your_pgadmin_password
```

> 📝 Replace the values with your own settings.
> Do **not** use sensitive production credentials during development.

---

### 3. Start Database and pgAdmin via Docker

```bash
docker compose up -d
```

This will start the following services:

- **PostgreSQL** at `localhost:<DB_PORT>` (e.g. `5432`)
- **pgAdmin** at [http://localhost:8081](http://localhost:8081)

> You can access pgAdmin using the credentials you provided in the `.env` file.

---

### 4. Backend Configuration (Spring Boot)

The backend runs on port `8080` and connects to the database with the same values defined in `.env`.

These are the values set in the [application properties](backend/src/main/resources/application.properties):

> ⚠️ Make sure the values for database URL, username, password, and port match exactly with those in your `.env` file.
> Otherwise, the backend will not be able to connect to the database started by Docker.

To run the backend:

```bash
cd backend
./mvnw spring-boot:run
```

Then visit:

- App API: [http://localhost:8080](http://localhost:8080)
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### 5. Start the Frontend (Angular)

Install dependencies and start the Angular development server:

```bash
cd frontend
npm install
ng s
```

Then open [http://localhost:4200](http://localhost:4200) in your browser.

## 📫 Questions?

Feel free to open an issue.
