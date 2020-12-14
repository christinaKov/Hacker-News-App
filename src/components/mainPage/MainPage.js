import React from 'react';
import { connect } from 'react-redux'
import './mainPage.css';
import List from './List';
import { getData } from '../../actions';

export const MainPage = ( { getData }) => {
    return (
        <div className="main-page">
            <p className='title'>Hacker News App</p>
            <List/>
            <button className='reload-btn' onClick={function(){ getData()}}>Update</button>
        </div>
    )
}

export default connect(null, { getData })(MainPage);