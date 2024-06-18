import React, { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isNewpicture, setisNewpicture] = useState(false);
  const [isFirstcapture, setFirstCapture] = useState(false);
  const [isreview, setPreview] = useState(false);
  const cameraRef = useRef<any>(null);
  const [isViewImage, setIsViewImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null | any>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const captureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImages([...capturedImages, photo.uri]);
      // setisNewpicture(false);
    }
  };

  const handleImageRemove = (index: number) => {
    setCapturedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsViewImage(true);
  };

  const closeImageView = () => {
    setSelectedImage(null);
    setIsViewImage(false);
  };

  const handlePreviewPage = () => {
    setPreview(true);
  };
  return (
    <View className="pb-[10%] h-full">
      <View className="w-full h-full">
        {isFirstcapture ? (
          <View className="flex flex-col w-full h-[400px]">
            <>
              {isNewpicture && capturedImages.length > 0 ? (
                <View className="w-full">
                  {isViewImage ? (
                    <View>
                      <ImageBackground
                        source={{ uri: selectedImage }}
                        className="w-full h-[400px] rounded-lg overflow-hidden relative z-0"
                      >
                        <TouchableOpacity
                          onPress={closeImageView}
                          className="absolute right-0"
                        >
                          <MaterialIcons
                            name="highlight-remove"
                            size={24}
                            color="white"
                          />
                        </TouchableOpacity>
                      </ImageBackground>
                    </View>
                  ) : (
                    <CameraView
                      className="h-[400px]"
                      facing={facing}
                      ref={cameraRef}
                    >
                      <View className="relative h-full">
                        <TouchableOpacity
                          className="absolute right-4 top-2"
                          onPress={toggleCameraFacing}
                        >
                          <MaterialIcons
                            name="flip-camera-ios"
                            size={44}
                            color="white"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="absolute bottom-0 left-[40%]"
                          onPress={captureImage}
                        >
                          <MaterialCommunityIcons
                            name="camera-iris"
                            size={54}
                            color="white"
                          />
                        </TouchableOpacity>
                      </View>
                    </CameraView>
                  )}
                  <View className="flex flex-row rounded-lg justify-start items-center mt-4">
                    {capturedImages.map((image, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleImageClick(image)}
                      >
                        <ImageBackground
                          key={index}
                          source={{ uri: image }}
                          className="w-[60px] h-[60px] ml-2 rounded-lg overflow-hidden relative z-0"
                        >
                          <TouchableOpacity
                            onPress={() => handleImageRemove(index)}
                            className="absolute right-0"
                          >
                            <MaterialIcons
                              name="highlight-remove"
                              size={24}
                              color="white"
                            />
                          </TouchableOpacity>
                        </ImageBackground>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <>
                  {capturedImages.length > 0 ? (
                    <View className="flex flex-col w-full rounded-lg justify-center items-center">
                      <View className="relative rounded-lg w-full h-full pt-8">
                        {capturedImages.map((image, index) => (
                          <ImageBackground
                            key={index}
                            source={{ uri: image }}
                            className="w-full h-full rounded-lg z-0 overflow-hidden "
                          >
                            <TouchableOpacity
                              onPress={() => handleImageRemove(index)}
                              className="absolute right-2 top-2 z-20"
                            >
                              <MaterialIcons
                                name="cancel"
                                size={34}
                                color="white"
                              />
                            </TouchableOpacity>
                          </ImageBackground>
                        ))}
                      </View>
                      <TouchableOpacity
                        className="w-full h-[44px] border-[1px] border-dashed border-[#6D9EFF] rounded-[4px] flex justify-center items-center flex-row mt-4"
                        onPress={() => setisNewpicture(true)}
                      >
                        <FontAwesome6 name="plus" size={24} color="#6D9EFF" />
                        <Text className="text-[14px] text-[#6D9EFF] ml-2 font-DMSans font-bold">
                          Add another image
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="flex flex-1 justify-center">
                      <CameraView
                        className="h-[400px]"
                        facing={facing}
                        ref={cameraRef}
                      >
                        <View className="relative h-full">
                          <TouchableOpacity
                            className="absolute right-4 top-2"
                            onPress={toggleCameraFacing}
                          >
                            <MaterialIcons
                              name="flip-camera-ios"
                              size={44}
                              color="white"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="absolute bottom-0 left-[40%]"
                            onPress={captureImage}
                          >
                            <MaterialCommunityIcons
                              name="camera-iris"
                              size={54}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                      </CameraView>
                    </View>
                  )}
                </>
              )}
            </>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              className="w-full h-[69px] bg-[#6D9EFF]/10 rounded-[4px] flex justify-center items-center flex-row"
              onPress={() => setFirstCapture(true)}
            >
              <MaterialIcons name="photo-camera" size={30} color="#6D9EFF" />
              <Text className="text-[13px] text-[#6D9EFF] ml-1 font-DMSans font-bold">
                Take a photo or Upload
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>
        {capturedImages.length === 0 ? (
          <TouchableOpacity className="h-[50px] w-[100%] bg-[#E2E2E2] rounded-[4px] flex justify-center items-center">
            <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
              Save
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handlePreviewPage}
            className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
          >
            <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
              Save
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 10,
    flexGrow: 0,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
