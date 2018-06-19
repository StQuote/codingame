import { calculateNextSnapshots } from './calculation';
import {
    sendTroopAction,
    sendBombAction,
    incrementFactoryProductionAction,
} from './api';
import { map } from './map.js';
import { Troop } from './models';
import { OWNER_ENUM } from './enums';

const argumentToId = arg => (typeof arg === 'object' ? arg.id : arg);

export class World {
    constructor(currentSnapshot) {
        this._currentSnapshot = currentSnapshot;
    }

    get currentSnapshot() {
        return this._currentSnapshot;
    }

    set currentSnapshot(currentSnapshot) {
        this._currentSnapshot = currentSnapshot;
    }

    get endSnapshot() {
        if (!this._endSnapshot) {
            this._endSnapshot = this.history[this.history.length - 1];
        }

        return this._endSnapshot;
    }

    get history() {
        if (!this._history) {
            this._history = calculateNextSnapshots(this.currentSnapshot);
        }
        return this._history;
    }

    sendTroop(sourceFactory, destinationFactory, unitsCount) {
        const sourceId = argumentToId(sourceFactory);
        const destinationId = argumentToId(destinationFactory);
        sendTroopAction(sourceId, destinationId, unitsCount);

        // TODO: FIX
        const sourceFactoryModel = this.currentSnapshot.getById(sourceId);
        sourceFactoryModel.units = Math.max(
            0,
            sourceFactoryModel.units - unitsCount,
        );
        this.currentSnapshot._entities.push(
            new Troop(
                6666666666,
                OWNER_ENUM.PLAYER,
                sourceId,
                destinationId,
                unitsCount,
                map.getDistance(sourceId, destinationId),
            ),
        );
    }

    sendBomb(sourceFactory, destinationFactory) {
        sendBombAction(
            argumentToId(sourceFactory),
            argumentToId(destinationFactory),
        );
    }

    incrementFactoryProduction(sourceFactory) {
        incrementFactoryProductionAction(argumentToId(sourceFactory));
        // TODO: FIX
        this.currentSnapshot.getById(argumentToId(sourceFactory)).units -= 10;
    }
}
