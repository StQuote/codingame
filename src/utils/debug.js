export const debug = (...args) =>
    printErr(args.map(arg => JSON.stringify(arg, null, '\t')).join(','));
