const fetch = require('node-fetch');

module.exports = async function (context, req) {

    const options = {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: {
            "Content-Type": "application/json"
        }
    }
    
    fetch(process.env["SUBMIT_URL"], options)
        .then(res =>
            context.res = { 
                status: 200
            }
        )
        .catch(err => 
            context.res = { 
                status: 400,
                body: err
            }
        )
};