import { useState, useEffect } from "react";
import { getUser, generateHeaders } from "@utils/api/auth";
import { isParallel } from "@utils/helpers/settings";

export function WhoamI() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let url = isParallel() ? "/api/whoami" : "http://localhost:8000/api/whoami";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: generateHeaders(getUser())
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) {
    return <div className="text-center p-4 text-gray-600">Loading...</div>;
  }

  if (error == "HTTP error! status: 401") {
    return <div className="text-center p-4 text-red-500">U arent login</div>;
  }
  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden m-4">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>
        <ul className="space-y-4">
          {Object.entries(userData).map(([key, value]) => (
            <li 
              key={key}
              className="flex justify-between items-center border-b pb-2 last:border-b-0"
            >
              <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</span>
              <span className="text-gray-600">
                {value === null ? 'Not set' : value.toString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}