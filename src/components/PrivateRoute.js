import React from 'react'
import { Redirect, Route } from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../context/profile.context';

const PrivateRoute = ({children,...routeProps}) => {
    const {profile,isLoading} = useProfile();
    if(isLoading && !profile){
        return <Container>
            <Loader center vertical size="lg" content="Loading" speed="fast" />
        </Container>
    }
    if(!profile && !isLoading){
        return <Redirect to="/signin" />
    }
    return (
        <Route {...routeProps}>
            {children}
        </Route>    )
}

export default PrivateRoute
