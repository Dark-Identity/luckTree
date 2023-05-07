
function create_data(datas){
   for(let data of datas){

       let status  , color;

       if(data['STATUS'] === 0){
        status = 'PENDING';
        color = 'pending';
       }else if(data['STATUS'] === 1){
          status = 'SUCCESS';
          color = 'success';
       }else {
        status = 'CANCELED';
        color = 'canceled';
       }
    
     
       let parent = document.querySelector('.funds_content');
       let child = document.createElement('div');
       child.classList.add('notification_card');
       child.insertAdjacentHTML("afterbegin" , `  
            <div class="topic_status">
                <h3>${data['TOPIC']}</h3>
                <div>
                    <span class="status_color ${color}">
                    </span>
                    <h4>${status}</h4>
                </div>
              </div>
              <div class="card_content">
                <h4 id="data">${data['DATE']}</h4>
                <h4 id="value">${data['VALUE']}</h4>
              </div>
              <div class="notification_id">
                 <div>
                    <h4>ID</h4>
                    <h5>${data['ID']}</h5>
                 </div>
              </div>`);
              parent.appendChild(child);

   }
}


(async function (){
  
    let res = await fetch('/get_funds_data');
    res = await res.json();
    if(res['status'] === 1){
        create_data(res['data']);
    }else{
       window.location.href = window.location.origin + '/login';
    }

})();

   window.addEventListener('load' , async ()=>{
        let user_data = await fetch('/user_data');
        user_data = await user_data.json();
        if(user_data['status'] === 2 || user_data['status'] === 3 ) {
         //  window.location.href = window.location.origin + '/login';
        }else{
         
          let balance = document.querySelectorAll('.balance');
          balance.forEach((ele)=>{
             ele.innerText = user_data['BALANCE'];
          })

        }
     })