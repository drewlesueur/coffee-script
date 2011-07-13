require("colors")

function __lookup(obj, property, dontBindObj, childObj, debug) {
  __slice = Array.prototype.slice
  if (property == "call" && "__original" in obj) {
    return function(){
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      thethis = args[0]
      theargs = args.slice(1)
      return obj.__original.apply(thethis, theargs)
    } 
  }
  if (property == "apply" && "__original" in obj) {
    return function(){
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      thethis = args[0]
      theargs = args[1]
      return obj.__original.apply(thethis, theargs)
    } 
  }
  var originalFunction = function(){}
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
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    method = obj[property]
    if (method) {
      //todo make this conditional
      return method.apply(obj, args);
    } else {
      return
    }
  }
  if (typeof obj !== "object" && typeof obj !== "function") {
    if (isString(obj) && property === "length") {
      return obj.length;
    } else if (isRegExp(obj) && property === "source") {
      return obj.source
    } else if (typeof obj === "number") {
      //return obj[property]
      obj = new Number(obj)
    } else if (obj[property] === void 0) { //might not need this one
      return
    } else {
      //thissedFunction.__original == ????
      return thissedFunction //everyting else is a function
    }
  }
  if (property in obj) {
    var ret = obj[property];  
    if (!dontBindObj && isFunction(ret)) {
      originalFunction = ret
      thissedFunction.__original = ret
      ret = thissedFunction
    }
    return ret
  } else if ("_lookup" in obj) {
    var usedObj = childObj || obj
    var ret = (obj._lookup(usedObj, property))
    if (!isUndefined(ret)) {
      return ret  
    }
  }
  var type = obj._type
  var hasTypeObj = (typeof type === "object") || (typeof type === "function");
  if (hasTypeObj) {
    ret = __lookup(type, property, true, obj);
    if (!dontBindObj && isFunction(ret)) { //is don't bind obj needed here
      var fn = function () {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        args.unshift(obj)
        return ret.apply(obj, args)
      }
      fn.__original = ret
      return fn
    } else {
      return ret;
    }

  } else {
    return;
  }
}


a = [1,2,3,4]
failes = []
passCount = 0
failCount = 0
ok = function (val, message) {
  if (!val) {
    failCount++
    failes.push(message)
    console.log(message.red)
  } else {
    console.log(message.green)
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
    return "You are " + obj.age + " years old"        
  },
  friendly: "unknown",
  testCall: function(obj, a, b, c) {
    return obj.color + a + b
  },
  _lookup: function(obj, property) {
    return "no has " + property
  }


}
Dog = {
  makeNoise: function(obj) {
    return "Bark!"
  },
  _type: Animal
}

Snake = {
  className: "Snake",
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
  snakey2: function(obj, a) {
    return obj.color + a
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
  info: "test",
  val: 1
}

var a, b, generateGetter, getA, getArgs;
generateGetter = function(prop) {
  return function(obj) {
    return __lookup(obj, prop);
  };
};
a = b = 30
getA = generateGetter('a');
result = getA(a, {
  b: 1
});


eq(void 0, result, "should get null");

eq(__lookup(library, "ooglie") , void 0, "not there")

eq(__lookup([1,2,3], "reverse")()[0] , 3, "build in prototype methods")
eq(__lookup(library, "joiner")("hi", "world") , "hiworld", "_my own value with a function")
eq(__lookup(dog, "age") , dog.age, "my own value")
eq(__lookup(library, "info") , "test", "my own value")
eq(__lookup(snake, "ageinator") , "1 snake year", "my own _lookup")
eq(__lookup(snake, "friendly") , "depends", "the _types value")
eq(__lookup(dog, "friendly" ) , "unknown", "the _types, _types value")
eq(__lookup(dog, "makeNoise")() , "Bark!", "the _type's function")
eq(__lookup(snake, "snakey")() , "green", "the _type's function with object param")
eq(__lookup(snake, "snakey2")("2") , "green2", "the _type's function with object param and another param")
eq(__lookup(snake, "the_eyes") , "like a cat", "the_type's _lookup")
eq(__lookup(snake, "sayAge")() , "You are 1 snake year years old", "_type's _type's func")
eq(__lookup(snake, "say_what") , "no has say_what", "_type's _type's lookup")

snakey = __lookup(snake, "snakey")
eq(snakey.__original, Snake.snakey, "original functions should equal")
testCall = __lookup(snake, "testCall")
eq(testCall.__original, Animal.testCall, "original functions should equal again")

eq(__lookup(__lookup(snake, "snakey"), "call")(null, {color: "blue"}) , "blue", "the _type's function with object param")
eq(__lookup(__lookup(snake, "snakey"), "call")(null, {color: "blue"}) , "blue", "using call on typed object")
eq(__lookup(__lookup(snake, "snakey"), "apply")(null, [{color: "blue"}]) , "blue", "using apply on typed object")

var obj1;
obj1 = ({
  one: 1,
  two: 2
});


hasOwner = __lookup(Object.prototype, "hasOwnProperty")
eq(__lookup(hasOwner, "call")(obj1, 'one'), true, "has owner");

hasOwner2 = Object.prototype.hasOwnProperty//__lookup(Object.prototype, "hasOwnProperty")
eq(__lookup(hasOwner2, "call")(obj1, 'one'), true, "has owner2");

eq(__lookup(__lookup(Object.prototype, "hasOwnProperty"), "call")(obj1, 'one'), true, "1");
eq(__lookup(obj1, "one"), 1, "2");
ok(__lookup(__lookup(Object.prototype, "hasOwnProperty"), "call")(obj1, 'two'), "3");
eq(__lookup(obj1, "two"), 2, "4");




var obj2;
obj2 = ({
  three: 3,
  four: 4
});
ok(__lookup(__lookup(Object.prototype, "hasOwnProperty"), "call")(obj2, 'three'), "5");
eq(__lookup(obj2, "three"), 3, "6");
ok(__lookup(__lookup(Object.prototype, "hasOwnProperty"), "call")(obj2, 'four'), "7");
eq(__lookup(obj2, "four"), 4, "8");







testFunc  = function(a, b, c) {
  return this  + a  + b
}

eq(__lookup(Array.prototype.reverse, "call")([10,9,8])[0] , 8, "using call")

eq(__lookup(testFunc, "call")("dude", "!", "@"), "dude!@", "using call")
eq(__lookup(testFunc, "apply")("dude", ["!", "@"]), "dude!@", "using call")
//eq(__lookup(__lookup(snake, "testCall"), "call")({color:"blue"}, "!", "@"), "blue!@", "using call2")





function argsTest() {
  var length = __lookup(arguments, "length")
  eq(length, 3, "length of args is 3")
  var arr = [1,2, 3, 4]
  eq(__lookup(arr, "length"), 4, "length should be 5")
}
argsTest(1,2,3);

//This test shouldn't pass
//a = __lookup(1, "toString")
//eq(a, Number.prototype.toString, "lookup on a numebr")

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
