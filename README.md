
* ngtichu: angular client
* tichu: server using spring boot and https://github.com/akkurat/libtichu


# Getting Started

* Checkout https://github.com/akkurat/libtichu in the same parent as this repo
* ```cd tjchu; ./gradlew runBoot``` starts server
* ```cd ../ngtichu; npm i; npx ng s --proxy-config proxy.conf.json``` install node packages and starts angular server with proxy to spring boot

* open http://localhost:4200/
