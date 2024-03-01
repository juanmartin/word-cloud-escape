const SerialPort = require("serialport");

let port;

SerialPort.list()
  .then((ports) => {
    console.log("Available serial ports:", ports);
    const usbPorts = ports.filter((portInfo) => /usb/i.test(portInfo.path)); // RegEx considers case insensitive USB names
    if (usbPorts.length > 0) {
      port = new SerialPort(usbPorts[0].path);
      console.log("USB serial port selected:", usbPorts[0].path);
    } else {
      console.log("No USB serial ports available");
    }
  })
  .catch((err) => {
    console.log("Error listing serial ports:", err);
  });

const sendData = (data) => {
  if (!port) {
    console.log("No USB serial port is available");
    return;
  }

  port.write(data, (err) => {
    if (err) {
      console.log("Error sending data:", err);
    } else {
      console.log("Data sent successfully");
    }
  });
};

module.exports = sendData;
