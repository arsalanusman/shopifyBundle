import React, { useState, useCallback, useEffect } from "react";
import { Page, Layout, FormLayout, Card, TextField, Button, Modal, TextContainer, DataTable, List, TextStyle,ResourceList,Thumbnail,CalloutCard } from "@shopify/polaris";
import ResourceListCollect  from '../component/productList'
import DataTableListView  from '../component/dataTable'
import { connect } from 'react-redux'
import {addBundle, allBundle, allProducts} from '../store/actions'
import {Redirect} from "react-router";
import {encode} from "base-64";

function CreateBundle(props) {
    const [active, setActive] = useState(false);
    const [searchData, setSearchData] = useState(false);
    const [products, setProducts] = useState();
    const [selectedProducts, setSelectedProducts] = useState();
    const handleChange = useCallback(() => setActive(!active), [active]);
    const [selectedItems, setSelectedItems] = useState(false);
    const [widgetHeadingValue, setWidgetHeadingValue] = useState('');
    const [bundleValue, setBundleValue] = useState('');
    const [redirect, setRedirect] = useState(false);

    let count = 10
    useEffect(()=>{
        props.allProductList && setProducts(props.allProductList.filter((items,index)=> index < 10))
    },[])

    const lazyLoad = (e) =>{
        if(props.allProductList.length > count)
            count = count + 10
            setProducts(props.allProductList.filter((items,index)=> index < count))
    }

    const handleScrollBottom = useCallback(() => lazyLoad(), []);

    const handleSearchChange  = (e) =>{
        setSearchData(e)
    }

    const setSelectedItemsFun = (e) =>{
        setSelectedItems(e)
    }

    function setWidgetHandleChange(e) {
        setWidgetHeadingValue(e);
    }

    function setBundleHandleChange(e) {
        setBundleValue(e);
    }

    const submitButton = () => {
        fetch("http://localhost:3001/add_bundle",{
            method: 'Post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body:JSON.stringify([{
                name: widgetHeadingValue,
                type:'group_bundle',
                internal_name: bundleValue,
                products: selectedProducts
            }])
        })
            .then(response => response.json())
            .then(data => setRedirect(true))
    }
    const addProducts = (e) =>{
        let collectedProducts = products.filter(group => (selectedItems.includes(group.id)) );
        let updatedProducts = collectedProducts &&
            collectedProducts.map((items,index)=>
                items.id === selectedItems[index] &&
                {
                    ...items,
                    quantity: '1',
                    discount:0
                }
            )
        setSelectedProducts(updatedProducts)
    }
    const updateDiscount = (e) => {
        let updatedProducts = selectedProducts &&
            selectedProducts.map((items,index)=>
                {
                    items.discount = parseInt(e)
                    return items
                }
            )
        setSelectedProducts(updatedProducts)
    }
    const changeQuant = (v,i) => {
        console.log(v,i)
        let updatedProducts = selectedProducts &&
        selectedProducts.map((items,index)=>{
            if(index == i)
                {
                    items.quantity = v
                    items.variants[0].price = (v + items.variants[0].price)
                    return items
                }
            return items
            }
        )
        setSelectedProducts(updatedProducts)
    }

    const pageMarkup = (
        <Page title="Bundle App">
            {redirect && <Redirect to={'/'} />}
            <Layout>
                <Layout.AnnotatedSection  title="Bundle App"  description="Shopify and your customers will use this information to contact you.">
                    <Card sectioned>
                        <FormLayout>
                            <Button onClick={handleChange}>Add Products</Button>
                        </FormLayout>
                    </Card>
                    <Modal
                        open={active}
                        title="Product Listing"
                        onClose={handleChange}
                        onScrolledToBottom={handleScrollBottom}
                        primaryAction={{
                            content: 'Add Product',
                            onAction: addProducts,
                        }}
                        secondaryActions={[
                            {
                                content: 'Close',
                                onAction: handleChange,
                            },
                        ]}
                    >
                        <Modal.Section>
                            <TextContainer>
                                <TextField value={searchData} onChange={handleSearchChange} label="Search" type="text"/>
                                <ResourceListCollect  props={props} products={products} serachingData={searchData} selectedProducts={selectedItems} setSelectedItemsProps={(e)=>setSelectedItemsFun(e)}  />
                            </TextContainer>
                        </Modal.Section>
                    </Modal>
                </Layout.AnnotatedSection>
            </Layout>
            {selectedItems.length > 0 &&
                <>
            <Layout>
                <Layout.AnnotatedSection  title="Bundle App"  description="Shopify and your customers will use this information to contact you.">
                   <DataTableListView  addMoreProduct={handleChange} changeQuantity={()=>changeQuant} prodcuts={selectedProducts} changeDiscount={(e)=>updateDiscount(e)} />
                </Layout.AnnotatedSection>
            </Layout>
            <div className="datatable-view">
                <Layout>
                    <Layout.AnnotatedSection title="Widget" description="">
                        <Card sectioned>
                            <FormLayout>
                                <TextField id="widget-title" label="Title" onChange={setWidgetHandleChange} value={widgetHeadingValue}/>
                            </FormLayout>
                        </Card>
                    </Layout.AnnotatedSection>
                    <Layout.AnnotatedSection title="" description="">
                        <Card sectioned>
                            <FormLayout>
                                <TextField id="bundle-name" label="Internal Name" onChange={setBundleHandleChange} value={bundleValue}/>
                                <Button onClick={submitButton}>Add Bundle</Button>
                            </FormLayout>
                        </Card>
                    </Layout.AnnotatedSection>
                </Layout>
            </div>
            </>
            }
        </Page>
    );
    return pageMarkup
}

const mapStateToProps = (state) => ({
    allProductList: state.store.allProducts
})
export default connect(mapStateToProps)(CreateBundle);