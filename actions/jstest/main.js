#!/usr/bin/env node


const fs=require('fs');
const child_process=require('child_process');
const path=require('path');

// ---------- Utility Functions --------------------

const makeDir=function(f1,exit=true) {
    console.log('++++ creating directory',f1);
    try {
        fs.mkdirSync(f1);
    } catch(e) {
        if (e.code === 'EEXIST') {
            console.log('---- directory '+f1+' exists. Remove and try again.'+exit);
            if (exit)
                process.exit(0);
            else
                return;
        }
        console.log('---- error=',JSON.stringify(e));
        process.exit(0);
    }
};

const copyFileSync=function(d1,fname,d2,fname2) {
    
    let f1=path.join(d1,fname);
    let f2=path.join(d2,fname2);
    
    console.log('++++ copying file  '+f1+'\n\t\t--> '+f2);
    try {
        fs.copyFileSync(f1,f2);
    } catch(e) {
        console.log('---- error',e);
        process.exit(0);
    }
};


const executeCommand=function(command,dir,force=false,dummy=false) {

    let done=false;
    
    if (force)
        console.log('++++ The next step will take a while ...');

    if (dummy) {
        console.log(command);
        return;
    }
    
    console.log('++++ ['+dir+"] "+command);

    
    return new Promise( (resolve,reject) => {

        try { 
            let proc=child_process.exec(command, { cwd : dir });
            if (force) {
                proc.stdout.pipe(process.stdout);
                proc.stderr.pipe(process.stderr);

                let sleep=function(ms) {  return new Promise(resolve => setTimeout(resolve, ms));};
                
                let fn= (async() => {
                    while (done) {
                        console.log('fn');
                        proc.stdout.write();
                        process.stdout.write();
                        await sleep(1000);
                    }
                });
                fn();
            } else {
                proc.stdout.on('data', function(data) {
                    let d=data.trim();
                    let show=true;
                    if (d.length<1)
                        show=false;
                    if (d.indexOf('inflating')>=0)
                        show=false;
                    
                    if (show)
                        console.log('____ '+d.split('\n').join('\n____ '));
                });
                proc.stderr.on('data', function(data) {
                    console.log('---- Error: '+data);
                });
            }
            
            proc.on('exit', function(code) {
                done=true;
                if (code===0)
                    resolve();
                else
                    reject();
            });
            
        } catch(e) {
            console.log(' error '+e);
            reject(e);
        }
    });
};

// -------- Main Function ---------

const main=async function() {

    const MYDIR='/tmp/biswebcontainer';
    console.log("------------------------------------------------------------------------------------");
    makeDir(MYDIR);
    copyFileSync(__dirname,'entrypointtest.sh',MYDIR,'entrypointtest.sh');
    copyFileSync(__dirname,'biswebconfig_unix.sh',MYDIR,'biswebconfig.sh');
    await executeCommand(`chmod +x ${MYDIR}\/*`,MYDIR);
    console.log("------------------------------------------------------------------------------------");
    await executeCommand(`bash ${MYDIR}/entrypointtest.sh ${MYDIR} 12 14`,MYDIR);
    console.log("------------------------------------------------------------------------------------");   
}

// -------- Main Program ---------

main().then( () => {
    console.log('++++\n++++ done\n++++');
    process.exit(0);
}).catch( (e) => {
    console.log('----\n---- error '+e+'\n----');
    process.exit(1);
});



