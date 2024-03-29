(function() {    
    if (!('forEach' in Array.prototype)) {
        Array.prototype.forEach = function(action, that /*opt*/ ) {
            for (var i = 0, n = this.length; i < n; i++)
                if (i in this)
                    action.call(that, this[i], i, this);
        };
    }

    if (!('indexOf' in Array.prototype)) {
        Array.prototype.indexOf = function(find, i /*opt*/ ) {
            if (i === undefined) i = 0;
            if (i < 0) i += this.length;
            if (i < 0) i = 0;
            for (var n = this.length; i < n; i++)
                if (i in this && this[i] === find)
                    return i;
            return -1;
        };
    }
})();