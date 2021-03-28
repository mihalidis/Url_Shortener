# [URL Shortener Microservice](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice)

## Project setup
```
npm install
```
## Usage

> Post valid Url

example:``` https://www.hackerrank.com/ ```

output: ``` {"original_url":"www.example.com","short_url":"ZTb1N7Hzh"} ```

> If you post unvalid Url

output: ``` {"error":"invalid url"} ```

> if you pass the ``` /api/shorturl/ZTb1N7Hzh ```

output: redirect to the www.example.com
