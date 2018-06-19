export const mapValues = callback => object =>
    Object.keys(object).reduce(
        (acc, key) => ({ ...acc, [key]: callback(object[key]) }),
        {},
    );
