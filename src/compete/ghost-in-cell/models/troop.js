import { ENTITY_TYPE_ENUM } from '../enums';
export class Troop {
    constructor(
        id,
        owner,
        sourceFactoryId,
        destinationFactoryId,
        unitsCount,
        turnsRemaining,
    ) {
        this._id = id;
        this._owner = owner;
        this._sourceFactoryId = sourceFactoryId;
        this._destinationFactoryId = destinationFactoryId;
        this._unitsCount = unitsCount;
        this._turnsRemaining = turnsRemaining;
    }

    get id() {
        return this._id;
    }

    get type() {
        return ENTITY_TYPE_ENUM.TROOP;
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

    get unitsCount() {
        return this._unitsCount;
    }

    get turnsRemaining() {
        return this._turnsRemaining;
    }

    set turnsRemaining(value) {
        this._turnsRemaining = value;
    }

    clone() {
        return new Troop(
            this.id,
            this.owner,
            this.sourceFactoryId,
            this.destinationFactoryId,
            this.unitsCount,
            this.turnsRemaining,
        );
    }
}
