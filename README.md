# ProjectDrapDrop# Project Setup Guide

Follow the steps below to set up and run the project on your local machine.

---

## 📌 Prerequisites
Make sure you have the following installed:
- **Git**
- **Node.js** (v16+ recommended)
- **npm** (comes with Node.js)
- **MongoDB** (installation steps provided below if not installed)

# Installation of MongoDB (if not installed)
- **curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor**
- **echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list > /dev/null**
- **sudo apt-get update**
- **sudo apt-get install -y mongodb-org**
- **sudo systemctl start mongod**
- **sudo systemctl enable mongod**


---

## 🚀 Setup Instructions
- **git clone https://github.com/amargope05/ProjectDrapDrop.git**
- **cd ProjectDrapDrop**
- **cd frontend** 
- **npm i**
- **npm start**
- **cd ../backend**
- **npm i**
- **node server.js**
