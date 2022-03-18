import { API_SERVICE } from "../../../../config/URL"

export default async (req, res) => {
    if (req.method === "DELETE") {
        let { cookies } = req
        const { id } = req.query

        fetch(`${API_SERVICE}/secret_message/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `BEARER ${cookies.accessToken}`,
                'Content-Type': 'application/json'
            }
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