const fs = require('fs')
const path = require('path')
const compiler = require("./compiler");

describe('compile file', function() {
    const creator = new compiler.Creator();
    let compilation = null;
    let errors = [];
    let module = null;
    beforeAll(async function() {
        compilation = await creator.startByFile('./Index.es');
        errors = compilation.compiler.errors;
    });

    afterAll(()=>{
        errors.forEach( item=>{
            if( item.kind == 0 ){
                fail( item.toString() )
            }
        });
        compilation = null;
    })

    it('should compile success and build', function() {
        expect('Expected 0 errors').toContain( errors.length );
        if( errors.length===0 ){
            creator.build( compilation, ()=>{
                console.log("build[Index.es] done")
            });
        }
    });
    
});


describe('compile file', function() {
    const creator = new compiler.Creator();
    let compilation = null;
    let errors = [];
    let module = null;
    beforeAll(async function() {
        compilation = await creator.startByFile('./karma/Index.es');
        errors = compilation.compiler.errors;
    });

    afterAll(()=>{
        errors.forEach( item=>{
            if( item.kind == 0 ){
                fail( item.toString() )
            }
        });
        compilation = null;
    })

    it('should compile success and build', function() {
        expect('Expected 0 errors').toContain( errors.length );
        if( errors.length===0 ){
            creator.build( compilation, ()=>{
                console.log("build[karma/Index.es] done")
            });
        }
    });
    
});

describe('compile file', function() {
    const creator = new compiler.Creator();
    let compilation = null;
    let errors = [];
    let module = null;
    beforeAll(async function() {
        compilation = await creator.startByFile('./karma/Test.es');
        errors = compilation.compiler.errors;
    });

    afterAll(()=>{
        errors.forEach( item=>{
            if( item.kind == 0 ){
                fail( item.toString() )
            }
        });
        compilation = null;
    })

    
    it('should compile success and build', function() {
        expect('Expected 0 errors').toContain( errors.length );
        if( errors.length===0 ){
            creator.build( compilation, ()=>{
                console.log("build[karma/Test.es] done")
            });
        }
    });
    
});