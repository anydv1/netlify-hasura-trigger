
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
      uri: process.env.HASURA_QUERY_URL,
      headers: {
          "Content-Type": "application/json",
              "X-Hasura-Role": "admin",
              "x-hasura-admin-secret":process.env.HASURA_ADMIN_SECRET
      },
      body:{
        "type": "create_cron_trigger",
        "args": {
           "name": data.new.id,
           "webhook": "https://server.internal.multiliving.co.in:8081/gql/api/generic/daily_reports", //needs to create api to send notification will have to update the url
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
