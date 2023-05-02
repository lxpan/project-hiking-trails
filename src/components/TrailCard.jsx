import React from 'react';
import placeholderThumbnail from '../assets/images/alltrails-sized-placeholder.jpg';
import { unslugify, capitalise } from '../utils/utils';
import '../styles/TrailCard.css';

function TrailCard({ trail }) {
    return (
        <a href="#" className="trail-card">
            <figure>
                <img src={placeholderThumbnail} alt="" />
            </figure>
            <div className="card-body">
                <h2>{trail.name}</h2>
                <div>{unslugify(trail.area)}</div>
                <div>{capitalise(trail.difficulty)}</div>
                <div>Length: {trail.distance} km</div>
            </div>
        </a>
    );
}

export default TrailCard;
