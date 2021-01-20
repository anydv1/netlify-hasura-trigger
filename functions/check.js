


exports.handler = async(event, context, cb) => {
console.log(event.body,event,'event')
// const user1=await hasuraClient.request(user(event.payload.query.trim()))
//        console.log(user1.users)
//         const users=user1.users;
event=event.body;
        switch(event.payload['notification_type']) {
            case "EMAIL":

                // users.forEach(async user => {
                    let email = 'anupama.yadav@doma.co.in';
                    let subject = event.payload['title'];
                    let body = event.payload['description'];
                    if (email !== null) await sendMail(email, subject, body);
                // })

                return res.status(200).json({status: true, schedulerId: req.params.id, message:"send email notification successfully"})
            
            case "SMS":
               
                users.forEach(user => {
                    let number = user.mobile.number;
                    sendSMS(number,event.payload['description']);
                });

                return res.status(200).json({status: true, schedulerId: req.params.id, message:"send sms notification successfully"})

            case "APP":
                try {
                    let payload = {};
                    payload.registration_ids = users.reduce((ids, item) => {
                        return [...ids, ...item.devices.map(device => device.is_logged_in && device.device_notification_key)]
                    }, []).filter(id => id)

                    if(!payload.registration_ids.length) return res.sendStatus(500);
                        
                    payload.notification = {
                        title: event.payload['title'],
                        body:event.payload['description']
                    }

                    if (event.payload['image_url'])
                        payload.notification.image = event.payload['image_url']

                    if (event.payload['external_url']) {
                        payload.notification.click_action = "HANDLE_NOTIFICATION"
                        payload.data = { url: event.payload['external_url'] }
                    }

                    const fcm_res = await PushNotificationUtility.postNotification(payload)
                    return res.status(200).json(fcm_res)
                }
                catch (e) {
                    console.log('App Notification ', e)
                    return res.status(500).send(e)
                }
            default:
        }
cb(null, {
    statusCode: 200,
    body: "success"
  });
}