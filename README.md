## Node API Generator

A dynamic Node.js project generator for creating robust RESTful APIs with full CRUD support. This tool simplifies development by scaffolding projects tailored to your needs, including:

- Choice of database: MongoDB (Mongoose) or SQL (Sequelize).
- Automatically generated models, controllers, routes, and Swagger documentation.
- Support for Docker, environment variable setup, and Git initialization.
- Unit testing integration with Jest (optional).

---

### **Installation**

To install the package globally using npm, run:

```bash
npm install -g node-api-generator-cli
```
---

### **Usage**

Once installed, use the CLI command to generate a new project:

```bash
node-api-generator-cli
```

The CLI will guide you through the project setup with the following prompts:
1. **Project Name**: Enter a name for your project.
2. **Database Type**: Choose between `MongoDB` or `SQL`.
3. **Model Name**: Specify the first model name (e.g., `Item`).
4. **Swagger Documentation**: Decide whether to include Swagger support.
5. **Unit Testing**: Choose whether to include Jest for unit tests.
6. **Git Initialization**: Decide whether to initialize a Git repository.
7. **NPM Initialization**: Decide whether to initialize npm and install dependencies.
8. **Database Configuration**: Enter details like host, port, username, and password.

---

### **Example**

#### Generate a New Project:
```bash
node-api-generator-cli
```

#### Sample Output:
```plaintext
? Enter the project name: my-api-project
? Choose the database type: (Use arrow keys) mongo
? Enter the first model name: User
? Include Swagger documentation? Yes
? Include unit tests? Yes
? Initialize a Git repository? Yes
? Initialize a NPM repository and install dependencies? Yes
? Enter the database host: localhost
? Enter the database port: 27017
? Enter the database name: mydatabase
```

After the CLI completes, a new project folder is created with the following structure:

```plaintext
my-api-project/
├── models/
├── controllers/
├── routes/
├── templates/
├── .env
├── Dockerfile
├── package.json
└── server.js
```

---

### **Start Your Project**

Navigate to the project directory:

```bash
cd my-api-project
```

Run the project:

```bash
npm start
```

Swagger documentation will be available at:
```plaintext
http://localhost:5000/api-docs
```

---

### **Feedback and Contribution**

Feel free to [open an issue](https://github.com/your-username/your-repo-name/issues) or submit a pull request if you encounter any issues or have suggestions for improvements.

