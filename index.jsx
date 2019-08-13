import React, { useEffect, useState } from 'react';

const PredicatedComponents = ({ state, options, children }) => {
    const [_state, update] = useState(state);

    // remove predicates
    const removePredicatedProp = ({ predicated, ...props }) => props;

    // take children and flatten
    const _children = React.Children.toArray(children);

    return React.Children.map(_children, (child) => {
        if (child.predicated) {
            const otherProps = child.predicated.reduce((acc, { predicate, name }) => {
                if (state[predicate]) return { ...acc, [name]: _state[predicate] };
            }, {});

            const props = removePredicatedProp({ ...child.props, ...otherProps, update });
            return React.cloneElement(child, props, child.children );
        }

        return React.cloneElement(child, { ...child.props, state: _state, update }, child.children );
    });
};

const page1Predicate = [{ predicate: 'page1', name: 'page' }];
const page2Predicate = [{ predicate: 'page2', name: 'page' }];
const page3Predicate = [{ predicate: 'page3', name: 'page' }];

const Page = ({ page, updateKey, update }) => {
    useEffect(() => {
        update({ [updateKey]: { clientLoaded: true }});
    });

    return (<div>{page.pageName}</div>);
};

const App = ({}) => {
    const state = {
        page1: { pageName: 'PAGE_1' },
        page2: { pageName: 'PAGE_2' },
        page3: { pageName: 'PAGE_3' },
    };

    return (
        <PredicatedComponents state={state}>
            <Page predicated={page1Predicate} />
            <Page predicated={page2Predicate} />
            <Page predicated={page3Predicate} />
        </PredicatedComponents>
    );
};
