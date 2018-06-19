import { ENTITY_TYPE_ENUM, OWNER_ENUM } from './enums';
import { Troop, Bomb, Factory } from './models';
import { Snapshot } from './snapshot.js';
import { map } from './map.js';

function readTroopModel(inputs) {
    return new Troop(
        parseInt(inputs[0]),
        OWNER_ENUM[parseInt(inputs[2])],
        parseInt(inputs[3]),
        parseInt(inputs[4]),
        parseInt(inputs[5]),
        parseInt(inputs[6]),
    );
}

function readFactoryModel(inputs) {
    return new Factory(
        parseInt(inputs[0]),
        OWNER_ENUM[parseInt(inputs[2])],
        parseInt(inputs[3]),
        parseInt(inputs[4]),
    );
}

function readBombModel(inputs) {
    const id = parseInt(inputs[0]);
    return new Bomb(
        id,
        OWNER_ENUM[parseInt(inputs[2])],
        parseInt(inputs[3]),
        parseInt(inputs[4]),
        parseInt(inputs[5]),
        Bomb.predictionCache[id],
    );
}

function readModelByType(type, inputs) {
    switch (type) {
        case ENTITY_TYPE_ENUM.FACTORY:
            return readFactoryModel(inputs);
        case ENTITY_TYPE_ENUM.TROOP:
            return readTroopModel(inputs);
        case ENTITY_TYPE_ENUM.BOMB:
            return readBombModel(inputs);
        default:
            throw new Error(`unkown entity type '${type}'`);
    }
}

function readSnapshot() {
    const entities = [];
    const entityCount = parseInt(readline()); // the number of entities (e.g. factories and troops)
    for (var i = 0; i < entityCount; i++) {
        const inputs = readline().split(' ');
        const entityType = inputs[1];
        const model = readModelByType(entityType, inputs);
        entities.push(model);
    }

    return new Snapshot(entities);
}

function initialize() {
    const FACTORY_COUNT = parseInt(readline()); // the number of factories
    const LINK_COUNT = parseInt(readline()); // the number of links between factories
    for (let i = 0; i < LINK_COUNT; i++) {
        const inputs = readline().split(' ');
        map.setDistance(
            parseInt(inputs[0]),
            parseInt(inputs[1]),
            parseInt(inputs[2]),
        );
    }

    map.initialize(FACTORY_COUNT);
}

let sendQueue = [];
function sendTroopAction(sourceFactory, destinationFactory, unitsCount) {
    sendQueue.push(`MOVE ${sourceFactory} ${destinationFactory} ${unitsCount}`);
}

function sendBombAction(sourceFactory, destinationFactory) {
    sendQueue.push(`BOMB ${sourceFactory} ${destinationFactory}`);
}

function incrementFactoryProductionAction(sourceFactory) {
    sendQueue.push(`INC ${sourceFactory}`);
}

function send() {
    if (sendQueue.length === 0) {
        sendQueue.push('WAIT');
    }
    print(sendQueue.join(';'));
    sendQueue = [];
}

export {
    readSnapshot,
    initialize,
    sendBombAction,
    sendTroopAction,
    incrementFactoryProductionAction,
    send,
};
