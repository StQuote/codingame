import { conquerStrategy } from './strategies';
import { OWNER_ENUM } from './enums';
import { readSnapshot, initialize, send } from './api';
import { World } from './world';

initialize();

const STRATEGIES = [conquerStrategy];
while (true) {
    const world = new World(readSnapshot());

    STRATEGIES.forEach(strategy => strategy(world));
    send();
}
