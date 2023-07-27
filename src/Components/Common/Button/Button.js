import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Button.css'


export default function Button(props) {

    const {
        onClick = () => { },
        buttonText = 'Upload',
        buttonIcon,
        disabled = false,
        style
    } = props


    return (
        <button style={style} onClick={onClick} disabled={disabled} className='button-with-icon'>
            <FontAwesomeIcon icon={buttonIcon} /> <span>{buttonText}</span>
        </button>
    );
}
