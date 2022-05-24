import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

const CharList = (props) => {

    const [chars, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, [])
    
    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
        .then(onCharLoaded)
        .catch(onError)    
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    
    const onCharLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }
        setCharList(chars => [...chars, ...newChars]);
        setLoading(false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const charCard = arr.map(({id, name, thumbnail}, i) => {
            const objFit = thumbnail.includes('image_not_available');
            return (
                <li tabIndex={0}
                    ref={elem => itemRefs.current[i] = elem}
                    className="char__item" 
                    key={id}
                    onClick={() => {
                        props.onCharSelected(id);
                        focusOnItem(i);
                    }}>
                    <img src={thumbnail} alt={name} style={objFit ? {objectFit: "contain"} : null}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {charCard}
            </ul>
        )

    }
    const items = renderItems(chars);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (

        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;