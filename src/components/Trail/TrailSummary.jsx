import React from 'react';
import { capitalise, uncapitalise } from '../../utils/utils';

function TrailSummary({ trail, loc }) {
    let summary = '';
    let distAreaString = '';
    let diffString = '';
    let goodForString = '';
    let timeString = '';

    const durationString = () => {
        const hours = Math.floor(trail.duration_mins / 60);
        const mins = trail.duration_mins % 60;

        if (trail.duration_mins < 60) {
            return `${trail.duration_mins} min`;
        }
        if (trail.duration_mins !== 0 && mins === 0) {
            return `${hours}h`;
        }
        return `${hours}h${mins}min`;
    };

    if (trail.distance && loc.name) {
        distAreaString += `Enjoy this ${trail.distance} km trail near ${loc.name}, ${capitalise(
            loc.state,
        )}. `;
    }

    if (trail.difficulty) {
        // use 'an' if the difficulty is 'easy'
        const article = trail.difficulty === 'easy' ? 'an' : `a`;
        diffString = `Generally considered ${article} ${trail.difficulty} route, `;
    }

    // todo: uncapitalise tags
    // todo: substitute "Dogs on leash" with "dog walking"
    const tags = [trail.tags[0], trail.tags[1], trail.tags[2]];
    tags.forEach((tag, index) => {
        if (index === tags.length - 1) {
            goodForString += `and ${uncapitalise(tag)}`;
        }
        else {
            goodForString += `${uncapitalise(tag)}, `;
        }
    });

    // todo: fill in with expected time taken
    timeString += `it takes an average of ${durationString()} to complete. This is a very popular area for ${goodForString}, so you'll likely encounter other people.`;

    summary += distAreaString + diffString + timeString;

    return <div className="TrailSummary trail-description">{summary}</div>;
}

export default TrailSummary;
