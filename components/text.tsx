import {
  Text as RnText,
  TextProps,
  StyleSheet,
  useColorScheme,
} from "react-native";

export const Text = (props: TextProps) => {
  let colorScheme = useColorScheme();
  return (
    <RnText
      style={[styles.text, styles[colorScheme], props.style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: "300",
    textAlign: "center",
  },
  dark: {
    color: "#eef",
  },
  light: {
    color: "#112",
  },
});
