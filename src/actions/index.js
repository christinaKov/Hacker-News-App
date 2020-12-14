import { DATA_LOADED } from '../constants/action-types';

export function getData() {
    return function(dispatch) {
      return fetch("https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty")
        .then(response => response.json())
        .then(json => {
          dispatch({ type: DATA_LOADED, payload: json });
        });
    };
}