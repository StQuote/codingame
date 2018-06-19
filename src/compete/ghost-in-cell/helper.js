import { groupBy } from 'utils/array';

export const groupTroopsByDestinationFactoryId = groupBy(
    'destinationFactoryId',
);
export const groupEntityByOwner = groupBy('owner');
