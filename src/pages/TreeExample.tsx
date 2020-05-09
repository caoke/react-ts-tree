import * as React from 'react';
// import { useEffect } from "react";

import Tree from '../components/tree/Tree';


const sourceData = [
  {
    text: '菜单1',value: '1',
    children: [
        {
          text: '菜单1.1', value: '1.1',
          children: [
              {
                text: '菜单1.1.1', value: '1.1.1' , 
                children: [
                  {
                    text: '菜单1.1.1.1', value: '1.1.1.1', 
                    children: [
                      {text: '菜单1.1.1.1.1', value: '1.1.1.1.1'},
                      {
                        text: '菜单1.1.1.1.2', value: '1.1.1.1.2',
                        children: [
                          {text: '菜单1.1.1.1.1.1', value: '1.1.1.1.1.1',}
                        ]
                      },
                    ]
                  }
                ]
              },
              { text: '菜单1.1.2', value: '1.1.2' }
          ]
        },
        {text: '菜单1.2', value: '1.2'},
    ]
  },
  {
    text: '菜单2',value: '2',
    children: [
      {text: '菜单2.1', value: '2.1'},
      {text: '菜单2.2', value: '2.2'}
    ]
  }
];

for(let i=3; i<=2000; i++) {
  sourceData.push({
    text:  `菜单${i}`,
    value: `${i}`,
    children: [
      {
        text: `菜单${i}.1`,
        value: `${i}.1`,
        children: [
          {
            text: `菜单${i}.1.1`,
            value: `${i}.1.1`
          },
          {
            text: `菜单${i}.1.2`,
            value: `${i}.1.2`
          }
        ]
      }
    ]});
}

const TreeExample: React.FC = () => {
// const [selectValues, setSelectValues] = useState<string[]>(['']);
// const onChange = (values: string[]) => {
//   setSelectValues(values);
// };

// 相当于 componentDidMount 和 componentDidUpdate:

return (
  <div >
    <Tree sourceData={sourceData} height={26} lazy={false}/>
  </div>
 );
};

export default TreeExample;