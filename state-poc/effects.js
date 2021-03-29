const replace = (arr, index, cb) => arr.map((v, i) => {
  if (i === index) {
    return cb(v);
  }

  return v;
})

const world = [
  { effects: [], object: null },
  { effects: [], object: null },
  { effects: [], object: null },
];

const effect = {
  name: 'effect1',
  affectedFields (world, x) {
    return [
      x - 1,
      x + 1
    ]
  }
}

const object = {
  getEffects () {
    return [
      effect
    ]
  }
}

const affectFields = (originalWorld, x, object) => {
  return object.getEffects().reduce((world, effect) => {
    const fields = effect.affectedFields(world, x);

    return fields.reduce((worldInner, fieldX) => {
      return replace(worldInner, fieldX, field => ({
        ...field,
        effects: field.effects.concat(effect.name),
      }));
    }, world);
  }, originalWorld);
}

const addObject = (world) => (x, object) => {
  const withObject = replace(world, x, field => ({
    ...field,
    object,
  }));

  const withEffects = affectFields(withObject, x, object);

  return withEffects;
}

console.log(addObject(world)(1, object))
