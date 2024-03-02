export let serial_port;

let userAgent = navigator.userAgent;

if (/Win/i.test(userAgent)) {
  // Windows
  serial_port = "COM1"; // default serial port for Windows
} else if (/Mac/i.test(userAgent)) {
  // Mac OS
  serial_port = "/dev/tty.USB0"; // default serial port for Mac
} else if (/Linux/i.test(userAgent)) {
  // Linux
  serial_port = "/dev/ttyS0"; // default serial port for Linux
} else {
  // Unknown OS
  console.log("Unknown operating system");
  serial_port = null;
}
