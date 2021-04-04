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
        type: "list",
        name: "languageType",
        message: "Please choose the language of the project:",
        choices: ["JavaScript", "TypeScript"],
        default: "JavaScript"
    },
    {
        type: "list",
        name: "middlewareType",
        message: "Please choose the Redux's middleware the project:",
        choices: ["redux-thunk", "redux-saga", "redux-promise-middleware (will use the page-level Redux)"],
        default: "redux-thunk",
        when: (answers) => answers.languageType === "JavaScript"
    },
    {
        type: "confirm",
        name: "addProxy",
        message: "Do you want to add proxy template files?",
        default: false,
        when: (answers) => answers.languageType === "JavaScript"
    },
    {
        type: "confirm",
        name: "addTests",
        message: "Do you want to add the Jest and Enzyme template files?",
        default: false,
        when: (answers) => answers.languageType === "JavaScript"
    }
];

inquirer.prompt(questions).then(answers => {
    let branchName = 'main';
    const { projectName, languageType, middlewareType, addProxy, addTests } = answers;
    console.log("--------------------");
    console.log("Your preferences:");
    console.log(`Language type: ${languageType}`);
    console.log(`Middleware type: ${middlewareType === undefined ? "redux-thunk" : middlewareType}`);
    console.log(`Add proxy: ${addProxy === undefined ? "false" : addProxy}`);
    console.log(`Add tests: ${addTests === undefined ? "false" : addTests}`);
    console.log("--------------------");
    shell.exec(`mkdir ${projectName}`);
    shell.cd(`${projectName}`);
    shell.exec(`git clone ${targetRepo} .`);

    if (languageType === "JavaScript") {
        switch (middlewareType) {
            case "redux-thunk":
                if (addProxy && addTests) {
                    branchName = 'jestCommitsForProxy';
                } else if (addProxy) {
                    branchName = 'proxyCommits';
                } else if (addTests) {
                    branchName = 'jestCommits';
                } else {
                    branchName = 'main';
                }
                break;
            case "redux-saga":
                if (addProxy && addTests) {
                    branchName = 'saga-proxy-jest';
                } else if (addProxy) {
                    branchName = 'saga-proxy';
                } else if (addTests) {
                    branchName = 'saga-jest';
                } else {
                    branchName = 'useSaga';
                }
                break;
            case "redux-promise-middleware (will use the page-level Redux)":
                if (addProxy && addTests) {
                    branchName = 'use-next-wrapper-proxy-jest';
                } else if (addProxy) {
                    branchName = 'use-next-wrapper-proxy';
                } else if (addTests) {
                    branchName = 'use-next-wrapper-jest';
                } else {
                    branchName = 'use-next-wrapper';
                }
                break;
        }
    } else {
        //TypeScript
        branchName = "ts-main";
    }

    shell.exec(`git checkout -B ${branchName} remotes/origin/${branchName}`);
    shell.exec('git checkout --orphan latest_branch');
    shell.exec('git add -A');
    shell.exec('git commit -am "init the new project and install Next.js, Redux, and Styled-Components"');
    shell.exec(`git branch -D ${branchName}`);
    shell.exec('git branch -m master');
    shell.exec('git branch -D main');
    shell.exec('git remote remove origin');
    shell.echo('New project has been created!');
});

