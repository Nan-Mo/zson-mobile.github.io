export default (compName) => `# ${compName} 组件名



## 基本用法
\`\`\`jsx
import { ${compName} } from 'zson-mobile';

ReactDOM.render(
  <>
    <${compName} />
  </>
, mountNode);
\`\`\`



## 用法二
\`\`\`jsx
import { ${compName} } from 'zson-mobile';

class Demo extends React.Component {
  state = {
  }

  render() {
    return <${compName} />;
  }
}

ReactDOM.render(<Demo />, mountNode);
\`\`\`



## API

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
`;
