let port;

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
    console.log("Selected serial port:", port.getInfo());
    await port.open({ baudRate: 115200 });
    console.log("Serial port opened");
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
