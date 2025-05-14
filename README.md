# AgriSense

**AgriSense** is a smart mobile application designed for hydroponic growers to monitor Pechay (Brassica rapa) growth and detect pest infestations using machine learning and computer vision. Integrated with Raspberry Pi for automated scanning, the app provides real-time insights to help optimize crop management in hydroponic greenhouses.

---

## Features

- Predict Pechay growth stages: Seedling, Vegetative, Mature  
- Detect pest infestations early through image analysis  
- Real-time monitoring with Raspberry Pi integration  
- User-friendly interface available on Android and iOS  
- Cloud-based data storage for historical tracking and analytics

---

## Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/agrisense.git
   cd agrisense

2. Install dependencies:
   ```bash
   npm install

3. Configure Firebase credentials in `/lib/firebase.js` or `/lib/firebase.ts` (depending on your setup).

4. Run the app (Android or iOS):
   ```bash
   npm run android
   # or
   npm run ios

## Usage

- Connect the Raspberry Pi camera module for automatic plant scanning.  
- Launch the app to view growth stage predictions and pest alerts.  
- Review historical data and insights from the dashboard.

## Technologies Used

- React Native (Android & iOS)  
- TensorFlow / Machine Learning models for image analysis  
- Raspberry Pi for plant image capture  
- Firebase (Storage and/or Realtime Database)  
- JavaScript / TypeScript

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## Team

Developed by:  
- Patrick Joseph R. Magbuhos — [patrickjosephmagbuhos@gmail.com](mailto:patrickjosephmagbuhos@gmail.com)  
- Kyla N. Marjes — [kylamarjes11@gmail.com](mailto:kylamarjes11@gmail.com)  
- Adrian A. Arcega — [adrianarcega18@gmail.com](mailto:adrianarcega18@gmail.com)  
- Ma. Angelica P. Sevilla — [angelmaesevilla@gmail.com](mailto:angelmaesevilla@gmail.com)

## License

[Specify your license here, e.g., MIT License]

## Contact

For inquiries or support, contact any of the team members listed above.
