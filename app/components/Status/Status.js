import React, {Component} from 'react';

import styles from './Status.scss';
import classNames from 'classnames/bind';
const cls = classNames.bind(styles);

class Status extends Component {
    getStatusText() {
        const {status, error} = this.props;
        let statusText;
        if (status.error) {
            return "Что-то пошло не так. Попробуйте как-нибудь по другому"
        }
        if (error) {
            return error || "Форма заполнена не корректно, проверьте все поля"
        }
        if (status.success) {
            return "Запрос на оплату отправлен успешно"
        }
        if (status.loading) {
            return "Запрос отправлен ждем ответа ..."
        }
    }
    render() {
        return (
            <div className={cls('status')}> {this.getStatusText()} </div>
        );
    }
}

export default Status