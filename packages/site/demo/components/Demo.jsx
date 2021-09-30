import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { transform } from '@babel/standalone';
import { Panel } from 'zson-mobile';
import enUS from 'zson/config-provider/locale/en_US';
import zhCN from 'zson/config-provider/locale/zh_CN';
import 'zson/style/entry';

export default ({ location, globalContext, children }) => {
  const containerId = `${parseInt(Math.random() * 1e9, 10).toString(36)}`;
  const document = children.match(/([^]*)\n?(```[^]+```)/);
  const title = String(document[1]);
  const containerRef = useRef();

  const renderSource = useCallback(() => {
    const source = document[2].match(/```(.*)\n?([^]+)```/);

    import('zson')
      .then((Element) => {
        const locale = {
          en_US: enUS,
          zh_CN: zhCN,
        };
        const args = ['context', 'React', 'ReactDOM', 'ZsonMobile', 'GlobalContext', 'Locale'];
        const argv = [this, React, ReactDOM, Element, globalContext, locale];
        return {
          args,
          argv,
        };
      })
      .then(({ args, argv }) => {
        const value = source[2]
          .replace(/import\s+\{\s+(.*)\s+\}\s+from\s+'react';/, 'const { $1 } = React;')
          .replace(/import\s+\{\s+(.*)\s+\}\s+from\s+'zson-mobile';/, 'const { $1 } = ZsonMobile;')
          .replace(
            /import\s+(.*)\s+from\s+'zson-mobile\/lib\/config-provider\/locale\/(.*)';/g,
            "const $1 = Locale['$2'];",
          )
          .replace(
            /ReactDOM.render\(\s?([^]+?)(,\s?mountNode\s?\))/g,
            `ReactDOM.render($1, document.getElementById('${containerId}'))`,
          )
          .replace(
            /ReactDOM.render\(\s?([^]+?)(,([\r\n])(\s)*mountNode,(\s+)?\))/g,
            `ReactDOM.render($1, document.getElementById('${containerId}'))`,
          );
        const { code } = transform(value, {
          presets: ['es2015', 'react'],
          plugins: ['proposal-class-properties'],
        });

        args.push(code);

        // eslint-disable-next-line
        new Function(...args)(...argv);
        // source[2] = value;
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          throw err;
        }
      });
  }, [containerId, document, globalContext]);
  useEffect(() => {
    const container = containerRef.current;
    renderSource();

    return function cleanup() {
      container && ReactDOM.unmountComponentAtNode(container);
    };
  }, [renderSource]);
  // const title = document[1]
  // Panel的例子特殊处理
  return location.pathname === '/panel' ? (
    <div id={containerId} ref={containerRef} />
  ) : (
    <Panel title={title}>
      <div id={containerId} ref={containerRef} />
    </Panel>
  );
};
