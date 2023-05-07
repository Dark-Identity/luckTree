document.querySelector('#pay_submit').addEventListener('click' , async (e)=>{
  e.target.disabled = true;

  let elements = document.querySelectorAll('.pay_submit_fields > input');
  let amount = elements[0].value;
  let transaction_id = elements[1].value;
   
  if(!amount || !transaction_id 
    || amount === undefined || transaction_id === undefined){
        alert("ENTER ALL THE DETAILS!");
        e.target.disabled = false;
        return;

    }else{
        if(transaction_id.lenth > 15){
            alert('ENTER A VALID UTR NUMBER');
            e.target.disabled = false;
            return;

        }else if( parseFloat(amount) < 1 ){
            alert("ENTER A VALID AMOUNT");
            e.target.disabled = false;
            return;

        }
        // ------every thing is fine -----------

        let config = {
            method : "POST",
            headers : {
                'content-type' : 'application/json'
            },
            body : JSON.stringify({amount , transactioin_id : transaction_id})
        }

        let res = await fetch('/deposit' , config);
        res = await res.json();
        if(res['status'] === 1){
            alert("SUCCESS , it will be credited soon");
            return;
        }else{
            alert(res['status']);
            window.location.reload;
        }
    }
    
})

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