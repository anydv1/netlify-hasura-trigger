
const axios = require('axios');
const moment=require('moment');
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
  const adminSecret = process.env.ADMIN_SECRET;
  const hgeEndpoint = "http://server.internal.multiliving.co.in/v1/graphql";
  try{
    const { event: {op, data}, table: {name, schema} } = JSON.parse(event.body);
  //const { event: {op, data}, table: {name, schema} } = event;
  
  let request;
  let {cron_expression,id}=data.new;
  let payload={
    cron_expression:cron_expression,
    id:id
  }
 
  if(op === 'INSERT'){
    const cron_expre ={id:data.new.cron_expression};
    let data1 = JSON.stringify({
      // query: sub_package_query,
      variables: cron_expre
    });
    
    let config = {
      method: 'post',
      url: hgeEndpoint,
      headers: { 
        'content-type': 'application/json', 
        'x-hasura-admin-secret': adminSecret
      },
      data : data1
    };
    
   const response=await axios(config);
   const res=response.data.data;
  console.log(res);

  const options = {
    uri: "https://server.internal.multiliving.co.in/v1/query",
    headers: {
            "X-Hasura-Role": "admin",
            "x-hasura-admin-secret":process.env.HASURA_ADMIN_SECRET
    },
    body:{
      "type": "create_cron_trigger",
      "args": {
         "name": "eod_reports",
         "webhook": "https://server.internal.multiliving.co.in:8081/gql/api/generic/daily_reports",
         "schedule": "0 22 * * 1-5",
         "include_in_metadata": true,
         "payload": {},
         "retry_conf": {
               "num_retries": 3,
               "timeout_seconds": 120,
               "tolerance_seconds": 21675,
               "retry_interval_seconds": 12
         },
         "comment": "sample_cron commment"
      }
    },
    json: true
};

  // const create_cron={
  //    "type": "create_cron_trigger",
  //    "args": {
  //       "name": "eod_reports",
  //       "webhook": "https://server.internal.multiliving.co.in:8081/gql/api/generic/daily_reports",
  //       "schedule": "0 22 * * 1-5",
  //       "include_in_metadata": true,
  //       "payload": {},
  //       "retry_conf": {
  //             "num_retries": 3,
  //             "timeout_seconds": 120,
  //             "tolerance_seconds": 21675,
  //             "retry_interval_seconds": 12
  //       },
  //       "comment": "sample_cron commment"
  //    }
  // }

  // const service_id=res.vas_sub_packages[0].services[0].service_id;
  // const duration=res.vas_sub_packages[0].duration;
  // payload.service_id=service_id;
 
  //    const freq=duration.split(":");
  //    let frequency;
  //    if(freq[0] == '01') frequency='M';
  //    else if(freq[1] == '01') frequency='w';
  //    else frequency='d';   
  //    const final_payload=[];
  //    while(moment(start_date).isSameOrBefore(end_date)){
  //      final_payload.push({...payload,service_date:start_date});
  //      start_date=moment(start_date, "YYYY-MM-DD").add(1, frequency).format("YYYY-MM-DD");
  //    }
  //    console.log("final payload ", final_payload);
    
  //    let insert_data = JSON.stringify({
  //      query:insert_tracker,
  //      variables: {objects:final_payload}
  //    });
  //    config.data=insert_data;
  //   const track= await axios(config);
  //    console.log(track.data);

   
  }
  // else if(op=== 'UPDATE'){
  //   console.log(data);
  //   const id=data.old.id;
  //   console.log(id);
  //   let update_data=JSON.stringify({
  //     query:update_tracker,
  //     variables:{object:payload,id:id}
  //   });
  //   let config = {
  //     method: 'post',
  //     url: hgeEndpoint,
  //     headers: { 
  //       'content-type': 'application/json', 
  //       'x-hasura-admin-secret': adminSecret
  //     },
  //     data : update_data
  //   };
  //  const track= await axios(config);
  //   console.log(track.data);

  // }


  cb(null, {
    statusCode: 200,
    body: "success"
  });
}
catch(err){
  console.log(err);
}
};
