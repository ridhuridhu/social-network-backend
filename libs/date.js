

module.exports=(data)=>{
    let d=new Date(data.time);

    let date=(`${d.getDate()}/${d.getMonth()}/${(d.getFullYear())}`);
    let time=(`${d.getHours()}:${d.getMinutes()}`);

    
   return {date,time};


};