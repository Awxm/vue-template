import { post } from '@/https/request';
import urls from '@/https/urls';
import { resetRouter } from '@/router';

const state = {
  auid: null,
  name: null,
  phone: null,
  avatar: null,
  token: null,
  info: {},
  roles: [],
};

const mutations = {
  SET_AUID: (state, auid) => {
    state.auid = auid;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
};

const actions = {
  // user login
  login({ commit }, loginForm) {
    return new Promise((resolve, reject) => {
      const { username, password } = loginForm;
      post(urls.account.login, { username: username.trim(), password }, true)
        .then((response) => {
          const { auid, token } = response;
          commit('SET_AUID', auid);
          commit('SET_TOKEN', token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      post(urls.account.info, { auid: state.auid })
        .then((response) => {
          const { username, phone, auid, avatarUrl, roles } = response;
          commit('SET_AUID', auid);
          commit('SET_NAME', username);
          commit('SET_PHONE', phone);
          commit('SET_AVATAR', avatarUrl);
          commit('SET_ROLES', roles);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve) => {
      commit('SET_AUID', '');
      commit('SET_ROLES', []);
      resetRouter();
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true });
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_AUID', null);
      commit('SET_ROLES', []);
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
