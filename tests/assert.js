function assert() {
    var result = { pass: [], fails: [], counter: 0 };
    
    return {
        check: function(test, msg) {
            if(test === true) {
                result.pass.push('pass ' + msg);
            } else {
                result.fails.push('fails ' + msg);
            }
            
            result.counter++;
        },
        
        getAll: function() {
            return result;  
        },
        
        getPassed: function() {
            return result.pass;  
        },
        
        getFailed: function() {
            return result.fails;  
        },
        
        getStatistics: function() {
            return 'Passed: ' + result.pass.length + ' Failed: ' + result.fails.length;
        }
    };
}

module.exports = assert;