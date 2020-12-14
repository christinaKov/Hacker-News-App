import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getData } from '../../actions';
import './mainPage.css';
import ListItem from './ListItem';

const mapStateToProps = state => {
    return { news: state.news };
};

export const List = ({ news, getData }) => {
    useEffect(() => {
        getData()
        const interval = setInterval(() => {
            getData()
        }, 60000);
        return () => clearInterval(interval);
    }, [])

    return (
        <div className="news-list">
            <ol>
                {news.map(el => (
                    <li key={el}>{<ListItem id={el}/>}</li>
                ))}
            </ol>
        </div>
    )
}

export default connect(mapStateToProps, { getData })(List);