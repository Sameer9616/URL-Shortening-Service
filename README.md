Certainly! Below is the README content consolidated into a single page:

---

# URL Shortening Service

This project implements a URL Shortening Service using Node.js, Express.js, MongoDB, and Redis. It allows users to shorten URLs, manage user accounts, and track analytics for shortened URLs.

## Getting Started

To get started with this service, follow the instructions below:

1. Clone this repository to your local machine.
2. Install the dependencies using npm:

```bash
npm install
```

3. Configure the environment variables by creating a `.env` file in the root directory. Refer to the `.env.example` file for the required variables.
4. Start the server:

```bash
node index.js
```

## Usage

### User Sign Up

To sign up for a new user account, send a POST request to:

```
POST localhost:8081/user/signup
```

Include the following JSON payload in the request body:

```json
{
  "name": "Your Name",
  "email": "your_email@example.com",
  "password": "your_password"
}
```

### User Sign In

To sign in with an existing user account, send a POST request to:

```
POST localhost:8081/user/signin
```

Include the following JSON payload in the request body:

```json
{
  "email": "your_email@example.com",
  "password": "your_password"
}
```

Upon successful authentication, the server will respond with a JWT token.

### URL Shortening

To shorten a URL, send a POST request to:

```
POST localhost:8081/url
```

Include the following JSON payload in the request body:

```json
{
  "url": "your_long_url_here"
}
```

### Redirection

To redirect to the original URL associated with a short ID, navigate to:

```
GET localhost:8081/:shortId
```

### Analytics

To retrieve analytics for a shortened URL, send a GET request to:

```
GET localhost:8081/analytics/:shortId
```

Replace `:shortId` with the short ID of the URL.

## Contributing

Contributions to this project are welcome. Feel free to open issues and submit pull req.
