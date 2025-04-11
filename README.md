# 🥾 Trek Mate – A React Native Hiking Tracker App (Built with Expo)

Trek Mate is a mobile application built with **React Native** and **Expo**, designed to help hikers track their outdoor adventures with precision and ease.

Whether you're deep in the wilderness or just exploring local trails, **Trek Mate** logs your real-time GPS location, displays your path on an interactive map, shows a live compass, and—when internet fails—can even send your coordinates via SMS to a trusted contact.

---

## 📱 Features

- 🗺️ **Real-time Route Tracking** – Log and visualize your path on a live map using GPS.
- 🧭 **Built-in Compass** – Navigate with an on-screen compass to stay on course.
- 📡 **Offline Emergency SMS** – No internet? Automatically send your coordinates via SMS.
- 📓 **Hike History** – View and manage previous treks stored locally on your device.

---

## ⚙️ Project Setup

### 1. Prerequisites

Make sure the following are installed on your system:

- **Node.js** – Run JavaScript code outside the browser. [Download Node.js](https://nodejs.org/)
- **Git** – Clone the project. [Download Git](https://git-scm.com/)
- **Expo CLI** – Build and run your React Native app. Install globally:

## Clone the repository and install the dependencies:

git clone https://github.com/aaron12345678901/GpsTravelApp.git
cd trek-mate
npm install

## Install the necessary dependencies:

npm install

## Required Configuration Before Running

## Update Google Maps API Key

# You must provide your own Google Maps API key. Replace the placeholder key in app.json with your own:

"googleMaps": {
"apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
}

## Update Emergency Phone Number

# Set Your Phone Number for SMS

# In the file LocationTracker.js, locate the following function:

async function sendLocationViaSMS(loc) {
const isAvailable = await SMS.isAvailableAsync();
if (isAvailable) {
await SMS.sendSMSAsync(
["xxxxxxxxxxxxx"],
`Location: ${loc.coords.latitude}, ${loc.coords.longitude}, Time: ${new Date()}`
);
} else {
console.warn("SMS not available. Unable to send location.");
}
}

# Replace xxxxxxxxxxxxx with your desired phone number that should receive the location via SMS.

# To launch the app, start the development server with:

npm start

# Then scan the QR code using the Expo Go app on your mobile device.
