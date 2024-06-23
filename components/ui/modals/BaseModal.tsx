import React, { useEffect, useRef } from "react";
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

interface IBaseModal extends IChildren, IModalPropsType {
  isOpen: boolean;
  closeModal: () => void;
}

export const BaseModal = ({ children, isOpen, closeModal }: IBaseModal) => {
  const modalRef = useRef<View>(null);

  // useEffect(() => {
  //   const handleEscKey = (event: KeyboardEvent) => {
  //     if (event.key === "Escape" && isOpen) {
  //       closeModal();
  //     }
  //   };

  //   document.addEventListener("keydown", handleEscKey);

  //   return () => {
  //     document.removeEventListener("keydown", handleEscKey);
  //   };
  // }, [closeModal, isOpen]);

  return (
    <Modal
      transparent={true}
      visible={isOpen}
      onRequestClose={closeModal}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View ref={modalRef} style={styles.modal}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    maxHeight: 540,
    backgroundColor: "#fff", // Use your theme color here
    borderRadius: 20,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});
