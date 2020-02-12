# ESP8266 & IKEA Ledberg

## Requisites

- Mongoose OS' `mos` tool installed

## Building & Flashing

- Connect the ESP8266 via USB/Serial to your computer
- `cd cRgbLed`
- `mos build --platform esp8266 --local && mos flash`

## Usage

Test it with

```
mos call LED.ChangeValue '{"r": 255, "g": 10, "b": 100}'
Using port /dev/ttyUSB0
{
  "msg": {
    "r": 255,
    "g": 10,
    "b": 100
  }
}
```

or

```
curl -d '{"r":100, "g": 20, "b": 10}' 192.168.0.116/rpc/LED.ChangeValue
{"msg": {"r": 100, "g": 20, "b": 10}}
```

Then you can try it from the browser

- Get its IP address

```
mos call Sys.GetInfo
Using port /dev/ttyUSB0

{
  "id": "esp8266_CB314D",
  "app": "cRgbLed",
  "fw_version": "1.0",
  "fw_id": "20200212-125929/g29b5878-master",
  "mg_version": "95b1ff7",
  "mg_id": "20200212-124942/g95b1ff7-master",
  "mac": "1AFE34CB314D",
  "arch": "esp8266",
  "uptime": 295,
  "public_key": null,
  "ram_size": 52728,
  "ram_free": 45148,
  "ram_min_free": 36368,
  "fs_size": 233681,
  "fs_free": 198290,
  "wifi": {
    "sta_ip": "192.168.0.116",
    "ap_ip": "",
    "status": "got ip",
    "ssid": "Wadsl-miaa"
  }
}
```

- Open the address in the browser. i.e. `192.168.0.116` in this case

## Developing

To change the files in the `fs` folder you can avoid reflashinb by using
`mos put fs/index.html` for example.
