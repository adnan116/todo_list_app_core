# Enhanced ToDo List Application (Backend)

## Table of Contents

- [Introduction](#introduction)
- [Setting Up the LLM Environment](#setting-up-the-llm-environment)
- [Application Configuration](#application-configuration)
- [Installing External Packages](#installing-external-packages)
- [Database Configuration](#database-configuration)
- [Sample User Credentials](#sample-user-credentials)
- [API Endpoints](#api-endpoints)

## Introduction

The **Enhanced To-Do List Application** is a task management solution that helps users efficiently organize their activities. Built with **Node.js**, and **MongoDB**, it offers a user-friendly interface for creating and tracking tasks, along with secure user authentication and features like sorting, filtering, and search for improved productivity.

## Application Configuration

1. Create a file named `.env`.
2. Set all configuration values in that file according to the provided `.env.sample`.

## Installing External Packages

Run the following command to install third-party packages and dependencies:

```bash
npm install
```

## Database Configuration

1. Create an empty database and set the `database_name` in the `.env` file with database credentials.
2. Insert **Roles**, **Features** and **Admin-User** data into the database with:
   ```bash
   npm run init:data
   ```

## Project Run

To run the project, use the following command:

```bash
npm run dev
```

## Sample User Credentials

### Admin User

- **Email:** `admin@admin.com`
- **Password:** `admin`
- **Role:** `admin`

## API Endpoints

### User Management

#### Sign Up

- Method: POST
- URL: `{{url}}:{{app_port}}/user/sign-up`
- Request Body:

```json
{
  "password": "1234",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "dob": "1990-01-01",
  "gender": "Male",
  "religion": "None",
  "email": "john@example.com"
}
```

#### Create User

- Method: POST
- URL: `{{url}}:{{app_port}}/user/create`
- Request Body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-15",
  "phoneNumber": "+1234567890",
  "email": "john.doe@example.com",
  "gender": "male",
  "religion": "Christianity",
  "password": "StrongPassword123",
  "roleId": "671ce6efe5feed9155eb8b9b"
}
```

#### Update User

- Method: PUT
- URL: `{{url}}:{{app_port}}/user/update/{userId}`
- Request Body:

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "dob": "1985-05-20",
  "phoneNumber": "+0987654321",
  "email": "jane.smith@example.com",
  "gender": "Female",
  "religion": "Buddhism",
  "roleId": "671ce6efe5feed9155eb8b9b"
}
```

#### Log In

- Method: POST
- URL: `{{url}}:{{app_port}}/user/login`
- Request Body:

```json
{
  "username": "admin@admin.com",
  "password": "admin"
}
```

#### Get Users with Pagination

- Method: GET
- URL: `{{url}}:{{app_port}}/user/list?page={page}&limit={limit}&search={search}`
- Query Parameters:
  - page: Integer
  - limit: Integer
  - search: String

#### Get All Users

- Method: GET
- URL: `{{url}}:{{app_port}}/user/all-users`

#### Delete User

- Method: DELETE
- URL: `{{url}}:{{app_port}}/user/delete/{userId}`

#### Get All Roles

- Method: GET
- URL: `{{url}}:{{app_port}}/user/all-roles`

### Task Category Management

#### Create Task Category

- Method: POST
- URL: `{{url}}:{{app_port}}/task-category/create`
- Request Body:

```json
{
  "categoryName": "Ongoing",
  "description": "Tasks related to ongoing activities"
}
```

#### Update Task Category

- Method: PUT
- URL: `{{url}}:{{app_port}}/task-category/update/{categoryId}`
- Request Body:

```json
{
  "categoryName": "Ongoing",
  "description": "Tasks related to ongoing activities"
}
```

#### Delete Task Category

- Method: DELETE
- URL: `{{url}}:{{app_port}}/task-category/delete/{categoryId}`

#### Get Task Categories with Pagination

- Method: GET
- URL: `{{url}}:{{app_port}}/task-category/list?page={page}&limit={limit}&search={search}`
- Query Parameters:
  - page: Integer
  - limit: Integer
  - search: String

#### Get All Task Categories

- Method: GET
- URL: `{{url}}:{{app_port}}/task-category/all-categories`

### Task Management

#### Create Task

- Method: POST
- URL: `{{url}}:{{app_port}}/task/create`
- Request Body:

```json
{
  "title": "Create Project Documentation2",
  "description": "Prepare detailed documentation for the new project.",
  "status": "in-progress",
  "deadline": "2024-11-15T23:59:59.000Z",
  "categoryId": "{categoryId}",
  "userId": "{userId}"
}
```

#### Update Task

- Method: PUT
- URL: `{{url}}:{{app_port}}/task/update/{taskId}`
- Request Body:

```json
{
  "title": "Update Project Documentation",
  "description": "Revise and update the existing project documentation.",
  "status": "completed",
  "deadline": "2024-11-20",
  "categoryId": "{categoryId}",
  "userId": "{userId}"
}
```

#### Delete Task

- Method: DELETE
- URL: `{{url}}:{{app_port}}/task/delete/{taskId}`

#### Get Tasks

- Method: GET
- URL: `{{url}}:{{app_port}}/task/list?page=1&limit=10&categoryId={categoryId}&userId={userId}&search=documentation`
- Query Parameters:
  - page: Integer
  - limit: Integer
  - search: String
  - categoryId: String
  - userId: String
