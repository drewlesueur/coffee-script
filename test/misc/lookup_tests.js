require("colors")

__slice = Array.prototype.slice
__hasProp = Object.prototype.hasOwnProperty
function __lookup(obj, property, debug) {

  var isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };
  isUndefined = function(obj) {
    return obj === void 0;
  };
  var isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }; 
  var isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false)); 
  }
  var thissedFunction = function () {
    if (debug) {
      console.log("debugged this")
      console.log(JSON.stringify(obj))
      //console.log(this)
    }
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (property == "call") {
      method = obj
      obj = args[0]
      args = args.slice(1)
    } else {
      method = obj[property]
    }
    //console.log("by the way, args[0] is" + args[0])
    //console.log("by the way, this is" + this)
    if (method) {
      //todo make this conditional
      if (debug) {
        console.log("applying " + JSON.stringify(obj) + "to the method")
        console.log(args)
      }
      return method.apply(obj, args);
    } else {
      console.log("NO HAVE THE PROP");
      console.log(property)
      return
    }
  }
  if (typeof obj !== "object" && typeof obj !== "function") {
    if (isString(obj) && property === "length") {
      return obj.length;
    } else if (isRegExp(obj) && property === "source") {
      return obj.source
    } else {
      console.log("not object!!!!!")
      console.log(typeof obj)
      console.log(property)
      return thissedFunction //everyting else is a function
    }
  }
  if (property in obj) {
    
    var ret = obj[property];  
    //if (__hasProp.call(obj, property)) {
    //  return ret
    //}
    return ret  //hmmm
    if (isFunction(ret)) {
      if (debug) {  
      console.log("returning thissed from normal lookup")
      console.log("the object at this poitn is")
      console.log(JSON.stringify(obj))
      }
      
      thissedFunction.original = ret
      ret = thissedFunction
    }
    return ret
  } else if ("_lookup" in obj) {
    var ret = (obj._lookup(obj, property))
    if (!isUndefined(ret)) {
      return ret  
    }
  }
  if (debug) {
    console.log("got here!")
  }
  var type = obj._type
  var hasTypeObj = (typeof type === "object") || (typeof type === "function");
  if (hasTypeObj) {
    ret = __lookup(type, property);
    console.log("lookup with type")
    //return ret //hmmm?
    if (isFunction(ret)) {
      return function () {
        console.log(ret.toString())
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        args.unshift(obj)
        console.log("applying")
        console.log(JSON.stringify(obj))
        console.log(ret.toString())
        return ret.apply(obj, args)
      }
    } else {
      return ret;
    }

  } else {
    return;
  }
}


a = [1,2,3,4]
//console.log(a.reverse())
failes = []
passCount = 0
failCount = 0
ok = function (val, message) {
  if (!val) {
    failCount++
    failes.push(message)
  } else {
    passCount++
  }
}
eq = function (val,other, message) {
  if (val != other) {
    failCount++
    failes.push(message + "\n expected: " + other + "\n got: " + val)
  } else {
    passCount++
  }
}

Animal = {
  makeNoise: function(obj) {
    return "noise!";
  },
  sayAge: function(obj) {
    return "You are " + obj.age + "years old"        
  },
  friendly: "unknown"
}
Dog = {
  makeNoise: function(obj) {
    return "Bark!"
  },
  _type: Animal
}

Snake = {
  makeNoise: function(obj) {
    return "His!"           
  },
  _lookup: function(obj, property) {
    if (property.match(/eyes/)) {
      return obj.eyes
    }
  },
  friendly: "depends",
  snakey: function(obj) {
    return obj.color
  },
  _type: Animal
}

dog = {
  age: "11 dog years",
  _type: Dog
}


snake = {
  eyes: "like a cat",
  age : "1 snake year",
  color: "green",
  _lookup: function(obj, property) {
    if (property.match(/age/)) {
      return obj.age
    }
  },
  _type: Snake
}

library = {
  joiner: function(str1, str2) {
    return str1 + str2
  },
  info: "test"
}

console.log("YYYYEEEEEESSSSS")
console.log(__lookup(dog, "makeNoise", "debug")())


eq(__lookup([1,2,3], "reverse")()[0] , 3, "build in prototype methods")
eq(__lookup(library, "joiner")("hi", "world") , "hiworld", "_my own value with a function")
eq(__lookup(dog, "age") , dog.age, "my own value")
eq(__lookup(library, "info") , "test", "my own value")
eq(__lookup(snake, "ageinator") , "1 snake year", "my own _lookup")
eq(__lookup(snake, "friendly", "debug") , "depends", "the _types value")
eq(__lookup(dog, "friendly" ) , "unknown", "the _types, _types value")
eq(__lookup(dog, "makeNoise", "debug")() , "Bark!", "the _type's function")
eq(__lookup(snake, "snakey", "debug")() , "green", "the _type's function with object param")
eq(__lookup(snake, "the_eyes", "debug") , "like a cat", "the_type's _lookup")



console.log((passCount + " tests passed").green)
console.log((failCount + " tests failed").red)
for (id in failes) {
  console.log(failes[id].red)
}
/*
f = Array.prototype.reverse
g = __lookup(f, "call")
a = [2,3,4]
console.log ("AAAAA")
console.log(g(a))

a = [2,3,4]
console.log ("BBBBB")
h = __lookup(Array.prototype, "reverse")
console.log(h.call(a))

i = __lookup(h, "call")
console.log ("CCCCC")
console.log(i(a))


*/
