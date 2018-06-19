import { sum } from 'utils/array';
import { mapValues } from 'utils/object';
import { OWNER_ENUM } from './enums';
import { map } from './map';
import {
    groupTroopsByDestinationFactoryId,
    groupEntityByOwner,
} from './helper';

function getFactoryBattleResult(factory, troopOwner, troopUnitsCount) {
    let owner = null;
    let units = 0;
    if (troopOwner === factory.owner) {
        owner = troopOwner;
        units = factory.unitsCount + troopUnitsCount;
    } else {
        const battleUnitsResult = factory.unitsCount - troopUnitsCount;
        owner = battleUnitsResult >= 0 ? factory.owner : troopOwner;
        units = Math.abs(battleUnitsResult);
    }

    return {
        owner,
        units,
    };
}

const getBattleSideForces = mapValues(sum('unitsCount'));

function solveBattles(troops, snapshot) {
    const troopGroupedByDestinationId = groupTroopsByDestinationFactoryId(
        troops,
    );
    Object.keys(troopGroupedByDestinationId).forEach(destinationId => {
        const destinationFactory = snapshot.getById(destinationId);
        const troopsToBattle = troopGroupedByDestinationId[destinationId];
        const troopsToBattleGroupedByOwner = groupEntityByOwner(troopsToBattle);
        const battleSideForces = getBattleSideForces(
            troopsToBattleGroupedByOwner,
        );
        const battleSides = Object.keys(battleSideForces);
        let result = null;

        if (battleSides.length === 1) {
            // process battle with factory
            const troopOwner = battleSides[0];
            result = getFactoryBattleResult(
                destinationFactory,
                troopOwner,
                battleSideForces[troopOwner],
            );
        } else {
            // process battle with units
            const battleResult =
                battleSideForces[OWNER_ENUM.PLAYER] -
                battleSideForces[OWNER_ENUM.OPPONENT];
            let winner = null;
            if (battleResult === 0) {
                // no units to fight for factory
                return;
            } else if (battleResult > 0) {
                winner = OWNER_ENUM.PLAYER;
            } else {
                winner = OWNER_ENUM.OPPONENT;
            }

            result = getFactoryBattleResult(
                destinationFactory,
                winner,
                Math.abs(battleResult),
            );
        }

        destinationFactory.owner = result.owner;
        destinationFactory.units = result.units;
    });
}

function solveBombs(bombs, snapshot) {
    bombs.forEach(bomb => {
        const destinationFactory = snapshot.getById(bomb.destinationFactoryId);
        const halfFactoryUnits = Math.floor(destinationFactory.units / 2);
        const unitsToRemove = Math.max(10, halfFactoryUnits);

        destinationFactory.units = Math.max(
            0,
            destinationFactory.units - unitsToRemove,
        );
    });
}

function getNextTurnSnapshot(currentSnapshot) {
    const next = currentSnapshot.clone();
    next.getTroops()
        .concat(next.getBombs())
        .forEach(t => (t.turnsRemaining -= 1));
    next.getFactories().forEach(f => {
        if (f.owner !== OWNER_ENUM.NEUTRAL) {
            f.unitsCount += f.production;
        }
    });

    const troopsToBattle = next.getTroops().filter(t => t.turnsRemaining === 0);
    solveBattles(troopsToBattle, next);
    const bombsToExplode = next.getBombs().filter(b => b.turnsRemaining === 0);
    solveBombs(bombsToExplode, next);

    next.removeByIds(troopsToBattle.concat(bombsToExplode).map(t => t.id));

    return next;
}

export function calculateNextSnapshots(currentSnapshot) {
    if (!currentSnapshot.hasTroops()) {
        return [currentSnapshot.clone()];
    }

    const history = [getNextTurnSnapshot(currentSnapshot)];
    let next = history[0];
    while (next.hasTroops()) {
        next = getNextTurnSnapshot(next);
        history.push(next);
    }

    return history;
}

export function getUnitsInTheEndOfTrip(sourceFactory, destinationFactory) {
    const distance = map.getDistance(sourceFactory.id, destinationFactory.id);
    const production =
        destinationFactory.owner !== OWNER_ENUM.NEUTRAL
            ? destinationFactory.production
            : 0;

    return destinationFactory.unitsCount + distance * production;
}
