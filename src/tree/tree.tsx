import * as React from "react";
import {createContext, useContext, useRef, useState,useEffect} from "react";
import './tree.css'
import {ChangeEventHandler} from "react";
interface SourceItem {
  text: string;
  value: string;
  children?: SourceItem[];
  top?: string;
  id?: string;
  refVal?:any;
}
interface Context {
  selected: string[];
}
interface Init {
  onChange: (str: string[]) => void;
  selected: string[];
}
interface Prop extends Init{
  sourceData: SourceItem[];
  height: number;
}
interface RecursiveArray<T> extends Array<T | RecursiveArray<T>>{}
const C = createContext<Context | null>(null)

const DeepTree: React.FC<{item: SourceItem, level: number, onChangeItem: (values: string[]) => void}> = (props) => {
  const {item, level} = props
  const [expanded, setExpanded] = useState(true)
  const { selected } = useContext<any>(C)
  const onClickCollapse = () => { setExpanded(!expanded) }
  const checked = selected.indexOf(item.value) >= 0
  const inputRef = useRef<HTMLInputElement>(null)
  const collectChildrenValues = (item: SourceItem): any => {
    return flatten(item.children?.map(i => [i.value, collectChildrenValues(i)].filter(Boolean)))
  }
  const flatten = (arr?: RecursiveArray<string>): string[] => {
    if (!arr) return []
    return arr.reduce<string[]>((result, current) =>
      result.concat(typeof current === 'string' ? current : flatten(current)), [])
  }
  const onChangeBox: ChangeEventHandler<HTMLInputElement> = (e) => {
    const childValues = collectChildrenValues(item)
    if (e.target.checked) {
      props.onChangeItem([...selected, item.value, ...childValues].filter(Boolean))
    } else {
      props.onChangeItem(selected.filter((i: string) => i !== item.value && childValues.indexOf(i) < 0))
    }
  }
  function commonArr<T>(array1: T[], array2: T[]): T[] {
    const arr: T[] = []
    for (let i = 0; i < array1.length; i++) {
      if (array2.indexOf(array1[i]) >= 0) {
        arr.push(array1[i])
      }
    }
    return arr
  }
  const onChangeItem = (values: string[]) => {
    // 这里的values就是每次选中的元素
    const childrenValues = collectChildrenValues(item)
    // 每次选中的元素和当前元素下的子元素进行共同元素比较
    const common = commonArr(values, childrenValues)
    if (common.length !== 0) {
      props.onChangeItem(Array.from(new Set(values.concat(item.value))))
      if (common.length === childrenValues.length) {
        inputRef.current!.indeterminate = false
      } else {
        inputRef.current!.indeterminate = true
      }
    } else {
      props.onChangeItem(values.filter(v => v !== item.value))
      inputRef.current!.indeterminate = false
    }
  }
  return (
    <div key={item.value} style={{marginLeft: level === 0 ? '0' : '1em', top: item.top}} id={item.id} ref={item.refVal}>
      {
        item.children ?
          <span className={"icons"}>
            {!expanded ? <span onClick={onClickCollapse}>+</span> : <span onClick={onClickCollapse}>-</span>}
          </span> : <span className={"icons"}></span>
      }
      <input type="checkbox" onChange={(e) => onChangeBox(e)} checked={checked} ref={inputRef}/>
      <span style={{overflow: expanded ? 'block' : 'none'}}>{item.text}</span>
      <div>
        {
          expanded && item.children?.map(i =>
            <DeepTree item={i} level={level + 1} key={i.value} onChangeItem={onChangeItem}/>
          )
        }
      </div>
    </div>
  )
}
const Tree: React.FC<Prop> = (props) => {
  const {sourceData, height} = props

  const onChangeItem = (values: string[]) => {
    props.onChange(Array.from(new Set(values)))
  }
  const THRESHOLD = 15;

  type NumberList = number[]
  type ObserverList = Array<React.RefObject<any>>
  type CallbackFunction = (indexList: NumberList) => void
  type ResultType = [React.Dispatch<React.SetStateAction<React.RefObject<any>[]>>]

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(THRESHOLD);
  const [observer, setObserver] = useState();

  const $bottomElement = useRef<HTMLElement>(null);
  const $topElement = useRef<HTMLElement>(null);

  useEffect(() => {
    intiateScrollObserver();
    return () => {
      resetObservation()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[end])

  const intiateScrollObserver = () => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    const Observer: IntersectionObserver = new IntersectionObserver(callback, options)

    if ($topElement.current) {
        Observer.observe($topElement.current);
      
    }
    if ($bottomElement.current) {
      Observer.observe($bottomElement.current);
    }
    setObserver(Observer)
  }

  const updateState = (newStart:number, newEnd:number) => {
    if (start !== newStart || end !== newEnd) {
      setStart(newStart)
      setEnd(newEnd)
    }
  }

  const resetObservation = () => {
    observer && observer.unobserve($bottomElement.current);
    observer && observer.unobserve($topElement.current);
  }


  const getReference = (index:number, isLastIndex:boolean) => {
    if (index === 0)
      return $topElement;
    if (isLastIndex) 
      return $bottomElement;
    return null;
  }

  const callback = (entries:any, observer:any) => {
    entries.forEach((entry:any, index:number) => {
      const listLength = sourceData.length;
      // Scroll Down
      // We make increments and decrements in 10s
      if (entry.isIntersecting && entry.target.id === "bottom") {
        const maxStartIndex = listLength - 1 - THRESHOLD;     // Maximum index value `start` can take
        const maxEndIndex = listLength - 1;                   // Maximum index value `end` can take
        const newEnd = (end + 10) <= maxEndIndex ? end + 10 : maxEndIndex;
        const newStart = (end - 5) <= maxStartIndex ? end - 5 : maxStartIndex;
        updateState(newStart, newEnd);
      }
      // Scroll up
      if (entry.isIntersecting && entry.target.id === "top") {
        const newEnd = end === THRESHOLD ? THRESHOLD : (end - 10 > THRESHOLD ? end - 10 : THRESHOLD);
        let newStart = start === 0 ? 0 : (start - 10 > 0 ? start - 10 : 0);
        updateState(newStart, newEnd);
      }
    });
  }

  const updatedList = sourceData.slice(start, end);
  console.log(updatedList)

  const lastIndex = updatedList.length - 1;

  return (
    <C.Provider value={{selected: props.selected}}>
      {updatedList.map((item,index) => {
        const top = (height * (index + start)) + 'px';
        const refVal = getReference(index, index === lastIndex);
        const id = index === 0 ? 'top' : (index === lastIndex ? 'bottom' : '');
        return (<DeepTree item={{...item,top,id,refVal}} level={0} key={item.value} onChangeItem={onChangeItem}/>)
      })}
    </C.Provider>
  )

}
export default Tree;