import { AsyncModule, wrapModule } from 'vuex-async-mutations';
import { UserProfile } from '@/types';

type UsersState = {
  users: UserProfile[];
};

type UserParams = {
  city?: string;
  profession?: string;
  genre?: string;
};

const stateFactory = (): UsersState => ({ users: [] });

const mod: AsyncModule<UsersState, any> = {
  namespaced: true,

  state: stateFactory,

  async: true,

  getters: {
    'get:bySite'(state) {
      return (site: string) => state.users.find((user) => user.site === site);
    },
  },

  actionsAsync: {
    fetch: {
      handler({ state, commitAsync }, params?: UserParams) {
        if (state.users.length) {
          return Promise.resolve(state.users);
        }

        return commitAsync(
          this.$axios.$get<UserProfile[]>(`/users`, { params }),
          params,
        );
      },

      resolved(state, users: UserProfile[]) {
        state.users = users;
      },
    },

    ['fetch:latest']: {
      handler({ state, commitAsync }) {
        if (state.users.length) {
          return Promise.resolve(state.users);
        }

        return commitAsync(this.$axios.$get<UserProfile[]>(`/users/new`));
      },

      resolved(state, users: UserProfile[]) {
        state.users = users;
      },
    },

    async 'fetch:bySite'({ dispatch, getters }, site: string) {
      await dispatch('fetch');

      return getters['get:bySite'](site);
    },
  },
};

export default wrapModule(mod);
