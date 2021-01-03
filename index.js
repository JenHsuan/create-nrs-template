#!/usr/bin/node

const shell = require("shelljs");
const inquirer = require("inquirer");

const targetRepo = 'https://github.com/JenHsuan/next-redux-styled-template.git';

const useSagaCommits = {
    begin: '300b4631ea767e5923712702b491c8c528df3f18',
    end: '300b4631ea767e5923712702b491c8c528df3f18'
}

const proxyCommits = {
    thunk: {
        begin: '038b8e1d443a45a2322dfd0af6d0cbfeea49edbf',
        end: '038b8e1d443a45a2322dfd0af6d0cbfeea49edbf'
    },
    saga: {
        begin: '026bb2cbabd659fc611aed31cc4d8bfd55dd9f5e',
        end: '026bb2cbabd659fc611aed31cc4d8bfd55dd9f5e'
    }
};

const jestCommitsForProxy = {
    thunk: {
        begin: 'd359be5e532d6a937062277041a6f635ad2f5c94',
        end: '18d6ec36333953f8f30a4ee50a4633d7b12e444b'
    },
    saga: {
        begin: '927f20c9f6676e9c4f5573ab54e48e4e1152a173',
        end: '927f20c9f6676e9c4f5573ab54e48e4e1152a173'
    }
};

const jestCommits = {
    thunk: {
        begin: '9b689f0184cab0b461b43030ca8e83baa66df37b',
        end: '2f05a93d290ad934f8e301a62570954d28dfd1ac'
    },
    saga: {
        begin: '8ae26bd1040d88240ade7711e188474776404754',
        end: '8ae26bd1040d88240ade7711e188474776404754'
    }
};

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
    const { projectName, addMiddleware, addProxy, addTests } = answers;
    shell.exec(`mkdir ${projectName}`);
    shell.cd(`${projectName}`);
    shell.exec(`git clone ${targetRepo} .`);
    if (addMiddleware) {
        //thunk
        if (addProxy && addTests) {
            shell.exec(`git cherry-pick ${proxyCommits.thunk.begin}^..${proxyCommits.thunk.end}`);
            shell.exec(`git cherry-pick ${jestCommitsForProxy.thunk.begin}^..${jestCommitsForProxy.thunk.end}`);
        } else if (addProxy) {
            shell.exec(`git cherry-pick ${proxyCommits.thunk.begin}^..${proxyCommits.thunk.end}`);
        } else if (addTests) {
            shell.exec(`git cherry-pick ${jestCommits.thunk.begin}^..${jestCommits.thunk.end}`);
        }
    } else {
        //saga
        shell.exec(`git cherry-pick ${useSagaCommits.begin}^..${useSagaCommits.end}`);
        if (addProxy && addTests) {
            shell.exec(`git cherry-pick ${proxyCommits.saga.begin}^..${proxyCommits.saga.end}`);
            shell.exec(`git cherry-pick ${jestCommitsForProxy.saga.begin}^..${jestCommitsForProxy.saga.end}`);
        } else if (addProxy) {
            shell.exec(`git cherry-pick ${proxyCommits.saga.begin}^..${proxyCommits.saga.end}`);
        } else if (addTests) {
            shell.exec(`git cherry-pick ${jestCommits.saga.begin}^..${jestCommits.saga.end}`);
        }
    }
    shell.exec('git checkout --orphan latest_branch');
    shell.exec('git add -A');
    shell.exec('git commit -am "init the new project and install Next.js, Redux, and Styled-Components"');
    shell.exec('git branch -D main');
    shell.exec('git branch -m master');
    shell.exec('git remote remove origin');
    shell.echo('New project has been created!');
});

