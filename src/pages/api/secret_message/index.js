import { API_SERVICE } from "../../../config/URL"

export default async (req, res) => {
    if (req.method === 'GET') {
        let { cookies } = req

        await fetch(`${API_SERVICE}/secret_message`, {
            method: "GET",
            headers: {
                'Authorization': `BEARER ${cookies.accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                // console.log(data)

                res.status = 200
                res.send(data.reverse())
            })
            .catch((error) => {
                res.status = 500
                res.send(error)
            });
    }
    if (req.method === "POST") {
        let { cookies } = req

        fetch(`${API_SERVICE}/secret_message`, {
            method: "POST",
            headers: {
                'Authorization': `BEARER ${cookies.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...req.body })
        })
            .then(response => {
                res.status(response.status)
                res.json(response)
            })
            .catch(err => {
                res.status(500)
                res.send(err)
            })

    }
}