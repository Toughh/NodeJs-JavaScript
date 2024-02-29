const common_utils = require('../../common/util/commonUtils')

module.exports = {
    postSSOConfigs: function (oauth_group, reseller_Id, idp_oauth_client_id) {

        let SSOConfigs = {
            "idp_sso_url": "https://j2sandbox.onelogin.com/trust/saml2/http-post/sso/3341c571-1409-4bdf-8acf-3e08370a5d5c",
            "idp_entity_id": "https://app.onelogin.com/saml/metadata/3341c571-1409-4bdf-8acf-3e08370a5d5c",
            "idp_oauth_client_id": idp_oauth_client_id,
            "oauth_group": oauth_group,
            "reseller_id": reseller_Id,
            "enabled": true,
            "X509_cert": "MIID5TCCAs2gAwIBAgIUIo+5AnD92w21Ql8QsNF/I2remUcwDQYJKoZIhvcNAQEF\r\nBQAwSDETMBEGA1UECgwKSjIgU2FuZGJveDEVMBMGA1UECwwMT25lTG9naW4gSWRQ\r\nMRowGAYDVQQDDBFPbmVMb2dpbiBBY2NvdW50IDAeFw0xOTAyMTIyMTUyMThaFw0y\r\nNDAyMTIyMTUyMThaMEgxEzARBgNVBAoMCkoyIFNhbmRib3gxFTATBgNVBAsMDE9u\r\nZUxvZ2luIElkUDEaMBgGA1UEAwwRT25lTG9naW4gQWNjb3VudCAwggEiMA0GCSqG\r\nSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDth1ZDxTOSxJ5y1COtv+xsurlXvArm1fMl\r\npoDMs/sHDtXYCtXrYu+pewneIMdnH14ByaL+sgPUMB9AysBOF/Kr0gQ5XMH4OfvP\r\nsQeeru7NlxQ0IqWhyJjHUajczGiS4qZqZQBgsffiLpwoNMRiw/KdBlTPfDKM5xaW\r\n2oWTuCmSKqZTRDc5CjVPIa5vYI3mrA2QlcZtKjcv/ZWJKdElKvm3f1/J38OszurF\r\nE+ESSLenR7nCRjQyZnp1sSkcol2GFrT8Cs5QGQRrrKOdLP2z985Kr9+dZcYVG2Gg\r\nzsayceE7zL8v8uKYDsgmCMYDj4fLpW53NVXxdUs3d3fGv+7eSSTxAgMBAAGjgcYw\r\ngcMwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQU4rGt+lKHDrZSCQNQB/DK3HuSQQ8w\r\ngYMGA1UdIwR8MHqAFOKxrfpShw62UgkDUAfwytx7kkEPoUykSjBIMRMwEQYDVQQK\r\nDApKMiBTYW5kYm94MRUwEwYDVQQLDAxPbmVMb2dpbiBJZFAxGjAYBgNVBAMMEU9u\r\nZUxvZ2luIEFjY291bnQgghQij7kCcP3bDbVCXxCw0X8jat6ZRzAOBgNVHQ8BAf8E\r\nBAMCB4AwDQYJKoZIhvcNAQEFBQADggEBAJCcN50B3lEjMOs0oG2t2NRyLeyzKr1Y\r\nKbmGKZGWvArtkBaPuk57NzPraQ3lT2fSJHNjIBClS7J9SnJuT8mqpnLF+ewDGAsg\r\nga9VzWd43RRvz+vvnVQi0X8ndbUQrUHkQBGIxs6WUyb5PQKhaKDKBNCJLcvqSH39\r\nofjwE6zYGqPvASU2NAGn+rT2fSGpKj9aZ3xxc8y4byp512gvuViesRUvEH3kV2cj\r\nOcAGkWE4jfGcCEwQCyJdXYOq8vVQBpVCafWSlMlWtv3JcpXuxJO3mUmBjicadOh6\r\niJM4QJ2LEIrXVYhPJCz7sFabDtmDAGl7CExblfKjSSk6gfgofCZNnXw="
        }
        return SSOConfigs
    }
}
