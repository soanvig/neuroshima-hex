class World {

  getFirstFoeInLine() {

  }

  getEffectsOnMyPosition() {

  }
}


class Medic {

}

class Soldier {
  initiative = ['3']


  act(initiative: number, world: World) {


    world.getFirstFoeInLine()


    return {
      effects: [],
    }
  }
}

class Netter {

  canIAct(world: World) {
    const effectsOnMyField = world.getEffectsOnMyPosition();



  }

  act() {

  }
}

const world = {}

console.log('asdsad')
