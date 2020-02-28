import Vue from 'vue';
import { AsyncModule, wrapModule } from 'vuex-async-mutations';
import { Theme, Portal } from '@/types';

type PortalState = {
  portals: { [name: string]: Portal };
};

const stateFactory = (): PortalState => ({
  portals: {},
});

const themeFactory = (): Theme => ({
  header: {
    type: 'text-only',
  },
});

const mod: AsyncModule<PortalState, any> = {
  namespaced: true,

  state: stateFactory,

  async: true,

  getters: {
    ['get:portal'](state) {
      return (name: string): Portal => state.portals[name];
    },

    ['get:current'](_state, getters, rootState) {
      return getters['get:portal'](rootState.route.params.id);
    },
  },

  actionsAsync: {
    ['fetch:portal']: {
      handler({ state, commitAsync }, name: string) {
        if (state.portals[name]) {
          return Promise.resolve(state.portals[name]);
        }

        return commitAsync(this.$axios.$get(`/sites/${name}`), name);
      },

      resolved(state, portal: Portal, name: string) {
        Vue.set(state.portals, name, { ...portal, theme: themeFactory() });
      },
    },
  },
};

export default wrapModule(mod);
