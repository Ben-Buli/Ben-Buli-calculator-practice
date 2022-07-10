import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.scss";


// Youtube : 
// https://www.youtube.com/watch?v=DgRrrOt0Vr8
// Github
// https://github.com/WebDevSimplified/react-calculator

// -g
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

// 製作一個功能讓userReducer呼叫
// type 類型, payload 有效負載。不同的類型傳遞不同的參數
// function reducer(state, action) {
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      // 不要讓輸入數等於下一個操作數 26-27:00
      if ( state.overwrite ) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      //不要出現多位0的情況
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state; //不做變化17:44
      }
      // 當有一個小數點時，再次
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      // 執行putput正常更新
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    // 沒有輸入數字時，運算子不反應 19:00
    case ACTIONS.CHOOSE_OPERATION:
      // 假設: 當前輸入數值為空，預先輸入數值也為空，狀態不反應
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      // 運算子操作覆蓋 (切換加減乘除)
      if ( state.currentOperand == null ) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      // 按下運𥮞子時，當前輸入欄位 -> 送到預先輸入欄位
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation, //?
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      // 多運算子疊加運算
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }

    // AC 清空
    case ACTIONS.CLEAR:
      // 返回空物件
      return {};
    // 倒刪除
      case ACTIONS.DELETE_DIGIT:
        // 檢查狀態是否為覆蓋，T則返回空物件
        if ( state.overwrite ){
        return {
            ...state,
          overwrite: false,
          currentOperand: null
        }
        }
        // 當前若沒有任何值，所以無法刪除任何東西 
        if ( state.currentOperand == null ) return state
        // 刪除到最後一個數字時將內容轉為null, 而非空字串的值 28:06
        if ( state.currentOperand.length === 1 ) {
          return { ...state, currentOperand: null }
        }
        // 最後檢查 28:26 ??
        return {
          ...state,
          // 從當前操作數中刪除最後一個數字
          currentOperand: state.currentOperand.slice(0, -1)


        }


    // = 等於 計算  
    case ACTIONS.EVALUATE:
      // TODO: 1.處理不須計算的情況
      if (
        // 沒有運算子操作變動的時候
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }
      // TODO: 2.計算
      return {
        ...state,
        overwrite: true, //可覆寫
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }
}

// 多重計算函式
function evaluate({ previousOperand, currentOperand, operation }) {
  // parseFloat 轉為字符串，並返回一個浮點數。
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  // 如果完全未輸入任何數值，返回空字串
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }
  return computation.toString()
}

// 29:06 優化數字格式 ??
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
// 30:00??
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


function App() {
  // reducer 減速器
  // const [state, dispatch] = useReducer(reducer,{})
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    // operand-output
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="current-operand">
          {currentOperand}
        </div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button
        onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
        >DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
