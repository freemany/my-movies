const data = {};

const getCache = (key) => {
    return data[key];
};

const setCache = (key, value) => {
    data[key] = value;
};

export {getCache, setCache};