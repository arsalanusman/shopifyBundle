import React, {useState, useCallback, useEffect} from "react";
import {Page, DataTable, Button, Card, Icon, Select} from "@shopify/polaris";
import { connect } from 'react-redux'
import { Redirect } from 'react-router';
import { allBundle } from "../store/actions";
import { EditMinor, DeleteMinor } from '@shopify/polaris-icons';
import { Link } from "react-router-dom";

function Dashboard(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [redirect, setRedirect] = useState(false);


    const getAllBundles = () => {
        fetch("http://localhost:3001/",{
            method: 'Get',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        })
            .then(response => response.json())
            .then(data => {
                props.dispatch(allBundle(data))
                setProducts(data)
                setIsLoading(true)
            })
    }

    useEffect(()=>{
        getAllBundles()
    },[])

    const actionOptions = [ {label: 'Select', value: ''}, {label: 'Edit', value: 'edit'}, {label: 'Delete', value: 'delete'}];

    const ChangeAction = (e,id) => {
        if(e == 'delete'){
            fetch("http://localhost:3001/remove_bundle",{
                method: 'Post',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body:JSON.stringify({id:id})
            })
                .then(response => response.json())
                .then(data => getAllBundles())
        }
    }

    let rows=[];
    products && products.map(function(product, i) {
        rows[i] = [product._id, product.name, product.internal_name, [<Button onClick={()=>ChangeAction('delete',product._id)}> <Icon source={DeleteMinor} /> </Button>, <Link to={"/bundle/"+product._id}> <Icon source={EditMinor} /> </Link>] ]
    })

    const createBundle = (e) => {
        setRedirect(true)
    }
    if (redirect) {
        return <Redirect push to="/addBundle" />;
    }
    return <Page title="Product Bundle Groups">

        <Button onClick={()=> createBundle()}>Add New Bundle</Button>
        <br /><br />
        <Card>
            {isLoading &&
            <DataTable
                columnContentTypes={[
                    'number',
                    'text',
                    'text',
                    'dropdown'
                ]}
                headings={[
                    'ID',
                    'Bundle Name',
                    'Internal Name',
                    'Action'
                ]}
                rows={rows}
            />}
        </Card>
    </Page>
}

const mapStateToProps = (state) => ({
    add_bundle: state.store.addBundle,
    all_bundle: state.store.allBundle
})
export default connect(mapStateToProps)(Dashboard);