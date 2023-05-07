// lottery creation and purchase done login signup donoe data fetched for home ;

const { User, Lottery, AdminLottery, Transaction } = require('../db');
const nodemailer = require("nodemailer");
const crypto = require('crypto');

let date_seed = new Date().toLocaleString({ timeZone: 'Asia/Delhi' });
let today = new Date(date_seed);

class user_functions {

  // league type 0 = virtual || league type 1 = league

  static upload_test = async (req, res) => {
    upload.single('file'), (req, res, next) => {
      const file = req.file;

      if (!file) {
        const error = new Error('pas a file');
        error.httpStatusCode = 400;
        return next(error);
      }
      res.send(file);
    }
  }

  static sign_new_user = async (req, res) => {

    res.clearCookie('id');

    let body = req.body;

    let inv = await generate_inv_code();

    let user_found = await User.findOne({ NAME: body.NAME }).count();
    let email_found = await User.findOne({ PHONE: body.EMAIL }).count();

    let data = {
      ...body,
      INVITATION_CODE: inv
    }

    let newUser = new User(data);

    if (body.INV !== 0 && !user_found && !email_found) {

      let parent = await User.findOne({ INVITATION_CODE : body.INV });

      if (parent) {

        let is_created = await newUser.save();
     
        if (is_created) {

          await increment_parent_mem(body.INV);

          req.session.user_id = is_created['_id'].valueOf();
          req.session.INV = is_created['INVITATION_CODE'];

          return res.send({ status: 1 });

        } else {
          return res.send({ status: 'SOMETHING WENT WRONG' })
        }

      } else {
        return res.send({ status: 'SOMETHING WENT WRONG' })
      }


    } else if (body.INV == 0 && !user_found && !email_found) {
    
      let new_user_created = await newUser.save();
   

      if (new_user_created) {

        req.session.user_id = new_user_created['_id'].valueOf();
        req.session.INV = new_user_created['INVITATION_CODE'];
        return res.send({ status: 1 });

      } else {
        return res.send({ status: 'SOMETHING WENT WRONG' });
      }

    } else {
      if (user_found) {
        return res.send({ status: "USER NAME ALREADY EXISTS" });
      } else if (email_found) {
        return res.send({ status: 'EMAIL IS ALREADY TAKEN' })
      } else {
        return res.send({ status: 'SOMETHING WENT WRONG' })
      }
    }

  }

  static login_user = async (req, res) => {

    let data = req.body;
    let db_user = await User.findOne({ Name: data.NAME });

    if (!data.PASS || data.PASS == 'undefined') {
      return res.send({ status: 'SOMETHING WENT WRONG' });
    }

    if (
      db_user !== null &&
      db_user.PASS.localeCompare(data.PASS) == 0
    ) {

      req.session.user_id = db_user['_id'].valueOf();
      req.session.INV = db_user['INVITATION_CODE'];
      return res.send({ status: 1 });

    } else {
      return res.send({ status: 'INVALID CREDENTIALS' });
    }

  }

  static deposit = async (req, res) => {

    let { amount, transactioin_id } = req.body;
    let INVITATION_CODE = parseInt(req.session.INV);

    let trans_id_exist = await Transaction.findOne({ ID: transactioin_id, INV: INVITATION_CODE , TYPE : 0});

    if (!trans_id_exist) {
      if (amount && transactioin_id) {

        amount = parseFloat(amount);
        const nDate = new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Calcutta'
        });
        let today = new Date(nDate);

        let date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;


        let data = {
          TOPIC : "DEPOSIT",
          INV : INVITATION_CODE,
          ID : transactioin_id,
          DATE : date,
          STATUS : 0,
          VALUE : amount,
          TYPE : 0
        }

        if (await newDeposit(data)) {

          let body = `
          DATE : ${date} \n
          INVITATION_CODE : ${data.INV} \n
          AMOUNT :  ${data.VALUE} \n
          TRANSACTION_ID : ${data.ID}
          `
          SENDMAIL('DEPOSIT', body);

          res.send({ status: 1 });
        } else {
          res.send({ status: "SOMETHING WENT WRONG" });
        }

      } else {
        return res.send({ status: 'ENTER SOME VALID DATA' }) // something went wrong with amount or the transaction id;
      }
    } else {
      return res.send({ status: 'ENTER A VALID TRANSACTION ID' });
    }

  }

  static purchase_lottery = async (req, res) => {
    let INV = req.session.INV;

    if (!INV || INV === undefined) {
      return res.send({ status: 0 });
    } else {
      let this_user = await User.findOne({ INVITATION_CODE: INV });
      if (!this_user) {
        return res.send({ status: 0 });
      } else {
        let balance = parseFloat(this_user['BALANCE']);
        let lottery_data = await AdminLottery.findOne({ LOTTERY_ID: req.body.LOTTERY_ID }, { _id: 0 });
        if (balance < parseFloat(lottery_data['AMOUNT'])) {
          return res.send({ status: "INSUFFICIANT BALANCE" });
        } else {

          // check if this user has already purchased the product or not
          let is_purchased = await Lottery.findOne({ LOTTERY_ID: req.body.LOTTERY_ID, INVITATION_CODE: INV });

          if (is_purchased) {
            return res.send({ status: 'ALREADY PURCHASED' });
          }

          let new_lottery = new Lottery({
            DATE: lottery_data['DATE'],
            TIME: lottery_data['TIME'],
            DESCRIPTION: lottery_data['DESCRIPTION'],
            IMAGE: lottery_data['IMAGE'],
            LOTTERY_ID: lottery_data['LOTTERY_ID'],
            AMOUNT: lottery_data['AMOUNT'],
            INVITATION_CODE: INV
          })

          new_lottery.save().then(async () => {
            // deducting the amount from user's balance
            let SUB_BALANCE = parseFloat(lottery_data['AMOUNT']) - 2 * parseFloat(lottery_data['AMOUNT']);

            await User.findOneAndUpdate({ INVITATION_CODE: INV }, {
              $inc: {
                BALANCE: SUB_BALANCE
              }
            })

            res.send({ status: 1 })
          }).catch((err) => {
            console.log(err);
            return res.send({ status: 0 });
          })
        }
      }
    }
  }

  static withdrawal = async (req, res) => {
    let INV = req.session.INV;
    const nDate = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Calcutta'
    });
    let today = new Date(nDate);
    let { bank_acc, AMOUNT } = req.body;

    if (!INV || INV === undefined) {
      return res.send({ status: 'SOMETHING WENT WRONG ' });
    } else {

      let U_details = await User.findOne({ INVITATION_CODE: INV }, { W_AMOUNT: 1, BANK_ADDED: 1, day_withdrawal: 1, UPI_ID: 1, BANK_DETAILS: 1 })

      if (!U_details) {
        console.log('user details is missing ')
        return res.send({ status: "SOMETHING WENT WRONG" });
      } else {
        let transactioin_id = crypto.randomBytes(16).toString("hex");
        transactioin_id = transactioin_id.slice(0, 6);
        if (bank_acc === 1) {
          //withdrawal by bank account
          if (U_details['BANK_ADDED'] === false) {
            return res.send({ status: 'ADD A BANK FIRST' });
          } else if (parseFloat(AMOUNT) > parseFloat(U_details['W_AMOUNT'])) {
            return res.send({ status: 'YOU DONT HAVE ENOUGH BALANACE' });
          } else {

            let withdraw_data = new Transaction({
              TOPIC: 'WITHDRAWAL',
              INV: INV,
              ID: transactioin_id,
              DATE: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
              STATUS: 0,
              VALUE: AMOUNT,
              TYPE: 1
            })

            withdraw_data.save().then(
              () => {
                let deduct_amount = parseFloat(AMOUNT - (2 * AMOUNT))
                // deduct the amount from the user and increment the withdrawal amount and withdrawal count;
                User.findOneAndUpdate({ INVITATION_CODE: INV }, {
                  $inc: {
                    W_AMOUNT: deduct_amount,
                    TOTAL_WITHDRAWAL: parseFloat(data['Ammount']),
                    Withdrawals: 1
                  },
                  day_withdrawal: today.getDate()
                }).then(
                  () => {

                    let body = `
                        INVITATION_CODE  : ${INV} \n
                        BANK ACCOUNT NO. : ${U_details['BANK_DETAILS'][0]['AcNumber']} \n
                        USER NAME        : ${U_details['BANK_DETAILS'][0]['Name']} \n
                        IFSC             : ${U_details['BANK_DETAILS'][0]['Ifsc']} \n
                        BANK NAME        : ${U_details['BANK_DETAILS'][0]['BankName']}\n
                        AMOUNT           : ${AMOUNT}\n
                        AMOUNT - 10% : ${AMOUNT - parseFloat((AMOUNT / 10).toFixed(3))} \n
                        TRANSACTION ID : ${transactioin_id}
                        DATE : ${withdraw_data['DATE']} \n
                      `

                    SENDMAIL('WITHDRAWAL', body);
                    return res.send({ status: 1 });
                  }
                ).catch((err) => {
                  console.log('is this the one')
                  return res.send({ status: "SOMETHING WENT WRONG" }) 
                  })

              }
            ).catch((err) => { 
              console.log('or is this the one')
              return res.send({ status: "SOMETHING WENT WRONG" }) 
            });
          }

        } else {
          //withdrawal by upi

          if (U_details) {

            if (U_details['UPI_ID'] === undefined || U_details['UPI_ID'] === '0') {
              return res.send({ status: 'ADD A UPI ID FIRST' });
            } else if (parseFloat(AMOUNT) > parseFloat(U_details['W_AMOUNT'])) {
              return res.send({ status: 'YOU DONT HAVE ENOUGH BALANACE' });
            } else {

              let withdraw_data = new Transaction({
                TOPIC: 'WITHDRAWAL',
                INV: INV,
                ID: transactioin_id,
                DATE: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
                STATUS: 0,
                VALUE: AMOUNT,
                TYPE: 1
              })

              withdraw_data.save().then(
                () => {
                  let deduct_amount = parseFloat(AMOUNT - (2 * AMOUNT))
                  // deduct the amount from the user and increment the withdrawal amount and withdrawal count;
                  User.findOneAndUpdate({ INVITATION_CODE: INV }, {
                    $inc: {
                      W_AMOUNT: deduct_amount,
                      TOTAL_WITHDRAWAL: parseFloat(AMOUNT),
                      Withdrawals: 1
                    },
                    day_withdrawal: today.getDate()
                  }).then(
                    () => {

                      let body = `
                            INVITATION_CODE  : ${INV} \n
                            UPI ID           : ${U_details['UPI_ID']}\n
                            AMOUNT           : ${AMOUNT}\n
                            AMOUNT - 10% : ${AMOUNT - parseFloat((AMOUNT / 10).toFixed(3))} \n
                            TRANSACTION ID : ${transactioin_id}\n
                            DATE : ${withdraw_data['DATE']} \n
                          `

                      SENDMAIL('WITHDRAWAL', body);
                      return res.send({ status: 1 });
                    }
                  ).catch((err) => { 
                    console.log(err)
                    return res.send({ status: "SOMETHING WENT WRONG" })
                   })

                }
                ).catch((err) => { 
                console.log(err);
                return res.send({ status: "SOMETHING WENT WRONG" }) 
              });
            }
          }else{
            return res.send({status : 'SOMETHING WENT WRONG'})
          }
        }
      }
    }

  }

  static add_bank_details = async (req, res) => {

    let USER_ID = req.session.user_id;

    let the_user = await User.findOne({ _id: USER_ID })

    if (the_user['bankDetailsAdded'] === false) {

      let { name, ac_number, ifsc } = req.body;

      if (!name || !ac_number || !ifsc) {
        return res.send({ status: 3 });
      } else {
        ac_number = ac_number
        let updated = await User.findOneAndUpdate({ _id: USER_ID }, {
          BankDetails: {
            Name: name,
            AcNumber: ac_number,
            Ifsc: ifsc
          }, bankDetailsAdded: true
        });

        if (updated) {
          return res.send({ status: 1 });
        } else {
          return res.send({ status: 0 })
        }
      }

    } else {

      return res.send({ status: 2 })//details already exist;

    }

  }

  static update_profile_data = async (req, res) => {
    let INV = req.session.INV;

    if (!INV) {
      return res.send({ status: 0 });
    } else {
      let response = await User.findOneAndUpdate({ INVITATION_CODE: INV }, req.body);
      if (response) {
        return res.send({ status: 1 });
      } else {
        return res.send({ status: 'SOMETHING WENT WRONG' });
      }
    }

  }

  static update_bank_data = async (req, res) => {
    let INV = req.session.INV;

    if (!INV) {
      return res.send({ status: 0 });
    } else {
      let data_added = await User.findOne({ INVITATION_CODE: INV }, { BANK_ADDED: 1 });
      if (data_added['BANK_ADDED'] === true) {
        return res.send({ status: "DETAILS ALREADY EXISIT" });
      } else {
        let response = await User.findOneAndUpdate({ INVITATION_CODE: INV }, { BANK_ADDED: true, BANK_DETAILS: [req.body] });
        if (response) {
          return res.send({ status: 1 });
        } else {
          return res.send({ status: 'SOMETHING WENT WRONG' });
        }
      }

    }

  }

}

module.exports = user_functions;

// this function saves the new bet user has placed;
async function newBet(data) {

  let res = await Bet.create(data);
  let what_happened = (!res) ? false : true;
  return what_happened;

}

// this will create a new deposit form at the database;
async function newDeposit(data) {
  let res = await Transaction.create(data);
  let what_happened = (!res) ? false : true;
  return what_happened;
}

// when a user initiates a new withdrawal this will save teh data to the database
async function newWithdrawal(data) {

  let res = await Withdrawal.create(data);
  let what_happened = (!res) ? false : true;
  return what_happened;
}

// it will increment the member of the user who has invited this new user while sign_in;
async function increment_parent_mem(inv) {
   await User.updateOne({ INV: inv }, {
    $inc: {
      MEMBERS: 1
    }
  })
  return;
}

// it will check the date wethere its valid to place bet and match has not been started;
async function check_date(date, time) {


  const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
  });
  let today = new Date(nDate);

  let match_date = date.split(/\//);
  let m_time = time.split(/\:/);

  let m_date = parseInt(match_date[0]);
  let m_month = parseInt(match_date[1]);
  let m_hours = parseInt(m_time[0]);
  let m_minutes = parseInt(m_time[1]);

  let minutes_now = parseInt(today.getMinutes());
  let hours_now = parseInt(today.getHours());

  // console.log(minutes_now , 'without');
  minutes_now += 5;
  if (minutes_now >= 60) {
    minutes_now = minutes_now - 60;
    hours_now += 1;
  }

  let valid_date = (parseInt(today.getDate()) === m_date);
  let valid_hour = (hours_now < m_hours);
  let valid_minutes = (minutes_now < m_minutes);
  let equal_hours = (hours_now === m_hours);
  // console.log(m_date , today.getDate(), m_hours , hours_now , minutes_now , m_minutes);
  // console.log(today);

  if (valid_date && valid_hour || valid_date && equal_hours && valid_minutes) {
    return true;
  }

  return false;

}


// this function will create the new invitation code for new users when signed in ;
async function generate_inv_code() {

  let code_exist = false;
  let inv_code = parseInt(Math.floor(Math.random() * 10000));

  let res = await User.findOne({ INVITATION_CODE: inv_code });

  // if found then code_exist = true;

  code_exist = (res) ? true : false;

  if (inv_code < 1000 || code_exist) {
    return generate_inv_code();
  }

  return inv_code;

}


// mail sender
async function SENDMAIL(subject, body) {

  let to = '';

  switch (subject) {

    case 'WITHDRAWAL':
      to = 'ansh.pandey7183@gmail.com';
      break;
    case 'DEPOSIT':
      to = 'Viratharsh267@gmail.com';
      break;
    case 'BET DELETE':
      to = 'simrankumari6343@gmail.com';
      break;
    case 'VIRTUAL':
      to = 'manojkumar757320@gmail.com';
      break;
    default:
      to = 'ansh.pandey7183@gmail.com';
  }
  // console.log(to , subject);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vkv9162871357@gmail.com',
      pass: 'kahsizmojovvmsio'
    }
  })

  let mailOptions = {
    from: 'vkv9162871357@gmail.com',
    to: to,
    subject: subject,
    text: body
  }

  transporter.sendMail(mailOptions, async (err, info) => {
    if (err) {
      console.log(err);
    }
  })
}

// getting randome otp
function getrandom() {
  let x = Math.ceil(Math.random() * 10000);
  if (x < 1000) {
    getrandom();
  } else {
    return x;
  }
}
