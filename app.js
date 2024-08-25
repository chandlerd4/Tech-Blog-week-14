require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const User = require('./models/User'); 
const Post = require('./models/Post'); 
const Comment = require('./models/Comment'); 

const app = express();

// Configure Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Setup session store
const sessionStore = new SequelizeStore({ 
    db: sequelize,
    tableName: 'Sessions',
    schema: 'tech_blog_schema' // Explicit schema name
});

// Configure session
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));

// Synchronize models with the database
sequelize.sync({ alter: true }) // Use { force: true } for a fresh start
    .then(() => {
        console.log('Database & tables created!');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => console.error('Failed to sync database:', err));

// Route Handlers

// Home Page
app.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.render('home', { posts, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Signup Page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Process Signup
app.post('/signup', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).send('Username is already taken');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });

        req.session.user = newUser;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// Process Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Dashboard
app.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const posts = await Post.findAll({ where: { userId: req.session.user.id } });
        res.render('dashboard', { posts, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Post Details
app.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.id },
            include: [
                { model: User, attributes: ['username'] },
                { model: Comment, include: [{ model: User, attributes: ['username'] }] }
            ]
        });

        if (post) {
            res.render('post-details', { post, user: req.session.user });
        } else {
            res.status(404).send('Post not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Comment
app.post('/comment/create', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const { content, postId } = req.body;
        await Comment.create({ content, postId, userId: req.session.user.id });
        res.redirect(`/post/${postId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});
