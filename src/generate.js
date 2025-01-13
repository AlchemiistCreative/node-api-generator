const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const ejs = require('ejs');
const { execSync } = require('child_process');

const TEMPLATES_DIR = path.join(__dirname, 'templates');

function initializeGit(projectDir) {
  try {
      console.log('Initializing Git repository...');
      const gitOutput = execSync('git init', { cwd: projectDir, stdio: 'pipe' }).toString();
      console.log('Git Initialization Output:\n', gitOutput.trim());
      console.log('Git repository successfully initialized.');
  } catch (error) {
      console.error('Error initializing Git repository:', error.message);
  }
}

function initializeNpm(projectDir) {
  try {
      console.log('Initializing NPM and installing dependencies...');
      const npmOutput = execSync('npm init -y && npm install', { cwd: projectDir, stdio: 'pipe' }).toString();
      console.log('NPM Initialization Output:\n', npmOutput.trim());
      console.log('NPM repository and dependencies successfully installed.');
  } catch (error) {
      console.error('Error initializing NPM:', error.message);
  }
}

async function main() {
    const answers = await inquirer.prompt([
        { name: 'projectName', message: 'Enter the project name:', default: 'my-node-api' },
        { name: 'appPort', message: 'Enter the application port:', default: '5000' },
        { name: 'dbType', type: 'list', message: 'Choose the database type:', choices: ['mongo', 'sql'] },
        { name: 'modelName', message: 'Enter the first model name:', default: 'Item' },
        { name: 'useSwagger', type: 'confirm', message: 'Include Swagger documentation?', default: true },
        { name: 'useTests', type: 'confirm', message: 'Include unit tests?', default: true },
        { name: 'initGit', type: 'confirm', message: 'Initialize a Git repository?', default: true },
        { name: 'initNpm', type: 'confirm', message: 'Initialize a NPM repository and install dependencies?', default: true },
        { name: 'dbHost', message: 'Enter the database host:', default: 'localhost' },
        { name: 'dbPort', message: 'Enter the database port:', default: (answers) => (answers.dbType === 'mongo' ? '27017' : '3306') },
        { name: 'dbName', message: 'Enter the database name:', default: 'mydatabase' },
        { name: 'dbUser', message: 'Enter the database username:', when: (answers) => answers.dbType === 'sql' },
        { name: 'dbPassword', message: 'Enter the database password:', when: (answers) => answers.dbType === 'sql', type: 'password' },
    ]);

    const projectDir = path.join(process.cwd(), answers.projectName);
    if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);

    // Copy and render templates
    copyAndRenderTemplates(projectDir, answers);

    // Generate .env file
    generateDotenvFile(projectDir, answers);

    if (answers.initGit) initializeGit(projectDir);
    if (answers.initNpm) initializeNpm(projectDir);

  
    console.log(`Project ${answers.projectName} generated successfully!`);
}

function copyAndRenderTemplates(projectDir, answers) {
  const filesToRender = [
      'package.json.template',
      `db/db.${answers.dbType}.js.template`,
      `models/model.${answers.dbType}.js.template`,
      'server.js.template',
      `controllers/controller.${answers.dbType}.js.template`,
      'routes/route.js.template',
      'docker-compose.yml.template',
      'README.md.template'
  ];

  filesToRender.forEach((file) => {
      const templatePath = path.join(TEMPLATES_DIR, file);
      let outputFilePath = path.join(projectDir, file.replace('.template', ''));

      if (file === `models/model.${answers.dbType}.js.template`) {
          outputFilePath = path.join(projectDir, `models/${answers.modelName.toLowerCase()}.model.js`);
      }
      if (file === `controllers/controller.${answers.dbType}.js.template`) {
          outputFilePath = path.join(projectDir, `controllers/${answers.modelName.toLowerCase()}.controller.js`);
      }
      if (file === 'routes/route.js.template') {
          outputFilePath = path.join(projectDir, `routes/${answers.modelName.toLowerCase()}.route.js`);
      }

      const renderedContent = ejs.render(fs.readFileSync(templatePath, 'utf8'), answers);

      const outputDir = path.dirname(outputFilePath);
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      fs.writeFileSync(outputFilePath, renderedContent);
  });

  // Copy static files
  ['Dockerfile'].forEach((file) => {
      fs.copyFileSync(path.join(TEMPLATES_DIR, file), path.join(projectDir, file));
  });
}


function generateDotenvFile(projectDir, answers) {
    const dotenvContent = answers.dbType === 'mongo' ?
        `APP_PORT=${answers.dbPort}
MONGO_URI=mongodb://${answers.dbHost}:${answers.dbPort}/${answers.dbName}` :
        `APP_PORT=${answers.dbPort}
DB_HOST=${answers.dbHost}
DB_PORT=${answers.dbPort}
DB_NAME=${answers.dbName}
DB_USER=${answers.dbUser}
DB_PASSWORD=${answers.dbPassword}`;
    fs.writeFileSync(path.join(projectDir, '.env'), dotenvContent);
    console.log('Generated .env file with database configuration.');
}

main().catch((err) => {
    console.error('Error generating project:', err);
    process.exit(1);
});