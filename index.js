import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import AdminRoutes from './routes/admin';
import GeneralRoutes from './routes/general';
import ManagerRoutes from './routes/manager';
import StaffRoutes from './routes/staff';
import VisitRoutes from './routes/visit';
import conn from './database/connection';

if (process.env.RESET_DB) {
  // run the sql files to drop and re-add all tables

  // run the script to insert the starting data into the db

}

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.static('public'));

app.use('/', GeneralRoutes);
app.use('/admin', AdminRoutes);
app.use('/manager', ManagerRoutes);
app.use('/staff', StaffRoutes);
app.use('/visit', VisitRoutes);

app.listen(port, () => console.log(`CS 4400 app running on port ${port}.`));
