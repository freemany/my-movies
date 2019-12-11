import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from '@/App'
import store from '@/store';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
const router = new VueRouter();

describe('App.vue', () => {
    it('is Vue instance', () => {
        const wrapper = shallowMount(App, {
            localVue,
            router,
            store,
        })
        expect(wrapper.isVueInstance()).toBe(true)
    })
});