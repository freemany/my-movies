import {debounce, mergeMap, distinctUntilChanged} from 'rxjs/operators';
import {fromEvent, timer} from 'rxjs';
import $ from 'jquery';
import config from '@/config/api.js';

const apiUrl = config.apiBaseUrl;
const apikey = config.apiKey;

// Without searchBase  Api will fail with message 'too many results' or 'something went wrong'
const searchBase = 'hello';
const maxItemPerPage = config.maxItemPerPage;

const getMovies = (page, term) => {
    let search = searchBase;
    if (term) {
        search = search + ' ' + term;
    }
    // Make sure it is native Promise,
    // that will be an issue works with Promise.all if not native
    return Promise.resolve($.get(apiUrl, {apikey: apikey, s: search, page: page}));
};

const getMovieById = (id) => {
    return Promise.resolve($.get(apiUrl, {apikey: apikey, i: id}));
};

const searchMovies = (termEl, el, loaderFunc) => {
    return fromEvent(termEl, 'keyup')
        .pipe(debounce(() => timer(400)),
            distinctUntilChanged(),
            mergeMap(e => {
                loaderFunc($(el), 'show');
                return getMovies(1, e.target.value);
            })
        );
};

export {getMovies, getMovieById, searchMovies, maxItemPerPage};