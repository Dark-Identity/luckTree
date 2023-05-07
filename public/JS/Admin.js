document.querySelector('#settle_lottery').addEventListener('click' , async(e)=>{
   e.target.disabled = true;
   let id = document.querySelector('#lotery_id').value;
   
   if(!id || id === undefined){
      alert("PLEASE ENTER A VALID ID");
      e.target.disabled = false;
      return;
   }else{
      let config = {
        method : 'POST',
        headers : {
            'content-type' : 'application/json'
        },
        body : JSON.stringify({id})
      }

      let res = await fetch('/settle_lottery' , config);
      res = await res.json();
      if(res['status'] === 1){
        document.querySelector('#results').innerText = res.stringify();
      }else{
        alert(res['status']);
      }
   }

})