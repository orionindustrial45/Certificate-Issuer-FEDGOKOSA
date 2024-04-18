import express from 'express';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js'
import issueCertificate from  './routes/certificateRoutes.js'
import connectDB from './config/db.js';
import passportConfig from './config/passportConfig.js';


//import certificateRoutes from './routes/certificateRoutes.js';
import dotenv from 'dotenv';

dotenv.config()

connectDB()

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user', applicationRoutes);
app.use('/api', issueCertificate)

app.get('/FEDGOKOSA/certifcate/apply', (req, res) => {
  res.render('applicant-form')
})

app.get('/admin/dashboard', (req, res) => {
  res.render('dashboard')
})

//app.use('/api/certificates', certificateRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
