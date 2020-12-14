import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

const ListItem = ({ id }) => {
    const [newsItem, setNewsItem] = useState('');
    const [timestamp, setTimestamp] = useState('');

    let date = new Date(timestamp * 1000);

    useEffect(() => {
        fetchNewsItem();
    }, [])
    
    const fetchNewsItem = async () => {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        const data = await response.json();
        setNewsItem(data);
        setTimestamp(data.time);
    }

    return (
        <Link to={`/${id}`}>
            <div className='list-item'>
                <p className='title'>{newsItem.title}</p>
                <p>Score: {newsItem.score}</p>
                <p>by {newsItem.by}</p>
                <p>Posted: {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</p>
            </div>
        </Link>
    )
}

export default ListItem;