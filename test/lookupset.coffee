__useLookup__ = true

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

{name} = band

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

