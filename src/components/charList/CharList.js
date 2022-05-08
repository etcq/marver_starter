import { Component } from 'react/cjs/react.production.min';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }


    marvelService = new MarvelService();

    onCharLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }
        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    updateCharacters = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharLoaded)
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError)    
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }



    onError = () => {
        this.setState({
            error: true,
            loading: false,
            newItemLoading: false
        })
    }

    renderItems(arr) {
        const charCard = arr.map(({id, name, thumbnail}) => {
            const objFit = thumbnail.includes('image_not_available');
            return (
                <li 
                    className="char__item" 
                    key={id}
                    onClick={() => this.props.onCharSelected(id)}>
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
    
    render () {
        const {chars, loading, error, newItemLoading, offset, charEnded} = this.state;

        const items = this.renderItems(chars);

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
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }


}

export default CharList;