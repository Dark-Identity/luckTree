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
    const htmlData = `<input type="text" placeholder="add your upi id">`;
    upi_page.insertAdjacentHTML('afterbegin', htmlData);
    upi_main_page.appendChild(upi_page);
}

upi_add_btn.addEventListener('click', () => {
    addNewpage();
});

 window.addEventListener('load' , async ()=>{
        let user_data = await fetch('/user_data');
        user_data = await user_data.json();
        if(user_data['status'] === 2 || user_data['status'] === 3 ) {
          window.location.href = window.location.origin + '/login';
        }else{
         
          let balance = document.querySelectorAll('.balance');
          balance.forEach((ele)=>{
             ele.innerText = user_data['BALANCE'];
          })

        }
     })