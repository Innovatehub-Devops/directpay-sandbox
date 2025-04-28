
import { NavLink } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container py-8">
        <div className="flex justify-center">
          <ul className="flex space-x-8">
            <li>
              <NavLink 
                to="/docs" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Documentation
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/sandbox" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                API Sandbox
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/access" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Get Access
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
