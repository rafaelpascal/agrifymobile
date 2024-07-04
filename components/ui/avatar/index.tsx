import { createAvatarUrl } from "../../../utils/helpers";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

interface AvatarProps {
  name: string;
  children?: React.ReactNode;
  img?: string;
  avatarClassName?: string;
  textClassName?: string;
  wrapperClassName?: string;
  avatarTextContainerClassName?: string;
  rounded?: boolean;
  onPress: () => void;
}

export const Avatar = (props: AvatarProps) => {
  const {
    img,
    name,
    children,
    avatarClassName,
    textClassName,
    wrapperClassName,
    avatarTextContainerClassName,
    rounded,
    onPress,
  } = props;

  const avatarUrl = createAvatarUrl({
    avatarUrl: name,
    additionalParams: {
      background: "A2A1A833",
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper}>
      <View className="flex justify-end items-end flex-row">
        {img ? (
          <Image
            source={{ uri: img }}
            className="w-[40px] h-[40px] rounded-full"
          />
        ) : (
          <ImageBackground
            source={{ uri: avatarUrl }}
            className="w-[40px] h-[40px] rounded-full"
            imageStyle={rounded && styles.roundedImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  roundedWrapper: {
    borderRadius: 50,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  roundedImage: {
    borderRadius: 50,
  },
  textContainer: {
    marginLeft: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
