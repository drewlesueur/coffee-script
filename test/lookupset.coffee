__useLookup__ = true

ok ?= () ->

band =
  name: "Aterciopelados"
  albums: ["Rio", "Oye", "Gozo Poderoso"]
  members: ["Andrea", "Hector"]
  _lookup: (obj, name) ->
    if name in obj.members
      "Yea!"
    else
      undefined

ok band.name is "Aterciopelados"
ok band.Andrea is "Yea!"


Yet2 =
  name: "Yet2"
Yet =
  name: "Yet"
  _type: Yet2

Another = 
  name: "Another"
  _lookup: (obj, prop) ->
    "#{obj._type.name}:#{prop}"
  _type: Yet

Animal =
  makeNoise: (self) ->
    self.noise + " normal animal"
  name: "Animal"
  _type: Another

Dog =
  makeNoise: (self, extra) ->
    self.noise + extra
  noise: "bark"
  _type: Animal
  name: "Dog"
  _lookup__: (obj, prop) ->
    "#{obj._type.name}:#{prop}"


dog =
  extra: "test for drew"
  _type: Dog
 

Wrapper =
  _set: (obj, prop, val) ->
    console.log "the obj is #{JSON.stringify obj}"
    console.log "the prop is #{prop}"
    console.log "thge val is #{val}"
    obj.attributes[prop] = val
    obj.attributes[prop] = val
    

person =
  _type: Wrapper
  eyes: "brown"
  attributes: {}

person.age = 11
console.log person.attributes.age
ok person.attributes.age is 11

console.log dog.yy
ok dog.makeNoise("woof") is "barkwoof"
ok dog.yoyo is "Dog:yoyo"




{name} = band

#a = {}
#a.b = {}
#a.b.casper = 2
#a.b[1 + 100] = 30
#a.b[ a.b("c") ] = 400
#
#a["b" + a.b("way")]["socks"]

#testing old way

__useLookup__ = false #todo make is so you don't have to do this
class Animal
  sound: "moo"
  makeNoise: () => @sound
__useLookup__ = false

b = {}
b.a = Animal
a = new b.a()

ok a.makeNoise() == "moo"
__useLookup__ = false

