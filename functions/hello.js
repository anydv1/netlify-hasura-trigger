
const axios = require('axios');
const moment=require('moment');
const rp = require('request-promise')

const sub_package_query=`query vas_sub_packages($id: uuid){
  vas_sub_packages(where:{id:{_eq:$id}}){
    id
    duration
    services{
      service_id
    }
  }
}`
const insert_tracker=`mutation insertTracker($objects: [vas_subscription_tracker_insert_input!]! ) {
  insert_vas_subscription_tracker(objects: $objects) {
    returning {
      id
    }
  }
}`
const update_tracker=`mutation updateTracker($object: vas_subscription_tracker_set_input,$id:uuid!){
  update_vas_subscription_tracker(where:{sub_subscription_id:{_eq:$id}},_set:$object){
    affected_rows
    returning{
      id
    }
  }
}`;

exports.handler = async(event, context, cb) => {
  const adminSecret ="8f70264534ccb260579b8a658601141a";
  const hgeEndpoint = "http://server.internal.multiliving.co.in/v1/graphql";
  try{
    const { event: {op, data} } = JSON.parse(event.body);
  //const { event: {op, data}, table: {name, schema} } = event;
  
  let {cron_expression,id}=data.new;
  
 
  if(op === 'INSERT'){
  
    
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
  return responses;
   
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
