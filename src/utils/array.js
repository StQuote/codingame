const getValueByKeySelector = (keySelector, el) => {
    if (typeof keySelector === 'function') {
        return keySelector(el);
    }
    return el[keySelector];
};

export const groupBy = keySelector => array => {
    return array.reduce((acc, el) => {
        const key = getValueByKeySelector(keySelector, el);

        if (!acc[key]) {
            return {
                ...acc,
                [key]: [el],
            };
        }

        return {
            ...acc,
            [key]: [...acc[key], el],
        };
    }, {});
};

export const sum = keySelector => array =>
    array.reduce((acc, el) => acc + getValueByKeySelector(keySelector, el), 0);

export const findMinElement = valueSelector => array => {
    let minValue = null,
        minElement = null;

    array.forEach(el => {
        const value = getValueByKeySelector(valueSelector, el);
        if (minValue === null || value < minValue) {
            minValue = value;
            minElement = el;
        }
    });

    return minElement;
};
