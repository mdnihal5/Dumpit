import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';
import { Colors, Typography, SPACING } from '../styles';

const Divider = ({
  text,
  direction = 'horizontal',
  thickness = 1,
  color = Colors.BORDER.LIGHT,
  style,
  textStyle,
  marginVertical = SPACING.MEDIUM,
  marginHorizontal = 0,
}) => {
  const baseStyle = direction === 'horizontal' 
    ? {
        height: thickness,
        width: '100%',
        marginVertical,
        marginHorizontal,
      } 
    : {
        width: thickness,
        height: '100%',
        marginHorizontal,
        marginVertical,
      };

  if (!text) {
    return (
      <View 
        style={[
          baseStyle, 
          { backgroundColor: color },
          style
        ]} 
      />
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          baseStyle, 
          { backgroundColor: color },
          styles.line, 
          direction === 'horizontal' ? styles.flexRow : styles.flexColumn
        ]} 
      />
      <Text style={[styles.text, textStyle]}>{text}</Text>
      <View 
        style={[
          baseStyle, 
          { backgroundColor: color },
          styles.line, 
          direction === 'horizontal' ? styles.flexRow : styles.flexColumn
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.MEDIUM,
  },
  flexRow: {
    flex: 1,
  },
  flexColumn: {
    flex: 1,
  },
  line: {
    backgroundColor: Colors.BORDER.LIGHT,
  },
  text: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
    marginHorizontal: SPACING.SMALL,
  },
});

export default Divider; 