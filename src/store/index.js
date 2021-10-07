const storeStates = {
    products:[],
    allProducts:[],
    addBundle:[],
    allBundle:[]
}
const store = (state = [storeStates], action) => {
    switch (action.type) {
        case 'ADD_PRODUCTS':
            return {
                ...state,
                products:  action.items.filter((id)=> id !== action.items)
            }
        case 'DELETE_PRODUCTS':
            return {
                ...state,
                products:  state.products.filter((id)=> id !== action.items)
            }
        case 'ALL_PRODUCTS':
            return {
                ...state,
                allProducts:  action.items.filter((id)=> id !== action.items)
            }
        case 'ADD_BUNDLE':
            return {
                ...state,
                addBundle:  action.items
            }
        case 'ALL_BUNDLE':
            return {
                ...state,
                allBundle:  action.items
            }
        default:
            return state
    }
}
export default store
