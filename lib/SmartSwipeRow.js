import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, ViewPropTypes, Animated } from 'react-native';
import Interactable from 'react-native-interactable';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden'
  },
  rowContainer: {
    left: 0,
    right: 0
  },
  viewContainerButton: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  leftButtonStyle: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#2f9a5d',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightButtonStyle: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#f8a024',
    justifyContent: 'center'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class SmartSwipeRow extends PureComponent {
  constructor(props) {
    super(props);
    this._deltaX = new Animated.Value(0);
    this.isMoving = false;
    this.position = 1;

    this.state = {
      contentWidth: 0,
      contentHeight: 0
    }
  }

  _renderButtons = (buttons, isVisible, positon) => {
    if (buttons && isVisible) {
      return (
        <View>
          {buttons.map(positon === 'left' ? this._renderButtonLeft : this._renderButtonRight)}
        </View>
      );
    } else {
      return <View />
    }
  }

  _renderButtonLeft = (btn, id) => {
    return (
      <Animated.View key={`left${id}`} style={
        [styles.leftButtonStyle,
        btn.styleButton ? btn.styleButton : {},
        {
          right: this.state.contentWidth - this.props.buttonWidth * (this.props.left.length - id),
          width: this.state.contentWidth,
          height: this.state.contentHeight,
          backgroundColor: btn.backgroundColor,
        },
        {
          transform: [{
            translateX: this._deltaX.interpolate({
              inputRange: [0, this.props.buttonWidth * this.props.right.length],
              outputRange: [-this.props.buttonWidth * (this.props.left.length - id), 0]
            })
          }]
        }
        ]}>
        <TouchableOpacity
          onPress={() => {
            this.props.autoClose && this._closeRow()
            btn.onPress()
          }}
          style={[styles.button, { width: this.props.buttonWidth, height: this.state.contentHeight }]}
        >
          {btn.component()}
        </TouchableOpacity>
      </Animated.View>
    )
  }

  _renderButtonRight = (btn, id) => {
    return (
      <Animated.View key={`right${id}`} style={
        [styles.rightButtonStyle,
        btn.styleButton ? btn.styleButton : {},
        {
          left: this.state.contentWidth - this.props.buttonWidth * (this.props.right.length - id),
          width: this.state.contentWidth,
          height: this.state.contentHeight,
          backgroundColor: btn.backgroundColor
        },
        {
          transform: [{
            translateX: this._deltaX.interpolate({
              inputRange: [-this.props.buttonWidth * this.props.right.length, 0],
              outputRange: [0, this.props.buttonWidth * (this.props.right.length - id)]
            })
          }]
        }
        ]}>
        <TouchableOpacity
          onPress={() => {
            this.props.autoClose && this._closeRow()
            btn.onPress()
          }}
          style={[styles.button, { width: this.props.buttonWidth, height: this.state.contentHeight }]}
        >
          {btn.component()}
        </TouchableOpacity>
      </Animated.View>
    )
  }

  render() {
    let {
      damping,
      tension,
      left,
      right,
      buttonWidth,
      style,
      rowContainerStyle,
      onPressRow,
      renderSeparator
    } = this.props;
    let { contentWidth, contentHeight } = this.state;

    const ComponentViewRow = onPressRow ? TouchableOpacity : View
    const isLeftVisible = left.length > 0
    const isRightVisible = right.length > 0
    const hasButton = isLeftVisible || isRightVisible

    return (
      <View ref={refs => this._root = refs} style={[styles.container, style]}>
        {
          hasButton ? (
            <View style={[styles.viewContainerButton, { height: contentHeight }]} pointerEvents='box-none'>
              {this._renderButtons(left, isLeftVisible, 'left')}
              {this._renderButtons(right, isRightVisible, 'right')}
            </View>
          ) : null
        }

        <Interactable.View
          horizontalOnly={true}
          ref={refs => this.row = refs}
          onSnap={this.onSnap.bind(this)}
          onDrag={this.onDrag.bind(this)}
          onStop={this.onStopMoving.bind(this)}
          snapPoints={hasButton ? [
            left.length > 0 ? { x: buttonWidth * left.length, damping: 1 - damping, tension } : {},
            { x: 0, damping: 1 - damping, tension },
            right.length > 0 ? { x: -buttonWidth * right.length, damping: 1 - damping, tension } : {}
          ] : []}
          boundaries={{ left: right.length > 0 ? -contentWidth : 0, right: left.length > 0 ? contentWidth : 0, bounce: 0 }}
          dragToss={0.1}
          dragEnabled={hasButton}
          animatedValueX={this._deltaX}
          animatedNativeDriver={true}
        >
          <ComponentViewRow
            style={[styles.rowContainer, rowContainerStyle]}
            onPress={this._onRowPress.bind(this)}
            onLayout={this._onLayout}
            activeOpacity={0.8}
          >
            {this.props.children}
          </ComponentViewRow>
        </Interactable.View>
        {
          renderSeparator ? renderSeparator() : <View/>
        }
      </View>
    );
  }

  _onLayout = (event) => {
    var { width, height } = event.nativeEvent.layout;
    this.setState({
      contentWidth: width,
      contentHeight: height
    });
  }

  _closeRow() {
    this.row.snapTo({ index: 1 })
  }

  _onRowPress() {
    this.props.onPressRow && this.props.onPressRow()

    if (!this.isMoving && this.position !== 1) {
      this._closeRow()
    }
  }

  onSnap({ nativeEvent }) {
    const { index } = nativeEvent;
    this.props.onSnap && this.props.onSnap(index)
    this.position = index;
  }

  onDrag({ nativeEvent }) {
    const { state, x } = nativeEvent;
    if (state === 'start') {
      this.isMoving = true;
    }

    if (state === 'end') {
      if (this.props.left.length > 0 && (x > (this.props.left.length * this.props.buttonWidth / 2))) {
        this.props.onDrag && this.props.onDrag()
      }

      if (this.props.right.length > 0 && (x < -(this.props.right.length * this.props.buttonWidth / 2))) {
        this.props.onDrag && this.props.onDrag()
      }
    }
  }

  onStopMoving() {
    this.isMoving = false;
    this.props.onStop && this.props.onStop()
  }
}

SmartSwipeRow.defaultProps = {
  damping: 1 - 0.7,
  tension: 300,
  left: [],
  right: [],
  buttonWidth: 75,
  onPressRow: null,
  style: {},
  rowContainerStyle: {},
  autoClose: true,
  renderSeparator: null
}

SmartSwipeRow.propTypes = {
  damping: PropTypes.number,
  tension: PropTypes.number,
  left: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.func,
    onPress: PropTypes.func,
    backgroundColor: PropTypes.string,
    styleButton: ViewPropTypes.style
  })),
  right: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.func,
    onPress: PropTypes.func,
    backgroundColor: PropTypes.string,
    styleButton: ViewPropTypes.style
  })),
  onDrag: PropTypes.func,
  onSnap: PropTypes.func,
  children: PropTypes.node.isRequired,
  buttonWidth: PropTypes.number,
  onPressRow: PropTypes.func,
  style: ViewPropTypes.style,
  rowContainerStyle: ViewPropTypes.style,
  autoClose: PropTypes.bool,
  renderSeparator: PropTypes.func
}

export default SmartSwipeRow;
