import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Headers! {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  console.log("app component getInitialProps");

  let pageProps = {};
  try {
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
  } catch (err) {
    console.error(err);
  }
  let currentUser = null;
  try {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get(`/api/users/currentuser`);

    currentUser = data.currentUser;
  } catch (err) {
    console.error(err);
  }

  const returnData = {
    pageProps,
    currentUser,
  };

  console.log(returnData);

  return returnData;
};

export default AppComponent;
