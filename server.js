const express = require('express');
const connectDB = require('./config/db')

const app = express();

//Connect database
connectDB();

//Init Middleware
app.use(express.json({extended:false}));

app.get('/', (req, res) => res.send('API running'))

app.use('/api/users',require('./routes/api/users'))
app.use('/api/posts',require('./routes/api/posts'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/auth',require('./routes/api/auth'))

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));