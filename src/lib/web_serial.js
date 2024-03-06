import { getPorts, sendValue } from "./backend_serial";

let port;

// Create dialog for user
export const showPorts = async () => {
  try {
    if (!("serial" in navigator)) {
      // Firefox
      const portPicker = document.getElementById("portPicker");
      document.getElementById("portPickerSelect").classList.remove("hidden");
      portPicker.classList.remove("hidden");
      const ports = await getPorts();
      console.log("Available serial ports:", ports);
      ports.forEach((port, index) => {
        const option = document.createElement("option");
        option.value = port.path;
        option.text = port.path;
        portPicker.appendChild(option);
      });
    } else {
      // Chromium
      // @ts-ignore
      port = await navigator.serial.requestPort();
      console.log("Selected serial port:", port.getInfo());
      await port.open({ baudRate: 115200 });
      console.log("Serial port opened");
      document.getElementById("serialPortMenu").classList.add("hidden");
    }
  } catch (err) {
    console.log("Error selecting serial port:", err);
  }
};

// Firefox selected port
export const selectPort = (selectedPort) => (port = selectedPort);

export const sendData = async (data) => {
  if (!port) {
    console.log("No serial port is available");
    return;
  }

  if (!("serial" in navigator)) {
    // firefox, use ws
    sendValue(data);
  } else {
    // chromium
    try {
      const writer = port.writable.getWriter();
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(data));
      writer.releaseLock();
      console.log("Data sent successfully", data);
    } catch (err) {
      console.log("Error sending data:", err);
    }
  }
};
