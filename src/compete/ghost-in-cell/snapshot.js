import { ENTITY_TYPE_ENUM, OWNER_ENUM } from './enums';

export class Snapshot {
    constructor(entities) {
        this._entities = entities;
    }

    getTroops() {
        return this._entities.filter(m => m.type === ENTITY_TYPE_ENUM.TROOP);
    }

    getFactories() {
        return this._entities.filter(m => m.type === ENTITY_TYPE_ENUM.FACTORY);
    }

    getBombs() {
        return this._entities.filter(m => m.type === ENTITY_TYPE_ENUM.BOMB);
    }

    getFactoriesByOwnerType(ownerType) {
        return this.getFactories().filter(m => m.owner === ownerType);
    }

    getFactoriesExcludeWithOwnerType(ownerType) {
        return this.getFactories().filter(m => m.owner !== ownerType);
    }

    getOwnFactories() {
        return this.getFactoriesByOwnerType(OWNER_ENUM.PLAYER);
    }

    getEnemyAndNeutralFactories() {
        return this.getFactoriesExcludeWithOwnerType(OWNER_ENUM.PLAYER);
    }

    getEnemyFactories() {
        return this.getFactoriesByOwnerType(OWNER_ENUM.OPPONENT);
    }

    getById(id) {
        return this._entities.find(entity => entity.id === parseInt(id));
    }

    clone() {
        return new Snapshot(this._entities.map(e => e.clone()));
    }

    hasTroops() {
        return this.getTroops().length > 0;
    }

    removeByIds(ids) {
        this._entities = this._entities.filter(e => !ids.includes(e.id));
    }
}
