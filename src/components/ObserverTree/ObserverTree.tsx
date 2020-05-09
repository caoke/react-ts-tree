import * as React from 'react';
import {  useState  } from 'react';
import '../tree/Tree.css';




interface SourceItem{
  text: string;
  value: string;
  children?:SourceItem[];
}

interface Prop{
  sourceData: SourceItem[];
}

const DeepTree: React.FC<{item: SourceItem, level: number}> = (props) => {
  const {item, level} = props;
  // 为每一项设置状态 默认折叠
  const [fold,setFold] = useState(true);
    const changeFold = () => {
        setFold(!fold);
    };
  return(
    <div style={{marginLeft: level === 0 ? 0 : '1em'}}>
      <div className="tree-node">
          {
            item.children && item.children.length ? 
            <span className="tree-switcher-icon">
                {
                    fold ? 
                    <span className="tree-node_colse" onClick={changeFold}>
                        <svg viewBox="0 0 1024 1024" focusable="false"  data-icon="caret-down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg>
                    </span>
                    :
                    <span className="tree-node_open" onClick={changeFold}>
                        <svg viewBox="0 0 1024 1024" focusable="false"  data-icon="caret-down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg>
                    </span>
                }
            </span>
            : <span className="tree-switcher-icon"></span>
          }
          
          <span>{item.text}</span>
      </div>
      {
          !fold && item.children?.map(child => <DeepTree item={child} level={level+1} key={child.value}></DeepTree>)
      }
    </div>
  );
};


const ObserverTree: React.FC<Prop>  = (props) => {
  const {sourceData} = props;
  const options = {
    root: document.getElementById('root'),
    threshold: 1
  };

  const io: IntersectionObserver = new IntersectionObserver(
    (entries,animatedScrollObserver) => {
      entries.forEach((e): any => {
        if (e.isIntersecting) { // 当前元素可见
          console.log(e);
          io.unobserve(e.target);
        }
      });
    }, options
  );
  let treeNodes: HTMLCollection = document.getElementsByClassName('tree-node');
  setTimeout(() => {
    Array.prototype.forEach.call(treeNodes, function(element) {
      io.observe(element);
    });
  });
  
  return (
    <div>
      {
        sourceData.map(item=> <DeepTree item={item} level={0} key={item.value}/>)
      }
    </div>
  );
};

export default ObserverTree;