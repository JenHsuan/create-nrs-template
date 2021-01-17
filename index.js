#!/usr/bin/env node

const shell = require("shelljs");
const inquirer = require("inquirer");

const targetRepo = 'https://github.com/JenHsuan/next-redux-styled-template.git';

//Check if git is enable
if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

const questions = [
    {
      type: "input",
      name: "projectName",
      message: "It's a Next.js, Redux, styled-Components template. Please enter your new project's name.",
      default: "nrs-project"
    },
    {
        type: "confirm",
        name: "addMiddleware",
        message: "Do you want to use react-thunk as the middleware? yes: react-thunk / no: react-saga",
        default: false
    },
    {
        type: "confirm",
        name: "addProxy",
        message: "Do you want to add proxy template files?",
        default: false
    },
    {
        type: "confirm",
        name: "addTests",
        message: "Do you want to add the Jest and Enzyme template files?",
        default: false
    }
];

inquirer.prompt(questions).then(answers => {
    let branchName = 'main';
    const { projectName, addMiddleware, addProxy, addTests } = answers;
    shell.exec(`mkdir ${projectName}`);
    shell.cd(`${projectName}`);
    shell.exec(`git clone ${targetRepo} .`);
    if (addMiddleware) {
        //thunk
        if (addProxy && addTests) {
            branchName = 'jestCommitsForProxy';
        } else if (addProxy) {
            branchName = 'proxyCommits';
        } else if (addTests) {
            branchName = 'jestCommits';
        }
    } else {
        //saga
        if (addProxy && addTests) {
            branchName = 'saga-proxy-jest';
        } else if (addProxy) {
            branchName = 'saga-proxy';
        } else if (addTests) {
            branchName = 'saga-jest';
        }
    }
    shell.exec(`git checkout -B ${branchName} remotes/origin/${branchName}`);
    shell.exec('git checkout --orphan latest_branch');
    shell.exec('git add -A');
    shell.exec('git commit -am "init the new project and install Next.js, Redux, and Styled-Components"');
    shell.exec('git branch -D main');
    shell.exec(`git branch -D ${branchName}`);
    shell.exec('git branch -m master');
    shell.exec('git remote remove origin');
    shell.echo('New project has been created!');
});

