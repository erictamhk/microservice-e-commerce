import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  let pageProps = {};
  let currentUser = null;
  try {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get(`/api/users/currentuser`);

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(
        appContext.ctx,
        client,
        data.currentUser
      );
    }

    currentUser = data.currentUser;
  } catch (err) {
    console.error(err);
  }

  const returnData = {
    pageProps,
    currentUser,
  };

  return returnData;
};

export default AppComponent;
