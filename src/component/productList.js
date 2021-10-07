import React, { useState, useCallback, useEffect } from "react";
import { ResourceItem, SkeletonBodyText, Avatar, ResourceList, TextStyle, TextField, Filters, Button} from "@shopify/polaris";
import { connect } from 'react-redux'
import {addProducts, allProducts} from '../store/actions'
import {encode} from "base-64";

const ResourceListCollect = ({props, products,setSelectedItemsProps, serachingData, page,  selectedProductsRedux, dispatch}) => {
    const [selectedProducts, setSelectedProducts] = useState();
    const [selectedItems, setSelectedItems] = useState([]);
    const [cartProducts, setCardProducts] = useState();
    const [cartProductsId, setCardProductsId] = useState();
    const [product, setProduct] = useState([serachingData.length > 3 && products.filter((name) => name.title.includes(serachingData))])
    const pro = serachingData.length > 2 ? products.filter((name) => name.title.includes(serachingData)) : products

    useEffect(()=>{
        fetch("http://localhost:3001/",{
            method: 'Get',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        })
            .then(response => response.json())
            .then(data => setCardProducts(data))

        page == 'create' &&
        dispatch(addProducts([]))
    },[])

    const proIdS = []
    const pros  = cartProducts && cartProducts.map((items,index) => items.products.filter(pro => proIdS.push(pro.id)))

    console.log(proIdS)

    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };

    const selectedItemHandler = (selected) =>{
        dispatch(addProducts(selected))
        setSelectedItemsProps(selected)
        setSelectedItems(selected)
    }

    return (
        <ResourceList
            resourceName={resourceName}
            items={pro}
            renderItem={renderItem}
            selectedItems={selectedProductsRedux}
            onSelectionChange={selectedItemHandler}
            selectable
        />
    );
    function renderItem(productItems,i) {
        const {id, title, image, product_type} = productItems;
        const media = image && image.src ? <Avatar customer source={image.src} size="medium" name={title} /> : <Avatar customer size="medium" name={title} />;


        return (
            !proIdS.includes(id) ?
                <ResourceItem id={id} name={title} media={media}>
                    <h3><TextStyle variation="strong">{title}</TextStyle></h3>
                    <div>{product_type}</div>
                </ResourceItem>
            :
                <div className='disabled'>
                    <ResourceItem id={id} name={title} media={media}>
                        <h3><TextStyle variation="strong">{title}</TextStyle></h3>
                        <div>{product_type}</div>
                    </ResourceItem>
                </div>
        );
    }


}
const mapStateToProps = (state) => ({
    selectedProductsRedux: state.store.products
})
export default connect(mapStateToProps)(ResourceListCollect)