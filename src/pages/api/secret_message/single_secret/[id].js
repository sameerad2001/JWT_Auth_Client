import { API_SERVICE } from "../../../../config/URL"

export default async (req, res) => {
    if (req.method === "GET") {
        let { cookies } = req
        const { id } = req.query

        fetch(`${API_SERVICE}/secret_message/get_single_secret/${id}`, {
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
                res.send(data)
            })
            .catch(err => {
                res.status(500)
                res.send(err)
            })

    }
}