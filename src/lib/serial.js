import { serial_port } from "./SERIALPORT";

let port = serial_port;

// List available serial ports programmatically
export const listPorts = async () => {
  try {
    if (!("serial" in navigator)) {
      // The Web Serial API is not supported
      alert(
        "The Web Serial API is not supported in this browser. Try Chromium based browser."
      );
      return;
    }
    // The Web Serial API is supported, proceed with using it
    const ports = await navigator.serial.getPorts();
    console.log("Available serial ports:", ports);
    const usbPorts = ports.filter((portInfo) => /USB|COM/i.test(portInfo.path));
    if (usbPorts.length > 0) {
      port = usbPorts[0];
      console.log("serial port selected:", usbPorts[0].path);
    } else {
      alert("No serial ports available");
      console.log("No USB serial ports available");
    }
  } catch (err) {
    console.log("Error listing serial ports:", err);
  }
};

// Create dialog for user
export const showPorts = async () => {
  try {
    if (!("serial" in navigator)) {
      alert(
        "The Web Serial API is not supported in this browser. Try Chromium based browser."
      );
      return;
    }
    port = await navigator.serial.requestPort();
    console.log("Selected serial port:", port);
  } catch (err) {
    console.log("Error selecting serial port:", err);
  }
};

export const sendData = async (data) => {
  if (!port) {
    console.log("No serial port is available");
    return;
  }

  try {
    const writer = port.writable.getWriter();
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(data));
    writer.releaseLock();
    console.log("Data sent successfully", data);
  } catch (err) {
    console.log("Error sending data:", err);
  }
};

// Call listPorts when the module is loaded
listPorts();
