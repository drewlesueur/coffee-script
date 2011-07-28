__useGetSet__ = true

ok ?= () ->

band =
  name: "Aterciopelados"
  albums: ["Rio", "Oye", "Gozo Poderoso"]
  members: ["Andrea", "Hector"]
  _get: (obj, name) ->
    if name in obj.members
      "Yea!"
    else
      undefined

ok band.name is "Aterciopelados"
ok band.Andrea is "Yea!"
{name} = band
ok name is "Aterciopelados"


Another = 
  name: "Another"
  _get: (obj, prop) ->
    "#{obj._type.name}:#{prop}"

Animal =
  makeNoise: (self) ->
    self.noise + " normal animal"
  name: "Animal"
  size: "big"
  _type: Another

Dog =
  makeNoise: (self, extra) ->
    self.noise + extra
  noise: "bark"
  _type: Animal
  name: "Dog"


dog =
  extra: "test for drew"
  _type: Dog
 
ok dog.size is "big"
ok dog.makeNoise("woof") is "barkwoof"
ok dog.yoyo is "Dog:yoyo"

Wrapper =
  _set: (obj, prop, val) ->
    obj.attributes[prop] = val
    obj.attributes[prop] = val
    

person =
  _type: Wrapper
  eyes: "brown"
  attributes: {}


person.age = 11
ok person.attributes.age is 11



#a = {}
#a.b = {}
#a.b.casper = 2
#a.b[1 + 100] = 30
#a.b[ a.b("c") ] = 400
#
#a["b" + a.b("way")]["socks"]


__useGetSet__ = false

#Not compatible with existing class syntax
#
#
#TODO
# define the _get function simpler
# have a if obj._get or _obj._type at the beginning so you don't have to worry about this and stuff
