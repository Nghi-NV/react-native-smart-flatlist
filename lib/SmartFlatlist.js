import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  ViewPropTypes
} from 'react-native';
import SmartSwipeRow from './SmartSwipeRow';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

class SmartFlatlist extends PureComponent {
  constructor(props) {
    super(props);
    this._rows = {};
    this.openCellId = null;
  }

  renderItem = ({ item, index }) => {
    let {
      damping,
      tension,
      left,
      right,
      buttonWidth,
      style,
      rowContainerStyle,
      onPressRow,
      renderSeparator,
      ...otherProps
    } = this.props;

    return (
      <SmartSwipeRow
        {...otherProps}
        damping={damping}
        tension={tension}
        left={this.props.left}
        right={this.props.right}
        buttonWidth={buttonWidth}
        style={style}
        rowContainerStyle={rowContainerStyle}
        onPressRow={onPressRow}
        renderSeparator={renderSeparator}
        ref={row => (this._rows[`smartSwipe${index}`] = row)}
        onDrag={this._onDrag.bind(this, index)}
      >
        {this.props.renderRow && this.props.renderRow(item, index)}
      </SmartSwipeRow>
    )
  }

  render() {
    let {
      data,
      heightRow
    } = this.props;

    return (
      <View style={styles.container}>
        
        <FlatList
          data={data}
          keyExtractor={(item, id) => String(id)}
          renderItem={this.renderItem}
          onScroll={e => this.onScroll(e)}
          getItemLayout={(data, index) => (
            { length: data.length, offset: heightRow * index, index }
          )}
        />
      </View>
    );
  }

  closeRow() {
    if (this._rows[this.openCellId].row) {
      this._rows[this.openCellId].row.snapTo({ index: 1 });
    }
  }

  _onDrag(index) {
    if (this.openCellId == null) {
      this.openCellId = `smartSwipe${index}`
    } else {
      if (this.openCellId && this.openCellId !== `smartSwipe${index}`) {
        this.closeRow()
        this.openCellId = `smartSwipe${index}`
      }
    }
  }

  onScroll(event) {
    const { y } = event.nativeEvent.contentOffset;
    console.log('onScroll', y)
    if (this.openCellId) {
      this.closeRow();
      this.openCellId = null;
    }
  }
}

SmartFlatlist.defaultProps = {
  damping: 1 - 0.7,
  tension: 300,
  data: [],
  left: [],
  right: [],
  buttonWidth: 75,
  onPressRow: null,
  style: {},
  rowContainerStyle: {},
  autoClose: true,
  renderSeparator: null,
  heightRow: 80
}

SmartFlatlist.propTypes = {
  damping: PropTypes.number,
  tension: PropTypes.number,
  data: PropTypes.array,
  renderRow: PropTypes.func,
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
  buttonWidth: PropTypes.number,
  onPressRow: PropTypes.func,
  style: ViewPropTypes.style,
  rowContainerStyle: ViewPropTypes.style,
  autoClose: PropTypes.bool,
  renderSeparator: PropTypes.func,
  heightRow: PropTypes.number
}

export default SmartFlatlist;
