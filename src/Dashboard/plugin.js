const loggerEnhancer = (reducer) => {
  return (state, action) => {
    console.log("action(Dashboard): ", action);
    return reducer(state, action);
  };
};

const reducer = (state = {}, action) => {
  return state;
};

const dashboardPlugin = async () => {
  return {
    name: "Dashboard",
    register(app) {
      app.combineReducers({
        dashboard: loggerEnhancer(reducer),
      });
      app.addRoute({
        path: "/dashboard",
        label: "Dashboard",
        import: async () => {
          return import(/* webpackChunkName: "dashboard" */ "./Dashboard");
        },
      });
    },
  };
};

export default dashboardPlugin;
