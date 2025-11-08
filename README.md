# 📈 Stock Exchange System

A full-stack demo application for managing stocks and stock exchanges.  
Built with **Spring Boot (Java)**, **React**, and **MySQL**, fully containerized with **Docker Compose**.

---

## 🗂️ Project Structure

```
Task/
├── Backend/
│   └── stock-exchange/           # Spring Boot backend
│       ├── src/
│       ├── pom.xml
│       └── Dockerfile
├── Frontend/
│   └── stock-exchange-frontend2/ # React frontend
│       ├── src/
│       ├── package.json
│       └── Dockerfile
├── init-db.sql                   # Database initialization script
└── docker-compose.yml            # Compose file for full stack
```

---

## ⚙️ Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/downloads)

> You don’t need Java, Maven, or Node installed locally — Docker handles everything.

---

## 🚀 Run the Full Stack Application

1. **Clone the repository:**

```bash
git clone https://github.com/Abdalrhman74/stock-exchange-app.git
cd stock-exchange-app
```

2. **Run Docker Compose:**

```bash
docker-compose up --build
```

> The first build may take a few minutes as it downloads dependencies.

3. **Access the apps:**

- Frontend (React UI): [http://localhost:3000](http://localhost:3000)  
- Backend API (Spring Boot): [http://localhost:8080](http://localhost:8080)  
- Database (MySQL) — localhost:3306  
  - Username: `root`  
  - Password: `12345`  
  - Database: `stock_exchange_db`  

---

## 🧩 Initialization Resources

The database is automatically initialized using `init-db.sql`:

- Creates tables: `users`, `stocks`, `stock_exchanges`, `exchange_stocks`
- Inserts sample data for stocks, exchanges, and relationships  

> You can edit `init-db.sql` in the project root if needed.

---

## 🛠️ Backend (Spring Boot)

- **Path:** `Backend/stock-exchange`  
- **Tech Stack:** Spring Boot, Spring Security, JPA, MySQL  
- **Port:** `8080`  

### Build manually (optional)

```bash
cd Backend/stock-exchange
mvn clean package -DskipTests
java -jar target/*.jar
```

---

## 💻 Frontend (React)

- **Path:** `Frontend/stock-exchange-frontend2`  
- **Port:** `3000`  

### Build manually (optional)

```bash
cd Frontend/stock-exchange-frontend2
npm install
npm start
```

---

## 🧰 Docker Compose Details

`docker-compose.yml` defines three services:

| Service    | Image / Build Path                | Description               | Port |
|------------|----------------------------------|---------------------------|------|
| **db**      | `mysql:8.0`                      | MySQL database            | 3306 |
| **backend** | `./Backend/stock-exchange`       | Spring Boot app (API)     | 8080 |
| **frontend**| `./Frontend/stock-exchange-frontend2` | React app served by Nginx | 3000 |

> Each container communicates internally via service names (`db`, `backend`, `frontend`).

---

## 🧾 API Endpoints

---

### **Authentication**

| Method | Endpoint             | Description                                       | Access     |
| ------ | -------------------- | ------------------------------------------------- | ---------- |
| POST   | `/api/auth/login`    | Login with username & password, returns JWT token | All        |
| POST   | `/api/auth/register` | Register a new user       | Admin/User |
| POST   | `/api/auth/register-admin` | Register a new admin       | Admin |


---

### **Stocks**

| Method | Endpoint                       | Description                | Access     |
| ------ | ------------------------------ | -------------------------- | ---------- |
| GET    | `/api/stocks/getAllStocks`     | Retrieve all stocks        | Admin/User |
| GET    | `/api/stocks/getStock/{id}`    | Get a specific stock by ID | Admin/User |
| POST   | `/api/stocks/createStock`      | Create a new stock         | Admin      |
| PATCH  | `/api/stocks/updateStock/{id}` | Update stock price         | Admin      |
| DELETE | `/api/stocks/deleteStock/{id}` | Delete a stock             | Admin      |

---

### **Stock Exchanges**

| Method | Endpoint                             | Description                                            | Access     |
| ------ | ------------------------------------ | ------------------------------------------------------ | ---------- |
| GET    | `/api/exchanges/getAllExchanges`     | Get all stock exchanges                                | Admin/User |
| GET    | `/api/exchanges/getExchange/{id}`    | Get a specific stock exchange by ID                    | Admin/User |
| POST   | `/api/exchanges/createExchange`      | Create a new exchange                                  | Admin      |
| PATCH  | `/api/exchanges/updateExchange/{id}` | Update exchange info                                   | Admin      |
| DELETE | `/api/exchanges/deleteExchange/{id}` | Delete a stock exchange                                | Admin      |

---

### **Exchange-Stocks (assign/remove stocks from exchanges)**

| Method | Endpoint                                            | Description                           | Access     |
| ------ | --------------------------------------------------- | ------------------------------------- | ---------- |
| POST   | `/api/exchanges/{exchangeId}/addStock/{stockId}`    | Add a stock to an exchange            | Admin      |
| DELETE | `/api/exchanges/{exchangeId}/removeStock/{stockId}` | Remove a stock from an exchange       | Admin      |
| GET    | `/api/exchanges/{exchangeId}/stocks`                | Get all stocks in a specific exchange | Admin/User |


---

## 🔑 Default Credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |

---

## 🧹 Clean Up

Stop and remove all containers:

```bash
docker-compose down
```

Remove volumes and reset the database:

```bash
docker-compose down -v
```

---

## ✅ Summary

After cloning the repo and running:

```bash
docker-compose up --build
```

You will have:

- A MySQL DB seeded with demo data
- A Spring Boot backend on port 8080
- A React frontend on port 3000
- Full CRUD functionality for stocks and exchanges
