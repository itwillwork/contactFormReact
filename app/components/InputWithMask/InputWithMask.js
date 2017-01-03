import React, {Component} from 'react';

import styles from './InputWithMask.scss';
import classNames from 'classnames/bind';
const cls = classNames.bind(styles);


import Control from '../../organisms/Control';
const {getSelection, setSelection} = require('react/lib/ReactInputSelection')

const InputMask = require('inputmask-core')

//класс унаследован
class InputWithMask extends Control {
    constructor(props, ctx) {
        super(props, ctx);
        this._updateMaskSelection = this._updateMaskSelection.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentWillMount() {
        const {mask: pattern, value, formatCharacters, placeholderChar} = this.props;
        this.mask = new InputMask({
            pattern,
            value,
            formatCharacters,
            placeholderChar
        })
    }

    componentDidMount() {
        this.input = this.refs.input;
    }

    _updateMaskSelection() {
        this.mask.selection = getSelection(this.input)
    }

    _updateInputSelection() {
        setSelection(this.input, this.mask.selection)
    }

    _getDisplayValue() {
        const value = this.mask.getValue();
        return (value === this.mask.emptyValue) ? '' : value
    }

    handleChange(e) {
        const maskValue = this.valueWithoutPlaceholderChar();
        if (e.target.value !== maskValue) {

            if (e.target.value.length < maskValue.length) {
                const sizeDiff = maskValue.length - e.target.value.length;
                this._updateMaskSelection();
                this.mask.selection.end = this.mask.selection.start + sizeDiff;
                this.mask.backspace()
            }

            this.mask.setValue(this.getValue());

            const value = this.mask.getValue();

            if (value.length) {
                e.target.value = this.valueWithoutPlaceholderChar(value);
            }

            if (value) {
                this._updateInputSelection()
            }

            super.handleChange(e);
        }

    }
    getValue() {
        return this.props.parse(this.mask.getValue());
    }
    handleKeyPress(e) {
        if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') return;
        e.preventDefault();
        this._updateMaskSelection();
        if (this.mask.input(e.key)) {
            e.target.value = this.valueWithoutPlaceholderChar();
            this._updateInputSelection();
        }
        super.handleChange(e);
    }
    valueWithoutPlaceholderChar(value) {
        if (!value) value = this.mask.getValue();
        const endPoint = value.indexOf(this.props.placeholderChar);
        return value.slice(0, endPoint < 0 ? value.length : endPoint)
    }
    handlePaste(e) {
        e.preventDefault();
        this._updateMaskSelection();
        if (this.mask.paste(e.clipboardData.getData('Text'))) {
            e.target.value = this.valueWithoutPlaceholderChar();
            setTimeout(() => this._updateInputSelection, 0);
            super.handleChange(e);
        }
    }
    _getValuePlaceholder() {
        const {placeholder, value} = this.props;
        this.mask.setValue(value);
        const valueWithMask = this.valueWithoutPlaceholderChar();
        this.mask.setValue(placeholder);
        let placeholderWithMask = this.mask.getValue();
        this.mask.setValue(value);
        return valueWithMask + placeholderWithMask.slice(valueWithMask.length, placeholderWithMask.length);
    }

    render() {
        const {props} = this;
        const placeholderWithMask = this._getValuePlaceholder().split('');
        const placeholderNode = placeholderWithMask.map((symbol, idx)=>{
            if (symbol !== props.highlightedPlaceholderChar) {
                return (<span key={idx}>{symbol}</span>)
            } else {
                return (<span key={idx} style={{'color': '#fff'}}>{symbol}</span>)
            }
        });

        return (
            <div className={cls("InputWithMask")}>
                <div className={cls("InputWithMask__field", "InputWithMask__placeholder")}
                >{placeholderNode}</div>
                <input
                    type='text'
                    name={props.name}
                    onChange={this.handleChange}
                    onPaste={this.handlePaste}
                    onKeyPress={this.handleKeyPress}
                    value={this.valueWithoutPlaceholderChar()}
                    defaultValue={props.defaultValue}
                    className={cls("InputWithMask__field", {
                        'InputWithMask--hasError': props.error
                    })}
                    ref='input'
                />
            </div>
        );
    }
}

export default InputWithMask