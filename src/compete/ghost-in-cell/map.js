import { debug } from 'utils/debug';

function getLinkHash(sourceFactoryId, destinationFactoryId) {
    return `${sourceFactoryId}_${destinationFactoryId}`;
}

class GameMap {
    constructor() {
        this._map = {};
    }

    setDistance(sourceFactoryId, destinationFactoryId, distance) {
        this._map[
            getLinkHash(sourceFactoryId, destinationFactoryId)
        ] = distance;
    }

    getDistance(sourceFactoryId, destinationFactoryId) {
        return this._map[getLinkHash(sourceFactoryId, destinationFactoryId)];
    }

    initialize(factoryCount) {
        this._factoryCount = factoryCount;
        debug('Distances', this._map);
    }
}

export const map = new GameMap();
