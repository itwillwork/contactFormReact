import React, {Component} from 'react';

import styles from './Input.scss';
import classNames from 'classnames/bind';
const cls = classNames.bind(styles);

import Control from '../../organisms/Control';

//класс унаследован
class Input extends Control {
    constructor () {
        super();
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }
    handleFocus () {
        this.setState({
            focused: true
        });
    }
    handleBlur () {
        this.setState({
            focused: false
        });
    }
    render() {
        const { placeholder, name, format, error, value, maxLength } = this.props;
        return (
            <div className={cls('input')}>
                {!value && <div className={cls('input__field', 'input__placeholder')}
                >{placeholder}</div>}
                <input
                    className={cls('input__field', {
                        'input__field--hasError': error
                    })}
                    type='text'
                    maxLength={maxLength}
                    onChange={this.handleChange}
                    name={name}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    value={format(value)}
                    ref='input'
                />
            </div>
        );
    }
}

export default Input