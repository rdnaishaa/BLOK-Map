import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/restaurants">Restaurants</Link>
            <Link to="/spots">Spots</Link>
            <Link to="/how-to-get">How To Get</Link>
        </nav>
    );
};

export default Navbar;
