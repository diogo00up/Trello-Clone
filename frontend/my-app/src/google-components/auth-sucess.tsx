import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OauthSuccess = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const google_token = queryParams.get("google_token");
      console.log("google token: ",google_token)
      
      if (google_token) {
  
        sessionStorage.setItem("google_token", google_token);
        setTimeout(() => {
            navigate("/groupPage");
          }, 100);

      } else {
        console.error("No token found in URL");
        navigate("/welcome");
      }
  
 
    }, [navigate]);
  
    return <div>Authenticating with Google...</div>;
  };
  
  export default OauthSuccess;