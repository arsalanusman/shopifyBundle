import React, { useState, useCallback, useEffect} from "react";
import logo from "./logo.svg";
import enTranslations from "@shopify/polaris/locales/en.json";
import { HomeMajorMonotone, OrdersMajorTwotone } from '@shopify/polaris-icons';
import { AppProvider, TopBar, Frame, Navigation } from "@shopify/polaris";
import {BrowserRouter, Link as ReactRouterLink, Redirect} from "react-router-dom";
import CreateBundle from './pages/create_bundle'
import UpdateBundle from './pages/update_bundle'
import Buyget from './pages/create_getfree_bundle'
import Bundle from './pages/bundle'
import Dashboard from './pages/dashboard'
import { connect } from 'react-redux'
import { allProducts } from './store/actions'
import ListingBundles from './pages/listing_bundles'
import { encode } from "base-64";
import "./App.css";
import {addProducts} from "./store/actions";
import { BrowserRouter as Router,  Switch,  Route,  Link} from "react-router-dom";

const userData = {
    key: 'ad06ce94997c18f717ed250c9854b426',
    security_key:'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',
    baseUrl:'https://cors-anywhere.herokuapp.com/https://bdt-bundle-app-store.myshopify.com'
}

function App(props) {
    const [isLoading, setIsLoading] = useState('dashboard');
    const [productItems, setProductItems] = useState(true);
    const [searchFieldValue, setSearchFieldValue] = useState("");
    const [isLoadingProd, setIsLoadingProd] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const [location, setLocation] = useState(false);

    useEffect(()=>{
        isLoadingProd &&
        fetch(userData.baseUrl+"/admin/api/2020-04/products.json",{
            method: 'Get',
            headers: new Headers({
                'Authorization': 'Basic '+ encode(userData.key+':'+userData.security_key),
                'Content-Type': 'application/json'
            }),
        })
        .then(response => response.json())
        .then(data => props.dispatch(allProducts(data.products)));
        setIsLoadingProd(false)
    },[]);

    const handleSearchChange = useCallback(
        (searchFieldValue) => setSearchFieldValue(searchFieldValue),
        []
    );
    const toggleIsLoading = useCallback(
        (value) => setIsLoading(value),
        []
    );
    const theme = {
        colors: {
            topBar: {
                background: "#343434",
            },
        },
        logo: {
            width:140,
            topBarSource:"/cropped-besthive-pk.png",
            url: "https://www.besthive.co/",
            accessibilityLabel: "BestHive",
            contextualSaveBarSource:"/cropped-besthive-pk.png",
        },
    };

    const searchFieldMarkup = (
        <TopBar.SearchField placeholder="Search" value={searchFieldValue} onChange={handleSearchChange}/>
    );

    const topBarMarkup = <TopBar />;

    const redirectLocation = (e) => {
        setRedirect(true)
        setLocation(e)
        setTimeout(()=>{
            setRedirect(false)
        },[])
    }

    const navigationMarkup = (
        <Navigation location="/">
            <Navigation.Section
                separator
                title="Bundle App"
                items={[
                  {
                    label: 'Dashboard',
                    icon: HomeMajorMonotone,
                    onClick: () => redirectLocation('/'),
                  }
                ]}
            />
        </Navigation>
    );
    return (
        <div style={{ height: "250px" }}>
            <Router>
            <AppProvider
                theme={theme}
                i18n={{
                    Polaris: {
                        Frame: { skipToContent: "Skip to content" },
                        ContextualSaveBar: { save: "Save", discard: "Discard",},
                        TopBar: {
                            SearchField: { clearButtonLabel: "Clear", search: "Search",},
                         },
                    },
                }}>
                    <Frame topBar={topBarMarkup} navigation={navigationMarkup}>
                        <Switch>
                            <Route exact path="/" render={(props) => <Dashboard props={props}/>} />
                            <Route exact path="/addBundle" render={(props) => <Bundle />} />
                            <Route exact path="/buyget" render={(props) => <Buyget props={userData} products={productItems}/>} />
                            <Route exact path="/bundle" render={(props) => <CreateBundle props={userData} products={productItems}/>} />
                            <Route exact path="/bundle/:id" render={(props) => <UpdateBundle props={props} user={userData} products={productItems}/>} />
                        </Switch>
                    </Frame>
            </AppProvider>
            {redirect && <Redirect to={location} />}
            </Router>
        </div>
    );
}

export default connect()(App);
