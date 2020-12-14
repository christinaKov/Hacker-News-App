import React, {useState, useEffect} from 'react';
import './newsDetailPage.css';
import {Link} from 'react-router-dom';
import { getData } from '../../actions';
import { connect } from 'react-redux'
import CommentsSection from './CommentsSection';

export const NewsDetailPage = ({ getData, match }) => {
    const [fetched, setFetched] = useState(false);

    const [newsItem, setNewsItem] = useState('');
    const [timestamp, setTimestamp] = useState('');

    const [commentsUrls, setCommentsUrls] = useState([]);
    const [rootComments, setRootComments] = useState([]);


    let date = new Date(timestamp * 1000);

    useEffect(() => {
        document.title = 'News Page';
        fetchNewsItem();
        fetchRootComments();
        const interval = setInterval(() => {
            fetchNewsItem();
            fetchRootComments();
        }, 60000);
        return () => clearInterval(interval);
    }, [fetched])
    
    const fetchNewsItem = async () => {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${match.params.id}.json?print=pretty`);
        const data = await response.json();
        setNewsItem(data);
        setTimestamp(data.time);
        if (data.kids) {
            setCommentsUrls(data.kids.map(id => (`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)));
        }
        setFetched(true);
    }

    const fetchRootComments = async () => {
        if (newsItem.kids) {
            let rootComments = await Promise.all(
                commentsUrls.map(url => fetch(url).then(response => response.json()))
            );
            setRootComments(rootComments.filter(comment => !comment.deleted));
        }
    }

    return (
        <div className="news-detail-page">
            <p className='title'>News Page</p>
            <div className="news-item-card">
                <p className='title'>{newsItem.title}</p>
                <p>Link: <a target='_blank' href={newsItem.url}>{newsItem.url}</a></p>
                <p>Posted: {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</p>
                <p>by {newsItem.by}</p>
                {newsItem.descendants === 0 ?
                    <p>{newsItem.descendants} comments</p>
                    : newsItem.descendants > 1 ?
                        <p>{newsItem.descendants} comments:</p>
                        : <p>{newsItem.descendants} comment:</p>
                }
                <p className='update-comments-btn' onClick={function(){ fetchNewsItem(); fetchRootComments()}}>Update Comments</p>
                <CommentsSection rootComments={rootComments}/>
            </div>
            <Link to={`/`}>
                <button onClick={function(){ getData()}} className="back-to-list-btn">Back to news</button>
            </Link>
        </div>
    )
}

export default connect(null, { getData })(NewsDetailPage);