import { useEffect, useState } from "react";
import { checkBackendHealth } from "../../services/api";

function BackendTest() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    checkBackendHealth()
      .then((data) => {
        console.log("Backend connected:", data);
        setStatus("Backend connected successfully");
      })
      .catch((error) => {
        console.error("Backend connection failed:", error);
        setStatus("Backend connection failed");
      });
  }, []);

  return <div>{status}</div>;
}

export default BackendTest;