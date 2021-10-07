import React from "react";
import { Page, Layout, FormLayout, Card } from "@shopify/polaris";
import { Link } from "react-router-dom";

function Bundle(props) {
    const pageMarkup = (
        <Page title="Bundle App">
            <Layout>
                <Layout.AnnotatedSection  title="Bundle App"  description="Shopify and your customers will use this information to contact you.">
                    <Card sectioned>
                        <FormLayout>
                            <Link to='/bundle'>Group Bundle</Link>
                            <Link to='/buyget'>Buy Get Free</Link>
                        </FormLayout>
                    </Card>

                </Layout.AnnotatedSection>
            </Layout>
        </Page>
    );
    return pageMarkup
}

export default Bundle;