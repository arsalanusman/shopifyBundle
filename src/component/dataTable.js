/**
 * Created by Masood on 23/07/2020.
 */
import React, { useState, useCallback, useEffect  } from "react";
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import {Card, DataTable, TextField, Select, Thumbnail, Button, Modal, TextContainer, Icon} from '@shopify/polaris';
import {DeleteMinor, EditMinor} from "@shopify/polaris-icons";
import {Link} from "react-router-dom";
import { deleteProducts } from '../store/actions'

function TextFieldExample(props) {
    const [value, setValue] = useState();
    function handleChange2(e) {
        setValue(e);
    }
    return <TextField id="bundle-percentage" label="Discount" value={value} onChange={handleChange2} />;
}
function ModalExample() {
    const [active, setActive] = useState(true);
    const handleChange = useCallback(() => setActive(!active), [active]);
    const activator = <Button onClick={handleChange}>Open</Button>;
    return (
        <div style={{height: '500px'}}>
            <Modal
                activator={activator}
                open={active}
                onClose={handleChange}
                title="Reach more shoppers with Instagram product tags"
                primaryAction={{
                    content: 'Add Instagram',
                    onAction: handleChange,
                }}
                secondaryActions={[
                    {
                        content: 'Learn more',
                        onAction: handleChange,
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <p>
                            Use Instagram posts to share your products with millions of
                            people. Let shoppers buy from your store without leaving
                            Instagram.
                        </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </div>
    );
}
function SelectExample(props) {
    const [selected, setSelected] = useState('0');
    //const handleSelectChange = useCallback((value) => setSelected(value), []);

    function handleSelectChange(e) {
        setSelected(e);
        console.log(e);
        return (
            <ModalExample />
        );
    }
    return (
        <Select options={props.quantityOptions} onChange={handleSelectChange} value={selected} />
    );
}

function DataTableListView({selectedProducts, prodcuts, addMoreProduct, changeDiscount, changeQuantity, dispatch}) {

    const [discount, setDiscount] = useState(0);


    const changeQuant = (value,i) => {
        changeQuantity(value,i)
        // updatedProducts.map((items,index)=> items.quantity = value)
        // console.log(updatedProducts)
    }
    const updatePercentage = (e) => {
        if(e > 0 && e <100 ){
            changeDiscount(e)
            setDiscount(e)
        }
    }
    const ChangeAction = (e,id) => {
        if(e == 'delete'){
            console.log(selectedProducts,id)
            dispatch(deleteProducts(id))
        }
    }
    console.log(prodcuts)
    let rows=[];
    prodcuts && prodcuts.length > 0 && prodcuts.map(function(product, i){
        rows[i] = [
            <Thumbnail source={product.image && product.image.src} size="medium" alt={product.title} />,
            product.title,
            <TextField type="number" value={product.quantity} onChange={(e)=>changeQuant(e,i)} />,
            product.variants && product.variants[0].price,
            product.discount+'%',
            [<Button onClick={()=>ChangeAction('delete',product.id)}> <Icon source={DeleteMinor} /> </Button>, <Link to={"/bundle/"+product._id}> <Icon source={EditMinor} /> </Link>] ,
        ];

    });

    return (
        <Card>
        <DataTable
        showTotalsInFooter
        columnContentTypes={[
            'text',
            'text',
            'text',
            'text',
            'text',
            'text'
            ]}
        headings={[
            'Image',
            'Title',
            'Quantity',
            'Regular Price',
            'Bundle Price',
            'Action',
        ]}
        rows={rows}
        totals={['', '', '', '', <TextField id="bundle-percentage" type="text" value={discount} onChange={(e)=>updatePercentage(e)} />, '']}
        totalsName={{
        singular: <Button id="add-product" onClick={addMoreProduct}>Add product</Button>,
    }}
/>
</Card>
);


}

const mapStateToProps = (state) => ({
    selectedProducts: state.store.products
})
export default connect(mapStateToProps)(DataTableListView);