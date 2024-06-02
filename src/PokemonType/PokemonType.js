import React from "react";
import './style.scss'

function types({ types }) {

    const getTypeColor = (type) => {
        switch (type.toLowerCase()) {
            case 'grass':
                return 'grass';
            case 'fire':
                return 'fire';
            case 'water':
                return 'water';
            case 'electric':
                return 'electric';
            case 'poison':
                return 'poison';
            case 'flying':
                return 'flying';
            case 'bug':
                return 'bug';
            case 'normal':
                return 'normal';
            case 'ground':
                return 'ground';
            case 'fairy':
                return 'fairy';
            case 'fighting':
                return 'fighting';
            case 'psychic':
                return 'psychic';
            case 'rock':
                return 'rock';
            case 'steel':
                return 'steel';
            case 'ice':
                return 'ice';
            case 'dragon':
                return 'dragon';
            case 'dark':
                return 'dark';
            case 'ghost':
                return 'ghost';
            // Add more cases for other types as needed
            default:
                return 'missigno'; // Default color
        }
    }
    
    return (
        <div>
            {types && (
                <div className='pokemon-types'>
                    {types && types.length > 0 ? (
                        <>
                            <p className={getTypeColor(types[0])}><span>{types[0]}</span></p>
                            {types[1] && <p className={getTypeColor(types[1])}><span>{types[1]}</span></p>}
                        </>
                    ) : (
                        <p style={{ color: getTypeColor('missigno') }}>missigno</p>
                    )}
                </div>
            )}

        </div>
    );
}

export default types