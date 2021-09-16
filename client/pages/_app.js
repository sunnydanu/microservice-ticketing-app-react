import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return <div>
    <h1>Welcome {currentUser.email}</h1>
    <Component {...pageProps} />
  </div>
};

AppComponent.getInitialProps = async appContext => {

  const { data } = await buildClient(appContext.ctx).get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {
    pageProps,
    ...data
  };
};


export default AppComponent;