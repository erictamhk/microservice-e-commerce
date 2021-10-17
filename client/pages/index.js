import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  let url;
  let option;
  if (typeof window === "undefined") {
    console.log("work on server");
    url = "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";
    option = {
      headers: req.headers,
    };
  } else {
    console.log("work on client");
    url = "";
    option = null;
  }
  try {
    const response = await axios.get(`${url}/api/users/currentuser`, option);

    return response.data;
  } catch (err) {
    console.error(err);
    return { currentUser: null };
  }
};

export default LandingPage;
