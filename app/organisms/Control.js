import React, {Component} from 'react';

/*
Используется в Input и InputWithMask
 */

class Control extends Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        const {name, type, onChange, parse, validate, isFull, mask: pattern, checkError } = this.props;
        const value = this.getValue(e);
        onChange({
            name,
            type,
            value,
            error: checkError(value),
            valid: validate(value),
            isFull: isFull(value, pattern)
        });
    }
    getValue(e) {
        return this.props.parse(e.target.value)
    }
}

export default Control