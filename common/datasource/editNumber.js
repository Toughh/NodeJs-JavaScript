module.exports = {
    editNumbers: function (customer_key, app_id) {

        let numberEdit = {
            "customer_key": customer_key,
            "services_api_app_id": app_id
        }
        return numberEdit
    }
}
