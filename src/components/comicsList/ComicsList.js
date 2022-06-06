import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [comics, setComcisList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset).then(onComicsLoaded)
    }

    const onComicsLoaded = (newComics) => {
        setComcisList(comics => [...comics, ...newComics]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
    }

    function renderItems(arr) {
        const comicsCard = arr.map(({id, title, thumbnail, price, url}) => {
            return (
                <li className="comics__item"
                    key={id}>
                <Link to={`/comics/${id}`}>
                    <img src={thumbnail} alt={title} className="comics__item-img"/>
                    <div className="comics__item-name">{title}</div>
                    <div className="comics__item-price">{price}$</div>
                </Link>
            </li>
            )
        })
        return (
            <ul className="comics__grid">
                {comicsCard}   
            </ul>
        )
    }

    const items = renderItems(comics);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;