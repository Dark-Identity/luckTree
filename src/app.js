let PUBLIC_KEY , SECRET_KEY;
const  {User, Lottery , AdminLottery ,Winners , UserImages} = require('./db');

const {
  express , hbs , path ,
  mongoose , jwt , cookieParser ,
  crypto , request , jssha , session ,
  MongoDBStore , user_data , admin_function , user_function
} = require('./controlers/imports');

const fs = require('fs');

const static_path = path.join( __dirname , '../' , 'public' );
const port = process.env.PORT || 2000;


const app = express();

app.use(express.urlencoded({extended : true}));
app.set('view engine' , 'hbs');
app.use(cookieParser());
app.use(express.json());



app.use(express.static(static_path));


let link = 'mongodb+srv://userkumar685:lucktree@lucktree.ffawo1u.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(link)
  .then(function(db){
    console.log('dtabse connected');
  app.listen(port , ()=>{
    console.log(`listening on ${port}`);
  })

})
  .catch(function(err){
  console.log(err);
})


const one_day = 1000 * 60 * 60 * 100;
let date_seed = new Date().toLocaleString({'timezone' : 
      'Asia/kolkata'
    });
    
let today = new Date(date_seed);

var store = new MongoDBStore(
  {
    uri: link,
    databaseName: 'test',
    collection: 'sessions'
  });

app.use(
  session({
  secret : 'vishal',
  resave : false,
  saveUninitialized: false,
  cookie: { maxAge: one_day },
  store : store
}));

const isAuthenticated = (req, res, next) => {

  if(req.session.INV){

    next();
  }else{
    res.redirect('/Login');
  }
}

const multer = require('multer');


const Storage = multer.diskStorage({
  destination : (req,file, cb)=>{
    cb(null, path.join( __dirname , '../' , 'public/userImages' ));
  },
  filename :  (req, file , cb)=>{
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage : Storage
})




app.get('/logout' , (req,res)=>{
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect("/Login");
  })
app.get('/signup' , (req,res)=>{
      let code = parseInt(req.query.id);
      return res.render("Login" , {inv_code : code});
})
app.get('/' , (req , res)=>res.render('Login'))
app.get("/home" ,isAuthenticated, (req,res)=>{
  
  res.render('Home');
})
app.get('/get_winner_images' , (req, res)=>{
  let obj = [];
  let folder = path.join(__dirname , '../' , 'public/WINNERS');
  fs.readdir(folder, (err, files) => {
        if (err){
          return res.send({'status' : err});
        }
        for (let file of files) {
            obj.push(file);
          }
          res.send(obj);
      })
})
app.get('/login' , (req , res)=>res.render("Login"));
app.get('/login' , (req, res)=>res.render('Login'));
app.get('/history' , (req, res)=>res.render('History'));
app.get('/result' , (req,res)=>res.render("Result"));
app.get('/settings', (req,res)=>res.render('Settings'));
app.get('/profile' , (req, res)=>res.render('Profile'));
app.get('/test' , (req,res)=>res.render('test'));
app.get('/funds' , (req,res)=>res.render('funds'));
app.get('/recharge' , (req,res)=>res.render('recharge'));
app.get('/AdMiNgRoUp' , (req,res)=>res.render('Admin'));
// getting all the user data;

app.get('/user_data' ,isAuthenticated, user_data.get_data );

app.get('/get_new_lottery' ,isAuthenticated ,  user_data.get_new_lottery );

app.get('/get_bet_data' ,isAuthenticated , user_data.get_bet_data );

app.get('/get_unsettled_trades' , isAuthenticated , user_data.get_unsettled_trades);

app.get('/get_funds_data' , isAuthenticated , user_data.get_funds_data);

app.post('/upload' , upload.single('file') , async (req,res,next)=>{
  const file = req.file;
  if(!file){
    return res.send('no file')
  }else{
    let img = fs.readFileSync(req.file.path);
    let enc_image = img.toString('base64');
    
    let finalImg = {
      contentType : req.file.mimetype,
      path : req.file.path,
      image : new Buffer.alloc( Buffer.byteLength(enc_image) ,enc_image , 'base64')
    };
    
    let image = new UserImages(finalImg);
    image.save();
    return res.send(file);
  }
});

app.post('/update_profile_data' , isAuthenticated , user_function.update_profile_data);

app.post('/update_bank_data' , isAuthenticated , user_function.update_bank_data);

app.post('/withdrawal' , isAuthenticated , user_function.withdrawal);
app.post('/deposit' , isAuthenticated , user_function.deposit);
app.post('/settle_lottery' , admin_function.settle_bet);
// user functions
app.post('/login' , user_function.login_user);

app.post('/signup' , user_function.sign_new_user);


// add new product here 

const new_product_storage = multer.diskStorage({
destination : (req,file, cb)=>{
  cb(null, path.join( __dirname , '../' , 'public/ADMINIMAGES' ));
},
filename :  (req, file , cb)=>{
  cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
}
});

const upload_new_product = multer({
storage : new_product_storage
})

app.post('/new_product' ,upload_new_product.single('file'), async (req,res)=>{
  const file = req.file;

  if(!file){
    return res.send('no file')
  }else{

    let img = fs.readFileSync(req.file.path);
    let enc_image = img.toString('base64');

    let finalImg = {
      contentType : req.file.mimetype,
      path : `../ADMINIMAGES/${req.file.path}`,
      image : new Buffer.alloc( Buffer.byteLength(enc_image) ,enc_image , 'base64')
    };
    
    let image = new UserImages(finalImg);

    let lottery_data = new AdminLottery({
       DATE : `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`,
       TIME : `${req.body.time}`,
       AMOUNT : `${req.body.amount}`,
       DESCRIPTION : `${req.body.description}`,
       LOTTERY_ID : parseInt(req.body.lottery_id),
       IMAGE : `../ADMINIMAGES/${req.file.filename}`,
    } );

    await lottery_data.save().then(async () => {
      await image
            .save()
            .then(() => {
                return res.status(200).json({
                   success: true,
                   message: 'items updated'
             })
        })
     }).catch( (err)=>{
         return res.status(400).send({status : err.message});
     })

  }

})

// upload winners images 
const hero_storage = multer.diskStorage({
destination : (req,file, cb)=>{
  cb(null, path.join( __dirname , '../' , 'public/WINNERS' ));
},
filename :  (req, file , cb)=>{
  cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
}
});

const upload_winners = multer({
storage : hero_storage
})

app.post('/winner_upload' , upload_winners.single('file'), async (req,res)=>{
  const file = req.file;

  if(!file){
    return res.send('no file')
  }else{

    let img = fs.readFileSync(req.file.path);
    let enc_image = img.toString('base64');

    let finalImg = {
      contentType : req.file.mimetype,
      NAME : `../WINNERS/${req.file.filename}`,
      IMAGE : new Buffer.alloc( Buffer.byteLength(enc_image) ,enc_image , 'base64')
    };
 
    let image = new Winners(finalImg);

      await image
            .save()
            .then(() => {
                return res.status(200).json({
                   success: true,
                   message: 'items updated'
             })
        }).catch((err)=>res.send({status : err}));

  }

})

// ------------------delete every image in the winners list -----------
app.get('/delete_prev_winner' , (req , res)=>{
  let folder = path.join(__dirname , '../' , 'public/WINNERS');
  fs.readdir(folder, (err, files) => {
        if (err){
          return res.send({'status' : err});
        }
        for (let file of files) {
            fs.unlinkSync(path.join(folder , '/' , file));
        }
        return res.send({'status' : 'deleted success'});
      });

});

app.post('/purchase_lottery' , user_function.purchase_lottery);
// admin functions
app.get('/AdMiNgRoUp/league_0' , (req , res)=>{
  res.render('bet_settle');
});


