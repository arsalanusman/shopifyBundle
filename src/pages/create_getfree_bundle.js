import React, { useState, useCallback, useEffect } from "react";
import { Page, Layout, FormLayout, Card, TextField, Button, Modal, TextContainer, DataTable, List, TextStyle,ResourceList,Thumbnail,CalloutCard } from "@shopify/polaris";
import ResourceListCollect  from '../component/productList'
import DataTableListView  from '../component/dataTable'
import { connect } from 'react-redux'
import {addBundle, allBundle, allProducts} from '../store/actions'
import {Redirect} from "react-router";
import {encode} from "base-64";

function GetFreeBundle(props) {
    const [active, setActive] = useState(false);
    const [searchData, setSearchData] = useState(false);
    const [products, setProducts] = useState();
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
        // e.length < 3 ? setProducts(props.allProductList) :
        //     setProducts(products.filter((name) => name.title.includes(e)));
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
    const activator = <Button onClick={handleChange}>Open</Button>;
    const getProductsFun = () => {
        props.getProducts()
    }
    const submitButton = () => {
        fetch("http://localhost:3001/add_bundle",{
            method: 'Post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body:JSON.stringify([{
                name: widgetHeadingValue,
                internal_name: bundleValue,
                products: selectedItems
            }])
        })
            .then(response => response.json())
            .then(data => setRedirect(true))
    }

    const pageMarkup = (
        <Page title="Buy / Get Free">
            {redirect && <Redirect to={'/'} />}
            <Layout>
                <Layout.AnnotatedSection  title="Select Buy Products"  description="Shopify and your customers will use this information to contact you.">
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
                            onAction: handleChange,
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
                                <ResourceListCollect  props={props} page={'create'} products={products} serachingData={searchData}  setSelectedItemsProps={(e)=>setSelectedItemsFun(e)}  />
                            </TextContainer>
                        </Modal.Section>
                    </Modal>
                </Layout.AnnotatedSection>
            </Layout>
            {selectedItems.length > 0 &&
                <>
            <Layout>
                <Layout.AnnotatedSection  title="Buy Products"  description="Shopify and your customers will use this information to contact you.">
                    <DataTableListView  addMoreProduct={handleChange} />
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection  title="Get Free Products"  description="Shopify and your customers will use this information to contact you.">
                    <DataTableListView  addMoreProduct={handleChange}/>
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
export default connect(mapStateToProps)(GetFreeBundle);