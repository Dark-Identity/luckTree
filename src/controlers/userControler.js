const {User, Lottery , AdminLottery , Transaction} = require('../db');

class user_data {

  static get_data = async(req , res)=>{

    if(!req.session.INV){
       return res.send({status : 2});
    }else{

      const INV = req.session.INV;

      try {

        let db_data = await User.findOne({INV} , {_id : 0 , W_AMOUNT : 1, NAME : 1 , EMAIL : 1 , INVITATION_CODE : 1 , BALANCE : 1 , MEMBERS : 1 , USER_IMG : 1 , PHONE : 1 , BANK_DETAILS : 1 , BANK_ADDED : 1});
        
        if( Object.keys(db_data).length === 0 || !db_data){
          return res.send({status : 2});
        }

         return res.send(db_data);

      } catch (e) {
        console.log(e)
        return res.send({status : 2});

      }

    }
  }
  
  static get_new_lottery = async(req, res)=>{
       let data = await AdminLottery.find({FINISHED : 0});
       
       if(data){
         return res.send(data);
       }else{
        return res.send({status : 0})
       }
     

  }

  // settled bet data;
  static get_bet_data = async(req , res)=>{

    const INVITATION_CODE = req.session.INV;

    if(!INVITATION_CODE || INVITATION_CODE == undefined){
         return res.send({status : 0});
     }

    let setteled_bets = 
    await Lottery.find(
      {INVITATION_CODE , FINISHED : 1} , 
      {_id : 0 , DATE : 1 , TIME : 1 , RESULT : 1 , DESCRIPTION : 1 , IMAGE : 1  }
      );

    let data = {setteled_bets, status : 1};
 
    return res.send(data);

  }
  static get_unsettled_trades = async(req , res)=>{

    const INVITATION_CODE = req.session.INV;

    if(!INVITATION_CODE || INVITATION_CODE == undefined){
         return res.send({status : 0});
     }

    let unsettled_trades = 
    await Lottery.find(
      {INVITATION_CODE , FINISHED : 0} , 
      {_id : 0 , DATE : 1 , TIME : 1 , DESCRIPTION : 1 , IMAGE : 1  }
      );

    let data = {unsettled_trades, status : 1};
 
    return res.send(data);

  }
  static get_funds_data = async (req,res)=>{
    
    let INV = req.session.INV;
    if(!INV || INV === undefined){
      return res.send({status : 'SOMETHING WENT WRONG'});
    }else{
       Transaction.find({INV})
       .then((data)=>{ 
          return res.send({status : 1 , data})
        }) 
       .catch((err)=>{
        console.log(err);
        return res.send({status : 'SOMETHIG WENT WRONG'});
       })
      }

  } 
}

module.exports = user_data;
