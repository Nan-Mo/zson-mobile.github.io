import React from 'react';
import type { ReactElement } from 'react';
import { mount, shallow } from 'enzyme';

describe('Loading', () => {
  let Loading: typeof import('../index').default;
  let ReactDOM: typeof import('react-dom');
  let renderSpy: jest.SpyInstance;
  let unmountNodeSpy: jest.SpyInstance;
  let createElementSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.resetModules();
    ReactDOM = require('react-dom');
    renderSpy = jest.spyOn(ReactDOM, 'render');
    createElementSpy = jest.spyOn(document, 'createElement');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Loading = require('../index').default;

    unmountNodeSpy = jest.spyOn(Loading, 'unmountNode');
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    const LoadingContainer = document.body.querySelector('.zs-loading-container');
    if (LoadingContainer) {
      document.body.removeChild(LoadingContainer as Node);
    }
  });
  describe('snapshot', () => {
    it('renders correctly', () => {
      const wrapper = mount(<Loading visible>foo</Loading>);
      expect(wrapper).toMatchSnapshot();
    });

    it('visible change true', () => {
      const wrapper = mount(<Loading />);
      wrapper.setProps({ visible: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('visible change false', () => {
      const afterClose = jest.fn();
      const wrapper = mount(<Loading visible afterClose={afterClose} />);
      wrapper.setProps({ visible: false });
      wrapper.simulate('transitionEnd');
      wrapper.simulate('animationEnd');
      expect(wrapper.state('visible')).toEqual(false);
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('static function pass params', () => {
    jest.useFakeTimers();
    Loading.show({
      content: <div>loading...</div>,
    });
    jest.runAllTimers();
    const LoadingContainer = document.getElementsByClassName('zs-loading-container');
    expect(LoadingContainer.length).toEqual(1);
  });

  it('should create zson loading DOM element inside document body and render Loading component inside zson loading DOM element', () => {
    Loading.show();
    expect(unmountNodeSpy).toBeCalledTimes(1);
    expect(createElementSpy).toBeCalledWith('div');
    const zsonLoading = document.body.querySelector('.zs-loading-container');
    expect(zsonLoading).toBeTruthy();
    const LoadingReactElement = renderSpy.mock.calls[0][0] as unknown as ReactElement;
    expect(LoadingReactElement.props).toEqual({
      prefixCls: 'zs-loading',
      mask: true,
      visible: true,
      mountContainer: false,
    });
    expect(renderSpy).toBeCalledWith(LoadingReactElement, zsonLoading);
  });

  it('should create zson loading DOM element inside mount container and render Loading component inside zson loading DOM element', () => {
    const mountContainer = document.createElement('div');
    Loading.show({ mountContainer, className: 'test-zs-loading' });
    expect(unmountNodeSpy).toBeCalledTimes(1);
    expect(createElementSpy).toBeCalledWith('div');
    const zsonLoading = mountContainer.querySelector('.test-zs-loading');
    expect(zsonLoading).toBeTruthy();
    const LoadingReactElement = renderSpy.mock.calls[0][0] as unknown as ReactElement;
    expect(LoadingReactElement.props).toEqual({
      prefixCls: 'zs-loading',
      mask: true,
      className: 'test-zs-loading',
      visible: true,
      mountContainer: false,
    });
    expect(renderSpy).toBeCalledWith(LoadingReactElement, zsonLoading);
  });

  it('should create hideHelper static method on Loading component class', () => {
    Loading.show();
    expect(Loading.hideHelper).toBeDefined();
  });

  it('should hide loading', () => {
    Loading.show();
    const hideHelperSpy = jest.spyOn(Loading, 'hideHelper');
    let loadingReactElement = renderSpy.mock.calls[0][0] as unknown as ReactElement;
    expect(loadingReactElement.props.visible).toBeTruthy();
    Loading.hide();
    expect(hideHelperSpy).toBeCalledTimes(1);
    loadingReactElement = renderSpy.mock.calls[1][0] as unknown as ReactElement;
    expect(loadingReactElement.props.visible).toBeFalsy();
  });

  it('should do nothing if zson loading has been removed when hide it', () => {
    Loading.show();
    const hideHelperSpy = jest.spyOn(Loading, 'hideHelper');
    Loading.zsonLoading = null;
    Loading.hide();
    expect(hideHelperSpy).not.toBeCalled();
  });

  it('should unmount zson loading from the DOM tree', () => {
    expect.assertions(5);
    Loading.show();
    let zsonLoading = document.body.querySelector('.zs-loading-container');
    expect(zsonLoading).toBeTruthy();
    if (zsonLoading) {
      const loadingReactElement = zsonLoading.firstChild;
      expect(loadingReactElement).toBeTruthy();
      Loading.unmountNode();
      expect(zsonLoading.firstChild).toBeFalsy();
      zsonLoading = document.body.querySelector('.zs-loading-container');
      expect(zsonLoading).toBeFalsy();
      expect(Loading.zsonLoading).toBeNull();
    }
  });

  it('should auto close loading if stay time greater than 0', () => {
    jest.useFakeTimers();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const wrapper = shallow(<Loading visible stayTime={100} />);
    expect(wrapper.state('visible')).toBeTruthy();
    expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), 100);
    jest.advanceTimersByTime(100);
    expect(wrapper.state('visible')).toBeFalsy();
    expect(clearTimeoutSpy).toBeCalledWith(expect.any(Number));
  });

  it('should call after close handler and remove zson loading element from the DOM tree', () => {
    const mAfterClose = jest.fn();
    Loading.show();
    const wrapper = shallow(<Loading afterClose={mAfterClose} />);
    let zsonLoading = document.body.querySelector('.zs-loading-container');
    expect(zsonLoading).toBeTruthy();
    wrapper.invoke('afterClose')();
    zsonLoading = document.body.querySelector('.zs-loading-container');
    expect(zsonLoading).toBeFalsy();
    expect(Loading.zsonLoading).toBeNull();
    expect(mAfterClose).toBeCalledTimes(1);
  });

  it('should do nothing after close if someone force remove the zson loading dom', () => {
    Loading.show();
    Loading.zsonLoading = null;
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
    const wrapper = shallow(<Loading />);
    wrapper.invoke('afterClose')();
    expect(removeChildSpy).not.toBeCalled();
  });

  it('should show loading if nextProps.visible is true', () => {
    const wrapper = shallow(<Loading visible={false} />);
    expect(wrapper.state('visible')).toBeFalsy();
    wrapper.setProps({ visible: true });
    expect(wrapper.state('visible')).toBeTruthy();
  });

  it('should hide loading if nextProps.visible is false', () => {
    const wrapper = shallow(<Loading visible />);
    expect(wrapper.state('visible')).toBeTruthy();
    wrapper.setProps({ visible: false });
    expect(wrapper.state('visible')).toBeFalsy();
  });

  it('should render again if zson loading alreay exists', () => {
    jest.spyOn(Loading, 'unmountNode').mockImplementation(() => 'assume this method broken');
    renderSpy.mockImplementation();
    Loading.show();
    expect(renderSpy).toBeCalledTimes(1);
    Loading.show();
    expect(renderSpy).toBeCalledTimes(2);
    expect(createElementSpy).toBeCalledTimes(1);
  });
});
