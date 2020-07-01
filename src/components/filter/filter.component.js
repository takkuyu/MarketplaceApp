import React from 'react';
import {
    Link,
} from "react-router-dom";
import queryString from 'query-string'

const Filter = ({ filter, match, location }) => {
    const parsed = queryString.parse(location.search);
    const formattedFilterName = filter.name.toLowerCase();
    return (
        <div className="filter" >
            <p className="filter__name">{filter.label}<i className="fas fa-chevron-down"></i></p>
            <ul className="filter__lists ">
                {
                    filter.lists.map((list, index) => {
                        let isActive = false;
                        const newQueryString = {
                            ...parsed,
                            [formattedFilterName]: list.id
                        }

                        if (!list.value) delete newQueryString[formattedFilterName];

                        for (let k of Object.keys(parsed)) {
                            if (k === formattedFilterName && list.id === Number(parsed[k])) isActive = true;
                        }

                        return (
                            <li key={index} className={isActive || (!parsed[formattedFilterName] && !list.id) ? 'active' : ''}>
                                <Link to={`${match.url}?${queryString.stringify(newQueryString)}`} >{list.label}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div >
    );
}


export default Filter;