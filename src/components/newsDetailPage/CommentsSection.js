import React, { useEffect, useState } from 'react';
import './newsDetailPage.css';

const CommentsSection = ({ rootComments }) => {
    const [rootCommentsWithKids, setRootCommentsWithKids] = useState([]);
    let newRootComments = [];

    const [nestedComments, setNestedComments] = useState([])


    useEffect(() => {
        fetchNestedComments();
        fetchNestedCommentsKids();
        if (nestedComments.some(comment => comment.kids)) {
            fetchNestedCommentsKids();
        }
    }, [rootComments])
    
    const fetchNestedComments = () => {
        const allKids = rootComments.flatMap(rootComment => rootComment.kids || [])
        const controller = new AbortController()
        fetchNestedCommentsText(allKids, controller.signal)
            .then(setRootCommentsWithKids)
        return () => controller.abort()
    }

    const fetchNestedCommentsText = async (ids, signal) => {
        const results = await Promise.all(ids.map(async id => {
            const url = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
            const res = await fetch(url, { signal })
            return res.json()
        }))
        setNestedComments(results)
        return rootComments.map(comment => {
            const kids = results.filter(r => r.parent === comment.id && !r.deleted && !r.dead)
            return { ...comment, kids }
        })
    }

    const fetchNestedCommentsKids = () => {
        const allKids = nestedComments.flatMap(comment => comment.kids || []);
        const controller = new AbortController();
        fetchKidsText(allKids, controller.signal);
        return () => controller.abort();
    }

    const fetchKidsText = async (ids, signal) => {
        const results = await Promise.all(ids.map(async id => {
            const url = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
            const res = await fetch(url, { signal });
            return res.json()
        }))
        let resultsWithKids = [...nestedComments]
        resultsWithKids.forEach(comment => {
            comment.kids = results.filter(r => r.parent === comment.id && !r.deleted && !r.deleted && !r.dead)
        })
        setNestedComments(results)
        newRootComments = [...rootCommentsWithKids]
        newRootComments.forEach(comment => {
            if (comment.kids) {
                comment.kids.map(comment => {
                    const kids = resultsWithKids.filter(r => r.parent === comment.id && !r.deleted && !r.dead)
                    return {...comment, kids}
                })
            }
        })
        setRootCommentsWithKids(newRootComments)
    }

    const handleShowNested = e => {
        fetchNestedCommentsKids()
        if (e.target.nextElementSibling.style.display === 'block') {
            e.target.nextElementSibling.style.display = 'none';
            e.target.innerText = 'Show replies';
        } else {
            e.target.nextElementSibling.style.display = 'block';
            e.target.innerText = 'Hide replies';
        }
    }
    
    const Kids = ({kid}) => {
        return (
            <li className='nested-comment-kids' key={kid.id}>
                <p dangerouslySetInnerHTML={ {__html: kid.text} }></p>
                {kid.kids && kid.kids.length > 0 ? <p className='show-answers-btn' onClick={function(){fetchNestedCommentsKids()}}>More replies</p> : null}
                <ul>
                    {kid.kids ?
                        kid.kids.map(kid => (
                            <Kids kid={kid}/>
                        ))
                        : null
                    }
                </ul>
            </li>
        )
    }

    return (
        <ul className='comments-section'>
            {rootCommentsWithKids.map(comment => (
                <li key={comment.id} className='comment'>
                    <p dangerouslySetInnerHTML={ {__html: comment.text} }></p>
                    {comment.kids.length > 0 ? 
                        <div className='nested-comments-section'>
                            <p className='show-answers-btn' onClick={handleShowNested}>Show replies</p>
                            <ul className='nested-comments'>
                                {comment.kids.map(nestedComment => (
                                    <li key={nestedComment.id}>
                                        <p dangerouslySetInnerHTML={ {__html: nestedComment.text} }></p>
                                        {nestedComment.kids ?
                                            <ul>
                                                {nestedComment.kids.map(kid => (
                                                    <Kids kid={kid}/>
                                                ))}
                                            </ul>
                                            : null
                                        }
                                    </li>
                                ))}
                            </ul>
                        </div>
                        : null
                    }
                </li>
            ))}
        </ul>
    )
}

export default CommentsSection;