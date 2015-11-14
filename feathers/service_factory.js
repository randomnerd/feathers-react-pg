import dbmon from 'dbmon';
import EventEmitter from 'events';

export default function(name, schema) {
  return {
    setup(app) {
      this._locks = { created: {}, updated: {}, removed: {} };
      this.db = app.db;
      this.model = this.db.define(name, schema, { freezeTableName: true });
      this.model.sync();

      let emitter = new EventEmitter;
      let channel = dbmon.channel({
        driver: 'postgresql',
        driverOpts: {
          postgresql: { cli: app.pgcli }
        },
        table: name,
        monitor: 'all',
        keyfld: { name: 'id', type: 'integer' },
        transports: 'eventemitter',
        transportsOpts: {
          eventEmitter: { eventEmitter: emitter}
        }
      });
      emitter.on('insert', (row) => {
        if (!this._locks.created[row.k]) {
          this.model.findOne({where: {id: row.k}}).then((obj) => {
            this.emit('created', obj);
          });
        } else {
          delete this._locks.created[row.k];
        }
      });

      emitter.on('update', (row) => {
        if (!this._locks.updated[row.k]) {
          this.model.findOne({where: {id: row.k}}).then((obj) => {
            this.emit('updated', obj);
          });
        } else {
          delete this._locks.updated[row.k];
        }
      });

      emitter.on('delete', (row) => {
        if (!this._locks.removed[row.k]) {
          this.emit('removed', {id: row.k});
        } else {
          delete this._locks.removed[row.k];
        }
      });
    },

    find(params, callback) {
      this.model.findAll({where: params.query}).then((models) => {
        callback(null, models);
      }).catch(callback);
    },

    create(data, params, callback) {
      this.model.create(data).then((model) => {
        this._locks.created[model.id] = true;
        callback(null, model);
      }).catch(callback);
    },

    get(id, params, callback) {
      this.model.findOne({where: {id}}).then((model) => {
        callback(null, model);
      }).catch(callback);
    },

    update(id, data, params, callback) {
      this.model.findOne({where: {id}}).then((model) => {
        model.update(data).then((model) => {
          this._locks.updated[model.id] = true;
          callback(null, model);
        }).catch(callback);
      }).catch(callback);
    },

    patch(id, data, params, callback) {
      this.update(id, data, params, callback);
    },

    remove(id, params, callback) {
      this.model.findOne({where: {id}}).then((model) => {
        model.destroy().then(() => {
          this._locks.removed[model.id] = true;
          callback(null, model);
        }).catch(callback);
      }).catch(callback);
    }
  };
};
