const initialStateAccount = {
    balance: 0,
    loan: 0,
    loanPurpose: "",
}

export default function accountReducer(state = initialStateAccount, action){
    switch(action.type){
        case "account/deposit":
            return {...state, balance: state.balance + action.payload}
        case "account/withdraw":
            return {...state, balance: state.balance - action.payload}
        case "account/requestLoan":
            if(state.loan > 0) return state;
            return {...state, loan: action.payload.amount, loanPurpose: action.payload.purpose};
        case "account/payloan":
            return {...state, loan: 0, loanPurpose: "", balance: state.balance - state.loan};
        default:
            return state;
    }
}

// ACTION EVENT CREATOR FUNCTION
export function deposit(amount, currency){
    if(currency === "USD")return {type: "account/deposit", payload: amount};

    return async function(dispatch, getState){
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`);
        const data = await res.json();
        const converted = data.rates;
        console.log(data)
        dispatch({type: "account/deposit", payload: converted})
    }
    // return {type: "account/deposit", payload: amount}
}

export function withdraw(amount){
    return {type: "account/withdraw", payload: amount}
}

export function requestLoan(amount, purpose){
    return {type: "account/requestLoan", payload: {amount, purpose}}
}

export function payLoan(){
    return {type: "account/payloan"}
}