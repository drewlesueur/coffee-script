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

a = new b.c.d(a)


__useLookup__ = false

