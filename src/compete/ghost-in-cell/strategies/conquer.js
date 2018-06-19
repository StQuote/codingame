import { OWNER_ENUM } from '../enums';
import { getUnitsInTheEndOfTrip } from '../calculation';
import { findMinElement } from 'utils/array';
import { map } from '../map';
import { debug } from 'utils/debug';

function getLeast(array, calcCallback) {
    let value = null,
        element = null;

    array.forEach(arrEl => {
        const tempValue = calcCallback(arrEl);
        if (!value || tempValue < value) {
            value = tempValue;
            element = arrEl;
        }
    });

    return element;
}

function getClosestFactory(destinationFactory, factories) {
    return findMinElement(f => map.getDistance(f.id, destinationFactory.id))(
        factories,
    );
}

// bigger value - faster unit generation
function getProductionFactor(factory) {
    return factory.production * 100;
}

// bigger value better for conquer
function getDistanceFactor(factory, enemyFactories, ownFactories) {
    const closestEnemyFactory = getClosestFactory(factory, enemyFactories);
    const closestOwnFactory = getClosestFactory(factory, ownFactories);

    return (
        (map.getDistance(factory.id, closestEnemyFactory.id) -
            map.getDistance(factory.id, closestOwnFactory.id)) *
        10
    );
}

function getConquerFactor(sourceFactory, destinationFactory) {
    const distance = map.getDistance(sourceFactory.id, destinationFactory.id);
    const production =
        destinationFactory.owner !== OWNER_ENUM.NEUTRAL
            ? destinationFactory.production
            : 0;

    return destinationFactory.unitsCount + distance * production;
}

function targetSelectionSort(enemyFactories, ownFactories) {
    return (left, right) => {
        return (
            getProductionFactor(right) +
            getDistanceFactor(right, enemyFactories, ownFactories) -
            (getProductionFactor(left) +
                getDistanceFactor(left, enemyFactories, ownFactories))
        );
    };
}

export function conquerStrategy(world) {
    const ownFactories = world.currentSnapshot
        .getOwnFactories()
        .filter(f => f.unitsCount > 0);
    const ownFactoriesOnTheEndIds = world.endSnapshot
        .getOwnFactories()
        .map(f => f.id);
    const enemyFactories = world.currentSnapshot
        .getEnemyAndNeutralFactories()
        .filter(f => !ownFactoriesOnTheEndIds.includes(f.id));

    ownFactories.forEach(source => {
        const targets = enemyFactories
            .filter(f => getUnitsInTheEndOfTrip(source, f) < source.unitsCount)
            .sort(targetSelectionSort(enemyFactories, ownFactories));

        while (targets.length > 0 && source.unitsCount > 2) {
            const destination = targets.shift();
            world.sendTroop(
                source,
                destination,
                Math.max(0, getUnitsInTheEndOfTrip(source, destination)) + 1,
            );
        }
    });
}
