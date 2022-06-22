import './CharSearch.scss';
import { useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';

import * as Yup from 'yup';



const CharSearch = () => {

    const [char, setChar] = useState(null);
    const {loading, error, clearError, getCharacterByName} = useMarvelService();

    const characterLoaded = (char) => {
        setChar(char);
    }

    const updateCharacter = (name) => {
        clearError();

        getCharacterByName(name)
            .then(characterLoaded)

    }

    const errorMessage = error ? <div><ErrorMessage/></div> : null;
    const results = !char ? null : char.length > 0 ?
                        <div className="char__search-wrapper">
                            <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                            <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                                <div className="inner">To page</div>
                            </Link>
                        </div> : 
                        <div className="char__search-error">
                            The character was not found. Check the name and try again
                        </div>;



    return (

        <div className="char__search">
            <div className="char__find">Or find a character by name:</div>
            <Formik
                initialValues={{name: ''}}
                validationSchema= {Yup.object({name: Yup.string().required('This field is required')})}
                onSubmit={({name}) => updateCharacter(name)}>
                <Form>
                    <Field type="text" name="name" className="char__input" placeholder='Enter name'/>
                    <button type="submit" className="button button__main" disabled={loading}>
                        <div className="inner">Find</div>
                    </button>
                    <ErrorMessage className="error" name="name" component="div"/>
                </Form>
            </Formik>
            <div>
                {results}
                {errorMessage}
            </div> 
        </div>
    )
}

export default CharSearch;

