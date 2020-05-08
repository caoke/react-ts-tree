import * as React from 'react';
import ReactDOM from 'react-dom';
import Tree from "./tree/tree";
import {useState} from "react";
const sourceData = [
  {
    text: '焦女士1',
    value: '1',
    children: [
      {
        text: '焦女士1.1', value: '1.1',
        children: [
          { text: '焦女士1.1.1', value: '1.1.1' , children: [
              {text: '焦女士1.1.1.1', value: '1.1.1.1', children: [
                  {text: '焦女士1.1.1.1.1', value: '1.1.1.1.1'}
                ]}
            ]},
          { text: '焦女士1.1.2', value: '1.1.2' }
        ]
      },
      {text: '焦女士1.2', value: '1.2'},
    ]
  },
  {
    text: '焦女士2',
    value: '2',
    children: [
      {text: '焦女士2.1', value: '2.1'},
      {text: '焦女士2.2', value: '2.2'},
    ]
  }
]

for(let i = 3; i< 100; i++){
  sourceData.push(
    {
      text: `菜单${i}`,
      value: `${i}`,
      children: []
    }
  )
}

const TreeExample: React.FC = () => {
  const [selectValues, setSelectValues] = useState<string[]>([''])
  const onChange = (values: string[]) => {
    setSelectValues(values)
  }
  return (
    <div>
      <Tree sourceData={sourceData} onChange={onChange} selected={selectValues} height={22}/>
    </div>
  )
}
ReactDOM.render(
  <React.StrictMode>
    <TreeExample/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA