

import { useUser } from '../context/UserContext';

function Header() {
    const {username} = useUser();
    return <div>
        <h1>Привет {username}!</h1>
    </div>; 
}
export default Header;
