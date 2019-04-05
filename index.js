import express from 'express';
import ManagerRoutes from './routes/manager'
import AdminRoutes from './routes/admin';


const app = express();
const port = 3000;



app.set('view engine', 'ejs');


app.get('/', (req, res) => res.render('index', {title:"heyo"}));
app.use('/manager', ManagerRoutes);
app.use('/admin', AdminRoutes);

app.listen(port, () => console.log(`CS 4400 app running on port ${port}.`));
