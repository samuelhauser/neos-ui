import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
// import style from './style.css';

const cachedWarnings = {};

const Icon = props => {
    const {size, padded, style, api} = props;
    const iconClassName = api.fontAwesome.getClassName(props.icon);
    const classNames = mergeClassNames({
        [style.icon]: true,
        [iconClassName]: true,
        [props.className]: props.className && props.className.length,
        [style['icon--big']]: size === 'big',
        [style['icon--small']]: size === 'small',
        [style['icon--tiny']]: size === 'tiny',
        [style['icon--paddedLeft']]: padded === 'left',
        [style['icon--paddedRight']]: padded === 'right',
        [style['icon--spin']]: props.spin
    });

    return (
        <i className={classNames}></i>
    );
};
Icon.propTypes = {
    // The icon key of Font-Awesome.
    icon(props, propName) {//eslint-disable-line
        const id = props[propName];
        const {isValid, isMigrationNeeded, iconName} = props.api.fontAwesome.validateId(id);

        if (!isValid) {
            if (isMigrationNeeded && iconName && !cachedWarnings[iconName]) {
                cachedWarnings[iconName] = true;

                props.api.logger.deprecate(`Font-Awesome has been updated. The icon name "${id}" has been renamed.

Please adjust the icon configurations in your .yaml files to the new icon name "${iconName}".

https://github.com/FortAwesome/Font-Awesome/wiki/Upgrading-from-3.2.1-to-4`);
            } else if (!iconName || !cachedWarnings[iconName]) {
                return new Error(`Icon name "${id}" was not a found in Font-Awesome 4.5.
Please use the icon names from the Font-Awesome website.

http://fortawesome.github.io/Font-Awesome/icons/`);
            }
        }
    },

    // Style related propTypes.
    size: PropTypes.oneOf(['big', 'small', 'tiny']),
    padded: PropTypes.oneOf(['none', 'left', 'right']),
    className: PropTypes.string,
    spin: PropTypes.bool,
    style: PropTypes.object,
    api: PropTypes.shape({
        fontAwesome: PropTypes.shape({
            getClassName: PropTypes.func.isRequired,
            validateId: PropTypes.func.isRequired
        }).isRequired,
        logger: PropTypes.shape({
            deprecate: PropTypes.func.isRequired
        }).isRequired
    })
};
Icon.defaultProps = {
    style: {},
    api: {}
};

try {
    Icon.defaultProps.api = window.neos;
} catch (e) {}

export default Icon;
