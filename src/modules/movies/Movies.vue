<template>
    <div id="wrapper" class="container">
        <div ref="screenDetector" id="screen-detector"></div>
        <div ref="slideLeft" id="side-left" :class="{toggle: isSlided}">
            <input type="text" class="form-control search-field" ref="search" v-model="term" placeholder="Search movies">
            <div ref="results">
            <button  v-for="(movie, index) in movies" :key="index" type="button" class="movie-item btn btn-primary btn-lg btn-block" @click="slide(index, movie.imdbID)" :disabled="movie.selected">
                <div>{{movie.Title}}<i v-if="movie.selected" class="fas fa-star"></i></div>
                <div class="movie-year">{{movie.Year}}</div>
            </button>
            <div class="paginator" v-if="showPaginator">
                <div class="prev-btn"><i v-if="hasPrev" class="fas fa-caret-left prev" @click="prev"></i></div>
                <div class="counter-part"><div class="page-counter"><div>Page {{page}}</div><div>{{totalCount}} results</div></div></div>
                <div class="next-btn"><i class="fas fa-caret-right next" v-if="hasNext" @click="next"></i></div>
            </div>
            <div v-if="noResults">No results found</div>
            </div>
        </div>
        <div ref="slideRight" id="side-right" :class="{toggle: isSlided}">
            <img :src="movie.poster" class="poster" v-if="'N/A'!==movie.poster">
            <h2>{{movie.title}}</h2>
            <p class="movie-genre">{{movie.genre}}</p>
            <p class="movie-plot">Movie plot - {{movie.plot}}</p>
            <p><strong>Language: </strong> {{movie.language}}</p>
            <p class="movie-director"><strong>Director: </strong><span>{{movie.director}}</span></p>
            <p class="movie-actors"><strong>Actors: </strong><span>{{movie.actors}}</span></p>
            <p><strong>Duration: </strong> {{movie.duration}}</p>
        </div>
    </div>
</template>
<script>
import {searchMovies, maxItemPerPage} from '@/services/MovieService';
import {loading} from '@/lib/loader';
import {getCachedMovieById, getCachedMovies} from '@/services/CacheService';
import {matchMedia} from '@/lib/global-adapter';

const mediaQueryCheckDesktop = '(min-width : 992px)';

export default {
    name: 'Movies',
    data() {
        return {
            term: '',
            isSlided: false,
            movies: [],
            page: 1,
            totalCount: 0,
            selectedMovieIndex : null,
            movie: {
                title: '',
                plot: '',
                poster: null,
                genre: null,
                language: null,
                director: null,
                duration: null,
                actors: null,
            },
            isDesktop: false,
        }
    },
    created() {
        this.isDesktop = matchMedia(mediaQueryCheckDesktop).matches;
        matchMedia(mediaQueryCheckDesktop).addListener(()=> {
            this.isDesktop = !this.isDesktop;
            if (false === this.isDesktop && true === this.isSlided) {
                this.isSlided = false;
                if (this.movies[this.selectedMovieIndex]) {
                    this.movies[this.selectedMovieIndex].selected = false;
                }
            }
        });
    },
    mounted() {
        this._getMovies(this.page, true);

        searchMovies(this.$refs.search, this.$refs.results, loading)
            .subscribe((res) => {
                if (res && res.Search && "True" === res.Response) {
                    this.page = 1;
                    this._success(res);
                } else {
                    this._fail();
                }
                loading(this.$refs.results, 'hide');
            }, () => {
                loading(this.$refs.results, 'hide');
                this._fail();
            });
    },
    computed: {
        hasPrev() {
            return this.page > 1;
        },
        hasNext() {
            return this.page < Math.ceil(this.totalCount / maxItemPerPage);
        },
        showPaginator() {
            return this.totalCount > maxItemPerPage;
        },
        noResults() {
            return this.totalCount === 0;
        },
    },
    methods: {
        _success(res) {
            this.movies = res.Search;
            this.totalCount = parseInt(res.totalResults);
            this.selectedMovieIndex = null;
        },
        _fail() {
            this.movies = [];
            this.totalCount = 0;
        },
        async _getMovies(page, fullPageLoading) {
            try {
                loading(this.$refs.results, 'show', fullPageLoading);

                const res = await getCachedMovies(page, this.term.trim());
                if (res && res.Search && "True" === res.Response) {
                    this._success(res);
                }

                loading(this.$refs.results, 'hide', fullPageLoading);

            } catch(err) {
                loading(this.$refs.results, 'hide', fullPageLoading);

                console.error(err);
                this._fail();
            }
        },
        prev() {
           this.page --;
           this._getMovies(this.page);
        },
        next() {
            this.page ++;
            this._getMovies(this.page);
        },
        slide(index, id) {
            if (false === this.isDesktop) {
                return;
            }
            if (this.movies[this.selectedMovieIndex]) {
                this.movies[this.selectedMovieIndex].selected = false;
            }
                // 'selected' is a new key in the react data,
                //  You have to use $set to make it react
            if (this.movies[index]) {
                this.$set(this.movies[index], 'selected', true);
                this.selectedMovieIndex = index;
            }

            this._getMovieById(id);
        },
        async _getMovieById(id) {
            try {
                 loading(this.$refs.slideRight, 'show');

                 const res = await getCachedMovieById(id);

                 if (res && res.Title) {
                    this.movie.title = res.Title;
                    this.movie.plot = res.Plot;
                    this.movie.poster = res.Poster;
                    this.movie.genre = res.Genre;
                    this.movie.language = res.Language;
                    this.movie.actors = res.Actors;
                    this.movie.duration = res.Runtime;
                    this.movie.director = res.Director;

                    this._slideOpen();
                    loading(this.$refs.slideRight, 'hide');
                }
            } catch (err) {
                loading(this.$refs.slideRight, 'hide');

                console.error(err);
                this._fail();
            }
        },
        _slideOpen() {
            if (true === this.isSlided) {
                return;
            }
            this.isSlided = true;
        }
    }
}
</script>
<style>
    #wrapper {
        width: 100%;
        height: 100%;
        padding: 0px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    input.search-field {
        margin-bottom: 2rem;
    }

    /** left side **/
    #side-left {
        width: 100%;
        height: 100%;
        background: #dee2e6;
        border-right: 1px solid #999;
        left:0px;
        position: absolute;
        overflow-x: hidden;
        overflow-y: auto;
        -moz-transition: all 0.5s ease;
        -o-transition: all 0.5s ease;
        -webkit-transition: all 0.5s ease;
        -ms-transition: all 0.5s ease;
        padding: 1rem;
        margin: 0;
    }

    #side-left.toggle {
        width:35%;
    }

    #side-left .movie-item {
        margin: 1rem 0;
        text-align: left;
    }

    #side-left .movie-item i {
        float: right;
    }

    #side-left .movie-year {
        float: right;
        clear: both;
    }

    #side-left .movie-item.btn:disabled {
        opacity: 1;
    }


    /** right side **/
    #side-right.toggle {
        left:35%;
    }

    #side-right {
        padding: 1rem;
        margin: 0px;
        width: 65%;
        height: 100%;
        left: 100%;
        text-align: left;
        position: absolute;
        overflow-x: hidden;
        overflow-y: auto;
        -moz-transition: all 0.5s ease;
        -o-transition: all 0.5s ease;
        -webkit-transition: all 0.5s ease;
        -ms-transition: all 0.5s ease;
        transition: all 0.5s ease;
    }

    #side-right {
        font-size: 1.2rem;
    }

    #side-right p {
        margin: 0.2rem 0;
    }

    #side-right .poster {
        float: right;
        margin: 0 0 1rem 1rem;
    }

    #side-right .movie-plot {
        margin: 2rem 0;
    }

    #side-right .movie-genre {
        font-size: 1rem;
    }

    #side-right .movie-director span,
    #side-right .movie-actors span {
        text-transform: uppercase;
    }

    /** Paginator **/
    .paginator {
        width: 100%;
    }

    .paginator {
        margin: 3rem 0;
    }

    .paginator i {
        display: block;
        font-size: 3rem;
    }

    .paginator .prev {
        float: left;
    }

    .paginator .next {
        float: right;
    }

    .paginator .page-counter {
        margin: 0 auto;
        text-align: center;
    }

    .paginator>div {
        display: inline-block;
        color:#17a2b8;
        font-size: 18px;
    }

    .paginator .prev-btn {
        width: 20%;
    }

    .paginator .counter-part {
        width: 60%;
    }

    .paginator .next-btn {
        width: 20%;
    }
</style>