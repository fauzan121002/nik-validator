const { resourceLimits } = require('worker_threads');
const Validator = require('./src/validator');

let validator = new Validator().parse(3271046504930002);

if(validator.valid){
    console.log(validator);
}