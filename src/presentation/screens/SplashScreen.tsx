import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import ClipboardIcon from '../../../assets/clipboard.svg';
import { lightColors } from '../theme/colors';

export function SplashScreen() {
  const { width } = useWindowDimensions();
  const iconSize = width * 0.42;

  return (
    <View style={styles.container}>
      <ClipboardIcon width={iconSize} height={iconSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
