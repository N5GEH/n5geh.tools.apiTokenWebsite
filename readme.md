# Token Website

This is an application designed to retrieve and display access tokens from an OIDC provider such as Keycloak.

## Deployment

**Deployment via Docker:**

- Build the image using the provided `Dockerfile`. Images are available at [GEWV-Dockerhub](https://docker-hub.gewv.iet.mw.tu-dresden.de/harbor/projects/5/repositories/get-token-ui).
- Utilize Docker Compose with the provided [compose.yml](compose.yml) file and configure the following environment variables:

    ```yaml
    CLIENT_ID = # ID of OAuth2 Client
    CLIENT_SECRET = # Secret of OAuth2 Client
    SECRET = # Secret for express-openid-connect (https://github.com/auth0/express-openid-connect) - LONG_RANDOM_VALUE
    ISSUER_BASE_URL = # Base URL of the Authorization Server
    HOST = # Hostname of the UI in the format: https://${HOST}/
    ```

- The UI is accessible at port 4000.
