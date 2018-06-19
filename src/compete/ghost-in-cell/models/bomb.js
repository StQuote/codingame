import {ENTITY_TYPE_ENUM} from '../enums';
export class Bomb {
    constructor(
        id,
        owner,
        sourceFactoryId,
        destinationFactoryId,
        turnsRemaining,
        predictedDestinationIds,
    ) {
        this._id = id;
        this._owner = owner;
        this._sourceFactoryId = sourceFactoryId;
        this._destinationFactoryId = destinationFactoryId;
        this._turnsRemaining = turnsRemaining;
        this._predictedDestinationIds = predictedDestinationIds;
    }

    get id() {
        return this._id;
    }

    get type() {
        return ENTITY_TYPE_ENUM.BOMB;
    }

    get owner() {
        return this._owner;
    }

    get sourceFactoryId() {
        return this._sourceFactoryId;
    }

    get destinationFactoryId() {
        return this._destinationFactoryId;
    }

    get predictedDestinationIds() {
        return this._predictedDestinationIds;
    }

    set predictedDestinationIds(value) {
        this._predictedDestinationIds = value;
    }

    get turnsRemaining() {
        return this._turnsRemaining;
    }

    set turnsRemaining(value) {
        this._turnsRemaining = value;
    }

    clone() {
        return new Bomb(
            this.id,
            this.owner,
            this.sourceFactoryId,
            this.destinationFactoryId,
            this.turnsRemaining,
            this.predictedDestinationIds,
        );
    }
}
Bomb.predictionCache = {};
