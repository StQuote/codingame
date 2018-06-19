import { ENTITY_TYPE_ENUM } from '../enums';

export class Factory {
    constructor(id, owner, unitsCount, production) {
        this._id = id;
        this._owner = owner;
        this._unitsCount = unitsCount;
        this._production = production;
    }

    get id() {
        return this._id;
    }

    get type() {
        return ENTITY_TYPE_ENUM.FACTORY;
    }

    get owner() {
        return this._owner;
    }

    set owner(value) {
        this._owner = value;
    }

    get unitsCount() {
        return this._unitsCount;
    }

    set unitsCount(value) {
        this._unitsCount = value;
    }

    get production() {
        return this._production;
    }

    set production(value) {
        this._production = value;
    }

    clone() {
        return new Factory(
            this.id,
            this.owner,
            this.unitsCount,
            this.production,
        );
    }
}
