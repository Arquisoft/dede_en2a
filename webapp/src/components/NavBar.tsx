import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import {Link} from 'react-router-dom';
import Shopping from './Shopping';
import LinkContainer from 'react-router-dom';

function NavBar(): JSX.Element{
    return (
        <>
            <br />
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                    <Nav.Link >
                        <Link to="/">Home</Link>
                    </Nav.Link>
                        
                    <Nav.Link>
                        <Link to="/cart">Cart
                        </Link>
                    </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;