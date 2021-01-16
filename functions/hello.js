
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
    const options = {
      uri: "https://server.internal.multiliving.co.in/v1/query",
      headers: {
              "X-Hasura-Role": "admin",
              "x-hasura-admin-secret":"8f70264534ccb260579b8a658601141a"
      },
      body:{
        "type": "create_cron_trigger",
        "args": {
           "name": "send_notification",
           "webhook": "https://server.internal.multiliving.co.in:8081/gql/api/generic/daily_reports",
           "schedule": cron_expression,
           "payload": {},
           "include_in_metadata": true
        }
     },
      json: true
  };
  const responses=await rp.post(options)
  console.log(responses,'here')
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
