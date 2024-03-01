let port;

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
    const usbPorts = ports.filter((portInfo) => /usb/i.test(portInfo.path));
    if (usbPorts.length > 0) {
      port = usbPorts[0];
      console.log("USB serial port selected:", usbPorts[0].path);
    } else {
      alert("No USB serial ports available");
      console.log("No USB serial ports available");
    }
  } catch (err) {
    console.log("Error listing serial ports:", err);
  }
};

export const sendData = async (data) => {
  if (!port) {
    console.log("No USB serial port is available");
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
