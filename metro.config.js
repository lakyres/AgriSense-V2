const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ✅ Add .cjs support just in case
config.resolver.sourceExts.push("cjs");

// ✅ Critical fix to prevent “Component auth not registered” bug
config.resolver.unstable_enablePackageExports = false;

// ✅ Keep NativeWind working
module.exports = withNativeWind(config, { input: "./global.css" });
