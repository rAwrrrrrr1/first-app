import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  upperRow: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: SIZES.xxLarge,
    width: SIZES.width - 44,
    zIndex: 999,
  },
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
  },
  details: {
    marginTop: -SIZES.large,
    backgroundColor: COLORS.lightWhite,
    width: SIZES.width,
    borderTopLeftRadius: SIZES.large,
    borderTopRightRadius: SIZES.large,
    position: "relative",
  },
  titleRow: {
    marginHorizontal: 20,
    paddingBottom: SIZES.small,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SIZES.width - 44,
    top: 20,
  },
  title: {
    fontFamily: "bold",
    fontSize: SIZES.large,
  },
  wrapper: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.large,
  },
  price: {
    padding: 10,
    fontFamily: "semiBold",
    fontSize: SIZES.medium,
    paddingHorizontal: 10,
  },
  desc: {
    padding: 20,
  },
  picker: {
    backgroundColor: COLORS.secondary,
    height: 40, // Adjust the height as needed
    width: SIZES.width - 44, // Takes full width
    borderColor: "gray", // Border color
    borderWidth: 1, // Border width
  },
  button: {
    position: "absolute",
    bottom: -180,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default styles;
