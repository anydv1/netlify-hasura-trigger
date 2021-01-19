


exports.handler = async(event, context, cb) => {
console.log(event,'event')

cb(null, {
    statusCode: 200,
    body: "success"
  });
}