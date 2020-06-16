var tools = {};

function isType(type) {
  return function(obj) {
    return Object.prototype.toString.call(obj) === "[object " + type + "]";
  };
}
tools.isObject = obj => {
  return isType("Object")(obj);
};

tools.isString = obj => {
  return isType("String")(obj);
};

tools.isNumber = obj => {
  return isType("Number")(obj);
};

tools.isBoolean = obj => {
  return isType("Boolean")(obj);
};

tools.isArray = obj => {
  return isType("Array")(obj);
};

tools.isFunction = obj => {
  return isType("Function")(obj);
};

tools.isUndefined = obj => {
  return isType("Undefined")(obj);
};

tools.jsonStringify = function(obj) {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return '';
  }
};

tools.jsonParse = function(obj) {
  try {
    return JSON.parse(obj);
  } catch (e) {
    return null;
  }
};


module.exports = tools;
