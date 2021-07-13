const passport = require('passport');
const bcrypt = require('bcrypt');


module.exports = function (app, myDataBase) {
   // Be sure to change the title
  app.route('/').get((req, res) => {
    //Change the response to render the Pug template
    res.render('pug', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true
    });
  });

  // Log in post
app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  });

  app.route('/profile').get(ensureAuthenticated, (req,res) => {
    res.render(process.cwd() + '/views/pug/profile', {
      username: req.user.username,
      name: req.user.name
    });
 });

app.route('/logout')
  .get((req, res) => {
    req.logout();
    res.redirect('/');
});

app.route('/register')
  .post((req, res, next) => {
    const hash = bcrypt.hashSync(req.body.password, 12);
    myDataBase.findOne({ username: req.body.username }, function(err, user) {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect('/');
      } else {
        myDataBase.insertOne({
          username: req.body.username,
          password: hash
        },
          (err, doc) => {
            if (err) {
              res.redirect('/');
            } else {
              // The inserted document is held within
              // the ops property of the doc
              next(null, doc.ops[0]);
            }
          }
        )
      }
    })
  },

    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
  );

  // GET requests for github authentication
  app.get('/auth/github', passport.authenticate('github'));

  app.route('/auth/github/callback').get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    req.session.user_id = req.user.id;
    res.redirect('/chat');
  });

   app.route('/chat').get(ensureAuthenticated, (req,res) => {
    res.render(process.cwd() + '/views/pug/chat', {
      user: req.user
    });
 });



 app.use((req, res, next) => {
  res.status(404)
    .type('text')
    .send('Not Found');
});
}

// The challenge here is creating the middleware function ensureAuthenticated(req, res, next), which will check if a user is authenticated by calling passport's isAuthenticated method on the request which, in turn, checks if req.user is defined. If it is, then next() should be called, otherwise, we can just respond to the request with a redirect to our homepage to login. An implementation of this middleware is:
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};