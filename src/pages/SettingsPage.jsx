import { isParallel, isProduct } from "@utils/helpers/settings";

export default function GetSettings() {
  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Settings</h2>
        <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
          <pre className="text-sm font-mono text-gray-800">
            <code>
              <span className="text-blue-600">{'{'}</span><br/>
              <span className="ml-4">"</span><span className="text-purple-600">IsParallel</span>
              <span className="ml-2">":</span> 
              <span className={isParallel() ? "text-green-600" : "text-red-600"}>
                {isParallel().toString()}
              </span>,<br/>
              <span className="ml-4">"</span><span className="text-purple-600">IsProduct</span>
              <span className="ml-2">":</span> 
              <span className={isProduct() ? "text-green-600" : "text-red-600"}>
                {isProduct().toString()}
              </span><br/>
              <span className="text-blue-600">{"}"}</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}