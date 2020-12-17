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
    }
];

inquirer.prompt(questions).then(answers => {
    const { projectName } = answers; 
    shell.cd('..');
    shell.exec(`mkdir ${projectName}`);
    shell.cd(`${projectName}`);
    shell.exec(`git clone ${targetRepo} .`);
    shell.exec('git checkout --orphan latest_branch');
    shell.exec('git add -A');
    shell.exec('git commit -am "init the new project and install Next.js, Redux, and Styled-Components"');
    shell.exec('git branch -D master');
    shell.exec('git branch -m master');
});

shell.echo('New project has been created!');
