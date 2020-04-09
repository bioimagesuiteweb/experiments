#!/usr/bin/env node

const path=require('path');
const util=require('./bis_createutil');

if (path.sep==='\\') {
    console.log('++++ BioImageSuite Web create developer environment \n++++');
    console.log('---- This file will only run on a UNIX OS (Mac or Linux)');
    process.exit(1);
}

const main=async function() {

    const MYDIR='/tmp/biswebcontainer';

    console.log("------------------------------------------------------------------------------------");
    util.makeDir(MYDIR);
    util.copyFileSync(__dirname,'entrypointtest.sh',MYDIR,'entrypointtest.sh');
    util.copyFileSync(__dirname,'biswebconfig_unix.sh',MYDIR,'biswebconfig.sh');
    await util.executeCommand(`chmod +x ${MYDIR}/*`,MYDIR);
    await util.executeCommand(`bash ${MYDIR}/entrypointtest.sh ${MYDIR} 12 14`,MYDIR);
}

main().then( () => {
    console.log('++++\n++++ done\n++++');
    process.exit(0);
}).catch( (e) => {
    console.log('----\n---- error '+e+'\n----');
    process.exit(1);
});



