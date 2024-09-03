import React from 'react';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import 'primeflex/primeflex.css';

const Home = () => {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <Header />
               
            </div>
            <Footer />
        </div>
    );
};

export default Home;
