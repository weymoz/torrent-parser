function Logger(moduleName) {
  this.moduleName = moduleName;
}

Logger.prototype.log = function() {
  console.log(this.moduleName);
} 

module.exports = Logger;
