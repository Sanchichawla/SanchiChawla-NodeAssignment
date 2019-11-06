const express = require('express')

const app = express();
const session = require("express-session")
const db = require('./db');
const methodOverride = require('method-override');
app.set("view engine","hbs");
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


/////////////////////////////////////////////////////////////////////
//                      Persistance login part                     //
var MySQLStore = require('express-mysql-session')(session);

var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'session_test'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));
//                             end                                //
////////////////////////////////////////////////////////////////////

const loggedInOnly = (failure = "/login") => (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect(failure);
  }
};

app.get("/", loggedInOnly(), (req, res) => {
  db.getAllBands(req.session.user.email)
    .then((bands) => {
      res.render("index", {
      name: req.session.user.username,
      bands
      })
    })
    .catch((err) => {
      res.send(err)
    })
})

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

app.delete('/delete', (req, res) => {
  let id = req.body.bandDelete;
  db.removeBand(id)
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => {
      res.send(err)
    })
})

app.post("/signup", (req, res) => {
  const { email,user, pass,dob,profile } = req.body;
  db.createCredentials(email,user, pass,dob,profile)
  .then(() => {
    res.redirect('/')
  })
  .catch((err) => {
    res.send(err)
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.checkCredentials(email, password).then((check) => {
    if (check.length > 0) {
      req.session.user = {
        email: check[0].email,
        username: check[0].username
      };
      res.redirect("/");
    }
    else {
      res.sendStatus(401);
    }
  });
});

app.post('/add', (req, res) => {
  let band = req.body.band;
  let email = req.session.user.email;
    db.addNewBand(band, email)
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => {
      res.send(err)
    })
})
app.post('/update', (req, res) => {
  let {id,newbandname} = req.body;
  
  db.updateBand(id, newbandname)
    .then(() => {
      res.redirect("/")
    })
    .catch((err) => {
      console.log(err);
      res.send(err)
    })
})

app.post('/callupdate',function(req,res){
  console.log(req.body.id);
  res.render('update',{
    id: req.body.id
  })
})

app.post('/callsignup',function(req,res){
    res.render('signup')
})

app.post('/calllogin',function(req,res){
  res.render('login')
})

app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.listen(8080, () => console.log("running"));
