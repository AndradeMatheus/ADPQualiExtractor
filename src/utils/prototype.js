// prototype.js

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};