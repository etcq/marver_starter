import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);
    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
    // eslint-disable-next-line
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        clearError();
        getCharacter(charId).then(onCharLoaded).then(() => setProcess('confirmed'))

    }

    const onCharLoaded = (char) => {
        setChar(char);   
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
    
}

const View = ({data}) => {

    const {name, description, thumbnail, homepage, wiki, comics} = data;
    const shortComicsList = comics.slice(0, 10);
    const objFit = thumbnail.includes('image_not_available');
    return (
        <>
            <div className="char__basics">
                <img style={objFit ? {objectFit: "contain"} : null} src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {   (comics.length > 0) ?
                        shortComicsList.map((item, i) => {
                            return (
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            )
                        }) : 'Comics not Found'
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;