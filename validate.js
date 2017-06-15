module.exports = (function() {
    "use strict";

    /**
     * Regular expressions used for validation.
     * @type {RegExp}
     */
    var numericRegex      = /^-{0,1}\d*\.{0,1}\d+$/,
        alphaRegex        = /^[a-z]+$/i,
        alphaNumericRegex = /^[a-z0-9]+$/i,
        alphaDashRegex    = /^[a-z0-9_\-]+$/i,
        integerRegex      = /^\-?[0-9]+$/,
        hexRegex          = /^[a-f0-9]+$/i,
        base64Regex       = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
        whitespaceRegex   = /\s/g,
        ipRegex           = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
        emailRegex        = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
        urlRegex          = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

    /**
     * Validate Array
     */
    function isArray(arr) {
        try {
            return arr.constructor === Array;
        } catch (e) {
            return false;
        }
    }

    /**
     * Crates the error message
     * @param  {[string]} message
     * @return {[string]}
     */
    function msg(message) {
        var args = Array.prototype.slice.call(arguments, 1);
        return message.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number]  : match;
        });
    }

    // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
    // :: Class constructor
    // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    function Validate() {
        this.errors     = [];
        this.lastErrors = [];

        /**
         * Error messages to be displayed in error array.
         * @type {Object}
         */
        this.messages = {

            max: '{1} integer value must not exceed {0}',
            min: '{1} integer value must be at least {0}',
            exact: '{1} integer value must be exactly {0}',

            maxLength: '{1} must not exceed {0} characters in length',
            minLength: '{1} must be at least {0} characters in length',
            exactLength: '{1} must be exactly {0} characters in length',

            required: 'required {1} is empty or undefined',
            match: '{1} does not match: {0}',
            matchArray: '{1} does not match any of: {0}',
            noMatch: '{1} must not match: {0}',
            noMatchArray: '{1} must not match any of: {0}',

            isAlpha: '{1} must contain only alphabetical characters',
            isNumeric: '{1} must contain only numbers',
            isAlphaNumeric: '{1} must contain only alpha-numeric characters',
            isAlphaDash: '{1} must contain only alpha-numeric characters, underscores, and dashes',
            isInteger: '{1} must contain an integer',
            hexRegex: '{1} must contain a valid hex value',

            isBase64: '{1} must contain a base64 string',
            isIP: '{1} must contain a valid IP',
            isEmail: '{1} must contain a valid email address',
            isUrl: '{1} must contain a valid URL',

            noWhitespace: 'must not use whitespace character in {1}',
            isJson: '{1} is not a valid JSON string'
        };

        this.value = null;
        this.key   = null;
    }

    // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
    // :: Public Methods
    // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    /**
     * Supply the value to be validated
     * @param  {[mixed]} value
     */
    Validate.prototype.validate = function(value, key) {
        this.value  = value;
        this.key    = key || 'field';
        return this;
    };

    /**
     * Set custom message
     * @param {[string]} msg    [message to be changed]
     * @param {[string]} newMsg [new message text]
     */
    Validate.prototype.setMsg = function(msg, newMsg) {
        this.messages[msg] = newMsg;
    };

    /**
     * Get errors, if any, after running isValid()
     * @return {[mixed]} [returns errors array, if no errors, returns false]
     */
    Validate.prototype.getErrors = function() {
        return this.lastErrors.length > 0 ? this.lastErrors : false;
    };

    /**
     * Run the validator
     * @return {Boolean}
     */
    Validate.prototype.isValid = function() {
        var result = (this.errors.length === 0);

        this.lastErrors = this.errors;
        this.errors     = [];
        this.value      = null;
        this.key        = null;

        return result;
    };

    // :: Validators

    Validate.prototype.max = function(value) {
        this.isNumeric(value);
        if (this.value > value) {
            this.errors.push(msg(this.messages.max, value, this.key));
        }
        return this;
    };

    Validate.prototype.min = function(value) {
        this.isNumeric(value);
        if (this.value < value) {
            this.errors.push(msg(this.messages.min, value, this.key));
        }
        return this;
    };

    Validate.prototype.exact = function(value) {
        this.isNumeric(value);
        if (this.value == value) {
            this.errors.push(msg(this.messages.exact, value, this.key));
        }
        return this;
    };

    Validate.prototype.maxLength = function(value) {
        if (this.value === null || this.value === undefined || this.value.toString().length > value) {
            this.errors.push(msg(this.messages.maxLength, value, this.key));
        }
        return this;
    };

    Validate.prototype.minLength = function(value) {
        if (this.value === null || this.value === undefined || this.value.toString().length < value) {
            this.errors.push(msg(this.messages.minLength, value, this.key));
        }
        return this;
    };

    Validate.prototype.exactLength = function(value) {
        if (this.value === null || this.value === undefined || this.value.toString().length != value) {
            this.errors.push(msg(this.messages.exactLength, value, this.key));
        }
        return this;
    };

    Validate.prototype.required = function() {
        if (this.value === null || this.value === '' || this.value === undefined) {
            this.errors.push(msg(this.messages.required, null, this.key));
        }
        return this;
    };

    Validate.prototype.match = function(value) {
        if (isArray(value)) {
            if (value.indexOf(this.value) === -1) {
                this.errors.push(msg(this.messages.matchArray, value.toString(), this.key));
            }

        } else {
            if (this.value !== value) {
                this.errors.push(msg(this.messages.match, value, this.key));
            }
        }

        return this;
    };

    Validate.prototype.matches = Validate.prototype.match; // alias to match

    Validate.prototype.noMatch = function(value) {
        if (isArray(value)) {
            if (value.indexOf(this.value) !== -1) {
                this.errors.push(msg(this.messages.noMatchArray, value.toString(), this.key));
            }

        } else {
            if (this.value === value) {
                this.errors.push(msg(this.messages.noMatch, value, this.key));
            }
        }

        return this;
    };

    Validate.prototype.isAlpha = function() {
        if (this.value === null || !alphaRegex.test(this.value)) {
            this.errors.push(msg(this.messages.isAlpha, null, this.key));
        }
        return this;
    };

    Validate.prototype.isNumeric = function() {
        if (!numericRegex.test(this.value)) {
            this.errors.push(msg(this.messages.isNumeric, null, this.key));
        }
        return this;
    };

    Validate.prototype.isAlphaNumeric = function() {
        if (this.value === null || !alphaNumericRegex.test(this.value)) {
            this.errors.push(msg(this.messages.isAlphaNumeric, null, this.key));
        }
        return this;
    };

    Validate.prototype.isAlphaDash = function() {
        if (this.value === null || !alphaDashRegex.test(this.value)) {
            this.errors.push(msg(this.messages.isAlphaDash, null, this.key));
        }
        return this;
    };

    Validate.prototype.isInteger = function() {
        if (!integerRegex.test(this.value)) {
            this.errors.push(msg(this.messages.isInteger, null, this.key));
        }
        return this;
    };

    Validate.prototype.isHex = function() {
        if (!hexRegex.test(this.value)) {
            this.errors.push(msg(this.messages.hexRegex, null, this.key));
        }
        return this;
    };

    Validate.prototype.isBase64 = function() {
        if (!base64Regex.test(this.value)) {
            this.errors.push(msg(this.messages.isBase64, null, this.key));
        }
        return this;
    };

    Validate.prototype.isIP = function() {
        if (!ipRegex.test(this.value)) {
            this.errors.push(msg(this.messages.isIP, null, this.key));
        }
        return this;
    };

    Validate.prototype.isEmail = function() {
        if (!emailRegex.test(this.value)) {
            this.errors.push(msg(this.messages.isEmail, null, this.key));
        }
        return this;
    };

    Validate.prototype.isUrl = function() {
        if (!urlRegex.test(this.value)) {
            this.errors.push(msg(this.messages.isUrl, null, this.key));
        }
        return this;
    };

    Validate.prototype.noWhitespace = function() {
        if(this.value === null || whitespaceRegex.test(this.value)) {
            this.errors.push(msg(this.messages.noWhitespace, null, this.key));
        }
        return this;
    };

    Validate.prototype.isJson = function() {
        try {
            JSON.parse(this.value);
        } catch (e) {
            this.errors.push(msg(this.messages.isJson, null, this.key));
        }
        return this;
    };

    return Validate;
}());
