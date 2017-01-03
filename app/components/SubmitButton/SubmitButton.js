import React, {Component} from 'react';

import styles from './SubmitButton.scss';
import classNames from 'classnames/bind';
const cls = classNames.bind(styles);

class SubmitButton extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        e.preventDefault();
        if (!this.props.enable) {
            this.props.onClick(e);
        }
    }
    render() {
        const {label, enable} = this.props;
        return (
            <button
                className={cls('button', {
                    'button--isActive': !enable
                })}
                onClick={this.handleClick}
            > {label} </button>
        );
    }
}

export default SubmitButton