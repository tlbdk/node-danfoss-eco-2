# node-danfoss-eco-2
Code examples for connecting to Danfoss Eco 2

## Installation Ubuntu

``` bash
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```