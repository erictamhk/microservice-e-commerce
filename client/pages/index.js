import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async (context) => {
  try {
    const client = buildClient(context);
    const { data } = await client.get(`/api/users/currentuser`);
    console.log("build clients", data);
    return data;
  } catch (err) {
    console.error(err);
    return { currentUser: null };
  }
};

export default LandingPage;
