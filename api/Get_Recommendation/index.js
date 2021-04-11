const fetch = require('node-fetch')     

module.exports = async function (context, req) {

    const options = {
        method: 'post',
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    await fetch(process.env["GET_RECOMMENDATION_URL"], options)
        .then(resp => 
            resp.json()
        )
        .then(data => 
            context.res = {
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                } 
            } 
        )
        .catch(err => 
            context.res = { 
                status: 400,
                body: err
            }
        )
            

};