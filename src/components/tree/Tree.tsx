import * as React from 'react';
import { createContext, useContext, useState, useEffect, useRef  } from 'react';
import './Tree.css';

interface SourceItem{
  text: string;
  value: string;
  children?: SourceItem[];
  top?: string| undefined;
  id?: string;
  refVal?:any;
  level?: number;
  fold?: boolean;
  visible?: boolean;
  parent?: SourceItem | null;
  hasChildren?: boolean;
}

interface Prop{
  sourceData: SourceItem[];
  height:number;
  onChange?: (str: string[]) => void;
  lazy?: boolean;
}
interface Context{
  lazy?: boolean;
}

const MyContext = createContext<Context | null>(null);

const TreeItem: React.FC<{item: SourceItem, level:number, updateList?:any}> = (props) =>{
  const {item, level} = props;
  // 为每一项设置状态 根据上下文lazy设置 默认折叠
  const { lazy } = useContext<any>(MyContext);

  const [fold,setFold] = useState(item.fold);
  const changeFold = () => {
    setFold(!fold);
    props.updateList(item, fold);
  };

  return (
    <div className="tree-item" style={{marginLeft: `${item.level}em`, top: item.top}} ref={item.refVal} id={item.id}>
    
        <div className="tree-node" >
          {
            item.hasChildren ? 
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
              </span> :
              <span className="tree-switcher-icon"></span>
          }
          <span>{item.text}</span>
        </div>
        
    </div>
  );
};

const intervalNumber = Math.round(document.documentElement.clientHeight/26) * 3 ; // 设定页面显示元素个数

const HookTree: React.FC<Prop>  = (props) => {
  const {sourceData,lazy, height} = props;

  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(intervalNumber);

  const [observer, setObserver] = useState<any>(null);
  const $bottomElement = useRef<HTMLElement>(null);
  const $topElement = useRef<HTMLElement>(null);

  const flatTree = (list:any[], level:number, parent?:SourceItem, fold = lazy ) => {
    let ret:any[] = [];
    list.forEach((item, index) => {
      const {text, value} = item;
      let visible = true;
  
      if (parent) {
        if(!parent.visible || parent.fold){
          visible = false;
        }
      }
      const newItem = {text, value, level, parent, fold, hasChildren: !!item.children?.length, visible};
      ret.push(newItem);

      if(item.children) {
        ret = ret.concat(flatTree(item.children, level+1, newItem ));
      }
    });
    return ret;
  };

  const [newSourceData, setNewSourceData] = useState<SourceItem[]>(flatTree(sourceData,0));

  // 相当于 componentDidMount 和 componentDidUpdate:

  useEffect(() => {
   
    intiateScrollObserver();
    
    return () => { // 在end变化时清除observation
      resetObservation();
    };
    
  
  // eslint-disable-next-line 
  },[end]);


  const sourceDataLength = newSourceData.length;


  // 折叠更改数据
  const updateList = (data:SourceItem, visible:boolean, count = 0) => {
    const list = [...newSourceData];
    list.forEach(item => {
      if(item.parent?.value === data.value){
        count++;
        item.visible = visible;
        if(item.hasChildren) {
          updateList(item, visible, count);
        }
      }
    });
    setNewSourceData(list);
    if(!visible) setEnd(end + count);

  };

  const intiateScrollObserver = () => {
    const options = {
      root: null,
      rootMargin: '0px',
      intervalNumber: 0.1
    };
    const Observer: IntersectionObserver = new IntersectionObserver(callback, options);
   
    if($topElement.current) {
      Observer.observe($topElement.current);
    }
    if($bottomElement.current) {
      Observer.observe($bottomElement.current);
    }
    setObserver(Observer);
   

  };

  const callback =  (entries:any, observer: IntersectionObserver) => {
    entries.forEach((entry:any, index: number) => {
      const listLength = sourceDataLength;
      // Scroll Down
      if (entry.isIntersecting && entry.target.id === "bottom") {
        const maxStartIndex = listLength - 1 - intervalNumber;     // Maximum index value `start` can take
        const maxEndIndex = listLength - 1;                   // Maximum index value `end` can take
        const newEnd = (end + Math.round(intervalNumber/ 2)) <= maxEndIndex ? end + Math.round(intervalNumber/ 2)  : maxEndIndex;
        const newStart = (end - Math.floor(intervalNumber/ 2)) <= maxStartIndex ? end - Math.floor(intervalNumber/ 2) : maxStartIndex;

        updateState(newStart, newEnd);
      }
      // Scroll up
      if (entry.isIntersecting && entry.target.id === "top") {
        const newEnd = end === intervalNumber ? intervalNumber : (end - Math.floor(intervalNumber/ 2) > intervalNumber ? end - Math.floor(intervalNumber/ 2) : intervalNumber);
        const newStart = start === 0 ? 0 : (start - intervalNumber > 0 ? start - intervalNumber : 0);
        updateState(newStart, newEnd);
      }
    });
  };

  const updateState = (newStart:number, newEnd:number) => {
    if (start !== newStart || end !== newEnd) {
      setStart(newStart);
      setEnd(newEnd);
    }
  };

  const resetObservation = () => {
   
    observer?.unobserve($bottomElement.current);
    observer?.unobserve($topElement.current);
  };

  const getReference = (index: number, isLastIndex:boolean) => {
    if (index === 0) {
      return $topElement;
    }
    if (isLastIndex) {
      return $bottomElement;
    }
    return null;
  };

  const updatedList = newSourceData.filter(item =>item.visible).slice(start, end);
  const lastIndex = updatedList.length - 1;
  console.log(updatedList);

  return (
    <MyContext.Provider value={{lazy}}>
      <div className="tree" >
        {
          updatedList.map((item,index)=> {
            const top = (height * (index + start)) + 'px';
            const refVal = getReference(index, index === lastIndex);
            const id = start !==0 && index === 0 ? 'top' : (index === lastIndex ? 'bottom' : '');
            item = {...item,  top, refVal, id};
            return (<TreeItem  item={item} level={0} key={item.value} updateList={updateList}/>);
          })
        }
      </div>
    </MyContext.Provider>
  );
};

export default HookTree;

