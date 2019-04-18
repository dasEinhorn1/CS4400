import express from 'express';
import AdminRoutes from './routes/admin';
import GeneralRoutes from './routes/general';
import ManagerRoutes from './routes/manager';
import StaffRoutes from './routes/staff';
import VisitRoutes from './routes/visit';
import con from './database';

const app = express();
const port = 3000;

con.query('SELECT * FROM department', (err, result, fields) => {
  console.log(result);
});

app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.static('public'));

app.use('/', GeneralRoutes);
app.use('/admin', AdminRoutes);
app.use('/manager', ManagerRoutes);
app.use('/staff', StaffRoutes);
app.use('/visit', VisitRoutes);

app.listen(port, () => console.log(`CS 4400 app running on port ${port}.`));
