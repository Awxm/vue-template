const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  auid: (state) => state.user.auid,
  name: (state) => state.user.name,
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routes,
  dataDictionarty_module: (state) => state.dataDictionarty.dataDictionarty_module,
  dataDictionarty_code: (state) => state.dataDictionarty.dataDictionarty_code,
};
export default getters;
