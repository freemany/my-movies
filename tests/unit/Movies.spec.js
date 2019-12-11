import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Movies from '@/modules/movies/Movies.vue'
import store from '@/store';
import VueRouter from 'vue-router'

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('Movies.vue', () => {
    it('render view with mount', () => {
        const wrapper = mount(Movies)
        expect(wrapper.vm.$el.textContent).toContain('Movie plot');
    })

    it('render view', () => {
        const expected = 'No results found';
        const wrapper = shallowMount(Movies, {
            propsData: {expected}
        })
        expect(wrapper.text()).toContain(expected);
    })

    it('has a name', () => {
        expect(Movies.name).toMatch('Movies')
    })

    it('has a created hook', () => {
        expect(typeof Movies.data).toMatch('function')
    })

    it('sets the correct default data', () => {
        expect(typeof Movies.data).toMatch('function')
        const defaultData = Movies.data()
        expect(defaultData).toEqual({
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
        });
    });

    it('renders html', () => {
        const wrapper = shallowMount(Movies, {
            propsData: {},
            localVue,
            router,
            store,
        })
        expect(wrapper.find('#wrapper').exists()).toBe(true);
    })
});