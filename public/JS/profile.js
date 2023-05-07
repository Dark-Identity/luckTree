const add_w = document.querySelector('h3 > ion-icon');
const profile_t = document.querySelector('.profile_two');
const withdrawal = document.querySelector('.withdrawal');
const btn = document.querySelector('.btn > button');
const swip = document.querySelector('.switch');
const withd = document.querySelector('.with');
const check = document.querySelector(".checkbox");
const outerdep = document.querySelector('.deposite');
const close = document.querySelector('.withdrawals_in > ion-icon');
const close2 = document.querySelector('.Pc_deposite > ion-icon');
const withdrawals = document.querySelector('.withdrawals');
const deposite_add_btn = document.querySelector('#add');
//---------------------------------------------------- close button for popup --------------------------------------------------------------------- 
close.addEventListener('click', () => {
    profile_t.style.filter = " blur(0)";
    withdrawal.style.transform = "translateY(200%)";
    outerdep.style.transform = "translate(200%)";
    withdrawals.style.transform = "translateY(200%)";
    check.checked = false;
    withd.style.transform = "translateX(0)";
});


// ----------------------------------------------  withdrawal popup -----------------------------------------   -----------------------------------------------------
add_w.addEventListener("click", () => {
    withdrawal.style.transform = "translateY(0)";
    withdrawals.style.transform = "translateY(0)";
    profile_t.style.filter = " blur(10px)";

});



// ------------------------------------------------- withdrawal btn -------

btn.addEventListener('click', async (e) => {
    e.target.disabled = true;
    console.log('am i being clicked')
    let account = document.querySelectorAll('.radio_btn');
    let amount = document.querySelector('#w_amount').value;
    if(amount < 1 || amount === undefined || !amount){
        alert('ENTER A VALID AMOUNT');
        e.target.disabled = false;
        return ;
    }

    let body = {
        bank_acc : ((account[0].checked === true)? 1 : 0),
        AMOUNT : amount    
    }
    let config = {
        method : "POST",
        headers : {
            'content-type' : 'application/json'
        },
        body : JSON.stringify(body)
    }
    let res = await fetch('/withdrawal' , config);
    res = await res.json();
    if(res['status'] === 1){
        alert('WITHDRAWAL IS UNDER PROCESS');
        return;
    }else{
        alert(res['status']);
        window.location.reload();
    }
});

// ---------------------------------------------------switch system ----------------------------------------------------

swip.addEventListener('click', () => {
    if (check.checked == true) {
        outerdep.style.transform = "translate(0)";
        withd.style.transform = "translate(130%)";
    } else {
        outerdep.style.transform = "translate(130%)";
        withd.style.transform = "translate(0)";
    }
});



// ------------------------------------------------ js for users profile details ---------------------------------------------------------------------

const pro_edit_id1 = document.querySelector('#one');
const pro_edit_icon_id1 = document.querySelector('#one');

const pro_edit_id2 = document.querySelector('#two');
const pro_edit_icon_id2 = document.querySelector('#two');

const pro_edit_id3 = document.querySelector('#three');
const pro_edit_icon_id3 = document.querySelector('#three');

const pro_edit_id4 = document.querySelector('#four');
const pro_edit_icon_id4 = document.querySelector('#four');

const pro_same_clss = document.querySelectorAll('.same');
let pro_icon_sams = document.querySelectorAll('.sams');

pro_same_clss.forEach(element => {
    element.disabled = true;
});
pro_icon_sams.forEach(element => {
    element.addEventListener('click', () => {
        pro_same_clss.forEach(i => {
            if (i.id == element.id) {
                i.disabled = false;
                i.style.cssText = `border-bottom:2px solid black`;
            } else {
                i.disabled = true;
                i.style.cssText = `border-bottom:1px solid black`;
            }
        });
    });
});


// ------------------------------------------- users settngs sliders -------------------------------------------------------------------------------------------------------


const user_icon = document.querySelector('.fa-user');
const bank_icon = document.querySelector('.fa-bank');
const upi_icon = document.querySelector('.upi');
const phone_icon = document.querySelector('.fa-phone');

const pro_det = document.querySelector('.pro_det');
const bank_det = document.querySelector('.bank_det');
const upi_main_page = document.querySelector('.upi_page');
const contact_page = document.querySelector('.contact_page');
const settings_uper_divs = document.querySelectorAll('.setting_opp > div > div');
const p = document.querySelector('#p');
const b = document.querySelector('#b');
const u = document.querySelector('#a');
const c = document.querySelector('#c');

user_icon.addEventListener('click', () => {
    pro_det.style.cssText = ` transform:scaleY(1);height:50%;`;
    bank_det.style.cssText = `transform:scaleY(0);height:0;`;
    upi_main_page.style.cssText = `transform:scaleY(0);height:0;`;
    contact_page.style.cssText = `transform:scaleY(0);height:0;`;
    p.style.color = "#ad1d85";
    b.style.color = "black";
    u.style.color = "black";
    c.style.color = "black";
    pro_same_clss.forEach(element => {
        element.disabled = true;
        element.value = "";
        element.style.cssText = `border-bottom:1px solid`
    });
    
});


bank_icon.addEventListener('click', () => {
    pro_det.style.cssText = ` transform:scaleY(0);height:0;`;
    bank_det.style.cssText = `transform:scaleY(1);height:48%; margin:0`;
    upi_main_page.style.cssText = `transform:scaleY(0);height:0;`;
    contact_page.style.cssText = `transform:scaleY(0);height:0;`;
    p.style.color = "black";
    b.style.color = "#ad1d85";
    u.style.color = "black";
    c.style.color = "black";
    pro_same_clss.forEach(element => {
        element.disabled = true;
        element.value = "";
        element.style.cssText = `border-bottom:1px solid`
    });
    
});


upi_icon.addEventListener('click', () => {
    pro_det.style.cssText = ` transform:scaleY(0);height:0;`;
    bank_det.style.cssText = `transform:scaleY(0);height:0;margin:0`;
    upi_main_page.style.cssText = `transform:scaleY(1);height:48%;`;
    contact_page.style.cssText = `transform:scaleY(0);height:0;`;
    p.style.color = "balck";
    b.style.color = "black";
    u.style.color = "#ad1d85";
    c.style.color = "black";
    pro_same_clss.forEach(element => {
        element.disabled = true;
        element.value = "";
        element.style.cssText = `border-bottom:1px solid`
    });
    
});


phone_icon.addEventListener('click', () => {
    pro_det.style.cssText = ` transform:scaleY(0);height:0;`;
    bank_det.style.cssText = `transform:scaleY(0);height:0;`;
    upi_main_page.style.cssText = `transform:scaleY(0);height:0;`;
    contact_page.style.cssText = `transform:scaleY(1);height:48%;`;
    p.style.color = "black";
    b.style.color = "black";
    u.style.color = "black";
    c.style.color = "#ad1d85";    
    pro_same_clss.forEach(element => {
        element.disabled = true;
        element.value = "";
        element.style.cssText = `border-bottom:1px solid`
    });
    
});

// --------------------------------------------- writting js for the upi id -------------------------------------------------------------------------------------------------------------------------------
const upi_add_btn = document.querySelector('.s_upi > span > ion-icon')
// const upi_main_page = document.querySelector('.upi_page');

const addNewpage = () => {
    const upi_page = document.createElement('div');
    upi_page.classList.add('upis');
    const htmlData = `<input id = "upi_id" type="text" placeholder="add your upi id">
                  <button id = "upi_submit" type = 'submit' style = 'color : white ; margin-top : 1rem;'>SUBMIT</button> 
      `;
    upi_page.insertAdjacentHTML('afterbegin', htmlData);
    upi_main_page.appendChild(upi_page);
 
    document.querySelector('#upi_submit').addEventListener('click' , async (e)=>{
        e.target.disabled = true;
        let id = document.querySelector('#upi_id').value;
        if(!id || id == undefined){
            alert('ENTER A UPI ID FIRST');
            e.target.disabled = false;
            return;
        }else if( id.search('@') !== -1 ){
            let config = {
                method : 'POST',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify({UPI_ID : id})
            }
            let res = await fetch('/update_profile_data' , config);
            res = await res.json();
            if(res['status'] === 1){
                alert('DATA UPDATED');
                window.location.reload();
            }else{
                alert(res['status']);
                window.location.reload();
            }
        }else{
            alert('ENTER A VALID UPI ID');
            return;
        }

    })
}

upi_add_btn.addEventListener('click', () => {
    addNewpage();
});


// -------------------------------------------------- writting the js for settings outside aerrow ----------------------------------------------------------------------------------------------------------------

const setting_btn = document.querySelector('.profile_two > h4 > ion-icon');
const setting_body = document.querySelector('.setting');
const setting_arrow = document.querySelector('.setting > h3 > ion-icon');

setting_btn.addEventListener('click', () => {
    profile_t.style.transform = "translateX(130%)";
    setting_body.style.transform = "translateX(0%)";
});

setting_arrow.addEventListener('click', () => {
    profile_t.style.transform = "translateX(0)";
    setting_body.style.transform = "translateX(130%)";
    pro_det.style.cssText = ` transform:scaleY(1);height:50%;`;
    bank_det.style.cssText = `transform:scaleY(0);height:0;`;
    upi_main_page.style.cssText = `transform:scaleY(0);height:0;`;
    contact_page.style.cssText = `transform:scaleY(0);height:0;`;
    p.style.color = "#ad1d85";
    b.style.color = "black";
    u.style.color = "black";
    c.style.color = "black";

    pro_same_clss.forEach(element => {
        element.disabled = true;
        element.value = "";
        element.style.cssText = `border-bottom:1px solid`
    });
     
});




// -------------------------------------------------- writting the js for the pc withdrawal and deposite ----------------------------------------------------------------------------------------------------------------

const pc_withdrawal = document.querySelector("#pc_W");
pc_withdrawal.addEventListener('click' , ()=>{
    withdrawal.style.transform = "translateX(0)";
    withdrawals.style.transform = "translateX(0)";
    Pc_depo.style.transform = "translateY(140vh)";
     
});
const Pc_depo = document.querySelector('.Pc_deposite');
const pc_dep = document.querySelector("#pc_D");
pc_dep.addEventListener('click' , ()=>{
    Pc_depo.style.transform = "translate(0)";
    withdrawals.style.transform = "translateX(200%)"    
    withdrawal.style.transform = "translateX(200%)";

});
close2.addEventListener('click', ()=>{
    Pc_depo.style.transform = "translateY(140vh)";
        
});


// ------------------ sending data for profile section -----------------

document.querySelector('#prof_data_submit').addEventListener('click' , async (e)=>{
  e.target.disabled = true;
  let data = document.querySelectorAll('.prof_data');
  let name = data[0].value;
  let pass = data[1].value;
  let email = data[2].value;
  let w_code = data[3].value;
  let data_to_send = {};

  if(
    !name || name == undefined &&
    !pass || pass == undefined &&
    !email || email == undefined &&
    !w_code || w_code== undefined
    ){
       alert('ENTER SOME VALUES FIRST');
       return;
    }else{

      if(name && name !== undefined){
        data_to_send['NAME'] = name;
      }
      if(pass && pass !== undefined){
         data_to_send['PASS'] = pass;
      }
      if(email && email !== undefined){
         data_to_send['EMAIL'] = email;
      }
      if(w_code && w_code !== undefined){
         data_to_send['WITHDRAWAL_CODE'] = w_code;
      }    
      
      let config = {
        method : 'POST',
        headers : {
            'content-type' : 'application/json'
        },
        body : JSON.stringify(data_to_send)
      }

      let res = await fetch('/update_profile_data' , config);
      res = await res.json();
      if(res['status'] === 1){
        alert('DATA UPDATED');
      }else{
        alert(res['status']);
        window.location.reload();
      }
    }

})


// ------------------------ adding bank details---------------
document.querySelector('#bank_data_submit').addEventListener('click' , async (e)=>{
  e.target.disabled = true;
  let data = document.querySelectorAll('.bank_data');
  let B_name = data[0].value;
  let acc_no = data[1].value;
  let ifsc = data[2].value;
  let U_name = data[3].value;

  if(
    !B_name || B_name == undefined ||
    !acc_no || acc_no == undefined ||
    !ifsc || ifsc == undefined ||
    !U_name || U_name== undefined
    ){
       alert('ENTER ALL VALUES FIRST');
       return;
    }else{
       
        let data_to_send = {
        BankName : B_name,
        AcNumber : acc_no,
        Ifsc : ifsc,
        Name : U_name
       }
      
      let config = {
        method : 'POST',
        headers : {
            'content-type' : 'application/json'
        },
        body : JSON.stringify(data_to_send)
      }

      let res = await fetch('/update_bank_data' , config);
      res = await res.json();
      if(res['status'] === 1){
        alert('DATA UPDATED');
      }else{
        alert(res['status']);
        window.location.reload();
      }
    }

})

// -------------------------getting the user data-------------------
   window.addEventListener('load' , async ()=>{
      
        let user_data = await fetch('/user_data');
        user_data = await user_data.json();
       if(user_data['status'] === 2 || user_data['status'] === 3 ) {
          window.location.href = window.location.origin + '/login';
        }else{
         
          document.querySelectorAll('.balance').forEach((ele)=>{
             ele.innerText = user_data['BALANCE'];
          })
          document.querySelectorAll('.phone').forEach((ele)=>{
            ele.innerText = user_data['PHONE']
          })
          document.querySelectorAll('.withdrawal_amm').forEach((ele)=>{
            ele.innerText = user_data['W_AMOUNT']
          })
          document.querySelectorAll('.bets_played').forEach((ele)=>{
            ele.innerText = Math.floor(Math.random()*10)
          })
          document.querySelectorAll('.members_invited').forEach((ele)=>{
            ele.innerText = user_data['MEMBERS']
          })
          

        }
     })