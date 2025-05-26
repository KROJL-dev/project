# 🧠 SkillForge – React Mastery Project

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=Zustand&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack%20Router-FECC00?style=for-the-badge)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ShadCN](https://img.shields.io/badge/ShadCN_UI-000000?style=for-the-badge)

---

## 🔗 Live Demo

Access the live version here:  
👉 [https://jobstracker.net/login](https://jobstracker.net/login)

---

## 🚀 About the Project

**SkillForge** is a personal playground for mastering modern frontend development with a robust and scalable stack.  
This project is aimed at deepening understanding and practical usage of advanced tools and patterns in the React ecosystem.

> ✨ The main goal is to **strengthen and improve development skills** while working with real-world architecture.

---

## 🛠 Tech Stack

- ⚛️ **React** – Component-based UI development
- 🟦 **TypeScript** – Static typing for better DX
- 🐻 **Zustand** – Lightweight and elegant state management
- 🧭 **TanStack Router** – Type-safe and powerful routing
- 📡 **TanStack Query** – Server-state management and data fetching
- 🎨 **Tailwind CSS** – Utility-first styling system
- 🧩 **ShadCN UI** – Accessible and customizable component library

---

> Structured using **Feature-Sliced Design (FSD)** for scalable front-end architecture.

---

## 🚢 Deployment

This application is:

- 📦 **Containerized** using Docker
- ☁️ **Hosted on AWS ECS (Elastic Container Service)** behind an Application Load Balancer (ALB)
- 🌐 **Served via NGINX** inside the container
- 🔐 **Secured with HTTPS** using [Let's Encrypt](https://letsencrypt.org/)
- 💡 ECS Task Definitions and Services manage container lifecycle and scaling
- 📄 Certificates are mounted into the container using ECS volumes

> The application listens on ports **80** and **443** and supports automatic TLS certificate renewal via Certbot.

### Volumes mounted inside the container:

```bash
-v /etc/letsencrypt:/etc/letsencrypt
-v /etc/nginx/conf.d:/etc/nginx/conf.d


---

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/your-repo-name.git

# Navigate to the project directory
cd your-repo-name

# Install dependencies
pnpm install

# Start the development server
pnpm dev
