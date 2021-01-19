
const axios = require('axios');
const moment=require('moment');
const rp = require('request-promise')



exports.handler = async(event, context, cb) => {
 
  try{
    const { event: {op, data} } = JSON.parse(event.body);
  //const { event: {op, data}, table: {name, schema} } = event;
  
  let {cron_expression,id}=data.new;
  
 
  if(op === 'INSERT'){
    console.log('called')
    console.log(cron_expression)
    const options = {
      uri: "https://server.internal.multiliving.co.in/v1/query",
      headers: {
          "Content-Type": "application/json",
              "X-Hasura-Role": "admin",
              "x-hasura-admin-secret":"8f70264534ccb260579b8a658601141a"
      },
      body:{
        "type": "create_cron_trigger",
        "args": {
           "name": data.new.id,
           "webhook": "https://friendly-bartik-e65d92.netlify.app/.netlify/functions/check", //needs to create api to send notification will have to update the url
           "schedule": cron_expression,
           "payload": {},
           "include_in_metadata": true
        }
     },
      json: true
  };
  try{
    const responses=await rp.post(options)
    console.log(responses,'here')
    // return responses;

  }catch(err){
    console.log(err)
  }
  // return responses;
   
  }
  cb(null, {
    statusCode: 200,
    body: "success"
  });


}
catch(err){
  console.log(err,'error');
}
};
