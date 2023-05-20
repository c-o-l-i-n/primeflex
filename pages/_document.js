import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);

        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>
                    {/* eslint-disable */}
                    <link href="https://primefaces.org/cdn/primereact/images/favicon.ico" rel="icon" type="image/x-icon"></link>
                    <link id="theme-link" href="/themes/bootstrap4-light-blue/theme.css" rel="stylesheet"></link>
                    <script src="/scripts/prism/prism.js" data-manual></script>
                    {/* eslint-enable */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
