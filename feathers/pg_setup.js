import pg from 'pg';
import Sequelize from 'sequelize';

export default function(app) {
  app.dbStr = 'postgres://localhost/lbtest';
  app.pgcli = new pg.Client(app.dbStr);
  app.pgcli.connect((err) => { if (err) throw err; });
  app.db = new Sequelize(app.dbStr);
}
