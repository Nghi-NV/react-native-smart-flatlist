
# react-native-smart-flatlist

## Getting started

`$ npm install react-native-smart-flatlist --save`

### Mostly automatic installation

`$ react-native link react-native-smart-flatlist`

`$ react-native link react-native-interactable`

### Use

```
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { SmartFlatlist } from 'react-native-smart-flatlist'

const DATA = [
  { title: 'Count 1' },
  { title: 'Count 2' },
  { title: 'Count 3' },
  { title: 'Count 4' },
  { title: 'Count 5' },
  { title: 'Count 6' },
  { title: 'Count 7' },
  { title: 'Count 8' }
]

class Example extends PureComponent {
  renderLeft = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ width: 36, height: 36 }} source={require('../assets/icon-check.png')} />
        <Text style={{ color: 'white', fontSize: 17, fontWeight: '500' }}>Check</Text>
      </View>
    )
  }

  renderRight = () => {
    return (
      <Image style={{ width: 40, height: 40 }} source={require('../assets/icon-trash.png')} />
    )
  }

  renderRight2 = () => {
    return (
      <Image style={{ width: 40, height: 40 }} source={require('../assets/icon-clock.png')} />
    )
  }

  renderRow = (item) => {
    return (
      <View style={{ height: 100, backgroundColor: 'orange', justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          {item.title}
        </Text>
      </View>
    )
  }

  render() {
    const leftButton = [
      {
        component: this.renderLeft,
        onPress: () => console.log('SmartSwipeRow'),
        backgroundColor: '#2f9a5d'
      },
      {
        component: this.renderRight,
        onPress: () => console.log('SmartSwipeRow'),
        backgroundColor: 'violet'
      },
    ]

    const rightButton = [
      {
        component: this.renderRight,
        onPress: () => console.log('SmartSwipeRow'),
        backgroundColor: 'red'
      },
      {
        component: this.renderRight2,
        onPress: () => console.log('SmartSwipeRow'),
        backgroundColor: 'green'
      },
    ]

    return (
      <View style={{ flex: 1, backgroundColor: 'skyblue' }}>
        <SmartFlatlist
          data={DATA}
          left={leftButton}
          right={rightButton}
          renderRow={this.renderRow}
          heightRow={100}
          renderSeparator={() => <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: 'grey' }} />}
        />
      </View>
    );
  }
}

export default Example
```

  