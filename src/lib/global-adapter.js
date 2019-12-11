const getMatchMedia = () => {

    if ('function' === typeof window.matchMedia) {
        return window.matchMedia;
    }

    return () => {
        return {
            matches: true,
            addListener() {
                return () => {};
            },
        }
    };
};

const matchMedia = getMatchMedia();

export {matchMedia};