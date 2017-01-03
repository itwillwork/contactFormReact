import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';

import styles from './MobilePayForm.scss';
import classNames from 'classnames/bind';
const cls = classNames.bind(styles);

import Input from '../Input/Input';
import InputWithMask from '../InputWithMask/InputWithMask';
import SubmitButton from '../SubmitButton/SubmitButton';
import Status from '../Status/Status';

import sendData from '../../utility/sendData';
import loader from '../../utility/loader';
import getMobilePayParams from '../../utility/getMobilePayParams'
import {fieldsMap, preparedFields, fieldsQueue} from '../../utility/fieldsConfig';
import transforms from '../../utility/transforms';
import declOfNum from '../../utility/declOfNum';

//тут что-то типо higher-order component
class MobilePayForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: { ...preparedFields },
            error: null,
            fieldsQueue,
            status: loader.initial()
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFieldChange({name, value, isFull, error, valid}) {
        this.setState({
            fields: {
                ...this.state.fields,
                [name]: { value, error, isFull, valid}
            },
            error
        });
        if (isFull && !error) {
            this.setFocusOnNextField(name);
        }
    }
    setFocusOnNextField(currentFieldName) {
        const { fields, fieldsQueue } = this.state;
        const queueIdx = fieldsQueue.indexOf(currentFieldName);
        const form = findDOMNode(this.refs.form);

        //следующий элемент по очереди
        let nextElement = fieldsQueue[queueIdx + 1];
        const nextElementIsFull = nextElement && fields[nextElement].isFull;
        if (!nextElement || nextElementIsFull) {
            nextElement = null;
            //следющий не заполненный элемент или с ошибкой
            for (let name in fields) {
                if ((!fields[name].isFull || fields[name].error) && name!== currentFieldName) {
                    nextElement = name;
                }
            }
        }

        if (nextElement) {
            form.elements[nextElement].focus();
        } else {
            //для того чтобы перед этим кодом сработал рендер
            setTimeout(()=>{
                //warning: допущение что только одна кнопка сабмита на форме
                const buttonNode = form.getElementsByTagName('button')[0];
                if (buttonNode) {
                    buttonNode.focus();
                }
            }, 0)
        }
    }
    handleSubmit() {
        this.setState({
           status: loader.begin()
        });
        const params = getMobilePayParams(this.state.fields);
        //тут можно что-нибудь дописать к параметрам перед отвравкой
        sendData(params)
            .then((res) => {
                this.setState({
                    fields: { ...preparedFields },
                    status: loader.success()
                });
            })
            .catch((error) => {
                this.setState({
                    status: loader.error(error),
                    error
                });
            })
    }
    getInputProps(fieldName) {
        const { innerType} = fieldsMap[fieldName];
        const fieldState = this.state.fields[fieldName];
        return {
            ...fieldState,
            onChange: this.handleFieldChange,
            ...fieldsMap[fieldName],
            ...transforms[innerType],
        }

    }
    isValidForm() {
        const {fields} = this.state;
        const nameFieldsList = Object.keys(fields);
        return nameFieldsList.filter((nameField)=> !fields[nameField].valid).length
    }
    render() {
        const {valid, status, error, fieldsQueue} = this.state;
        const enableForm = status.loading || this.isValidForm();
        return (
            <div className={cls('MobilePayForm')}>
                <div className={cls('MobilePayForm__container')}>
                    <form ref="form">
                        <div>
                            <div className={cls('MobilePayForm__field')}>
                                <div className={cls('MobilePayForm__fieldTitle')}>Номер телефона</div>
                                <InputWithMask
                                    {...this.getInputProps("phoneNumber")}
                                />
                            </div>
                            <div className={cls('MobilePayForm__field', 'MobilePayForm__field--right')}>
                                <div className={cls('MobilePayForm__fieldTitle')}>Сумма пополнения</div>
                                <div>
                                    <div className={cls('MobilePayForm__money')}>
                                        {declOfNum(this.state.fields.summ.value, ['рубль', 'рубля', 'рублей'])}
                                    </div>
                                    <div className={cls('MobilePayForm__field--money')}>
                                        <Input
                                            {...this.getInputProps("summ")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SubmitButton
                            enable={enableForm}
                            label="Продолжить"
                            className={cls("MobilePayForm__submit")}
                            onClick={this.handleSubmit}
                        />
                        <Status
                            status={status}
                            error={error}
                        />
                    </form>
                </div>
            </div>
        );
    }
}

export default MobilePayForm