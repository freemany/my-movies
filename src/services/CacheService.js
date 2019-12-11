import {getCache, setCache} from '@/lib/cache';
import {getMovieById, getMovies} from './MovieService';

const getCachedMovieById = async (id) => {
    const cached = getCache(id);
    let res;

    if (undefined === cached) {
        res = await getMovieById(id);
        setCache(id, res);
    } else {
        res = cached;
    }

    return res;
};

const getCachedMovies = async (page, term) => {
    // Set unique cache key by page no. and search term
    const key = JSON.stringify([page, term]);

    const cached = getCache(key);
    let res;

    if (undefined === cached) {
        res = await getMovies(page, term);
        setCache(key, res);
    } else {
        res = cached;
    }

    return res;
};

export {getCachedMovieById, getCachedMovies};