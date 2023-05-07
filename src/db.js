const mongoose  = require('mongoose');

let SchemaTypes = mongoose.Schema.Types;

const newUserSchema = new mongoose.Schema ({

  NAME : {type : String , required : true},
  EMAIL : {type : String , required : true},
  PASS : {type : String , required : true},
  INVITATION_CODE : {type : Number , required : true},
  PARENT : {type : Number , default : 0},
  W_AMOUNT : {type : Number , default : 0},
  BALANCE : {type : Number , default : 0},
  MEMBERS : {type : Number  ,default : 0},
  WITHDRAWAL_CODE : {type : Number , default : 0},
  BANK_ADDED : {type : Boolean , default : false},
  BANK_DETAILS : [{
      Name : {type : String , default : '0'},
      BankName : {type : String , default : '0'},
      AcNumber : {type : String , default : '0'},
      Ifsc : {type : String , default : '0'},
    }],
  UPI_ID : {type : String , default : '0'},
  TOTAL_WITHDRAWAL : {type : Number , default : 0},
  USER_IMG : {type : String , default : '0'},
  PHONE : {type : String , default : '0'},
  day_withdrawal : {type : Number , default : 0}

});

const newLotterySchema = new mongoose.Schema ({
   DATE : {type : String },
   TIME : {type : String},
   INVITATION_CODE : {type : Number, default : 0},
   RESULT : {type : String , default : '0'},
   DESCRIPTION : {type : String},
   LOTTERY_ID : {type : Number , default : 0},
   IMAGE : { type : String , default : '0'},
   AMOUNT : {type : Number , default : 0},
   FINISHED  : {type : Number , default : 0 }  //0 -> pending , 1 -> success , 2 -> canceled 
});

const adminLotterySchema = new mongoose.Schema ({
   DATE : {type : String },
   TIME : {type : String},
   AMOUNT : {type : Number , default : 0},
   DESCRIPTION : {type : String},
   LOTTERY_ID : {type : Number , default : 0},
   IMAGE : {type : String , default : '0'},
   FINISHED  : {type : Number , default : 0 } //0 -> pending , 1 -> success , 2 -> canceled 
});

const userImages = new mongoose.Schema({
  image : {data : Buffer , contentType : String},
  path : {type : String},
  contentType : {type : String} 
})

const adminImages = new mongoose.Schema({
  contentType : {type : String},
  NAME : {type : String , required : true},
  IMAGE : {data : Buffer , contentType : String} 
})

const transactions = new mongoose.Schema({
  TOPIC : {type : String , default : '0'},
  INV : {type : Number , default : 0},
  ID : {type : String , default : "0"},
  DATE : {type : String , default : '0'},
  STATUS : {type : Number , default : 0},
  VALUE : {type : String , default : '0'},
  TYPE : {type : Number} // 0 -> deposit 1 -> withdrawal 2 -> others
})

 const User =  mongoose.model("users" , newUserSchema );
 const Lottery = mongoose.model('lotterys' , newLotterySchema);
 const AdminLottery = mongoose.model('adminlotterys' , adminLotterySchema);
 const Winners = mongoose.model('winners' , adminImages);
 const UserImages = mongoose.model('userImages' , userImages);
 const Transaction = mongoose.model('transactions' , transactions);

module.exports =  {User, Lottery , AdminLottery , Winners , UserImages , Transaction};
