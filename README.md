# sh-server

A webserver that runs bash scripts. Php style.

### **WIP**

## Usage

```
Options:
  --help      Show help                                                [boolean]
  --version   Show version number                                      [boolean]
  --port, -p  Port to listen on              [number] [required] [default: 8080]
  --dir, -d   Root directory for the webserver               [string] [required]
```

## API

## Env

Headers are available as `WEB_HEADER` (dashes are replaced with underscores and the string is converted to upper-case so `User-Agent` becomes `WEB_USER_AGENT`)

> TODO: Add post/get values, url, etc

### Functions

 - `header "HEADER" "VALUE"`: Sets the value of `HEADER` to `VALUE`
 - `status STATUS`: Sets the response status code to `STATUS`

> TODO: add more functions
