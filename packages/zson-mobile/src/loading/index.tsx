import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import type PropsType from './PropsType';
import Popup from '../popup';
import { getMountContainer } from '../utils/dom';
import ActivityIndicator from '../activity-indicator';

export interface LoadingProps extends PropsType {
  prefixCls?: string;
  className?: string;
}

export default class Loading extends PureComponent<LoadingProps, {}> {
  static defaultProps: LoadingProps = {
    prefixCls: 'zs-loading',
    mask: true,
  };

  static zsonLoading: HTMLElement | null;

  private static loadingContainer: HTMLElement;

  static hideHelper: () => void;

  static show = (content?: LoadingProps) => {
    Loading.unmountNode();
    // TODO: after calling .unmountNode(), Loading.zsonLoading is null. Is this check necessary?
    if (!Loading.zsonLoading) {
      Loading.zsonLoading = document.createElement('div');
      Loading.zsonLoading.classList.add('za-loading-container');
      if (content && content.className) {
        Loading.zsonLoading.classList.add(content.className);
      }
      Loading.loadingContainer =
        content && content.mountContainer
          ? getMountContainer(content.mountContainer)
          : getMountContainer();
      Loading.loadingContainer.appendChild(Loading.zsonLoading);
    }
    const props: LoadingProps = {
      ...Loading.defaultProps,
      ...(content as LoadingProps),
      ...{ visible: true, mountContainer: false },
    };

    Loading.hideHelper = () => {
      ReactDOM.render(<Loading {...props} visible={false} />, Loading.zsonLoading);
    };
    ReactDOM.render(<Loading {...props} />, Loading.zsonLoading);
  };

  static hide = () => {
    if (Loading.zsonLoading) {
      Loading.hideHelper();
    }
  };

  static unmountNode = () => {
    const { zsonLoading } = Loading;
    if (zsonLoading) {
      ReactDOM.render(<></>, zsonLoading);
      Loading.loadingContainer.removeChild(zsonLoading);
      Loading.zsonLoading = null;
    }
  };

  private timer: ReturnType<typeof setTimeout>;

  state = {
    visible: this.props.visible,
  };

  componentDidMount() {
    this.autoClose();
  }

  componentDidUpdate(prevProps: LoadingProps) {
    const { visible } = this.props;
    if (prevProps.visible !== visible) {
      if (visible) {
        // eslint-disable-next-line
        this.setState({ visible: true });
        this.autoClose();
      } else {
        this._hide();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  afterClose = () => {
    const { afterClose } = this.props;
    if (Loading.zsonLoading) {
      ReactDOM.unmountComponentAtNode(Loading.zsonLoading);
      Loading.loadingContainer.removeChild(Loading.zsonLoading);
      Loading.zsonLoading = null;
    }

    if (typeof afterClose === 'function') {
      afterClose();
    }
  };

  _hide = () => {
    this.setState({
      visible: false,
    });
  };

  autoClose() {
    const { stayTime } = this.props;

    if (stayTime && stayTime > 0) {
      this.timer = setTimeout(() => {
        this._hide();
        clearTimeout(this.timer);
      }, stayTime);
    }
  }

  render() {
    const { prefixCls, content, stayTime, className, ...others } = this.props;
    const { visible } = this.state;
    return (
      <Popup
        direction="center"
        maskType="transparent"
        width="70%"
        {...others}
        visible={visible}
        afterClose={this.afterClose}
      >
        <div className={prefixCls}>
          <div className={`${prefixCls}__container`}>
            {content || <ActivityIndicator type="spinner" size="lg" />}
          </div>
        </div>
      </Popup>
    );
  }
}
