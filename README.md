# Task-management

## Overview

**Cloud Task Manager** is a cloud-based task management system built with React for the frontend and Node.js with PostgreSQL for the backend. It uses Docker for containerization and Kubernetes (GKE) for orchestration, providing scalability and reliability.

### Features
- **User Authentication**: Secure login and registration.
- **Task Management**: Full CRUD operations for tasks.
- **Task Filtering**: Filter tasks by priority, status, and due date.
- **Data Storage**: All data is stored in PostgreSQL.

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js, Sequelize, PostgreSQL
- **Containerization**: Docker
- **Orchestration**: Kubernetes (GKE)
- **Load Balancing**: Google Cloud Load Balancing
- **Cloud Infrastructure**: GKE, Cloud SQL (PostgreSQL)

## Benefits
- **Auto-Scaling**: Automatically scales based on traffic.
- **Load Balancing**: Efficient traffic distribution for reliability.
- **High Availability**: Redundant systems for fault tolerance.

## Setup

1. Clone the repo

2. Install dependencies:
    - For frontend: `npm install`
    - For backend: `npm install`

3. Deploy to Kubernetes using `kubectl`.

