#!/usr/bin/node

const shell = require("shelljs");
const inquirer = require("inquirer");

const targetRepo = 'https://github.com/JenHsuan/next-redux-styled-template.git';
const proxyCommit = '038b8e1d443a45a2322dfd0af6d0cbfeea49edbf';
const jestCommit = 'd359be5e532d6a937062277041a6f635ad2f5c94';
const onlyJestCommit = '9b689f0184cab0b461b43030ca8e83baa66df37b';

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
    const { projectName, addProxy, addTests } = answers;
    shell.exec(`mkdir ${projectName}`);
    shell.cd(`${projectName}`);
    shell.exec(`git clone ${targetRepo} .`);
    if (addProxy && addTests) {
        shell.exec(`git cherry-pick ${proxyCommit}`);
        shell.exec(`git cherry-pick ${jestCommit}`);
    } else if (addProxy) {
        shell.exec(`git cherry-pick ${proxyCommit}`);
    } else if (addTests) {
        shell.exec(`git cherry-pick ${onlyJestCommit}`);
    }
    shell.exec('git checkout --orphan latest_branch');
    shell.exec('git add -A');
    shell.exec('git commit -am "init the new project and install Next.js, Redux, and Styled-Components"');
    shell.exec('git branch -D main');
    shell.exec('git branch -m master');
    shell.exec('git remote remove origin');
    shell.echo('New project has been created!');
});

