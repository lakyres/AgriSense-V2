import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import { getDetections } from "@/utils/getDetections";

export default function DetectionAlert() {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const lastDetectionId = useRef<string | null>(null);

  useEffect(() => {
    const checkData = async () => {
      const detections = await getDetections();
      if (!detections.length) return;

      const latestDetection = detections[detections.length - 1];

      if (lastDetectionId.current === latestDetection.id) {
        // Same data, no alert
        return;
      }

      // Example alert condition: light intensity
      if (
        latestDetection.environment.light_intensity_lux < 100 ||
        latestDetection.environment.light_intensity_lux > 1000
      ) {
        setAlertMessage(
          `Alert! Light intensity is ${latestDetection.environment.light_intensity_lux.toFixed(
            1
          )} lux`
        );
        setModalVisible(true);
        lastDetectionId.current = latestDetection.id;
      }
    };

    checkData();
    // No interval here — no auto polling
  }, []);

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{ marginBottom: 12 }}>{alertMessage}</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 25,
    borderRadius: 8,
    elevation: 5,
  },
});
