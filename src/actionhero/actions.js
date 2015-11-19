const actions = {
  load(service) {
    return function load(input, state, output, {aHero}) {
      let models = state.get(['data', service]);
      if (models) return output.success({models});
      console.log('aHero.load', service);
      aHero[service].find({}, (err, items) => {
        output.success({models: items});
      });
    }
  },

  loadOne(service) {
    return function loadOne(input, state, output, {aHero}) {
      let models = state.get(['data', service]) || [];
      let model = _.find(models, (p) => { return p.id == input.id; });
      if (model) return output.success({model});
      aHero[service].get(input.id, (err, model) => {
        console.log('aHero.loadOne', service);
        err ? output.error(err) : output.success({model});
      })
    }
  },

  set(service) {
    return function set(input, state, output, {aHero}) {
      state.set(['data', service], input.models);
    }
  },

  create(service) {
    return function create(input, state, output, {aHero}) {
      console.log('aHero.create', service, input.model);
      aHero[service].create(input.model, (error, model) => {
        if (error) return output.error({service, error});
        output.success({service, model});
      });
    }
  },

  created(input, state) {
    console.log('aHero.created', input.service, input.model);
    let path = ['data', input.service]
    let serviceData = state.get(path) || [];
    state.set(path, serviceData.concat([input.model]));
  },

  remove(service) {
    return function remove(input, state, output, {aHero}) {
      let {query} = input;
      console.log('aHero.remove', service, query);
      aHero[service].remove(query, (error, count) => {
        if (error) return output.error({service, query, error});
        output.success({service, query, count});
      });
    }
  },

  removed(input, state) {
    console.log('aHero.removed', input.service, input.query);
    let path = ['data', input.service]
    let serviceData = state.get(path) || [];
    let newData = _.reject(serviceData, _.matches(input.query));
    state.set(path, newData);
  },

  update(service) {
    return function update(input, state, output, {aHero}) {
      let {query, model} = input;
      aHero[service].update(query, model, (error, ret) => {
        if (error) return output.error({service, query, error});
        let {count, rows} = ret;
        output.success({service, query, model, count, rows});
      });
    }
  },

  updated(input, state) {
    console.log('aHero.updated', input.service, input.query);
    let path = ['data', input.service]
    let serviceData = state.get(path) || [];
    let {query, model} = input;

    let newData = _.map(serviceData, (item) => {
      if (_.matches(query)(item)) item = _.merge(_.clone(item), model);
      return item;
    });
    // let rows = _.filter(serviceData, _.matches(input.query));
    // let newData = _.filter(serviceData, (model) => {
    //   return model.id !== input.model.id;
    // });
    state.set(path, newData);
  },

  connect(input, state, output, {aHero}) {
    aHero._client.connect((err) => {
      console.log('ah connected');
      if (err) output.error(err);
      aHero._client.configure((info) => {
        console.log('ah configured', info);
        output.success(info);
      })
    })
  },

  login(input, state, output, {aHero}) {
    let {username, password} = input;
    aHero._client.action('login', {apiVersion: 1, username, password}, (data) => {
      data.error ? output.error(data) : output.success(data);
    });
  },

  setUser(input, state) {
    state.set(['user'], input.user);
  },

  setToken(input, state, output, {aHero}) {
    if (!input.token) return;
    let user = state.get(['user']);
    let {token} = input;

    state.set(['token'], token);
    localStorage.setItem('authToken', token);
  },

  loginWithToken(input, state, output, {aHero}) {
    let token = input.token || localStorage.getItem('authToken');
    if (!token) return output.error(new Error('No token provided'));

    aHero._client.action('loginWithToken', { apiVersion: 1, token }, (data) => {
      data.error ? output.error(data) : output.success(data);
    });
  },

  logout(input, state) {
    state.set(['user'], null);
    state.set(['token'], null);
    localStorage.removeItem('authToken');
  }
};

actions.connectChain = [
  actions.connect, {
    success: [
      [
        actions.loginWithToken, {
          success: [actions.setUser, actions.setToken], error: []
        }
      ]
    ]
  }
];

export default actions;
